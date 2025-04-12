
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
}

export function ResponsiveImage({
  src,
  alt,
  className,
  aspectRatio = "aspect-square",
  objectFit = "cover",
  ...props
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("overflow-hidden relative", aspectRatio, className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          objectFit === "cover" ? "object-cover" : "object-contain",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
}
