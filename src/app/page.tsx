"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTMSStore } from "@/lib/store/tmsStore";

export default function Home() {
  const router = useRouter();
  const currentRole = useTMSStore((state) => state.currentRole);

  useEffect(() => {
    if (!currentRole) {
      router.replace("/login");
    } else {
      router.replace("/dashboard");
    }
  }, [currentRole, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-teal border-t-transparent" />
        <div className="text-ink text-caption font-medium tracking-tight">Authenticating Session...</div>
      </div>
    </div>
  );
}
