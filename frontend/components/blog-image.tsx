"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
  quality?: "low" | "medium" | "high";
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
  quality = "medium",
  style,
  width,
  height,
  fill = false,
}: BlogImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [blurSrc, setBlurSrc] = useState<string>("");

  useEffect(() => {
    if (!src) return;

    if (src.includes("thumb-")) {
      setBlurSrc(src);
      return;
    }

    if (src.startsWith("/uploads/")) {
      const pathParts = src.split("/");
      const filename = pathParts[pathParts.length - 1];
      setBlurSrc(`/uploads/thumbnails/thumb-${filename}`);
    } else {
      setBlurSrc(src);
    }
  }, [src]);

  const qualityMap = {
    low: 30,
    medium: 75,
    high: 90,
  };

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        aspectRatio,
        ...style,
      }}
    >
      {blurSrc && !loaded && (
        <Image
          src={blurSrc}
          alt={alt}
          fill={fill || (!width && !height)}
          width={width}
          height={height}
          className={cn(
            "transition-opacity duration-300 object-cover",
            loaded ? "opacity-0" : "opacity-100 scale-[1.02] blur-[10px]",
          )}
          sizes={sizes}
          loading="eager"
          style={{ aspectRatio }}
        />
      )}

      <Image
        src={imgSrc}
        alt={alt}
        fill={fill || (!width && !height)}
        width={width}
        height={height}
        onLoadingComplete={() => setLoaded(true)}
        className={cn(
          "transition-opacity duration-500 object-cover",
          loaded ? "opacity-100" : "opacity-0",
        )}
        sizes={sizes}
        quality={qualityMap[quality]}
        priority={priority}
        style={{ aspectRatio }}
        onError={() => {
          setImgSrc("/images/placeholder.jpg");
        }}
      />
    </div>
  );
}
