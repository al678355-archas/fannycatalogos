import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SmartLink from '../ui/SmartLink.jsx';

/**
 * Header público. Es un componente "puro" (recibe datos por props) para poder
 * reutilizarlo en la vista previa del panel administrativo.
 */
export default function Header({ header, site }) {
  const [open, setOpen] = useState(false);
  if (!header) return null;

  const close = () => setOpen(false);
  const links = (header.links || []).filter((l) => l.visible !== false);
  const style = { '--c-header-bg': header.bgColor, '--c-header-text': header.textColor };
  const showLogo = header.showLogo && site?.logo?.url;

  return (
    <header className={`site-header ${header.sticky ? 'site-header--sticky' : ''}`} style={style}>
      <div className="container site-header__inner">
        <Link to="/" className="brand" onClick={close} aria-label={`${header.brandText || site?.siteName} — inicio`}>
          {showLogo && <img className="brand__logo" src={site.logo.url} alt="" />}
          {(header.showBrand || !showLogo) && (
            <span className="brand__text">
              <span className="brand__name">{header.brandText || site?.siteName}</span>
              {header.tagline && <span className="brand__tagline">{header.tagline}</span>}
            </span>
          )}
        </Link>

        {header.showAdminLink !== false && (
          <Link
            to="/admin/login"
            className="site-header__admin"
            onClick={close}
            aria-label="Acceso para administradores"
            title="Acceso para administradores"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </Link>
        )}

        <button
          className={`nav-toggle ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="site-nav" className={`site-nav ${open ? 'is-open' : ''}`} aria-label="Principal">
          <ul className="site-nav__list">
            {links.map((link, i) => (
              <li key={`${link.url}-${i}`}>
                {link.url === '/' ? (
                  <NavLink to="/" end className="site-nav__link" onClick={close}>
                    {link.label}
                  </NavLink>
                ) : (
                  <SmartLink to={link.url} className="site-nav__link" onClick={close}>
                    {link.label}
                  </SmartLink>
                )}
              </li>
            ))}
            {/* El apartado Catálogo siempre está presente */}
            <li>
              <NavLink to="/catalogo" className="site-nav__link site-nav__link--catalog" onClick={close}>
                {header.catalogLabel || 'Catálogo'}
              </NavLink>
            </li>
          </ul>
          {header.showCta && header.ctaText && (
            <SmartLink to={header.ctaUrl} className="btn btn--primary btn--sm site-nav__cta" onClick={close}>
              <span>{header.ctaText}</span>
            </SmartLink>
          )}
        </nav>
      </div>
    </header>
  );
}
