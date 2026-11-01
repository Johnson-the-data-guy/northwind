import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { useSearchParams } from 'react-router';
import { ProjectCard } from '@/components/project-card';
import { Lines } from '@/components/reveal';
import { LoadError, Loading } from '@/components/status';
import { useProjects, type Project } from '@/lib/projects';
import { cn } from '@/lib/utils';

// Repeating 12-column rhythm: wide, narrow, narrow, wide.
const placement = [
  'md:col-span-7',
  'md:col-span-4 md:col-start-9 md:mt-28',
  'md:col-span-4 md:col-start-2',
  'md:col-span-6 md:col-start-7 md:mt-16',
];

const ALL = 'All';

function Filters({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange: (option: string) => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <LayoutGroup>
      <div role="group" aria-label="Filter by discipline" className="gutter mb-8 flex flex-wrap gap-x-5 gap-y-1 md:mb-12 md:gap-x-8">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === active}
            onClick={() => onChange(option)}
            className={cn(
              'label relative cursor-pointer py-3 text-[0.9375rem] transition-colors hover:text-accent',
              option === active ? 'text-accent' : 'text-muted-foreground',
            )}
          >
            {option}
            {option === active && (
              <motion.span
                layoutId="filter-underline"
                transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
                className="absolute inset-x-0 bottom-1.5 h-0.5 bg-accent"
              />
            )}
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}

function Grid({ projects }: { projects: Project[] }) {
  const [params, setParams] = useSearchParams();
  const options = [ALL, ...new Set(projects.map((project) => project.discipline))];
  const requested = params.get('discipline') ?? ALL;
  const active = options.includes(requested) ? requested : ALL;
  const visible = active === ALL ? projects : projects.filter((p) => p.discipline === active);

  function choose(option: string) {
    setParams(option === ALL ? {} : { discipline: option }, { replace: true, preventScrollReset: true });
  }

  return (
    <>
      <Filters options={options} active={active} onChange={choose} />
      <div className="gutter grid gap-10 md:grid-cols-12 md:gap-y-16">
        {visible.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            number={projects.indexOf(project) + 1}
            className={placement[index % placement.length]}
          />
        ))}
      </div>
    </>
  );
}

export function Work() {
  const projects = useProjects();

  return (
    <div className="signal-wash pb-16 md:pb-24">
      <Lines
        className="display gutter pt-10 pb-8 text-[clamp(4rem,15vw,15rem)] md:pt-16 md:pb-10"
        lines={[
          <>
            Work<span className="text-accent">.</span>
          </>,
        ]}
      />
      {projects.status === 'loading' && <Loading />}
      {(projects.status === 'error' || projects.status === 'not-found') && <LoadError />}
      {projects.status === 'ready' && <Grid projects={projects.data} />}
    </div>
  );
}
