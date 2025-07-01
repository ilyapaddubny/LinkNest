import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TagQuerySchema } from '@/lib/validations/tag';
import {
  apiResponse,
  apiError,
  validationError,
  unauthorizedError,
} from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const validation = TagQuerySchema.safeParse(query);
    if (!validation.success) {
      return validationError(validation.error.flatten().fieldErrors);
    }

    const { limit, search } = validation.data;

    const where: any = {
      bookmarks: {
        some: {
          bookmark: {
            userId: session.user.id,
            deletedAt: null,
          },
        },
      },
    };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const tags = await prisma.tag.findMany({
      where,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            bookmarks: {
              where: {
                bookmark: {
                  userId: session.user.id,
                  deletedAt: null,
                },
              },
            },
          },
        },
      },
    });

    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      count: tag._count.bookmarks,
      createdAt: tag.createdAt,
    }));

    return apiResponse(formattedTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return apiError('Failed to fetch tags', 500);
  }
}
