import useScrollReveal from '../hooks/useScrollReveal';
import { useData } from '../context/DataContext';

export default function Footer() {
  const [ref, visible] = useScrollReveal({ threshold: 0.1 });
  const { siteSettings } = useData();
  const { logoText, footerDescription, footerAddressLine1, footerAddressLine2, footerEmail, footerPhone, footerSocialTitle, footerSocialLinks, footerCopyright, footerTagline, footerStudioLabel } = siteSettings;

  return (
    <footer
      id="footer"
      ref={ref}
      className="border-t border-border bg-charcoal"
    >
      <div className="mx-auto max-w-[1600px] px-6 py-24 sm:px-8 lg:px-16">
        <div
          className={`grid gap-16 lg:grid-cols-[1fr_1fr_1fr] ${visible ? 'visible reveal-on-scroll' : 'reveal-on-scroll'}`}
        >
          {/* Brand */}
          <div>
            <a
              href="#"
              className="font-serif text-xl font-semibold tracking-[0.3em] text-cream"
            >
              {logoText}
            </a>
            <p className="mt-6 max-w-xs font-sans text-sm leading-relaxed text-muted">
              {footerDescription}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="font-sans text-[10px] font-medium tracking-widest uppercase text-cream/40">
              {footerStudioLabel}
            </p>
            <address className="mt-6 space-y-3 font-sans text-sm not-italic leading-relaxed text-cream/70">
              <p>{footerAddressLine1}</p>
              <p>{footerAddressLine2}</p>
              <p className="mt-4">
                <a
                  href={`mailto:${footerEmail}`}
                  className="transition-colors hover:text-accent"
                >
                  {footerEmail}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${footerPhone.replace(/\s/g, '')}`}
                  className="transition-colors hover:text-accent"
                >
                  {footerPhone}
                </a>
              </p>
            </address>
          </div>

          {/* Links */}
          <div>
            <p className="font-sans text-[10px] font-medium tracking-widest uppercase text-cream/40">
              {footerSocialTitle}
            </p>
            <ul className="mt-6 space-y-3">
              {footerSocialLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="font-sans text-sm text-cream/70 transition-colors hover:text-accent"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`mt-20 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 sm:flex-row ${visible ? 'visible reveal-on-scroll' : 'reveal-on-scroll'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <p className="font-sans text-xs tracking-wider text-cream/30">
            {footerCopyright.replace('{year}', new Date().getFullYear().toString())}
          </p>
          <p className="font-sans text-xs tracking-wider text-cream/20">
            {footerTagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
