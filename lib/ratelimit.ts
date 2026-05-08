import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash Redis is configured
export const isRateLimitingConfigured = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

// Fallback mock Redis for when credentials aren't provided
// This allows local dev to proceed without Redis configured
const mockRedis = {
    sadd: async () => 1,
    hset: async () => 1,
    expire: async () => 1,
    zadd: async () => 1,
    zremrangebyscore: async () => 1,
    zrange: async () => [],
    zcard: async () => 0,
    zcount: async () => 0,
    eval: async () => [1, Date.now() + 10000], // Allow request, set expiry
} as unknown as Redis;

export const redis = isRateLimitingConfigured
    ? Redis.fromEnv()
    : mockRedis;

// Auth endpoints rate limiter (Login, Recovery)
// Allows 10 requests per minute per IP
export const authRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "@upstash/ratelimit/auth",
});

// Contact form rate limiter
// Allows 5 requests per 10 minutes per IP
export const contactRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: true,
    prefix: "@upstash/ratelimit/contact",
});

// Generic API rate limiter for file uploads and other mutations
// Allows 20 requests per minute per IP
export const apiRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    analytics: true,
    prefix: "@upstash/ratelimit/api",
});
