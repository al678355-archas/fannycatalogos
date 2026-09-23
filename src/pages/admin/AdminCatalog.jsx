import { useState } from 'react';
import { useAsync } from '../../hooks/useAsync.js';
import { useCopy } from '../../hooks/useCopy.js';
import { catalogService } from '../../services/catalog.js';
import { productsService } from '../../services/products.js';
import { PageHeader, Panel, AdminAsync } from '../../components/admin/AdminPage.jsx';
import Button from '../../components/ui/Button.jsx';

const loadShare = async () => {
  const [share, stats] = await Promise.all([catalogService.share(), productsService.stats()]);
  return { url: share.url, stats: stats.stats };
};

export default function AdminCatalog() {
  const { data, loading, error, reload } = useAsync(loadShare);
  const { copied, copy } = useCopy();
  // Cambia al regenerar para evitar caché del navegador en el QR
  const [version, setVersion] = useState(() => Date.now());

  return (
    <>
      <PageHeader
        title="Compartir catálogo"
        description="Enlace público, código QR y PDF del catálogo. Todo se genera con los productos activos actuales."
      />
      <AdminAsync loading={loading && !data} error={error} onRetry={reload}>
        {() => (
          <div className="panels-grid">
            <Panel title="Enlace del catálogo" description="Página pública, no requiere iniciar sesión.">
              <div className="copy-field">
                <input className="input" value={data.url} readOnly aria-label="URL del catálogo" onFocus={(e) => e.target.select()} />
                <Button onClick={() => copy(data.url)}>{copied ? '¡Copiado!' : 'Copiar URL'}</Button>
              </div>
              <div className="quick-actions">
                <Button variant="outline" size="sm" href={data.url} target="_blank" rel="noopener noreferrer">
                  Abrir catálogo ↗
                </Button>
              </div>
              <p className="field__hint">
                Puedes cambiar esta URL en Configuración (por ejemplo, si usas un dominio propio).
              </p>
            </Panel>

            <Panel title="Código QR" description="Apunta directamente al catálogo público.">
              <div className="qr-box">
                <img
                  src={catalogService.qrUrl({ size: 480, v: version })}
                  alt="Código QR del catálogo"
                  width="220"
                  height="220"
                />
                <div className="quick-actions">
                  <Button size="sm" href={catalogService.qrUrl({ size: 1024, download: true, v: version })}>
                    Descargar QR (PNG)
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setVersion(Date.now())}>
                    Regenerar
                  </Button>
                </div>
              </div>
            </Panel>

            <Panel
              title="Catálogo PDF"
              description="Formato carta (8.5 × 11 in) listo para imprimir. Se genera al momento con los productos activos."
              className="panel--wide"
            >
              <p className="pdf-summary">
                <strong>{data.stats.active}</strong> {data.stats.active === 1 ? 'producto activo' : 'productos activos'} se
                incluirán en el PDF.
              </p>
              <div className="quick-actions">
                <Button href={catalogService.pdfUrl()} download>
                  Descargar catálogo PDF
                </Button>
                <Button variant="outline" href={`${catalogService.pdfUrl()}?inline=1`} target="_blank" rel="noopener noreferrer">
                  Vista previa ↗
                </Button>
              </div>
            </Panel>
          </div>
        )}
      </AdminAsync>
    </>
  );
}
