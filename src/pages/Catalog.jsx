import { useState } from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { productsService } from '../services/products.js';
import ProductGrid, { ProductGridSkeleton } from '../components/catalog/ProductGrid.jsx';
import ProductModal from '../components/catalog/ProductModal.jsx';
import ShareBar from '../components/catalog/ShareBar.jsx';
import { EmptyState, ErrorState } from '../components/ui/StateMessage.jsx';

export default function Catalog() {
  const { data: siteData } = useSite();
  const site = siteData.site;
  const { data, loading, error, reload } = useAsync(productsService.listPublic);
  const [selected, setSelected] = useState(null);
  const products = data?.products || [];

  useDocumentMeta({
    title: `${site.catalogTitle} · ${site.siteName}`,
    description: site.catalogSubtitle || site.seoDescription,
    image: site.ogImage?.url || site.logo?.url,
    url: site.catalogUrl,
  });

  return (
    <div className="catalog">
      <section className="catalog-hero">
        <div className="container catalog-hero__inner">
          <div>
            <p className="eyebrow">{site.siteName}</p>
            <h1 className="catalog-hero__title">{site.catalogTitle}</h1>
            {site.catalogSubtitle && <p className="catalog-hero__subtitle">{site.catalogSubtitle}</p>}
          </div>
          <ShareBar catalogUrl={site.catalogUrl} title={site.catalogTitle} />
        </div>
      </section>

      <section className="container catalog__content" aria-live="polite">
        {loading && !data ? (
          <ProductGridSkeleton />
        ) : error ? (
          <ErrorState title="No pudimos cargar los productos" error={error} onRetry={reload} />
        ) : products.length === 0 ? (
          <EmptyState title="Aún no hay productos" message="Vuelve pronto: estamos preparando nuestro catálogo." />
        ) : (
          <>
            <p className="catalog__count">
              {products.length} {products.length === 1 ? 'producto' : 'productos'}
            </p>
            <ProductGrid products={products} currency={site.currency} locale={site.locale} onSelect={setSelected} />
          </>
        )}
      </section>

      <ProductModal
        product={selected}
        currency={site.currency}
        locale={site.locale}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
