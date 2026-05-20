import useScrollReveal from '../hooks/useScrollReveal';
import { useData } from '../context/DataContext';

export default function About() {
  const [ref, visible] = useScrollReveal({ threshold: 0.1 });
  const { siteSettings } = useData();
  const { aboutSubtitle, aboutHeadingLine1, aboutHeadingLine2, aboutDescription1, aboutDescription2, aboutImage, stats } = siteSettings;

  return (
    <section
      id="about"
      ref={ref}
      className="mx-auto max-w-[1600px] px-6 py-32 sm:px-8 lg:px-16"
    >
      {/* Asymmetrical layout */}
      <div className="grid items-center gap-0 lg:grid-cols-[1.1fr_0.9fr] lg:gap-0">
        {/* Image */}
        <div
          className={`reveal-on-scroll overflow-hidden ${visible ? 'visible' : ''}`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="aspect-[4/5] overflow-hidden lg:aspect-[5/4]">
            <img
              src={aboutImage}
              alt="Sonsuzluk havuzuna bakan modern mimari pavyon"
              className="h-full w-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-[1.03]"
            />
          </div>
        </div>

        {/* Text */}
        <div
          className={`reveal-on-scroll flex flex-col justify-center px-0 pt-12 lg:px-16 lg:pt-0 ${visible ? 'visible' : ''}`}
          style={{ transitionDelay: '300ms' }}
        >
          <span className="section-label">{aboutSubtitle}</span>

          <h2 className="max-w-md font-serif text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            {aboutHeadingLine1}
            <br />
            {aboutHeadingLine2}
          </h2>

          <div className="mt-8 space-y-5">
            <p className="max-w-lg font-sans text-base leading-relaxed text-charcoal sm:text-lg">
              {aboutDescription1}
            </p>
            <p className="max-w-lg font-sans text-base leading-relaxed text-muted">
              {aboutDescription2}
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-10 border-t border-border pt-10">
            {stats.map(({ id, value, label }) => (
              <div key={id}>
                <p className="font-serif text-3xl font-medium text-ink sm:text-4xl">
                  {value}
                </p>
                <p className="mt-1 font-sans text-xs tracking-widest uppercase text-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
