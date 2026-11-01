import { Photo } from '@/components/photo';
import { photos } from '@/lib/photos';
import { studio } from '@/lib/studio';

export function Contact() {
  return (
    <section className="gutter pt-10 md:pt-16">
      <h1 className="label text-muted-foreground">Contact</h1>
      <a
        href={`mailto:${studio.email}`}
        className="display mt-6 block text-[clamp(2.1rem,9.6vw,10rem)] underline decoration-accent decoration-4 underline-offset-[0.12em] hover:text-accent"
      >
        hello@
        <wbr />
        northwind
        <wbr />
        .example
      </a>
      <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-12">
        <p className="m-0 text-xl md:col-span-5 md:text-2xl">
          Tell us what you are making and when it needs to exist. We answer every message ourselves,
          usually within two working days.
        </p>
        <div className="md:col-span-3 md:col-start-7">
          <h2 className="label m-0 text-muted-foreground">Studio</h2>
          <address className="mt-3 text-xl not-italic md:text-2xl">
            {studio.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>
        <div className="md:col-span-3 md:col-start-10">
          <h2 className="label m-0 text-muted-foreground">Hours</h2>
          <dl className="mt-3 mb-0">
            {studio.hours.map((row) => (
              <div key={row.days} className="mb-3">
                <dt className="label">{row.days}</dt>
                <dd className="m-0 text-xl md:text-2xl">{row.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <Photo photo={photos['contact-studio']} className="-mx-4 mt-12 aspect-[4/3] md:-mx-10 md:mt-20 md:aspect-[21/9]" />
    </section>
  );
}
