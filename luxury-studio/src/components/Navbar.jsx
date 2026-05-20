import { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { siteSettings } = useData();
  const { logoText, navLinks } = siteSettings;

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream/90 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-6 lg:px-16">
        <a
          href="#"
          className="font-serif text-xl font-semibold tracking-[0.3em] text-ink transition-colors duration-300"
        >
          {logoText}
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-10 md:flex">
          {navLinks.map(({ id, label, href }) => (
            <li key={id}>
              <a href={href} className="nav-link">
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-[1.5px] w-6 bg-ink transition-all duration-300 ${
              menuOpen ? 'translate-y-[5px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-[1.5px] w-6 bg-ink transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-[1.5px] w-6 bg-ink transition-all duration-300 ${
              menuOpen ? '-translate-y-[5px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${
          menuOpen ? 'max-h-80' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col items-center gap-6 bg-cream/95 pb-8 pt-4 backdrop-blur-xl">
          {navLinks.map(({ id, label, href }) => (
            <li key={id}>
              <a
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium tracking-widest uppercase text-ink/70 transition-colors hover:text-ink"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
