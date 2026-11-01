import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export function NotFound() {
  return (
    <section className="gutter pt-10 pb-16 md:pt-16 md:pb-24">
      <p className="display text-[clamp(7rem,30vw,30rem)] text-accent" aria-hidden>
        404
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-12">
        <h1 className="display text-4xl md:col-span-6 md:text-6xl">Nothing moored here.</h1>
        <div className="md:col-span-4 md:col-start-8">
          <p className="mt-0">This page has drifted off or never existed. The work is still where we left it.</p>
          <Button asChild>
            <Link to="/work">
              <ArrowLeft aria-hidden className="size-4" />
              See the work
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
