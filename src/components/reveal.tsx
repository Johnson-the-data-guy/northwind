import { type ElementType, type ReactNode, useRef } from 'react';
import { revealLines, revealText, useMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

/** Headline revealed one line at a time. The bottom padding keeps descenders out of the mask. */
export function Lines({
  lines,
  as: Tag = 'h1',
  className,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
}) {
  const heading = useRef<HTMLElement>(null);
  useMotion(heading, revealLines);

  return (
    <Tag ref={heading} className={className}>
      {lines.map((line, index) => (
        <span key={index} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          <span data-line className="block">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Children marked with data-rise fade up in turn as the block scrolls into view. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const block = useRef<HTMLDivElement>(null);
  useMotion(block, revealText);

  return (
    <div ref={block} className={cn(className)}>
      {children}
    </div>
  );
}
