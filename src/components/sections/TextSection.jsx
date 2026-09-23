import { SectionShell, SectionButton, Paragraphs } from './SectionShell.jsx';

export default function TextSection({ section }) {
  return (
    <SectionShell section={section} className="text-section">
      <div className="container container--narrow text-section__inner">
        {section.subtitle && <p className="eyebrow">{section.subtitle}</p>}
        {section.title && <h2 className="section-title">{section.title}</h2>}
        <div className="prose">
          <Paragraphs text={section.body} />
        </div>
        <SectionButton section={section} variant="outline" />
      </div>
    </SectionShell>
  );
}
