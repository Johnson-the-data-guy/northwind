import { Photo } from '@/components/photo';
import { Lines, Reveal } from '@/components/reveal';
import { photos } from '@/lib/photos';
import { numbers, team, values } from '@/lib/studio';

export function Studio() {
  return (
    <>
      <section className="signal-wash gutter pt-10 md:pt-16">
        <Lines
          className="display text-[clamp(3.25rem,11vw,11rem)]"
          lines={[
            'Small on',
            <>
              purpose<span className="text-accent">.</span>
            </>,
          ]}
        />
        <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-12 md:grid-rows-[auto_1fr]">
          <Photo
            photo={photos['studio-loft']}
            priority
            className="aspect-[4/5] md:col-span-4 md:row-span-2"
          />
          <p className="m-0 text-xl md:col-span-6 md:col-start-6 md:text-2xl">
            Northwind is three designers and one developer in a former net loft on Lantern Wharf. We
            take on a handful of projects a year, and the people you meet are the people who do the
            work.
          </p>
          <p className="m-0 text-muted-foreground md:col-span-6 md:col-start-6">
            Most of our clients are within sight of the water: harbours, ferries, makers, a museum,
            a poetry press. We like jobs with a physical end, something printed, cut, painted or
            hung, and we build for screens with the same care.
          </p>
        </div>
      </section>

      <Photo photo={photos['studio-atelier']} className="mt-16 aspect-[4/3] md:mt-24 md:aspect-[21/9]" />

      <div className="signal-wash pb-16 md:pb-24">
        <section className="gutter pt-16 md:pt-24">
          <h2 className="display text-4xl md:text-6xl">What we hold to</h2>
          <Reveal className="mt-8 grid gap-8 md:mt-10 md:grid-cols-3">
            {values.map((value, index) => (
              <div key={value.name} data-rise className="border-t-2 border-accent pt-4">
                <p className="label m-0 text-accent">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="display mt-3 text-3xl md:text-4xl">{value.name}</h3>
                <p className="mt-3 mb-0">{value.text}</p>
              </div>
            ))}
          </Reveal>
        </section>

        <section className="gutter pt-16 md:pt-24">
          <h2 className="display text-4xl md:text-6xl">The four of us</h2>
          <ul className="mt-8 grid list-none gap-8 p-0 sm:grid-cols-2 md:mt-10 md:grid-cols-4 md:gap-6">
            {team.map((member) => (
              <li key={member.name}>
                <Photo
                  photo={photos[member.portrait]}
                  alt={`Portrait of ${member.name}`}
                  parallax={false}
                  position="50% 15%"
                  className="aspect-[3/4]"
                />
                <span aria-hidden className="mt-3 block h-0.5 w-10 bg-accent" />
                <h3 className="display mt-3 text-3xl">{member.name}</h3>
                <p className="label mt-2 mb-0 text-muted-foreground">{member.role}</p>
                <p className="mt-3 mb-0">{member.bio}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-label="Studio numbers" className="gutter bg-accent py-10 text-ink md:py-14">
        <Reveal>
          <dl className="m-0 grid gap-6 md:grid-cols-3 md:gap-8">
            {numbers.map((item) => (
              <div key={item.label} data-rise className="flex flex-col-reverse border-t border-ink/30 pt-3">
                <dd className="display m-0 text-[clamp(4.5rem,11vw,10rem)]">{item.value}</dd>
                <dt className="label mb-2">{item.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>
    </>
  );
}
