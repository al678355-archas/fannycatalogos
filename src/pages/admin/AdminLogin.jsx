import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { TextInput } from '../../components/ui/Field.jsx';
import Button from '../../components/ui/Button.jsx';
import { PageLoader } from '../../components/ui/Spinner.jsx';

export default function AdminLogin() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const from = location.state?.from?.startsWith('/admin') ? location.state.from : '/admin';

  useEffect(() => {
    document.title = 'Iniciar sesión · Panel';
  }, []);

  if (status === 'loading') return <PageLoader />;
  if (status === 'authenticated') return <Navigate to={from} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Ingresa tu usuario y contraseña');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await login(form.username.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      setForm((f) => ({ ...f, password: '' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login">
      <form className="login__card" onSubmit={handleSubmit} noValidate>
        <div className="login__badge" aria-hidden="true">
          ✦
        </div>
        <h1 className="login__title">Panel administrativo</h1>
        <p className="login__subtitle">Acceso exclusivo para administradores</p>

        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        <TextInput
          label="Usuario"
          type="text"
          autoCapitalize="none"
          spellCheck={false}
          autoComplete="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <TextInput
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <Button type="submit" block size="lg" loading={submitting}>
          Iniciar sesión
        </Button>
        <a className="login__back" href="/">
          ← Volver al sitio
        </a>
      </form>
    </div>
  );
}
