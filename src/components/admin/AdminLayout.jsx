import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ErrorBoundary from '../ui/ErrorBoundary.jsx';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '◧', end: true },
  { group: 'Contenido' },
  { to: '/admin/content', label: 'Contenido', icon: '☰' },
  { to: '/admin/header', label: 'Header', icon: '▔' },
  { to: '/admin/footer', label: 'Footer', icon: '▁' },
  { to: '/admin/appearance', label: 'Apariencia y logo', icon: '◐' },
  { to: '/admin/images', label: 'Imágenes', icon: '▣' },
  { group: 'Catálogo' },
  { to: '/admin/products', label: 'Productos', icon: '◇' },
  { to: '/admin/catalog', label: 'Compartir · QR · PDF', icon: '⇪' },
  { group: 'Sistema' },
  { to: '/admin/admins', label: 'Administradores', icon: '☺' },
  { to: '/admin/settings', label: 'Configuración', icon: '⚙' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  useEffect(() => {
    document.title = 'Panel administrativo';
  }, []);

  return (
    <div className="admin">
      <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__dot" aria-hidden="true" />
          Panel administrativo
        </div>
        <nav aria-label="Panel">
          <ul className="admin-nav">
            {NAV.map((item) =>
              item.group ? (
                <li key={item.group} className="admin-nav__group">
                  {item.group}
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className="admin-nav__link" onClick={close}>
                    <span className="admin-nav__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav__link">
            <span className="admin-nav__icon" aria-hidden="true">
              ↗
            </span>
            Ver sitio público
          </a>
        </div>
      </aside>
      {menuOpen && <div className="admin-backdrop" onClick={close} aria-hidden="true" />}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-topbar__menu"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
          <div className="admin-topbar__user">
            <span className="admin-topbar__avatar" aria-hidden="true">
              {admin?.name?.charAt(0)?.toUpperCase()}
            </span>
            <span className="admin-topbar__name">{admin?.name}</span>
            <button className="btn btn--ghost btn--sm" onClick={logout}>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </header>
        <main className="admin-content">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
