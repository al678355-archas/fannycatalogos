import { useSite } from '../context/SiteContext.jsx';
import SectionRenderer from '../components/sections/SectionRenderer.jsx';
import { EmptyState } from '../components/ui/StateMessage.jsx';
import Button from '../components/ui/Button.jsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';

export default function Home() {
  const { data } = useSite();
  const { site, sections } = data;

  useDocumentMeta({
    title: site.seoTitle,
    description: site.seoDescription,
    image: site.ogImage?.url || site.logo?.url,
  });

  if (!sections.length) {
    return (
      <div className="container page-pad">
        <EmptyState
          title={site.siteName}
          message="Estamos preparando nuestro contenido. Mientras tanto, visita el catálogo."
          action={<Button to="/catalogo">Ver catálogo</Button>}
        />
      </div>
    );
  }

  return <SectionRenderer sections={sections} siteName={site.siteName} />;
}
