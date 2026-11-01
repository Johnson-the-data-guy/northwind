import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router';
import { Marquee } from '@/components/marquee';
import { Photo } from '@/components/photo';
import { ProjectCard } from '@/components/project-card';
import { Lines, Reveal } from '@/components/reveal';
import { LoadError, Loading } from '@/components/status';
import { slowZoom, useMotion } from '@/lib/motion';
import { photos } from '@/lib/photos';
import { useProjects } from '@/lib/projects';
import { brands, clients, process, services, testimonial } from '@/lib/studio';

// Column placement for the first four projects, offset on purpose.
const placement = [
  'md:col-span-7',
  'md:col-span-4 md:col-start-9 md:mt-32',
  'md:col-span-5 md:col-start-2',
  'md:col-span-6 md:col-start-7 md:mt-20',
];

function Hero() {
  const backdrop = useRef<HTMLDivElement>(null);
  useMotion(backdrop, slowZoom);

  return (
    <section className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink text-paper">
      <div ref={backdrop} className="absolute inset-0">
        <img
          src={photos['home-hero'].src}
          alt={photos['home-hero'].alt}
          width={photos['home-hero'].width}
          height={photos['home-hero'].height}
          fetchPriority="high"
          className="size-full object-cover object-[80%_50%] md:object-[50%_60%]"
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/50" />
      <div className="gutter relative pt-28 pb-8 md:pb-12">
        <Lines
          className="display text-[clamp(3.25rem,11vw,11rem)]"
          lines={[
            'Four people.',
            <>
              One <span className="text-accent">harbour.</span>
            </>,
            'Loud work.',
          ]}
        />
        <div className="mt-8 grid md:mt-10 md:grid-cols-12">
          <p className="m-0 text-xl md:col-span-5 md:col-start-8 md:text-2xl">
            Northwind is a design studio on Lantern Wharf. We make identities, books, packaging and
            websites for clients who would rather be remembered than liked.
          </p>
        </div>
      </div>
    </section>
  );
}

function ClientMarquee() {
  return (
    <section aria-label="Clients" className="border-b border-border/40 py-5 md:py-7">
      <Marquee seconds={38}>
        {clients.map((client) => (
          <li key={client} className="display px-6 text-2xl whitespace-nowrap md:px-10 md:text-4xl">
            {client}
          </li>
        ))}
      </Marquee>
    </section>
  );
}

function SelectedWork() {
  const projects = useProjects();

  return (
    <div className="signal-wash">
      <div className="gutter pt-16 pb-8 md:pt-24 md:pb-12">
        <h2 className="display text-5xl md:text-7xl">
          Selected work<span className="text-accent">.</span>
        </h2>
      </div>
      {projects.status === 'loading' && <Loading />}
      {(projects.status === 'error' || projects.status === 'not-found') && <LoadError />}
      {projects.status === 'ready' && (
        <section aria-label="Selected work" className="gutter grid gap-10 md:grid-cols-12 md:gap-y-16">
          {projects.data.slice(0, 4).map((project, index) => (
            <ProjectCard key={project.slug} project={project} number={index + 1} className={placement[index]} />
          ))}
        </section>
      )}
      <p className="gutter mt-14 md:mt-20">
        <Link
          to="/work"
          className="display inline-flex items-center gap-3 text-5xl hover:text-accent md:text-6xl"
        >
          All six projects
          <ArrowUpRight aria-hidden className="size-10 shrink-0 md:size-14" />
        </Link>
      </p>
    </div>
  );
}

function Services() {
  return (
    <section className="gutter mt-20 md:mt-28">
      <h2 className="display text-5xl md:text-7xl">What we do</h2>
      <Reveal>
        <ul className="mt-8 list-none p-0 md:mt-10">
          {services.map((service) => (
            <li
              key={service.name}
              data-rise
              className="grid gap-3 border-t border-border/40 py-5 md:grid-cols-12 md:py-7"
            >
              <h3 className="display text-3xl md:col-span-6 md:text-5xl">{service.name}</h3>
              <p className="m-0 md:col-span-5 md:col-start-8">{service.text}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function Process() {
  return (
    <section className="mt-20 md:mt-28">
      <Photo photo={photos['home-process']} className="aspect-[4/3] md:aspect-[21/9]" />
      <div className="gutter mt-10 md:mt-16">
        <h2 className="display text-5xl md:text-7xl">How it goes</h2>
        <Reveal>
          <ol className="mt-8 grid list-none gap-8 p-0 md:mt-10 md:grid-cols-4 md:gap-8">
            {process.map((step, index) => (
              <li key={step.name} data-rise>
                <p className="label m-0 text-accent">Step {index + 1}</p>
                <h3 className="display mt-3 text-3xl md:text-4xl">{step.name}</h3>
                <p className="mt-3 mb-0 text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

function TrustedBrands() {
  return (
    <section className="mt-20 border-y border-border/40 py-10 md:mt-28 md:py-10">
      <h2 className="label gutter mb-6 text-muted-foreground md:mb-8">Trusted by brands you know</h2>
      <Marquee seconds={32}>
        {brands.map((brand) => (
          <li key={brand.name} className="px-8 md:px-14">
            <span
              role="img"
              aria-label={brand.name}
              style={{ mask: `url(${brand.logo}) center / contain no-repeat` }}
              className="block size-12 bg-current md:size-16"
            />
          </li>
        ))}
      </Marquee>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="gutter mt-20 md:mt-28">
      <Reveal>
        <figure className="m-0 grid gap-6 md:grid-cols-12">
          <span data-rise aria-hidden className="block h-0.5 w-16 bg-accent md:col-span-12" />
          <blockquote data-rise className="display m-0 text-3xl md:col-span-9 md:text-6xl">
            {testimonial.quote}
          </blockquote>
          <figcaption data-rise className="label md:col-span-10">
            {testimonial.name}
            <span className="block text-muted-foreground">{testimonial.role}</span>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

function BigCta() {
  return (
    <section className="relative mt-24 overflow-hidden bg-ink text-paper md:mt-40">
      <Photo photo={photos['home-cta']} alt="" className="aspect-[3/4] md:aspect-[21/9]" />
      <div aria-hidden className="absolute inset-0 bg-ink/55" />
      <div className="gutter absolute inset-x-0 bottom-0 pb-8 md:pb-12">
        <p className="label m-0">Tell us what you are making</p>
        <Link
          to="/contact"
          className="display mt-3 inline-flex items-center gap-3 text-[clamp(3.25rem,10vw,10rem)] hover:text-accent"
        >
          Start here
          <ArrowUpRight aria-hidden className="size-[0.8em] shrink-0" />
        </Link>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <ClientMarquee />
      <SelectedWork />
      <Services />
      <Process />
      <TrustedBrands />
      <Testimonial />
      <BigCta />
    </>
  );
}
