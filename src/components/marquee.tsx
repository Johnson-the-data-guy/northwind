import { type ReactNode, useRef } from 'react';
import { runMarquee, useMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Two identical rows moved by half the track's width, which loops without a seam. Hovering pauses
 * it. Under reduced motion it stays still, and one row wraps so every item can still be read.
 */
export function Marquee({
  children,
  seconds,
  className,
}: {
  children: ReactNode;
  seconds: number;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  useMotion(frame, runMarquee);

  return (
    <div ref={frame} data-seconds={seconds} className={cn('overflow-hidden', className)}>
      <div data-track className="flex w-max motion-reduce:w-full">
        <ul className="m-0 flex shrink-0 list-none items-center p-0 motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center">
          {children}
        </ul>
        <ul aria-hidden className="m-0 flex shrink-0 list-none items-center p-0 motion-reduce:hidden">
          {children}
        </ul>
      </div>
    </div>
  );
}
