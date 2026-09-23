import { useSite } from '../context/SiteContext.jsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import SmartLink from '../components/ui/SmartLink.jsx';
import SocialIcon from '../components/layout/SocialIcon.jsx';
import { EmptyState } from '../components/ui/StateMessage.jsx';
import Button from '../components/ui/Button.jsx';
import { SOCIAL_NETWORKS } from '../utils/socials.js';
import { paragraphs } from '../utils/format.js';

const networkLabel = (n) => SOCIAL_NETWORKS.find((s) => s.value === n)?.label || n;

function ContactCard({ icon, label, value, href, action, external }) {
  const content = (
    <>
      <span className="contact-card__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="contact-card__text">
        <span className="contact-card__label">{label}</span>
        <span className="contact-card__value">{value}</span>
      </span>
      {action && <span className="contact-card__action">{action} →</span>}
    </>
  );
  if (!href) return <div className="contact-card">{content}</div>;
  return (
    <a
      className="contact-card contact-card--link"
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  );
}

export default function Contact() {
  const { data } = useSite();
  const { site, footer } = data;
  const contact = site.contact;

  useDocumentMeta({
    title: `${contact.title} · ${site.siteName}`,
    description: contact.subtitle || site.seoDescription,
    image: site.ogImage?.url || site.logo?.url,
  });

  const whatsappUrl = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp}${contact.whatsappMessage ? `?text=${encodeURIComponent(contact.whatsappMessage)}` : ''}`
    : null;
  const socials = (footer.socials || []).filter((s) => s.visible !== false && s.url);
  const hasChannels = whatsappUrl || footer.email || footer.phone || footer.address;

  return (
    <div className="contact">
      <section className="contact-hero">
        <div className="container contact-hero__inner">
          <p className="eyebrow">{site.siteName}</p>
          <h1 className="contact-hero__title">{contact.title}</h1>
          {contact.subtitle && <p className="contact-hero__subtitle">{contact.subtitle}</p>}
          {whatsappUrl && (
            <Button href={whatsappUrl} size="lg" target="_blank" rel="noopener noreferrer">
              Escríbenos por WhatsApp
            </Button>
          )}
        </div>
      </section>

      <section className="container contact__content">
        {!hasChannels && !contact.text ? (
          <EmptyState
            title="Muy pronto"
            message="Estamos actualizando nuestros datos de contacto."
            action={<Button to="/catalogo">Ver catálogo</Button>}
          />
        ) : (
          <div className="contact__grid">
            <div className="contact__info">
              {contact.text && (
                <div className="prose">
                  {paragraphs(contact.text).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}

              {contact.hours && (
                <div className="contact-hours">
                  <h2 className="contact__heading">Horario de atención</h2>
                  <p className="contact-hours__text">{contact.hours}</p>
                </div>
              )}

              {socials.length > 0 && (
                <div>
                  <h2 className="contact__heading">Síguenos</h2>
                  <ul className="socials socials--contact" aria-label="Redes sociales">
                    {socials.map((s, i) => (
                      <li key={`${s.network}-${i}`}>
                        <SmartLink to={s.url} className="socials__link" aria-label={networkLabel(s.network)}>
                          <SocialIcon network={s.network} />
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="contact__cards">
              {whatsappUrl && (
                <ContactCard
                  icon={<SocialIcon network="whatsapp" />}
                  label="WhatsApp"
                  value={`+${contact.whatsapp}`}
                  href={whatsappUrl}
                  action="Enviar mensaje"
                  external
                />
              )}
              {footer.phone && (
                <ContactCard
                  icon="☏"
                  label="Teléfono"
                  value={footer.phone}
                  href={`tel:${footer.phone.replace(/[^\d+]/g, '')}`}
                  action="Llamar"
                />
              )}
              {footer.email && (
                <ContactCard
                  icon="✉"
                  label="Correo electrónico"
                  value={footer.email}
                  href={`mailto:${footer.email}`}
                  action="Escribir"
                />
              )}
              {footer.address && (
                <ContactCard
                  icon="⌂"
                  label="Dirección"
                  value={footer.address}
                  href={contact.mapUrl || null}
                  action={contact.mapUrl ? 'Ver mapa' : null}
                  external
                />
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
