import HeroSection from './HeroSection.jsx';
import TextSection from './TextSection.jsx';
import ImageTextSection from './ImageTextSection.jsx';
import FeaturesSection from './FeaturesSection.jsx';
import CtaSection from './CtaSection.jsx';

// Registro de tipos de sección. Para agregar uno nuevo: crear el componente y registrarlo aquí
// (y en SECTION_TYPES del backend).
const SECTIONS = {
  hero: HeroSection,
  text: TextSection,
  imageText: ImageTextSection,
  features: FeaturesSection,
  cta: CtaSection,
};

export default function SectionRenderer({ sections = [], siteName }) {
  let imageTextCount = 0;
  return sections.map((section) => {
    const Component = SECTIONS[section.type];
    if (!Component) return null;
    const reversed = section.type === 'imageText' && imageTextCount++ % 2 === 1;
    return <Component key={section.id} section={section} siteName={siteName} reversed={reversed} />;
  });
}
