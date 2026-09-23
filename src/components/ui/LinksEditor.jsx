import Button from './Button.jsx';
import { isSafeUrl, URL_HINT } from '../../utils/validators.js';

/**
 * Editor de listas de enlaces [{ label, url, visible }] (o redes sociales con `network`).
 * `labelKey` permite reutilizarlo para redes: labelKey="network".
 */
export default function LinksEditor({
  items = [],
  onChange,
  max = 8,
  labelKey = 'label',
  labelPlaceholder = 'Texto',
  labelOptions,
  addText = 'Agregar enlace',
}) {
  const update = (index, patch) => onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const move = (index, dir) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const add = () => onChange([...items, { [labelKey]: labelOptions?.[0]?.value || '', url: '', visible: true }]);

  return (
    <div className="links-editor">
      {items.length === 0 && <p className="field__hint">Sin elementos.</p>}
      {items.map((item, index) => {
        const badUrl = !isSafeUrl(item.url);
        return (
          <div className="links-editor__row" key={index}>
            {labelOptions ? (
              <select
                className="input select"
                value={item[labelKey]}
                onChange={(e) => update(index, { [labelKey]: e.target.value })}
                aria-label="Red social"
              >
                {labelOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="input"
                value={item[labelKey] || ''}
                placeholder={labelPlaceholder}
                maxLength={60}
                onChange={(e) => update(index, { [labelKey]: e.target.value })}
                aria-label="Texto del enlace"
              />
            )}
            <input
              className={`input ${badUrl ? 'input--invalid' : ''}`}
              value={item.url || ''}
              placeholder="https://… o /ruta"
              maxLength={300}
              title={badUrl ? URL_HINT : undefined}
              onChange={(e) => update(index, { url: e.target.value.trim() })}
              aria-label="URL"
            />
            <div className="links-editor__tools">
              <label className="mini-check" title="Visible">
                <input
                  type="checkbox"
                  checked={item.visible !== false}
                  onChange={(e) => update(index, { visible: e.target.checked })}
                />
                Visible
              </label>
              <button type="button" className="icon-btn" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Subir">
                ↑
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Bajar"
              >
                ↓
              </button>
              <button type="button" className="icon-btn icon-btn--danger" onClick={() => remove(index)} aria-label="Quitar">
                ×
              </button>
            </div>
            {badUrl && <p className="field__error links-editor__error">{URL_HINT}</p>}
          </div>
        );
      })}
      {items.length < max && (
        <Button size="sm" variant="outline" onClick={add}>
          + {addText}
        </Button>
      )}
    </div>
  );
}
