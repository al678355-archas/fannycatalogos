import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync.js';
import { productsService } from '../../services/products.js';
import { useToast } from '../../context/ToastContext.jsx';
import { PageHeader, AdminAsync } from '../../components/admin/AdminPage.jsx';
import ProductForm from '../../components/admin/ProductForm.jsx';
import DoubleConfirmDelete from '../../components/ui/DoubleConfirmDelete.jsx';
import Button from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/StateMessage.jsx';
import { formatPrice, formatDate } from '../../utils/format.js';

const fieldErrors = (err) => Object.fromEntries((err.details || []).map((d) => [d.field, d.message]));

export default function AdminProducts() {
  const { data, loading, error, reload, setData } = useAsync(productsService.listAll);
  const [searchParams, setSearchParams] = useSearchParams();
  const [editing, setEditing] = useState(searchParams.get('new') ? 'new' : null);
  const [deleting, setDeleting] = useState(null);
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState(null);
  const toast = useToast();

  const products = useMemo(() => data?.products ?? [], [data]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
  }, [products, query]);

  const closeForm = () => {
    setEditing(null);
    if (searchParams.get('new')) setSearchParams({}, { replace: true });
  };

  const handleSubmit = async (payload) => {
    try {
      if (editing === 'new') {
        await productsService.create(payload);
        toast.success('Producto creado');
      } else {
        await productsService.update(editing.id, payload);
        toast.success('Producto actualizado');
      }
      closeForm();
      reload();
      return null;
    } catch (err) {
      toast.error(`Error al guardar: ${err.message}`);
      return fieldErrors(err);
    }
  };

  const toggleActive = async (product) => {
    setBusyId(product.id);
    try {
      const { product: updated } = await productsService.update(product.id, { isActive: !product.isActive });
      setData((d) => ({ products: d.products.map((p) => (p.id === updated.id ? updated : p)) }));
      toast.success(updated.isActive ? 'Producto activado' : 'Producto desactivado');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= products.length) return;
    const next = [...products];
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((p, i) => ({ ...p, sortOrder: i }));
    setData({ products: reordered });
    try {
      await productsService.reorder(reordered.map((p) => p.id));
    } catch (err) {
      toast.error(`No se pudo guardar el orden: ${err.message}`);
      reload();
    }
  };

  const confirmDelete = async () => {
    try {
      await productsService.remove(deleting.id);
      setData((d) => ({ products: d.products.filter((p) => p.id !== deleting.id) }));
      toast.success('Producto eliminado');
      setDeleting(null);
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`);
    }
  };

  return (
    <>
      <PageHeader
        title="Productos"
        description="Administra los productos del catálogo público y del PDF."
        actions={<Button onClick={() => setEditing('new')}>+ Nuevo producto</Button>}
      />

      <AdminAsync loading={loading && !data} error={error} onRetry={reload}>
        {() =>
          products.length === 0 ? (
            <EmptyState
              title="Aún no hay productos"
              message="Crea tu primer producto para que aparezca en el catálogo."
              action={<Button onClick={() => setEditing('new')}>Crear producto</Button>}
            />
          ) : (
            <div className="panel">
              <div className="toolbar">
                <input
                  className="input toolbar__search"
                  type="search"
                  placeholder="Buscar por nombre…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Buscar productos"
                />
                <span className="toolbar__meta">
                  {products.filter((p) => p.isActive).length} activos · {products.length} en total
                </span>
              </div>

              <ul className="item-list">
                {filtered.map((p) => {
                  const index = products.indexOf(p);
                  return (
                    <li key={p.id} className={`item-row ${p.isActive ? '' : 'item-row--muted'}`}>
                      <div className="item-row__thumb">
                        {p.image ? <img src={p.image.url} alt="" loading="lazy" /> : <span>{p.name.charAt(0)}</span>}
                      </div>
                      <div className="item-row__info">
                        <p className="item-row__title">{p.name}</p>
                        <p className="item-row__meta">
                          <strong>{formatPrice(p.price)}</strong> · Orden {p.sortOrder} · Actualizado {formatDate(p.updatedAt)}
                        </p>
                      </div>
                      <span className={`badge ${p.isActive ? 'badge--success' : 'badge--muted'}`}>
                        {p.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                      <div className="item-row__actions">
                        {!query && (
                          <>
                            <button className="icon-btn" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Subir">
                              ↑
                            </button>
                            <button
                              className="icon-btn"
                              onClick={() => move(index, 1)}
                              disabled={index === products.length - 1}
                              aria-label="Bajar"
                            >
                              ↓
                            </button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => toggleActive(p)} loading={busyId === p.id}>
                          {p.isActive ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleting(p)}>
                          Eliminar
                        </Button>
                      </div>
                    </li>
                  );
                })}
                {filtered.length === 0 && <li className="item-list__empty">Sin resultados para “{query}”.</li>}
              </ul>
            </div>
          )
        }
      </AdminAsync>

      {editing && (
        <ProductForm
          key={editing === 'new' ? 'new' : editing.id}
          product={editing === 'new' ? null : editing}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      {deleting && (
        <DoubleConfirmDelete
          key={deleting.id}
          itemLabel="este producto"
          itemName={deleting.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}
