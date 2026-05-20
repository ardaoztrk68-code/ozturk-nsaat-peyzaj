import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const { siteSettings } = useData();
  const { heroTagline, heroHeadingLine1, heroHeadingLine2, heroDescription, heroImage, heroCtaText, heroScrollText } = siteSettings;

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex h-screen min-h-[700px] items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className="h-full w-full object-cover"
        />
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/20 via-transparent to-ink/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 text-center text-white">
        <p
          className={`mb-6 font-sans text-[11px] font-medium tracking-super uppercase text-white/60 transition-all duration-1000 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {heroTagline}
        </p>

        <h1
          className={`mx-auto max-w-5xl font-serif text-5xl font-medium leading-[1.1] tracking-tight transition-all duration-1000 sm:text-6xl md:text-7xl lg:text-8xl ${
            loaded ? 'opacity-100' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          {heroHeadingLine1}
          <br />
          <span className="italic">{heroHeadingLine2}</span>
        </h1>

        <p
          className={`mx-auto mt-8 max-w-xl font-sans text-base font-light leading-relaxed text-white/70 transition-all duration-1000 sm:text-lg ${
            loaded ? 'opacity-100' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          {heroDescription}
        </p>

        <div
          className={`mt-12 transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '900ms' }}
        >
          <a
            href="#projects"
            className="group btn-outline border-white/30 text-white hover:border-white/60 hover:bg-white hover:text-ink"
          >
            {heroCtaText}
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 left-1/2 z-10 -translate-x-1/2 transition-all duration-1000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1400ms' }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-[9px] tracking-widest uppercase text-white/50">
            {heroScrollText}
          </span>
          <div className="h-10 w-[1px] animate-pulse bg-white/30" />
        </div>
      </div>
    </section>
  );
}
