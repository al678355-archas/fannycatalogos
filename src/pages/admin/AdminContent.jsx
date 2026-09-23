import { useState } from 'react';
import { useAsync } from '../../hooks/useAsync.js';
import { contentService } from '../../services/content.js';
import { useToast } from '../../context/ToastContext.jsx';
import { PageHeader, AdminAsync } from '../../components/admin/AdminPage.jsx';
import SectionEditor from '../../components/admin/SectionEditor.jsx';
import { SECTION_TYPES } from '../../utils/sections.js';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import Button from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/StateMessage.jsx';

const fieldErrors = (err) => Object.fromEntries((err.details || []).map((d) => [d.field, d.message]));

export default function AdminContent() {
  const { data, loading, error, reload, setData } = useAsync(contentService.listAll);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [newType, setNewType] = useState('text');
  const [creating, setCreating] = useState(false);
  const toast = useToast();
  const sections = data?.sections ?? [];

  const replace = (section) =>
    setData((d) => ({ sections: d.sections.map((s) => (s.id === section.id ? section : s)) }));

  const create = async () => {
    setCreating(true);
    try {
      const { section } = await contentService.create({
        type: newType,
        title: 'Nueva sección',
        visible: false,
      });
      setData((d) => ({ sections: [...d.sections, section] }));
      setEditing(section);
      toast.success('Sección creada (oculta hasta que la actives)');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const save = async (payload) => {
    try {
      const { section } = await contentService.update(editing.id, payload);
      replace(section);
      setEditing(null);
      toast.success('Guardado correctamente');
      return null;
    } catch (err) {
      toast.error(`Error al guardar: ${err.message}`);
      return fieldErrors(err);
    }
  };

  const toggleVisible = async (section) => {
    try {
      const { section: updated } = await contentService.update(section.id, { visible: !section.visible });
      replace(updated);
      toast.success(updated.visible ? 'Sección visible' : 'Sección oculta');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setData({ sections: next });
    try {
      await contentService.reorder(next.map((s) => s.id));
    } catch (err) {
      toast.error(`No se pudo guardar el orden: ${err.message}`);
      reload();
    }
  };

  const remove = async () => {
    setDeletingBusy(true);
    try {
      await contentService.remove(deleting.id);
      setData((d) => ({ sections: d.sections.filter((s) => s.id !== deleting.id) }));
      toast.success('Sección eliminada');
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Contenido de la página principal"
        description="Edita, ordena y muestra u oculta las secciones del inicio."
        actions={
          <div className="inline-form">
            <select
              className="input select"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              aria-label="Tipo de sección"
            >
              {Object.entries(SECTION_TYPES).map(([value, t]) => (
                <option key={value} value={value}>
                  {t.label}
                </option>
              ))}
            </select>
            <Button onClick={create} loading={creating}>
              + Agregar sección
            </Button>
          </div>
        }
      />

      <AdminAsync loading={loading && !data} error={error} onRetry={reload}>
        {() =>
          sections.length === 0 ? (
            <EmptyState title="Sin secciones" message="Agrega una sección para construir tu página de inicio." />
          ) : (
            <ul className="item-list panel">
              {sections.map((s, index) => (
                <li key={s.id} className={`item-row ${s.visible ? '' : 'item-row--muted'}`}>
                  <div className="item-row__thumb item-row__thumb--index">
                    {s.image ? <img src={s.image.url} alt="" loading="lazy" /> : <span>{index + 1}</span>}
                  </div>
                  <div className="item-row__info">
                    <p className="item-row__title">{s.title || <em>Sin título</em>}</p>
                    <p className="item-row__meta">{SECTION_TYPES[s.type]?.label || s.type}</p>
                  </div>
                  <span className={`badge ${s.visible ? 'badge--success' : 'badge--muted'}`}>
                    {s.visible ? 'Visible' : 'Oculta'}
                  </span>
                  <div className="item-row__actions">
                    <button className="icon-btn" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Subir">
                      ↑
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => move(index, 1)}
                      disabled={index === sections.length - 1}
                      aria-label="Bajar"
                    >
                      ↓
                    </button>
                    <Button size="sm" variant="ghost" onClick={() => toggleVisible(s)}>
                      {s.visible ? 'Ocultar' : 'Mostrar'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(s)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setDeleting(s)}>
                      Eliminar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )
        }
      </AdminAsync>

      {editing && <SectionEditor key={editing.id} section={editing} onSubmit={save} onClose={() => setEditing(null)} />}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar sección"
        message={`¿Eliminar la sección “${deleting?.title || 'sin título'}”? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        danger
        loading={deletingBusy}
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
