"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
  quality?: number;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  fill?: boolean;
}

export function BlogImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  aspectRatio = "16/9",
  quality = 75,
  style,
  width,
  height,
  fill = false,
}: BlogImageProps) {
  const [error, setError] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // Determine if the source is a remote URL and format it properly
  let imageSrc = src;

  if (!src) {
    imageSrc = "/images/placeholder.jpg";
  } else if (src.startsWith("/uploads") || src.includes("/api/uploads/")) {
    // If path is relative to backend but doesn't start with http
    imageSrc = `${BACKEND_URL}${src.startsWith("/") ? "" : "/"}${src}`;
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        aspectRatio,
        ...style,
      }}
    >
      <Image
        src={error ? "/images/placeholder.jpg" : imageSrc}
        alt={alt || "Blog image"}
        fill={fill || (!width && !height)}
        width={width}
        height={height}
        className={cn("object-cover")}
        sizes={sizes}
        quality={quality}
        priority={priority}
        onError={() => {
          console.error("Image failed to load:", imageSrc);
          setError(true);
        }}
      />
    </div>
  );
}
