import { useState } from 'react';
import Button from '../ui/Button.jsx';
import Modal from '../ui/Modal.jsx';
import { catalogService } from '../../services/catalog.js';
import { useCopy } from '../../hooks/useCopy.js';

/** Compartir el catálogo: enlace, código QR y PDF descargable */
export default function ShareBar({ catalogUrl, title }) {
  const [showQr, setShowQr] = useState(false);
  const { copied, copy } = useCopy();
  const url = catalogUrl || `${window.location.origin}/catalogo`;

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // cancelado por el usuario: se copia como alternativa
      }
    }
    copy(url);
  };

  return (
    <div className="share-bar">
      <Button variant="outline" size="sm" onClick={share}>
        {copied ? '¡Enlace copiado!' : 'Compartir enlace'}
      </Button>
      <Button variant="outline" size="sm" onClick={() => setShowQr(true)}>
        Código QR
      </Button>
      <Button variant="primary" size="sm" href={catalogService.pdfUrl()} download>
        Descargar catálogo PDF
      </Button>

      <Modal open={showQr} onClose={() => setShowQr(false)} title="Escanea para ver el catálogo" size="sm">
        <div className="qr-box">
          <img src={catalogService.qrUrl({ size: 480 })} alt="Código QR del catálogo" width="240" height="240" />
          <p className="qr-box__url">{url}</p>
          <Button variant="outline" size="sm" href={catalogService.qrUrl({ size: 1024, download: true })}>
            Descargar QR
          </Button>
        </div>
      </Modal>
    </div>
  );
}
