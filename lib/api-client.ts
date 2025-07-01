import type {
  BookmarkQueryInput,
  CreateBookmarkInput,
  UpdateBookmarkInput,
} from '@/lib/validations/bookmark';

export interface Bookmark {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'An error occurred' }));
    throw new ApiError(response.status, error.error || 'An error occurred');
  }

  const result = await response.json();
  return result.data;
}

export const bookmarkApi = {
  list: async (
    params?: BookmarkQueryInput
  ): Promise<PaginatedResponse<Bookmark>> => {
    const searchParams = new URLSearchParams();

    if (params?.search) searchParams.append('search', params.search);
    if (params?.tag) searchParams.append('tag', params.tag);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.cursor) searchParams.append('cursor', params.cursor);
    if (params?.isPublic !== undefined)
      searchParams.append('isPublic', params.isPublic.toString());

    const response = await fetch(`/api/bookmarks?${searchParams.toString()}`);
    return handleResponse<PaginatedResponse<Bookmark>>(response);
  },

  get: async (id: string): Promise<Bookmark> => {
    const response = await fetch(`/api/bookmarks/${id}`);
    return handleResponse<Bookmark>(response);
  },

  create: async (data: CreateBookmarkInput): Promise<Bookmark> => {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Bookmark>(response);
  },

  update: async (id: string, data: UpdateBookmarkInput): Promise<Bookmark> => {
    const response = await fetch(`/api/bookmarks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Bookmark>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/bookmarks/${id}`, {
      method: 'DELETE',
    });
    await handleResponse<void>(response);
  },
};
