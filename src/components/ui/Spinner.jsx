export default function Spinner({ size = 'md', label }) {
  return (
    <span className={`spinner spinner--${size}`} role={label ? 'status' : undefined}>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}

export function PageLoader({ label = 'Cargando…' }) {
  return (
    <div className="page-loader">
      <Spinner size="lg" />
      <p>{label}</p>
    </div>
  );
}
