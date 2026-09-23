import { useRef, useState } from 'react';
import Button from './Button.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { imagesService } from '../../services/images.js';
import { useToast } from '../../context/ToastContext.jsx';
import { validateImageFile, ALLOWED_IMAGE_TYPES, MAX_IMAGE_MB } from '../../utils/validators.js';

/**
 * Subir / reemplazar / eliminar una imagen con vista previa.
 * value: { id, url } | null   onChange(image | null)
 */
export default function ImageUploader({
  label = 'Imagen',
  value,
  onChange,
  hint,
  aspect = '4 / 3',
  fit = 'cover',
  removeConfirm = '¿Quitar esta imagen?',
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const toast = useToast();

  const pick = () => inputRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const validation = validateImageFile(file);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const { image } = await imagesService.upload(file);
      await onChange(image);
      toast.success('Imagen subida');
    } catch (err) {
      setError(err.message);
      toast.error(`Error al subir la imagen: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    setConfirmRemove(false);
    await onChange(null);
  };

  return (
    <div className="uploader">
      {label && <span className="field__label">{label}</span>}
      <div
        className={`uploader__preview ${value ? '' : 'uploader__preview--empty'}`}
        style={{ aspectRatio: aspect }}
      >
        {value?.url ? (
          <img src={value.url} alt={value.alt || ''} style={{ objectFit: fit }} />
        ) : (
          <button type="button" className="uploader__placeholder" onClick={pick} disabled={uploading}>
            <span aria-hidden="true">＋</span>
            Seleccionar imagen
          </button>
        )}
        {uploading && (
          <div className="uploader__overlay">
            <span className="spinner spinner--md" />
            Subiendo…
          </div>
        )}
      </div>
      <div className="uploader__actions">
        <Button size="sm" variant="outline" onClick={pick} loading={uploading}>
          {value ? 'Reemplazar' : 'Subir imagen'}
        </Button>
        {value && (
          <Button size="sm" variant="ghost" onClick={() => setConfirmRemove(true)} disabled={uploading}>
            Eliminar
          </Button>
        )}
      </div>
      {error ? (
        <p className="field__error">{error}</p>
      ) : (
        <p className="field__hint">{hint || `JPG, PNG o WEBP · máx. ${MAX_IMAGE_MB} MB`}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        onChange={handleFile}
        hidden
      />
      <ConfirmDialog
        open={confirmRemove}
        title="Eliminar imagen"
        message={removeConfirm}
        confirmText="Eliminar"
        danger
        onConfirm={remove}
        onCancel={() => setConfirmRemove(false)}
      />
    </div>
  );
}
