import { SectionShell, SectionButton } from './SectionShell.jsx';

export default function FeaturesSection({ section }) {
  const items = section.items.filter((i) => i.title || i.text);
  return (
    <SectionShell section={section} className="features">
      <div className="container">
        <div className="section-head">
          {section.title && <h2 className="section-title">{section.title}</h2>}
          {section.subtitle && <p className="section-subtitle">{section.subtitle}</p>}
        </div>
        {items.length > 0 && (
          <ul className="features__grid">
            {items.map((item, i) => (
              <li className="feature-card" key={i}>
                <span className="feature-card__num">{String(i + 1).padStart(2, '0')}</span>
                {item.title && <h3 className="feature-card__title">{item.title}</h3>}
                {item.text && <p className="feature-card__text">{item.text}</p>}
              </li>
            ))}
          </ul>
        )}
        {section.buttonText && (
          <div className="section-foot">
            <SectionButton section={section} variant="outline" />
          </div>
        )}
      </div>
    </SectionShell>
  );
}
