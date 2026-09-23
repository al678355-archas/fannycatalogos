import { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import ImageUploader from '../ui/ImageUploader.jsx';
import { TextInput, TextArea, Toggle } from '../ui/Field.jsx';
import { formatPrice, parsePriceInput } from '../../utils/format.js';

const EMPTY = { name: '', description: '', price: '', isActive: true, sortOrder: '', image: null };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'El nombre es obligatorio';
  if (values.price === '' || values.price === null) errors.price = 'El precio es obligatorio';
  else if (parsePriceInput(values.price) === null) {
    errors.price = 'Precio no válido. Ej: 1250 o 1,250.00 (máximo 2 decimales)';
  }
  if (values.sortOrder !== '' && !/^\d{1,6}$/.test(String(values.sortOrder))) {
    errors.sortOrder = 'Debe ser un número entero positivo';
  }
  return errors;
}

/** Crear / editar producto. Montar con key distinta por producto para reiniciar el estado. */
export default function ProductForm({ product, onSubmit, onClose }) {
  const [values, setValues] = useState(() =>
    product ? { ...product, sortOrder: String(product.sortOrder) } : EMPTY,
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (patch) => setValues((v) => ({ ...v, ...patch }));

  const normalizedPrice = parsePriceInput(values.price);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      price: normalizedPrice,
      isActive: values.isActive,
      imageId: values.image?.id ?? null,
      ...(values.sortOrder !== '' ? { sortOrder: Number(values.sortOrder) } : {}),
    };
    const serverErrors = await onSubmit(payload);
    setSaving(false);
    if (serverErrors) setErrors(serverErrors);
  };

  return (
    <Modal
      open
      onClose={saving ? undefined : onClose}
      title={product ? 'Editar producto' : 'Nuevo producto'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="product-form" loading={saving}>
            {product ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </>
      }
    >
      <form id="product-form" className="form-grid form-grid--product" onSubmit={handleSubmit} noValidate>
        <div className="form-grid__main">
          <TextInput
            label="Nombre *"
            value={values.name}
            maxLength={150}
            onChange={(e) => set({ name: e.target.value })}
            error={errors.name}
          />
          <TextArea
            label="Descripción"
            value={values.description}
            maxLength={2000}
            rows={5}
            onChange={(e) => set({ description: e.target.value })}
            error={errors.description}
          />
          <div className="form-row">
            <TextInput
              label="Precio *"
              inputMode="decimal"
              placeholder="1,250.00"
              value={values.price}
              onChange={(e) => set({ price: e.target.value })}
              error={errors.price}
              hint={normalizedPrice ? `Se mostrará como ${formatPrice(normalizedPrice)}` : 'Entero o con decimales'}
            />
            <TextInput
              label="Orden"
              inputMode="numeric"
              placeholder="Automático"
              value={values.sortOrder}
              onChange={(e) => set({ sortOrder: e.target.value.replace(/\D/g, '') })}
              error={errors.sortOrder}
              hint="Menor número = aparece primero"
            />
          </div>
          <Toggle
            label={values.isActive ? 'Activo (visible en el catálogo)' : 'Inactivo (oculto)'}
            checked={values.isActive}
            onChange={(isActive) => set({ isActive })}
          />
        </div>
        <div className="form-grid__side">
          <ImageUploader
            label="Imagen del producto"
            value={values.image}
            onChange={(image) => set({ image })}
            aspect="4 / 5"
            removeConfirm="¿Quitar la imagen de este producto? Se aplicará al guardar."
          />
        </div>
      </form>
    </Modal>
  );
}
