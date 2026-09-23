import { Link } from 'react-router-dom';
import { isSafeUrl } from '../../utils/validators.js';

/** Enlace interno (SPA) o externo según la URL configurada en el CMS */
export default function SmartLink({ to, children, ...props }) {
  if (!to || !isSafeUrl(to)) return <span {...props}>{children}</span>;
  if (to.startsWith('/')) {
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//i.test(to);
  return (
    <a href={to} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>
      {children}
    </a>
  );
}
