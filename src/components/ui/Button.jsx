import { Link } from 'react-router-dom';
import Spinner from './Spinner.jsx';

/**
 * Botón reutilizable. Con `to` renderiza un <Link>, con `href` un <a>.
 * variant: primary | secondary | ghost | danger | outline ; size: sm | md | lg
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  block = false,
  to,
  href,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, block && 'btn--block', className]
    .filter(Boolean)
    .join(' ');
  const content = (
    <>
      {loading && <Spinner size="sm" />}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading} {...rest}>
      {content}
    </button>
  );
}
