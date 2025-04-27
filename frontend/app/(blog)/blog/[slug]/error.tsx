"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UnauthorizedFallback from "@/components/unauthorized-fallback";

export default function PostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Blog post error:", error);
  }, [error]);

  if (error.message.includes("unauthorized") || error.message.includes("401")) {
    return <UnauthorizedFallback />;
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
        <div className="mb-6 text-slate-600">
          <p>
            {error.message ||
              "We couldn't load this blog post. Please try again."}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Link href="/blog">
            <Button variant="outline">Back to Blog</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
