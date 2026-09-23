import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, currency, locale, onSelect }) {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} currency={currency} locale={locale} onSelect={onSelect} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div className="product-card product-card--skeleton" key={i}>
          <div className="product-card__media skeleton" />
          <div className="product-card__body">
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
          </div>
        </div>
      ))}
    </div>
  );
}
