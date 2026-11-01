import { useRef } from 'react';
import { revealImage, revealImageWithParallax, useMotion } from '@/lib/motion';
import type { PhotoData } from '@/lib/photos';
import { cn } from '@/lib/utils';

type PhotoProps = {
  photo: PhotoData;
  // The size of the frame, usually an aspect ratio. The image always covers it.
  className?: string;
  alt?: string;
  // True only for images above the fold: they load first instead of lazily.
  priority?: boolean;
  parallax?: boolean;
  position?: string;
};

export function Photo({ photo, className, alt, priority = false, parallax = true, position }: PhotoProps) {
  const frame = useRef<HTMLDivElement>(null);
  useMotion(frame, parallax ? revealImageWithParallax : revealImage);

  return (
    <div ref={frame} className={cn('overflow-hidden', className)}>
      <img
        src={photo.src}
        alt={alt ?? photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
        className="size-full object-cover"
      />
    </div>
  );
}
