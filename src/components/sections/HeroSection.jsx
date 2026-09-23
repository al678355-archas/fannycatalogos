import { SectionShell, SectionButton, Paragraphs } from './SectionShell.jsx';

export default function HeroSection({ section, siteName }) {
  return (
    <SectionShell section={section} className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          {section.subtitle && <p className="eyebrow">{section.subtitle}</p>}
          <h1 className="hero__title">{section.title || siteName}</h1>
          <div className="hero__body">
            <Paragraphs text={section.body} />
          </div>
          <div className="hero__actions">
            <SectionButton section={section} />
          </div>
        </div>
        <div className="hero__media" aria-hidden={!section.image}>
          <div className="hero__arch">
            {section.image ? (
              <img src={section.image.url} alt={section.image.alt || section.title} fetchPriority="high" />
            ) : (
              <span className="hero__monogram">{(section.title || siteName || '✦').charAt(0)}</span>
            )}
          </div>
          <span className="hero__orb hero__orb--a" />
          <span className="hero__orb hero__orb--b" />
        </div>
      </div>
    </SectionShell>
  );
}
