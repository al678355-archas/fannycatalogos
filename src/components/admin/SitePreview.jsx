import { useAsync } from '../../hooks/useAsync.js';
import { siteService } from '../../services/site.js';
import { themeToStyle } from '../../utils/theme.js';

/** Vista previa (no interactiva) de componentes públicos con el tema actual */
export default function SitePreview({ children, theme }) {
  const { data } = useAsync(siteService.getPublic);
  const site = data?.site;
  return (
    <div className="preview" aria-label="Vista previa" style={themeToStyle(theme || site?.theme)}>
      <span className="preview__label">Vista previa</span>
      <div className="preview__frame site" inert>
        {site ? children(site) : <div className="preview__loading">Cargando vista previa…</div>}
      </div>
    </div>
  );
}
