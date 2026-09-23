import { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import ImageUploader from '../ui/ImageUploader.jsx';
import { TextInput, TextArea, Toggle, ColorInput } from '../ui/Field.jsx';
import { isSafeUrl, URL_HINT } from '../../utils/validators.js';
import { SECTION_TYPES } from '../../utils/sections.js';

function ItemsEditor({ items, onChange }) {
  const update = (i, patch) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  return (
    <div className="items-editor">
      {items.map((item, i) => (
        <div key={i} className="items-editor__row">
          <input
            className="input"
            placeholder="Título"
            value={item.title}
            maxLength={120}
            onChange={(e) => update(i, { title: e.target.value })}
            aria-label={`Título de la tarjeta ${i + 1}`}
          />
          <textarea
            className="input textarea"
            rows={2}
            placeholder="Texto"
            value={item.text}
            maxLength={500}
            onChange={(e) => update(i, { text: e.target.value })}
            aria-label={`Texto de la tarjeta ${i + 1}`}
          />
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            aria-label="Quitar tarjeta"
          >
            ×
          </button>
        </div>
      ))}
      {items.length < 12 && (
        <Button size="sm" variant="outline" onClick={() => onChange([...items, { title: '', text: '' }])}>
          + Agregar tarjeta
        </Button>
      )}
    </div>
  );
}

/** Editor de una sección del body. Montar con key por sección. */
export default function SectionEditor({ section, onSubmit, onClose }) {
  const [values, setValues] = useState(section);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const config = SECTION_TYPES[values.type] || SECTION_TYPES.text;
  const set = (patch) => setValues((v) => ({ ...v, ...patch }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.buttonUrl && !isSafeUrl(values.buttonUrl)) {
      setErrors({ buttonUrl: URL_HINT });
      return;
    }
    setSaving(true);
    const serverErrors = await onSubmit({
      title: values.title,
      subtitle: values.subtitle,
      body: values.body,
      buttonText: values.buttonText,
      buttonUrl: values.buttonUrl,
      items: values.items,
      imageId: values.image?.id ?? null,
      bgColor: values.bgColor,
      textColor: values.textColor,
      visible: values.visible,
    });
    setSaving(false);
    if (serverErrors) setErrors(serverErrors);
  };

  return (
    <Modal
      open
      onClose={saving ? undefined : onClose}
      title={`Editar sección · ${config.label}`}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="section-form" loading={saving}>
            Guardar sección
          </Button>
        </>
      }
    >
      <form id="section-form" className="form-stack" onSubmit={handleSubmit} noValidate>
        <div className={config.image ? 'form-grid form-grid--product' : ''}>
          <div className="form-grid__main">
            <TextInput
              label="Título"
              value={values.title}
              maxLength={200}
              onChange={(e) => set({ title: e.target.value })}
              error={errors.title}
            />
            <TextInput
              label={values.type === 'hero' ? 'Texto superior (antetítulo)' : 'Subtítulo'}
              value={values.subtitle}
              maxLength={300}
              onChange={(e) => set({ subtitle: e.target.value })}
              error={errors.subtitle}
            />
            {values.type !== 'features' && (
              <TextArea
                label="Párrafos"
                hint="Deja una línea en blanco para separar párrafos."
                value={values.body}
                maxLength={5000}
                rows={5}
                onChange={(e) => set({ body: e.target.value })}
                error={errors.body}
              />
            )}
          </div>
          {config.image && (
            <div className="form-grid__side">
              <ImageUploader
                label="Imagen"
                value={values.image}
                onChange={(image) => set({ image })}
                aspect={values.type === 'hero' ? '4 / 5' : '4 / 3'}
                removeConfirm="¿Quitar la imagen de esta sección? Se aplicará al guardar."
              />
            </div>
          )}
        </div>

        {config.items && (
          <fieldset className="fieldset">
            <legend>Tarjetas</legend>
            <ItemsEditor items={values.items} onChange={(items) => set({ items })} />
          </fieldset>
        )}

        <fieldset className="fieldset">
          <legend>Botón</legend>
          <div className="form-row">
            <TextInput
              label="Texto del botón"
              value={values.buttonText}
              maxLength={60}
              onChange={(e) => set({ buttonText: e.target.value })}
              hint="Déjalo vacío para ocultar el botón"
            />
            <TextInput
              label="Enlace del botón"
              value={values.buttonUrl}
              maxLength={300}
              placeholder="/catalogo"
              onChange={(e) => set({ buttonUrl: e.target.value.trim() })}
              error={errors.buttonUrl}
            />
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>Colores de la sección (opcional)</legend>
          <div className="form-row">
            <ColorInput
              label="Fondo"
              value={values.bgColor}
              allowEmpty
              onChange={(bgColor) => set({ bgColor })}
            />
            <ColorInput
              label="Texto"
              value={values.textColor}
              allowEmpty
              onChange={(textColor) => set({ textColor })}
            />
          </div>
        </fieldset>

        <Toggle
          label={values.visible ? 'Sección visible' : 'Sección oculta'}
          checked={values.visible}
          onChange={(visible) => set({ visible })}
        />
      </form>
    </Modal>
  );
}
