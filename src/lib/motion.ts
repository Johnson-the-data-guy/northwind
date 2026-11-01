import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { type RefObject, useEffect, useLayoutEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

const MOTION_ALLOWED = '(prefers-reduced-motion: no-preference)';

let lenis: Lenis | null = null;

export { gsap };

type Setup<T> = (element: T) => void | (() => void);

/**
 * Runs a GSAP setup only while motion is allowed. Everything it creates is reverted on unmount,
 * or at once if the visitor turns reduced motion on. Pass a function defined outside the component
 * so the effect does not re-run on every render.
 */
export function useMotion<T extends HTMLElement>(ref: RefObject<T | null>, setup: Setup<T>) {
  // Layout effect: hidden start states must apply before the first paint.
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add(MOTION_ALLOWED, () => setup(element));
    return () => media.revert();
  }, [ref, setup]);
}

/** Smooth scrolling on the GSAP clock, so Lenis and ScrollTrigger stay in step. */
export function useSmoothScroll() {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(MOTION_ALLOWED, () => {
      const instance = new Lenis();
      const tick = (time: number) => instance.raf(time * 1000);
      instance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenis = instance;

      // Fetched project lists and filters change the page height after triggers are measured.
      const observer = new ResizeObserver(() => ScrollTrigger.refresh());
      observer.observe(document.body);

      return () => {
        observer.disconnect();
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        instance.destroy();
        lenis = null;
      };
    });
    return () => media.revert();
  }, []);
}

export function jumpToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

/**
 * Starts at a 1% sliver, not 100%: a fully clipped image never intersects the viewport,
 * so the browser would not start loading a lazy image until the reveal had already begun.
 */
function clipReveal(element: HTMLElement) {
  gsap.fromTo(
    element,
    { clipPath: 'inset(99% 0% 0% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: element, start: 'top 90%', once: true },
    },
  );
}

export function revealImage(element: HTMLElement) {
  clipReveal(element);
}

export function revealImageWithParallax(element: HTMLElement) {
  clipReveal(element);
  const image = element.querySelector('img');
  if (!image) return;
  gsap.fromTo(
    image,
    { scale: 1.14, yPercent: -6 },
    {
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  );
}

export function revealText(element: HTMLElement) {
  gsap.from(element.querySelectorAll('[data-rise]'), {
    y: 28,
    opacity: 0,
    duration: 0.9,
    stagger: 0.09,
    ease: 'power3.out',
    scrollTrigger: { trigger: element, start: 'top 85%', once: true },
  });
}

export function revealLines(element: HTMLElement) {
  gsap.from(element.querySelectorAll('[data-line]'), {
    yPercent: 115,
    duration: 1.15,
    stagger: 0.14,
    delay: 0.25,
    ease: 'power4.out',
  });
}

export function slowZoom(element: HTMLElement) {
  const image = element.querySelector('img');
  if (!image) return;
  gsap.fromTo(image, { scale: 1.16 }, { scale: 1, duration: 14, ease: 'sine.out' });
  gsap.to(element, {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: element, start: 'top top', end: 'bottom top', scrub: true },
  });
}

/** A small shift across the whole page, so the coil moves only slightly against the content. */
export function driftSpiral(element: HTMLElement) {
  gsap.fromTo(
    element,
    { y: -100 },
    { y: 100, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } },
  );
}

export function runMarquee(element: HTMLElement) {
  const track = element.querySelector('[data-track]');
  const seconds = Number(element.dataset.seconds) || 30;
  const tween = gsap.to(track, { xPercent: -50, duration: seconds, ease: 'none', repeat: -1 });
  const pause = () => tween.pause();
  const play = () => tween.play();
  element.addEventListener('pointerenter', pause);
  element.addEventListener('pointerleave', play);
  return () => {
    element.removeEventListener('pointerenter', pause);
    element.removeEventListener('pointerleave', play);
  };
}
