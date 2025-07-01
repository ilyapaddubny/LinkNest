import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BookmarkQuerySchema } from '@/lib/validations/bookmark';
import {
  apiResponse,
  apiError,
  validationError,
  unauthorizedError,
  notFoundError,
} from '@/lib/api-response';

interface Context {
  params: {
    name: string;
  };
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const tagName = decodeURIComponent(params.name);

    // Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { name: tagName },
    });

    if (!tag) {
      return notFoundError('Tag not found');
    }

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const validation = BookmarkQuerySchema.safeParse(query);
    if (!validation.success) {
      return validationError(validation.error.flatten().fieldErrors);
    }

    const { search, limit, cursor } = validation.data;

    const where: any = {
      userId: session.user.id,
      deletedAt: null,
      tags: {
        some: {
          tag: {
            name: tagName,
          },
        },
      },
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { url: { contains: search, mode: 'insensitive' } },
      ];
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
      tag: {
        name: tagName,
        count: items.length,
      },
    });
  } catch (error) {
    console.error('Error fetching bookmarks by tag:', error);
    return apiError('Failed to fetch bookmarks by tag', 500);
  }
}
