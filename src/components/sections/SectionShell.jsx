import SmartLink from '../ui/SmartLink.jsx';
import { paragraphs } from '../../utils/format.js';

/** Contenedor común: aplica colores personalizados de la sección si existen */
export function SectionShell({ section, className = '', children }) {
  const style = {};
  if (section.bgColor) style['--section-bg'] = section.bgColor;
  if (section.textColor) style['--section-text'] = section.textColor;
  const custom = section.bgColor || section.textColor ? 'section--custom' : '';
  return (
    <section className={`section ${custom} ${className}`} style={style}>
      {children}
    </section>
  );
}

export function SectionButton({ section, variant = 'primary' }) {
  if (!section.buttonText || !section.buttonUrl) return null;
  return (
    <SmartLink to={section.buttonUrl} className={`btn btn--${variant} btn--lg`}>
      <span>{section.buttonText}</span>
    </SmartLink>
  );
}

export function Paragraphs({ text, className = '' }) {
  return paragraphs(text).map((p, i) => (
    <p key={i} className={className}>
      {p}
    </p>
  ));
}
