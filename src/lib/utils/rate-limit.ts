/**
 * Client-side rate limiter to prevent brute-force form submissions.
 * Complements server-side rate limiting — not a replacement.
 */

const attempts: Map<string, { count: number; lastAttempt: number }> = new Map();

interface RateLimitOptions {
  maxAttempts?: number;
  windowMs?: number;
  lockoutMs?: number;
}

export function checkRateLimit(
  key: string,
  { maxAttempts = 5, windowMs = 60_000, lockoutMs = 300_000 }: RateLimitOptions = {}
): { allowed: boolean; remainingMs?: number; attemptsLeft?: number } {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record) {
    attempts.set(key, { count: 1, lastAttempt: now });
    return { allowed: true, attemptsLeft: maxAttempts - 1 };
  }

  // Reset window if enough time has passed
  if (now - record.lastAttempt > windowMs) {
    attempts.set(key, { count: 1, lastAttempt: now });
    return { allowed: true, attemptsLeft: maxAttempts - 1 };
  }

  // Hard lockout after too many attempts
  if (record.count >= maxAttempts) {
    const remainingMs = lockoutMs - (now - record.lastAttempt);
    if (remainingMs > 0) {
      return { allowed: false, remainingMs };
    }
    // Lockout expired — reset
    attempts.set(key, { count: 1, lastAttempt: now });
    return { allowed: true, attemptsLeft: maxAttempts - 1 };
  }

  record.count += 1;
  record.lastAttempt = now;
  return { allowed: true, attemptsLeft: maxAttempts - record.count };
}

export function resetRateLimit(key: string): void {
  attempts.delete(key);
}

export function formatLockoutTime(ms: number): string {
  const mins = Math.ceil(ms / 60_000);
  return mins === 1 ? '1 minute' : `${mins} minutes`;
}
