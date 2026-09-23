import { formatPrice } from '../../utils/format.js';

export default function ProductCard({ product, currency, locale, onSelect }) {
  return (
    <article className="product-card">
      <button className="product-card__button" onClick={() => onSelect?.(product)} aria-label={`Ver ${product.name}`}>
        <div className="product-card__media">
          {product.image ? (
            <img
              src={product.image.url}
              alt={product.image.alt || product.name}
              loading="lazy"
              decoding="async"
              width={product.image.width || undefined}
              height={product.image.height || undefined}
            />
          ) : (
            <div className="product-card__noimg" aria-hidden="true">
              {product.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="product-card__body">
          <h3 className="product-card__name">{product.name}</h3>
          {product.description && <p className="product-card__desc">{product.description}</p>}
          <p className="product-card__price">{formatPrice(product.price, currency, locale)}</p>
        </div>
      </button>
    </article>
  );
}
