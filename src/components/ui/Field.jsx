import { useId } from 'react';
import { isHexColor } from '../../utils/theme.js';

/** Envoltorio con etiqueta, ayuda y error para cualquier control */
export function Field({ label, hint, error, children, id, counter, className = '' }) {
  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
          {counter && <span className="field__counter">{counter}</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="field__error" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="field__hint">{hint}</p>
      )}
    </div>
  );
}

export function TextInput({ label, hint, error, maxLength, value, className, ...props }) {
  const id = useId();
  const counter = maxLength ? `${String(value ?? '').length}/${maxLength}` : null;
  return (
    <Field label={label} hint={hint} error={error} id={id} counter={counter} className={className}>
      <input
        id={id}
        className="input"
        value={value ?? ''}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        {...props}
      />
    </Field>
  );
}

export function TextArea({ label, hint, error, maxLength, value, rows = 4, className, ...props }) {
  const id = useId();
  const counter = maxLength ? `${String(value ?? '').length}/${maxLength}` : null;
  return (
    <Field label={label} hint={hint} error={error} id={id} counter={counter} className={className}>
      <textarea
        id={id}
        className="input textarea"
        value={value ?? ''}
        maxLength={maxLength}
        rows={rows}
        aria-invalid={Boolean(error)}
        {...props}
      />
    </Field>
  );
}

export function Select({ label, hint, error, options, className, ...props }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} id={id} className={className}>
      <select id={id} className="input select" {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Interruptor on/off */
export function Toggle({ label, hint, checked, onChange, disabled }) {
  const id = useId();
  return (
    <div className="toggle-field">
      <label className="toggle" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={Boolean(checked)}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="toggle__track" aria-hidden="true">
          <span className="toggle__thumb" />
        </span>
        <span className="toggle__label">{label}</span>
      </label>
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}

/** Selector de color con campo hexadecimal sincronizado */
export function ColorInput({ label, hint, value, onChange, allowEmpty = false, emptyLabel = 'Usar tema' }) {
  const id = useId();
  const valid = isHexColor(value);
  const pickerValue = valid && value.length === 7 ? value : '#ffffff';
  return (
    <Field label={label} hint={hint} id={id} error={value && !valid ? 'Color no válido (ej. #F4B6C2)' : null}>
      <div className="color-input">
        <input
          type="color"
          className="color-input__picker"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          aria-label={`${label} (selector)`}
        />
        <input
          id={id}
          className="input color-input__hex"
          value={value || ''}
          placeholder={allowEmpty ? emptyLabel : '#000000'}
          maxLength={9}
          onChange={(e) => onChange(e.target.value.trim())}
        />
        {allowEmpty && value && (
          <button type="button" className="link-btn" onClick={() => onChange('')}>
            Quitar
          </button>
        )}
      </div>
    </Field>
  );
}
