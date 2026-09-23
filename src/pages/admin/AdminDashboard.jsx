import { useAsync } from '../../hooks/useAsync.js';
import { productsService } from '../../services/products.js';
import { PageHeader, Panel, AdminAsync } from '../../components/admin/AdminPage.jsx';
import Button from '../../components/ui/Button.jsx';
import { formatDate } from '../../utils/format.js';
import { useAuth } from '../../context/AuthContext.jsx';

function StatCard({ label, value, hint, tone, small }) {
  return (
    <div className={`stat-card ${tone ? `stat-card--${tone}` : ''} ${small ? 'stat-card--small' : ''}`}>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {hint && <p className="stat-card__hint">{hint}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { admin } = useAuth();
  const { data, loading, error, reload } = useAsync(productsService.stats);

  return (
    <>
      <PageHeader title={`Hola, ${admin?.name?.split(' ')[0] || ''}`} description="Resumen de tu sitio y catálogo." />
      <AdminAsync loading={loading && !data} error={error} onRetry={reload}>
        {() => {
          const s = data.stats;
          const published = s.active > 0;
          return (
            <>
              <div className="stats-grid">
                <StatCard label="Productos activos" value={s.active} hint="Visibles en el catálogo" tone="accent" />
                <StatCard label="Productos totales" value={s.total} hint={`${s.inactive} inactivos`} />
                <StatCard label="Última actualización" value={s.lastUpdatedAt ? formatDate(s.lastUpdatedAt) : '—'} small />
                <StatCard
                  label="Estado del catálogo"
                  value={published ? 'Publicado' : 'Sin productos'}
                  hint={published ? 'Disponible en /catalogo' : 'Agrega o activa productos'}
                  tone={published ? 'success' : 'warning'}
                />
              </div>

              <Panel title="Accesos rápidos">
                <div className="quick-actions">
                  <Button to="/admin/products?new=1">+ Nuevo producto</Button>
                  <Button to="/admin/catalog" variant="outline">
                    Compartir catálogo
                  </Button>
                  <Button to="/admin/content" variant="outline">
                    Editar contenido
                  </Button>
                  <Button to="/admin/appearance" variant="outline">
                    Colores y logo
                  </Button>
                  <Button href="/catalogo" variant="ghost" target="_blank" rel="noopener noreferrer">
                    Ver catálogo público ↗
                  </Button>
                </div>
              </Panel>
            </>
          );
        }}
      </AdminAsync>
    </>
  );
}
