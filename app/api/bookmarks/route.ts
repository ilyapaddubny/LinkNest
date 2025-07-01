import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  CreateBookmarkSchema,
  BookmarkQuerySchema,
} from '@/lib/validations/bookmark';
import {
  apiResponse,
  apiError,
  validationError,
  unauthorizedError,
} from '@/lib/api-response';
import { fetchMetadata } from '@/lib/metadata-fetcher';
import { apiRateLimit, bookmarkCreateRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = apiRateLimit.check(request);
    if (!rateLimitResult.success) {
      return apiError('Too many requests', 429);
    }

    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const validation = BookmarkQuerySchema.safeParse(query);
    if (!validation.success) {
      return validationError(validation.error.flatten().fieldErrors);
    }

    const { search, tag, limit, cursor, isPublic } = validation.data;

    const where: any = {
      userId: session.user.id,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { url: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: tag,
          },
        },
      };
    }

    if (typeof isPublic === 'boolean') {
      where.isPublic = isPublic;
    }

    const bookmarks = await prisma.bookmark.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    const hasMore = bookmarks.length > limit;
    const items = hasMore ? bookmarks.slice(0, -1) : bookmarks;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    const formattedBookmarks = items.map((bookmark) => ({
      ...bookmark,
      tags: bookmark.tags.map((bt: any) => bt.tag.name),
    }));

    return apiResponse({
      data: formattedBookmarks,
      pagination: {
        hasMore,
        nextCursor,
      },
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return apiError('Failed to fetch bookmarks', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for bookmark creation
    const rateLimitResult = bookmarkCreateRateLimit.check(request);
    if (!rateLimitResult.success) {
      return apiError(
        'Too many bookmark creations. Please try again later.',
        429
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const body = await request.json();
    const validation = CreateBookmarkSchema.safeParse(body);

    if (!validation.success) {
      return validationError(validation.error.flatten().fieldErrors);
    }

    const { url, title, description, tags, isPublic } = validation.data;

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_url: {
          userId: session.user.id,
          url,
        },
      },
    });

    if (existingBookmark) {
      return apiError('Bookmark already exists', 409);
    }

    // Fetch metadata if title/description not provided
    let metadata = { title, description };
    if (!title || !description) {
      const fetchedMetadata = await fetchMetadata(url);
      metadata = {
        title: title || fetchedMetadata.title || 'Untitled',
        description: description || fetchedMetadata.description,
      };
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        url,
        title: metadata.title!,
        description: metadata.description || null,
        isPublic: isPublic ?? false,
        userId: session.user.id,
      },
    });

    // Handle tags
    if (tags && tags.length > 0) {
      const tagPromises = tags.map(async (tagName) => {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
        return tag;
      });

      const createdTags = await Promise.all(tagPromises);

      await prisma.bookmarkTag.createMany({
        data: createdTags.map((tag) => ({
          bookmarkId: bookmark.id,
          tagId: tag.id,
        })),
      });
    }

    // Fetch the created bookmark with tags
    const createdBookmark = await prisma.bookmark.findUnique({
      where: { id: bookmark.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    const formattedBookmark = {
      ...createdBookmark,
      tags: createdBookmark?.tags.map((bt: any) => bt.tag.name) || [],
    };

    return apiResponse(formattedBookmark, 201);
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return apiError('Failed to create bookmark', 500);
  }
}
