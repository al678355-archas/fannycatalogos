import { siteService } from '../../services/site.js';
import { useEditableForm } from '../../hooks/useEditableForm.js';
import { useToast } from '../../context/ToastContext.jsx';
import { PageHeader, Panel, AdminAsync, SaveBar } from '../../components/admin/AdminPage.jsx';
import SitePreview from '../../components/admin/SitePreview.jsx';
import ProductCard from '../../components/catalog/ProductCard.jsx';
import ImageUploader from '../../components/ui/ImageUploader.jsx';
import Button from '../../components/ui/Button.jsx';
import { ColorInput } from '../../components/ui/Field.jsx';
import { THEME_FIELDS, DEFAULT_THEME, isHexColor } from '../../utils/theme.js';

const pick = ({ site }) => site.theme;
const SAMPLE_PRODUCT = {
  id: 'preview',
  name: 'Producto de ejemplo',
  description: 'Así se verán las tarjetas del catálogo con tus colores.',
  price: '1250.00',
  image: null,
};

function ThemePreview({ theme }) {
  return (
    <SitePreview theme={theme}>
      {() => (
        <div className="theme-preview">
          <div className="theme-preview__text">
            <p className="eyebrow">Vista previa</p>
            <h3 className="section-title">Títulos y textos</h3>
            <p className="section-subtitle">Texto secundario para descripciones y apoyo.</p>
            <div className="theme-preview__buttons">
              <span className="btn btn--primary btn--md">
                <span>Botón principal</span>
              </span>
              <span className="btn btn--outline btn--md">
                <span>Secundario</span>
              </span>
            </div>
          </div>
          <div className="theme-preview__card">
            <ProductCard product={SAMPLE_PRODUCT} />
          </div>
        </div>
      )}
    </SitePreview>
  );
}

export default function AdminAppearance() {
  const toast = useToast();
  const form = useEditableForm({
    load: siteService.getSettings,
    pick,
    save: (theme) => siteService.updateAppearance({ theme }),
    successMessage: 'Colores guardados',
  });
  const theme = form.values;
  const invalid = theme && THEME_FIELDS.some((f) => !isHexColor(theme[f.key]));

  // Logo y favicon se guardan al instante al subir / quitar
  const saveImage = (field, label) => async (image) => {
    try {
      const response = await siteService.updateAppearance({ [field]: image?.id ?? null });
      form.setData(response);
      toast.success(image ? `${label} actualizado` : `${label} eliminado`);
    } catch (err) {
      toast.error(`Error al guardar: ${err.message}`);
    }
  };

  return (
    <>
      <PageHeader title="Apariencia y logo" description="Colores del sitio público, logo y favicon." />
      <AdminAsync loading={form.loading} error={form.error} onRetry={form.reload}>
        {() => {
          const site = form.data.site;
          return (
            <div className="form-stack">
              <div className="panels-grid">
                <Panel title="Logo" description="Se muestra en el header, footer, PDF y como imagen para compartir.">
                  <ImageUploader
                    label=""
                    value={site.logo}
                    onChange={saveImage('logoId', 'Logo')}
                    aspect="3 / 1"
                    fit="contain"
                    hint="PNG con fondo transparente recomendado · máx. 5 MB"
                    removeConfirm="¿Eliminar el logo actual? El sitio mostrará el nombre de la marca en su lugar."
                  />
                </Panel>
                <Panel title="Favicon" description="Icono de la pestaña del navegador (idealmente cuadrado, PNG).">
                  <ImageUploader
                    label=""
                    value={site.favicon}
                    onChange={saveImage('faviconId', 'Favicon')}
                    aspect="1 / 1"
                    fit="contain"
                    hint="Cuadrado, mínimo 64×64 px"
                    removeConfirm="¿Eliminar el favicon? Se usará el logo o el icono por defecto."
                  />
                </Panel>
              </div>

              <Panel
                title="Colores"
                description="Los cambios se aplican en todo el sitio público. Header y footer tienen sus propios colores en sus secciones."
                actions={
                  <Button variant="ghost" size="sm" onClick={() => form.set(DEFAULT_THEME)}>
                    Restablecer rosa pastel
                  </Button>
                }
              >
                <div className="colors-grid">
                  {THEME_FIELDS.map((f) => (
                    <ColorInput
                      key={f.key}
                      label={f.label}
                      hint={f.hint}
                      value={theme[f.key]}
                      onChange={(value) => form.set({ [f.key]: value })}
                    />
                  ))}
                </div>
              </Panel>

              <ThemePreview theme={theme} />

              <SaveBar
                dirty={form.dirty && !invalid}
                saving={form.saving}
                onSave={() => form.submit()}
                onReset={form.reset}
              />
            </div>
          );
        }}
      </AdminAsync>
    </>
  );
}
