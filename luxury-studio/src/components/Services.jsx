import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import { useData } from '../context/DataContext';

export default function Services() {
  const [ref, visible] = useScrollReveal({ threshold: 0.1 });
  const [expanded, setExpanded] = useState(null);
  const { siteSettings } = useData();
  const { servicesSectionTitle, servicesHeadingLine1, servicesHeadingLine2, services } = siteSettings;

  const toggle = (i) => setExpanded(expanded === i ? null : i);

  return (
    <section
      id="services"
      ref={ref}
      className="mx-auto max-w-[1600px] px-6 py-32 sm:px-8 lg:px-16"
    >
      <div
        className={`reveal-on-scroll mb-16 ${visible ? 'visible' : ''}`}
        style={{ transitionDelay: '100ms' }}
      >
        <span className="section-label">{servicesSectionTitle}</span>
        <h2 className="max-w-xl font-serif text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
          {servicesHeadingLine1}
          <br />
          {servicesHeadingLine2}
        </h2>
      </div>

      <div className="grid gap-[1px] divide-y divide-border border-y border-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {services.map((service, i) => (
          <div
            key={service.number}
            className={`group cursor-pointer px-0 py-10 transition-all duration-500 lg:px-10 lg:hover:bg-stone/30 ${
              visible ? 'reveal-on-scroll visible' : 'reveal-on-scroll'
            }`}
            style={{ transitionDelay: `${200 + i * 150}ms` }}
            onClick={() => toggle(i)}
          >
            {/* Number */}
            <span className="font-serif text-5xl font-medium text-stone transition-colors duration-500 group-hover:text-accent/30 sm:text-6xl">
              {service.number}
            </span>

            {/* Title */}
            <h3 className="mt-6 font-serif text-2xl font-medium tracking-tight transition-all duration-500 group-hover:translate-x-1">
              {service.title}
            </h3>

            {/* Description */}
            <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-muted transition-colors duration-500 group-hover:text-charcoal">
              {service.description}
            </p>

            {/* Expandable details */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                expanded === i ? 'mt-6 max-h-80 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="space-y-2 border-l-2 border-accent/30 pl-4">
                {service.details.map((detail) => (
                  <li
                    key={detail}
                    className="font-sans text-sm text-charcoal"
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Expand indicator */}
            <div className="mt-6 flex items-center gap-2">
              <span className="font-sans text-[10px] font-medium tracking-widest uppercase text-muted transition-colors group-hover:text-ink">
                {expanded === i ? 'Daralt' : 'Keşfedin'}
              </span>
              <svg
                className={`h-3 w-3 text-muted transition-all duration-500 group-hover:text-ink ${
                  expanded === i ? 'rotate-180' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
