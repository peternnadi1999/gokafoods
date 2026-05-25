'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { verifyEmailService } from '@/lib/api/services';
import { QUERY_KEYS } from '@/lib/api/endpoints';

// ──────────────────────────────────────────────
// Poll: is the current user's email verified?
// Runs every 5 s — auto-advances page when verified.
// ──────────────────────────────────────────────
export function useEmailVerifiedStatus(email: string, enabled = true) {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_VERIFIED, email],
    queryFn: async () => {
      if (!email) {
        throw new Error('Email query parameter is required');
      }
      const res = await verifyEmailService.checkVerified(email);
      return res.data;
    },
    enabled: enabled && !!email,
    refetchInterval: 10000,
    staleTime: 0,
  });
}

// ──────────────────────────────────────────────
// Resend the verification email
// ──────────────────────────────────────────────
export function useResendVerification() {
  return useMutation({
    mutationFn: async ({ userEmail, platform }: { userEmail: string; platform: string }) => {
      await verifyEmailService.resend(userEmail, platform);
    },
  });
}

// // ──────────────────────────────────────────────
// // Consume the token from the email link URL
// // ──────────────────────────────────────────────
// export function useVerifyEmailToken() {
//   return useMutation({
//     mutationFn: async (token: string) => {
//       if (IS_DEMO) return demoVerifyEmailToken(token);
//       const res = await verifyEmailService.verifyToken(token);
//       return res.data.data;
//     },
//   });
// }