import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { Photo } from '@/components/photo';
import { Lines, Reveal } from '@/components/reveal';
import { LoadError, Loading } from '@/components/status';
import { Button } from '@/components/ui/button';
import { caseStudyFor } from '@/lib/case-studies';
import { photos, type PhotoData } from '@/lib/photos';
import { useProject, useProjects, type Project } from '@/lib/projects';
import { cn } from '@/lib/utils';
import { NotFound } from '@/pages/not-found';

const galleryPlacement = [
  'md:col-span-7',
  'md:col-span-4 md:col-start-9 md:mt-20',
  'md:col-span-4 md:col-start-2',
  'md:col-span-6 md:col-start-7 md:mt-14',
];

function coverOf(project: Project): PhotoData {
  const study = caseStudyFor(project.slug);
  return study ? photos[study.cover] : { src: project.cover, width: 1600, height: 1200, alt: '' };
}

function NextProject({ slug }: { slug: string }) {
  const projects = useProjects();
  if (projects.status !== 'ready' || projects.data.length < 2) return null;

  const index = projects.data.findIndex((project) => project.slug === slug);
  const next = projects.data[(index + 1) % projects.data.length];

  return (
    <section className="gutter mt-20 border-t border-border/40 pt-8 md:mt-28 md:pt-10">
      <Link to={`/work/${next.slug}`} className="group grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="label m-0 text-muted-foreground">Next project</p>
          <p className="display mt-3 mb-0 inline-flex items-center gap-3 text-5xl transition-colors group-hover:text-accent md:text-6xl">
            {next.title}
            <ArrowUpRight aria-hidden className="size-10 shrink-0 md:size-14" />
          </p>
        </div>
        <Photo
          photo={coverOf(next)}
          alt=""
          parallax={false}
          position={caseStudyFor(next.slug)?.coverPosition}
          className="aspect-[16/9] md:col-span-4 md:col-start-9"
        />
      </Link>
    </section>
  );
}

function CaseStudy({ project }: { project: Project }) {
  const { slug, title, client, year, discipline, summary } = project;
  const study = caseStudyFor(slug);

  return (
    <article className="pb-16 md:pb-24">
      <Lines
        className="display gutter pt-10 pb-10 text-[clamp(3.25rem,11vw,11rem)] md:pt-16 md:pb-12"
        lines={[title]}
      />
      <Photo
        photo={coverOf(project)}
        priority
        position={study?.coverPosition}
        className="aspect-[4/3] md:aspect-[16/9]"
      />
      <div className="gutter mt-10 grid gap-10 md:mt-16 md:grid-cols-12">
        <dl className="label m-0 grid grid-cols-[6rem_1fr] content-start gap-y-2 md:col-span-4">
          <dt className="text-muted-foreground">Client</dt>
          <dd className="m-0">{client}</dd>
          <dt className="text-muted-foreground">Year</dt>
          <dd className="m-0">{year}</dd>
          <dt className="text-muted-foreground">Discipline</dt>
          <dd className="m-0">{discipline}</dd>
        </dl>
        <p className="m-0 text-2xl md:col-span-7 md:col-start-6 md:text-4xl md:leading-tight">{summary}</p>
      </div>

      {study && (
        <>
          <Reveal className="gutter mt-16 grid gap-8 md:mt-24 md:grid-cols-3">
            {[
              { heading: 'Challenge', text: study.challenge },
              { heading: 'Approach', text: study.approach },
              { heading: 'Outcome', text: study.outcome },
            ].map((part) => (
              <section key={part.heading} data-rise className="border-t border-border/40 pt-4">
                <h2 className="display text-3xl md:text-4xl">{part.heading}</h2>
                <p className="mt-4 mb-0">{part.text}</p>
              </section>
            ))}
          </Reveal>

          <section aria-label="Gallery" className="gutter mt-16 grid gap-6 md:mt-24 md:grid-cols-12 md:gap-y-12">
            {study.gallery.map((name, index) => {
              const photo = photos[name];
              const tall = photo.height > photo.width;
              return (
                <Photo
                  key={name}
                  photo={photo}
                  className={cn(tall ? 'aspect-[3/4]' : 'aspect-[4/3]', galleryPlacement[index])}
                />
              );
            })}
          </section>
        </>
      )}

      <NextProject slug={slug} />

      <p className="gutter mt-10">
        <Button asChild>
          <Link to="/work">
            <ArrowLeft aria-hidden className="size-4" />
            Back to the work
          </Link>
        </Button>
      </p>
    </article>
  );
}

export function ProjectDetail() {
  const { slug = '' } = useParams();
  const project = useProject(slug);

  if (project.status === 'loading') return <Loading />;
  if (project.status === 'error') return <LoadError />;
  if (project.status === 'not-found') return <NotFound />;

  return <CaseStudy project={project.data} />;
}
