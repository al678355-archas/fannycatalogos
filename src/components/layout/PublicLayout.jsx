import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useSite } from '../../context/SiteContext.jsx';
import { PageLoader } from '../ui/Spinner.jsx';
import { ErrorState } from '../ui/StateMessage.jsx';
import { useFavicon } from '../../hooks/useDocumentMeta.js';

export default function PublicLayout() {
  const { data, loading, error, reload } = useSite();
  const site = data?.site;

  useFavicon(site?.favicon?.url || site?.logo?.url);

  if (loading && !data) return <PageLoader />;
  if (error && !data) {
    return (
      <div className="site site--center">
        <ErrorState title="No pudimos cargar el sitio" error={error} onRetry={reload} />
      </div>
    );
  }

  return (
    <div className="site">
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <Header header={data.header} site={site} />
      <main id="main" className="site-main">
        <Outlet />
      </main>
      <Footer footer={data.footer} site={site} />
    </div>
  );
}
