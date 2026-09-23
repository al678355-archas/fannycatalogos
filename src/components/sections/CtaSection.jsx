import { SectionShell, SectionButton, Paragraphs } from './SectionShell.jsx';

export default function CtaSection({ section }) {
  return (
    <SectionShell section={section} className="cta">
      <div className="container">
        <div className="cta__panel">
          {section.subtitle && <p className="eyebrow">{section.subtitle}</p>}
          {section.title && <h2 className="section-title">{section.title}</h2>}
          <div className="cta__body">
            <Paragraphs text={section.body} />
          </div>
          <SectionButton section={section} />
        </div>
      </div>
    </SectionShell>
  );
}
