import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UpdateBookmarkSchema } from '@/lib/validations/bookmark';
import {
  apiResponse,
  apiError,
  validationError,
  unauthorizedError,
  notFoundError,
} from '@/lib/api-response';

interface Context {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const bookmark = await prisma.bookmark.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!bookmark) {
      return notFoundError('Bookmark not found');
    }

    const formattedBookmark = {
      ...bookmark,
      tags: bookmark.tags.map((bt: any) => bt.tag.name),
    };

    return apiResponse(formattedBookmark);
  } catch (error) {
    console.error('Error fetching bookmark:', error);
    return apiError('Failed to fetch bookmark', 500);
  }
}

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const body = await request.json();
    const validation = UpdateBookmarkSchema.safeParse(body);

    if (!validation.success) {
      return validationError(validation.error.flatten().fieldErrors);
    }

    const { url, title, description, tags, isPublic } = validation.data;

    // Check if bookmark exists and user owns it
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!existingBookmark) {
      return notFoundError('Bookmark not found');
    }

    // Check for URL conflict if URL is being changed
    if (url && url !== existingBookmark.url) {
      const urlConflict = await prisma.bookmark.findUnique({
        where: {
          userId_url: {
            userId: session.user.id,
            url,
          },
        },
      });

      if (urlConflict && urlConflict.id !== params.id) {
        return apiError('URL already bookmarked', 409);
      }
    }

    // Update bookmark
    const updateData: any = {};
    if (url) updateData.url = url;
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (typeof isPublic === 'boolean') updateData.isPublic = isPublic;

    await prisma.bookmark.update({
      where: { id: params.id },
      data: updateData,
    });

    // Handle tags if provided
    if (tags) {
      // Remove existing tags
      await prisma.bookmarkTag.deleteMany({
        where: { bookmarkId: params.id },
      });

      // Add new tags
      if (tags.length > 0) {
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
            bookmarkId: params.id,
            tagId: tag.id,
          })),
        });
      }
    }

    // Fetch the updated bookmark with tags
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: params.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    const formattedBookmark = {
      ...bookmark,
      tags: bookmark?.tags.map((bt: any) => bt.tag.name) || [],
    };

    return apiResponse(formattedBookmark);
  } catch (error) {
    console.error('Error updating bookmark:', error);
    return apiError('Failed to update bookmark', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    // Check if bookmark exists and user owns it
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!existingBookmark) {
      return notFoundError('Bookmark not found');
    }

    // Soft delete
    await prisma.bookmark.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return apiResponse({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return apiError('Failed to delete bookmark', 500);
  }
}
