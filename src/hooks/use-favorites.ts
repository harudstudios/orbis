"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useFavorites() {
  const user = useAuthStore((s) => s.user);
  const favorites = useQuery(
    api.favorites.listByUser,
    user ? { userId: user.uid } : "skip",
  );
  return { favorites: favorites ?? [], isLoading: favorites === undefined };
}

export function useIsFavorited(eventId: string) {
  const user = useAuthStore((s) => s.user);
  const result = useQuery(
    api.favorites.isFavorited,
    user ? { userId: user.uid, eventId: eventId as Id<"events"> } : "skip",
  );
  return user ? !!result : false;
}

export function useToggleFavorite() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const toggleMutation = useMutation(api.favorites.toggle);

  const toggle = useCallback(
    async (eventId: string) => {
      if (!user) {
        router.push("/login");
        return;
      }
      await toggleMutation({ userId: user.uid, eventId: eventId as Id<"events"> });
    },
    [user, router, toggleMutation],
  );

  return toggle;
}
