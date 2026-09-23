// Mapeo entre las claves de color guardadas en la base y las variables CSS del sitio público
export const THEME_VARS = {
  primary: '--c-primary',
  secondary: '--c-secondary',
  background: '--c-bg',
  surface: '--c-surface',
  text: '--c-text',
  textMuted: '--c-muted',
  border: '--c-border',
  button: '--c-button',
  buttonText: '--c-button-text',
  price: '--c-price',
};

// Etiquetas para el panel de Apariencia
export const THEME_FIELDS = [
  { key: 'primary', label: 'Color primario', hint: 'Acentos, fondos suaves y detalles decorativos' },
  { key: 'secondary', label: 'Color secundario', hint: 'Títulos destacados y elementos de contraste' },
  { key: 'background', label: 'Fondo de la página' },
  { key: 'surface', label: 'Tarjetas', hint: 'Fondo de tarjetas de productos y paneles' },
  { key: 'text', label: 'Texto principal' },
  { key: 'textMuted', label: 'Texto secundario', hint: 'Descripciones y textos de apoyo' },
  { key: 'border', label: 'Bordes' },
  { key: 'button', label: 'Botones' },
  { key: 'buttonText', label: 'Texto de botones' },
  { key: 'price', label: 'Precios' },
];

export const DEFAULT_THEME = {
  primary: '#F4B6C2',
  secondary: '#7D3C52',
  background: '#FFF8F9',
  surface: '#FFFFFF',
  text: '#34242A',
  textMuted: '#7B6168',
  border: '#F2D9DE',
  button: '#7D3C52',
  buttonText: '#FFFFFF',
  price: '#7D3C52',
};

/** Convierte un tema en un objeto de estilos con variables CSS */
export function themeToStyle(theme = {}) {
  const style = {};
  for (const [key, cssVar] of Object.entries(THEME_VARS)) {
    if (theme[key]) style[cssVar] = theme[key];
  }
  return style;
}

/** Aplica el tema al documento completo */
export function applyTheme(theme) {
  const root = document.documentElement;
  Object.entries(themeToStyle(theme)).forEach(([cssVar, value]) => root.style.setProperty(cssVar, value));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && theme?.primary) meta.setAttribute('content', theme.primary);
}

export const isHexColor = (v) => /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v || '');
