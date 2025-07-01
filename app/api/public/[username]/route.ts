import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BookmarkQuerySchema } from '@/lib/validations/bookmark';
import {
  apiResponse,
  apiError,
  validationError,
  notFoundError,
} from '@/lib/api-response';

interface Context {
  params: {
    username: string;
  };
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const username = decodeURIComponent(params.username);

    // Find user by email (assuming username is email for now)
    const user = await prisma.user.findUnique({
      where: { email: username },
    });

    if (!user) {
      return notFoundError('User not found');
    }

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const validation = BookmarkQuerySchema.safeParse(query);
    if (!validation.success) {
      return validationError(validation.error.flatten().fieldErrors);
    }

    const { search, tag, limit, cursor } = validation.data;

    const where: any = {
      userId: user.id,
      isPublic: true,
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
      id: bookmark.id,
      url: bookmark.url,
      title: bookmark.title,
      description: bookmark.description,
      image: bookmark.image,
      favicon: bookmark.favicon,
      createdAt: bookmark.createdAt,
      tags: bookmark.tags.map((bt: any) => bt.tag.name),
    }));

    return apiResponse({
      data: formattedBookmarks,
      pagination: {
        hasMore,
        nextCursor,
      },
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error fetching public bookmarks:', error);
    return apiError('Failed to fetch public bookmarks', 500);
  }
}
