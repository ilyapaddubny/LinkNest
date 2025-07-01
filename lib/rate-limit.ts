import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
  return `ip:${ip}`;
}

export function rateLimit(config: RateLimitConfig) {
  return {
    check: (
      request: NextRequest,
      identifier?: string
    ): {
      success: boolean;
      limit: number;
      remaining: number;
      reset: number;
    } => {
      const now = Date.now();
      const key = identifier || getClientIdentifier(request);

      // Clean up expired entries
      if (store[key] && now > store[key].resetTime) {
        delete store[key];
      }

      // Initialize or get existing record
      if (!store[key]) {
        store[key] = {
          count: 0,
          resetTime: now + config.windowMs,
        };
      }

      const record = store[key];
      record.count += 1;

      const remaining = Math.max(0, config.maxRequests - record.count);
      const reset = Math.ceil(record.resetTime / 1000);

      return {
        success: record.count <= config.maxRequests,
        limit: config.maxRequests,
        remaining,
        reset,
      };
    },
  };
}

// Predefined rate limiters
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
});

export const authRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 requests per minute
});

export const bookmarkCreateRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 bookmarks per minute
});
