import { SectionShell, SectionButton, Paragraphs } from './SectionShell.jsx';

export default function ImageTextSection({ section, reversed }) {
  return (
    <SectionShell section={section} className={`image-text ${reversed ? 'image-text--reversed' : ''}`}>
      <div className="container image-text__grid">
        <div className="image-text__media">
          {section.image ? (
            <img src={section.image.url} alt={section.image.alt || section.title} loading="lazy" decoding="async" />
          ) : (
            <div className="image-text__placeholder" aria-hidden="true" />
          )}
        </div>
        <div className="image-text__content">
          {section.subtitle && <p className="eyebrow">{section.subtitle}</p>}
          {section.title && <h2 className="section-title">{section.title}</h2>}
          <div className="prose">
            <Paragraphs text={section.body} />
          </div>
          <SectionButton section={section} variant="outline" />
        </div>
      </div>
    </SectionShell>
  );
}
