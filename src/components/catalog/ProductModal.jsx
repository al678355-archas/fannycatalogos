import Modal from '../ui/Modal.jsx';
import { formatPrice, paragraphs } from '../../utils/format.js';

/** Vista detallada de un producto */
export default function ProductModal({ product, currency, locale, onClose }) {
  return (
    <Modal open={Boolean(product)} onClose={onClose} size="lg">
      {product && (
        <div className="product-detail">
          <div className="product-detail__media">
            {product.image ? (
              <img src={product.image.url} alt={product.image.alt || product.name} />
            ) : (
              <div className="product-card__noimg">{product.name.charAt(0)}</div>
            )}
          </div>
          <div className="product-detail__info">
            <h2 className="product-detail__name">{product.name}</h2>
            <p className="product-detail__price">{formatPrice(product.price, currency, locale)}</p>
            <div className="product-detail__desc">
              {paragraphs(product.description).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
