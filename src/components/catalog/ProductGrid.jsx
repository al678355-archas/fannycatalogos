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
