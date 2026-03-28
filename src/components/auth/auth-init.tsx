"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AuthInit() {
  const init = useAuthStore((s) => s._init);

  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe;
  }, [init]);

  return null;
}
