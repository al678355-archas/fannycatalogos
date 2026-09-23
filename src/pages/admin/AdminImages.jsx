import { useRef, useState } from 'react';
import { useAsync } from '../../hooks/useAsync.js';
import { imagesService } from '../../services/images.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useCopy } from '../../hooks/useCopy.js';
import { PageHeader, AdminAsync } from '../../components/admin/AdminPage.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/StateMessage.jsx';
import { formatBytes, formatDate } from '../../utils/format.js';
import { validateImageFile, ALLOWED_IMAGE_TYPES } from '../../utils/validators.js';

export default function AdminImages() {
  const { data, loading, error, reload, setData } = useAsync(imagesService.list);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [viewing, setViewing] = useState(null);
  const inputRef = useRef(null);
  const toast = useToast();
  const { copy } = useCopy();
  const images = data?.images ?? [];

  const upload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setUploading(true);
    let ok = 0;
    for (const file of files) {
      const problem = validateImageFile(file);
      if (problem) {
        toast.error(`${file.name}: ${problem}`);
        continue;
      }
      try {
        await imagesService.upload(file);
        ok++;
      } catch (err) {
        toast.error(`${file.name}: ${err.message}`);
      }
    }
    setUploading(false);
    if (ok) {
      toast.success(ok === 1 ? 'Imagen subida' : `${ok} imágenes subidas`);
      reload();
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await imagesService.remove(deleting.id);
      setData((d) => ({ images: d.images.filter((i) => i.id !== deleting.id) }));
      toast.success('Imagen eliminada');
      setDeleting(null);
      setViewing(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const copyUrl = async (url) => {
    await copy(url);
    toast.info('URL copiada');
  };

  return (
    <>
      <PageHeader
        title="Imágenes"
        description="Biblioteca de imágenes subidas. Las imágenes de productos, secciones y logo se administran desde sus pantallas."
        actions={
          <Button onClick={() => inputRef.current?.click()} loading={uploading}>
            + Subir imágenes
          </Button>
        }
      />
      <input ref={inputRef} type="file" accept={ALLOWED_IMAGE_TYPES.join(',')} multiple hidden onChange={upload} />

      <AdminAsync loading={loading && !data} error={error} onRetry={reload}>
        {() =>
          images.length === 0 ? (
            <EmptyState title="Sin imágenes" message="Las imágenes que subas aparecerán aquí." />
          ) : (
            <ul className="media-grid">
              {images.map((img) => (
                <li key={img.id} className="media-card">
                  <button className="media-card__thumb" onClick={() => setViewing(img)} aria-label="Ver imagen">
                    <img src={img.url} alt={img.alt} loading="lazy" />
                  </button>
                  <div className="media-card__info">
                    <span className={`badge ${img.usage ? 'badge--success' : 'badge--muted'}`}>
                      {img.usage ? `En uso (${img.usage})` : 'Sin usar'}
                    </span>
                    <span className="media-card__meta">
                      {img.width}×{img.height} · {formatBytes(img.size)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )
        }
      </AdminAsync>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Detalle de imagen" size="lg">
        {viewing && (
          <div className="media-detail">
            <img src={viewing.url} alt={viewing.alt} />
            <dl className="media-detail__meta">
              <dt>Dimensiones</dt>
              <dd>
                {viewing.width}×{viewing.height} px
              </dd>
              <dt>Tamaño</dt>
              <dd>{formatBytes(viewing.size)}</dd>
              <dt>Subida</dt>
              <dd>{formatDate(viewing.createdAt)}</dd>
              <dt>Uso</dt>
              <dd>{viewing.usage ? `Usada en ${viewing.usage} lugar(es)` : 'No se usa en el sitio'}</dd>
            </dl>
            <div className="quick-actions">
              <Button variant="outline" size="sm" onClick={() => copyUrl(viewing.url)}>
                Copiar URL
              </Button>
              <Button variant="danger" size="sm" onClick={() => setDeleting(viewing)}>
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar imagen"
        message={
          deleting?.usage
            ? `Esta imagen se usa en ${deleting.usage} lugar(es). Si la eliminas, se quitará de ellos. ¿Continuar?`
            : '¿Eliminar esta imagen permanentemente?'
        }
        confirmText="Eliminar"
        danger
        loading={busy}
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
