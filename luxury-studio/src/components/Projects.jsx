import useScrollReveal from '../hooks/useScrollReveal';
import { useData } from '../context/DataContext';

export default function Projects() {
  const { projects } = useData();

  const [ref, visible] = useScrollReveal({ threshold: 0.05 });

  return (
    <section
      id="projects"
      ref={ref}
      className="mx-auto max-w-[1600px] px-6 py-32 sm:px-8 lg:px-16"
    >
      <div
        className={`reveal-on-scroll mb-16 ${visible ? 'visible' : ''}`}
        style={{ transitionDelay: '100ms' }}
      >
        <span className="section-label">Seçkin İşler</span>
        <h2 className="max-w-2xl font-serif text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
          Özenle Seçilmiş
          <br />
          Projeler
        </h2>
      </div>

      {/* Masonry / Editorial Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {projects.map((project, i) => (
          <a
            key={project.id}
            href="#"
            className={`group relative block overflow-hidden lg:col-span-1 lg:row-span-1 aspect-[4/5] ${
              visible ? 'reveal-on-scroll visible' : 'reveal-on-scroll'
            }`}
            style={{ transitionDelay: `${200 + i * 100}ms` }}
          >
            {/* Image */}
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              loading={i > 2 ? 'lazy' : 'eager'}
            />
            {/* Permanent subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

            {/* Text overlay - always visible, enhanced on hover */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="font-sans text-[10px] font-medium tracking-widest uppercase text-white/50 transition-all duration-500 group-hover:text-white/70">
                {project.category}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-medium text-white transition-all duration-500 sm:text-3xl group-hover:translate-y-[-2px]">
                {project.title}
              </h3>
              <div className="mt-2 flex items-center gap-3 overflow-hidden">
                <span className="font-sans text-xs tracking-wider text-white/40 transition-all duration-500 group-hover:text-white/60">
                  {project.location}
                </span>
                <span className="font-sans text-xs tracking-wider text-white/30">—</span>
                <span className="font-sans text-xs tracking-wider text-white/40 transition-all duration-500 group-hover:text-white/60">
                  {project.year}
                </span>
              </div>
            </div>

            {/* Hover border accent */}
            <div className="absolute inset-0 border-2 border-transparent transition-all duration-500 group-hover:border-white/10" />
          </a>
        ))}
      </div>

      {/* CTA */}
      <div
        className={`reveal-on-scroll mt-16 text-center ${visible ? 'visible' : ''}`}
        style={{ transitionDelay: '900ms' }}
      >
        <a href="#" className="group btn-outline">
          Tüm Projeleri Görün
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
