import { useState } from 'react';
import { useAsync } from '../../hooks/useAsync.js';
import { adminsService } from '../../services/admins.js';
import { authService } from '../../services/auth.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { PageHeader, Panel, AdminAsync } from '../../components/admin/AdminPage.jsx';
import { AdminFormModal, ResetPasswordModal } from '../../components/admin/AdminUserModals.jsx';
import DoubleConfirmDelete from '../../components/ui/DoubleConfirmDelete.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import Button from '../../components/ui/Button.jsx';
import { TextInput } from '../../components/ui/Field.jsx';
import { formatDate } from '../../utils/format.js';

const fieldErrors = (err) => Object.fromEntries((err.details || []).map((d) => [d.field, d.message]));

function ChangePassword() {
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const set = (patch) => setValues((v) => ({ ...v, ...patch }));

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!values.currentPassword) found.currentPassword = 'Ingresa tu contraseña actual';
    if (values.newPassword.length < 10) found.newPassword = 'Mínimo 10 caracteres';
    if (values.newPassword !== values.confirm) found.confirm = 'Las contraseñas no coinciden';
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Contraseña actualizada');
      setValues({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel title="Cambiar mi contraseña" description="Se cerrarán tus sesiones abiertas en otros dispositivos.">
      <form className="form-stack" onSubmit={submit} noValidate>
        <TextInput
          label="Contraseña actual"
          type="password"
          autoComplete="current-password"
          value={values.currentPassword}
          onChange={(e) => set({ currentPassword: e.target.value })}
          error={errors.currentPassword}
        />
        <TextInput
          label="Nueva contraseña"
          type="password"
          autoComplete="new-password"
          value={values.newPassword}
          onChange={(e) => set({ newPassword: e.target.value })}
          error={errors.newPassword}
          hint="Mínimo 10 caracteres"
        />
        <TextInput
          label="Confirmar nueva contraseña"
          type="password"
          autoComplete="new-password"
          value={values.confirm}
          onChange={(e) => set({ confirm: e.target.value })}
          error={errors.confirm}
        />
        <div>
          <Button type="submit" loading={saving}>
            Actualizar contraseña
          </Button>
        </div>
      </form>
    </Panel>
  );
}

export default function AdminAdmins() {
  const { admin: me, updateCurrentAdmin } = useAuth();
  const { data, loading, error, reload, setData } = useAsync(adminsService.list);
  // Diálogo abierto: { type: 'create' | 'edit' | 'password' | 'toggle' | 'delete', admin }
  const [dialog, setDialog] = useState(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const close = () => setDialog(null);
  const target = dialog?.admin;
  const activeCount = data?.admins.filter((a) => a.isActive).length ?? 0;

  const replace = (admin) =>
    setData((d) => ({ admins: d.admins.map((a) => (a.id === admin.id ? admin : a)) }));

  const handleSaved = (admin) => {
    if (dialog.type === 'create') setData((d) => ({ admins: [...d.admins, admin] }));
    else replace(admin);
    // Si me edité a mí mismo, actualiza el nombre de la barra superior
    if (admin.id === me?.id) updateCurrentAdmin({ name: admin.name, username: admin.username });
    close();
  };

  const toggle = async () => {
    setBusy(true);
    try {
      const { admin } = await adminsService.update(target.id, { isActive: !target.isActive });
      replace(admin);
      toast.success(admin.isActive ? 'Administrador activado' : 'Administrador desactivado');
      close();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    try {
      await adminsService.remove(target.id);
      setData((d) => ({ admins: d.admins.filter((a) => a.id !== target.id) }));
      toast.success('Administrador eliminado');
      close();
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`);
    }
  };

  return (
    <>
      <PageHeader
        title="Administradores"
        description="Personas con acceso al panel. No existe registro público."
        actions={<Button onClick={() => setDialog({ type: 'create' })}>+ Nuevo administrador</Button>}
      />
      <AdminAsync loading={loading && !data} error={error} onRetry={reload}>
        {() => (
          <div className="form-stack">
            <ul className="item-list panel">
              {data.admins.map((a) => {
                const isMe = a.id === me?.id;
                // Nunca se puede dejar el panel sin administradores activos
                const isLastActive = a.isActive && activeCount <= 1;
                return (
                  <li key={a.id} className={`item-row ${a.isActive ? '' : 'item-row--muted'}`}>
                    <div className="item-row__thumb item-row__thumb--round">
                      <span>{a.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="item-row__info">
                      <p className="item-row__title">
                        {a.name} {isMe && <span className="badge badge--accent">Tú</span>}
                      </p>
                      <p className="item-row__meta">
                        Usuario: <strong>{a.username}</strong> · Último acceso: {formatDate(a.lastLoginAt)}
                      </p>
                    </div>
                    <span className={`badge ${a.isActive ? 'badge--success' : 'badge--muted'}`}>
                      {a.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                    <div className="item-row__actions">
                      <Button size="sm" variant="outline" onClick={() => setDialog({ type: 'edit', admin: a })}>
                        Editar
                      </Button>
                      {!isMe && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => setDialog({ type: 'password', admin: a })}>
                            Contraseña
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDialog({ type: 'toggle', admin: a })}
                            disabled={isLastActive}
                          >
                            {a.isActive ? 'Desactivar' : 'Activar'}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setDialog({ type: 'delete', admin: a })}
                            disabled={isLastActive}
                          >
                            Eliminar
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            <ChangePassword />
          </div>
        )}
      </AdminAsync>

      {(dialog?.type === 'create' || dialog?.type === 'edit') && (
        <AdminFormModal key={target?.id || 'new'} admin={target} onClose={close} onSaved={handleSaved} />
      )}

      {dialog?.type === 'password' && (
        <ResetPasswordModal key={target.id} admin={target} onClose={close} onDone={close} />
      )}

      <ConfirmDialog
        open={dialog?.type === 'toggle'}
        title={target?.isActive ? 'Desactivar administrador' : 'Activar administrador'}
        message={
          target?.isActive
            ? `${target?.name} ya no podrá iniciar sesión y sus sesiones abiertas se cerrarán.`
            : `${target?.name} podrá volver a iniciar sesión.`
        }
        confirmText={target?.isActive ? 'Desactivar' : 'Activar'}
        danger={target?.isActive}
        loading={busy}
        onConfirm={toggle}
        onCancel={close}
      />

      {dialog?.type === 'delete' && (
        <DoubleConfirmDelete
          key={target.id}
          itemLabel="este administrador"
          itemName={`${target.name} (${target.username})`}
          onConfirm={remove}
          onCancel={close}
        />
      )}
    </>
  );
}
