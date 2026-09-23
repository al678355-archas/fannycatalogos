import { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { TextInput } from '../ui/Field.jsx';
import { adminsService } from '../../services/admins.js';
import { useToast } from '../../context/ToastContext.jsx';

const MIN_PASSWORD = 10;
const USERNAME = /^[a-z0-9._@+-]{3,160}$/i;
const USERNAME_ERROR = 'Usuario no válido: 3 o más caracteres (letras, números, . _ - @)';

const fieldErrors = (err) => Object.fromEntries((err.details || []).map((d) => [d.field, d.message]));

function validatePasswords(password, confirm, key = 'password') {
  const errors = {};
  if (password.length < MIN_PASSWORD) errors[key] = `Mínimo ${MIN_PASSWORD} caracteres`;
  if (password !== confirm) errors.confirm = 'Las contraseñas no coinciden';
  return errors;
}

/**
 * Crear (admin = null) o editar (admin = {...}) un administrador.
 * Al crear se pide contraseña; al editar sólo nombre y usuario.
 */
export function AdminFormModal({ admin, onClose, onSaved }) {
  const editing = Boolean(admin);
  const [values, setValues] = useState({
    name: admin?.name ?? '',
    username: admin?.username ?? '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const set = (patch) => setValues((v) => ({ ...v, ...patch }));

  const submit = async (e) => {
    e.preventDefault();
    let found = {};
    if (!values.name.trim()) found.name = 'El nombre es obligatorio';
    if (!USERNAME.test(values.username.trim())) found.username = USERNAME_ERROR;
    if (!editing) found = { ...found, ...validatePasswords(values.password, values.confirm) };
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    const payload = { name: values.name.trim(), username: values.username.trim() };
    try {
      const { admin: saved } = editing
        ? await adminsService.update(admin.id, payload)
        : await adminsService.create({ ...payload, password: values.password });
      toast.success(editing ? 'Administrador actualizado' : 'Administrador creado');
      onSaved(saved);
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={saving ? undefined : onClose}
      title={editing ? 'Editar administrador' : 'Nuevo administrador'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="admin-form" loading={saving}>
            {editing ? 'Guardar cambios' : 'Crear administrador'}
          </Button>
        </>
      }
    >
      <form id="admin-form" className="form-stack" onSubmit={submit} noValidate>
        <TextInput
          label="Nombre"
          value={values.name}
          maxLength={120}
          onChange={(e) => set({ name: e.target.value })}
          error={errors.name}
        />
        <TextInput
          label="Usuario"
          hint="Nombre de usuario o email. Se usa para iniciar sesión."
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          value={values.username}
          onChange={(e) => set({ username: e.target.value })}
          error={errors.username}
        />
        {!editing && (
          <>
            <TextInput
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={(e) => set({ password: e.target.value })}
              error={errors.password}
              hint={`Mínimo ${MIN_PASSWORD} caracteres`}
            />
            <TextInput
              label="Confirmar contraseña"
              type="password"
              autoComplete="new-password"
              value={values.confirm}
              onChange={(e) => set({ confirm: e.target.value })}
              error={errors.confirm}
            />
          </>
        )}
      </form>
    </Modal>
  );
}

/** Restablecer la contraseña de otro administrador */
export function ResetPasswordModal({ admin, onClose, onDone }) {
  const [values, setValues] = useState({ newPassword: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    const found = validatePasswords(values.newPassword, values.confirm, 'newPassword');
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      await adminsService.resetPassword(admin.id, values.newPassword);
      toast.success(`Contraseña de ${admin.name} actualizada`);
      onDone();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={saving ? undefined : onClose}
      title="Cambiar contraseña"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="reset-password-form" loading={saving}>
            Guardar contraseña
          </Button>
        </>
      }
    >
      <form id="reset-password-form" className="form-stack" onSubmit={submit} noValidate>
        <p className="confirm__msg">
          Nueva contraseña para <strong>{admin.name}</strong> ({admin.username}). Se cerrarán sus sesiones abiertas.
        </p>
        <TextInput
          label="Nueva contraseña"
          type="password"
          autoComplete="new-password"
          value={values.newPassword}
          onChange={(e) => setValues((v) => ({ ...v, newPassword: e.target.value }))}
          error={errors.newPassword}
          hint={`Mínimo ${MIN_PASSWORD} caracteres`}
        />
        <TextInput
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          value={values.confirm}
          onChange={(e) => setValues((v) => ({ ...v, confirm: e.target.value }))}
          error={errors.confirm}
        />
      </form>
    </Modal>
  );
}
