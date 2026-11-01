import { Link } from 'react-router';
import { Photo } from '@/components/photo';
import { caseStudyFor } from '@/lib/case-studies';
import { photos, type PhotoData } from '@/lib/photos';
import type { Project } from '@/lib/projects';
import { cn } from '@/lib/utils';

export function ProjectCard({
  project,
  number,
  className,
}: {
  project: Project;
  number: number;
  className?: string;
}) {
  const study = caseStudyFor(project.slug);
  const cover: PhotoData = study
    ? photos[study.cover]
    : { src: project.cover, width: 1600, height: 1200, alt: '' };
  const second = study && photos[study.gallery[0]];

  return (
    <Link to={`/work/${project.slug}`} className={cn('group block', className)}>
      <div className="relative overflow-hidden">
        <Photo photo={cover} alt="" position={study?.coverPosition} className="aspect-[4/3]" />
        {second && (
          // A 99.9% clip rather than 100%: a fully clipped image would never start lazy loading.
          <img
            src={second.src}
            alt=""
            width={second.width}
            height={second.height}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-[clip-path] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] [clip-path:inset(99.9%_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/85 p-4 text-paper transition-transform delay-100 duration-500 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none md:p-5"
        >
          <p className="m-0 line-clamp-2 text-base leading-snug">{project.summary}</p>
          <p className="label mt-2 mb-0 text-accent">View project</p>
        </div>
      </div>
      <span
        aria-hidden
        className="mt-3 block h-0.5 origin-left scale-x-[0.12] bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />
      <h3 className="display mt-3 text-3xl transition-colors group-hover:text-accent md:text-4xl">
        {project.title}
      </h3>
      <p className="label mt-2 text-muted-foreground">
        <span className="mr-2 text-accent">{String(number).padStart(2, '0')}</span>
        {project.discipline}, {project.year}
      </p>
    </Link>
  );
}
