'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  CreateBookmarkSchema,
  UpdateBookmarkSchema,
} from '@/lib/validations/bookmark';
import { fetchMetadata } from '@/lib/metadata-fetcher';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: unknown };

export async function createBookmark(
  data: z.infer<typeof CreateBookmarkSchema>
): Promise<ActionResult<any>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validation = CreateBookmarkSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors,
      };
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
      return { success: false, error: 'Bookmark already exists' };
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

    revalidatePath('/dashboard');
    return { success: true, data: formattedBookmark };
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return { success: false, error: 'Failed to create bookmark' };
  }
}

export async function updateBookmark(
  id: string,
  data: z.infer<typeof UpdateBookmarkSchema>
): Promise<ActionResult<any>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validation = UpdateBookmarkSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors,
      };
    }

    const { url, title, description, tags, isPublic } = validation.data;

    // Check if bookmark exists and user owns it
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!existingBookmark) {
      return { success: false, error: 'Bookmark not found' };
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

      if (urlConflict && urlConflict.id !== id) {
        return { success: false, error: 'URL already bookmarked' };
      }
    }

    // Update bookmark
    const updateData: any = {};
    if (url) updateData.url = url;
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (typeof isPublic === 'boolean') updateData.isPublic = isPublic;

    await prisma.bookmark.update({
      where: { id },
      data: updateData,
    });

    // Handle tags if provided
    if (tags) {
      // Remove existing tags
      await prisma.bookmarkTag.deleteMany({
        where: { bookmarkId: id },
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
            bookmarkId: id,
            tagId: tag.id,
          })),
        });
      }
    }

    // Fetch the updated bookmark with tags
    const updatedBookmark = await prisma.bookmark.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    const formattedBookmark = {
      ...updatedBookmark,
      tags: updatedBookmark?.tags.map((bt: any) => bt.tag.name) || [],
    };

    revalidatePath('/dashboard');
    return { success: true, data: formattedBookmark };
  } catch (error) {
    console.error('Error updating bookmark:', error);
    return { success: false, error: 'Failed to update bookmark' };
  }
}

export async function deleteBookmark(
  id: string
): Promise<ActionResult<{ message: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check if bookmark exists and user owns it
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!existingBookmark) {
      return { success: false, error: 'Bookmark not found' };
    }

    // Soft delete
    await prisma.bookmark.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/dashboard');
    return {
      success: true,
      data: { message: 'Bookmark deleted successfully' },
    };
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return { success: false, error: 'Failed to delete bookmark' };
  }
}
