import SmartLink from '../ui/SmartLink.jsx';
import SocialIcon from './SocialIcon.jsx';
import { SOCIAL_NETWORKS } from '../../utils/socials.js';

const networkLabel = (n) => SOCIAL_NETWORKS.find((s) => s.value === n)?.label || n;

/** Footer público (componente puro, reutilizado en la vista previa del panel) */
export default function Footer({ footer, site }) {
  if (!footer) return null;
  const style = { '--c-footer-bg': footer.bgColor, '--c-footer-text': footer.textColor };
  const logo = footer.logo || site?.logo;
  const links = (footer.links || []).filter((l) => l.visible !== false);
  const socials = (footer.socials || []).filter((s) => s.visible !== false && s.url);
  const hasContact = footer.email || footer.phone || footer.address;

  return (
    <footer className="site-footer" id="contacto" style={style}>
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          {footer.showLogo && logo?.url ? (
            <img className="site-footer__logo" src={logo.url} alt={site?.siteName || ''} loading="lazy" />
          ) : (
            <p className="site-footer__name">{site?.siteName}</p>
          )}
          {footer.text && <p className="site-footer__text">{footer.text}</p>}
          {footer.showSocials && socials.length > 0 && (
            <ul className="socials" aria-label="Redes sociales">
              {socials.map((s, i) => (
                <li key={`${s.network}-${i}`}>
                  <SmartLink to={s.url} className="socials__link" aria-label={networkLabel(s.network)}>
                    <SocialIcon network={s.network} />
                  </SmartLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {footer.showLinks && links.length > 0 && (
          <nav className="site-footer__col" aria-label="Enlaces del pie de página">
            <h2 className="site-footer__heading">Enlaces</h2>
            <ul>
              {links.map((l, i) => (
                <li key={`${l.url}-${i}`}>
                  <SmartLink to={l.url}>{l.label}</SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {footer.showContact && hasContact && (
          <div className="site-footer__col">
            <h2 className="site-footer__heading">Contacto</h2>
            <ul>
              {footer.email && (
                <li>
                  <a href={`mailto:${footer.email}`}>{footer.email}</a>
                </li>
              )}
              {footer.phone && (
                <li>
                  <a href={`tel:${footer.phone.replace(/[^\d+]/g, '')}`}>{footer.phone}</a>
                </li>
              )}
              {footer.address && <li>{footer.address}</li>}
            </ul>
          </div>
        )}
      </div>
      {footer.copyright && (
        <div className="container site-footer__bottom">
          <p>{footer.copyright}</p>
        </div>
      )}
    </footer>
  );
}
