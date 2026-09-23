import { siteService } from '../../services/site.js';
import { useEditableForm } from '../../hooks/useEditableForm.js';
import { PageHeader, Panel, AdminAsync, SaveBar } from '../../components/admin/AdminPage.jsx';
import ImageUploader from '../../components/ui/ImageUploader.jsx';
import { TextInput, TextArea, Select } from '../../components/ui/Field.jsx';
import { formatPrice } from '../../utils/format.js';

const pick = ({ site }) => ({
  siteName: site.siteName,
  seoTitle: site.seoTitle,
  seoDescription: site.seoDescription,
  ogImage: site.ogImage,
  currency: site.currency,
  locale: site.locale,
  catalogTitle: site.catalogTitle,
  catalogSubtitle: site.catalogSubtitle,
  catalogUrl: site.catalogUrlOverride,
  pdfFooterText: site.pdfFooterText,
});

const save = ({ ogImage, ...values }) => siteService.updateSettings({ ...values, ogImageId: ogImage?.id ?? null });

const CURRENCIES = [
  { value: 'MXN', label: 'MXN — Peso mexicano' },
  { value: 'USD', label: 'USD — Dólar estadounidense' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'COP', label: 'COP — Peso colombiano' },
  { value: 'ARS', label: 'ARS — Peso argentino' },
  { value: 'CLP', label: 'CLP — Peso chileno' },
  { value: 'PEN', label: 'PEN — Sol peruano' },
  { value: 'GTQ', label: 'GTQ — Quetzal' },
];

const LOCALES = [
  { value: 'es-MX', label: 'Español (México)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'es-CO', label: 'Español (Colombia)' },
  { value: 'es-AR', label: 'Español (Argentina)' },
  { value: 'es-US', label: 'Español (Estados Unidos)' },
  { value: 'en-US', label: 'English (US)' },
];

export default function AdminSettings() {
  const form = useEditableForm({ load: siteService.getSettings, pick, save });
  const { values: v, set, errors } = form;

  return (
    <>
      <PageHeader title="Configuración" description="Datos generales, SEO, moneda y opciones del catálogo." />
      <AdminAsync loading={form.loading} error={form.error} onRetry={form.reload}>
        {() => (
          <div className="form-stack">
            <div className="panels-grid">
              <Panel title="General">
                <TextInput
                  label="Nombre del sitio"
                  value={v.siteName}
                  maxLength={120}
                  onChange={(e) => set({ siteName: e.target.value })}
                  error={errors.siteName}
                />
                <div className="form-row">
                  <Select label="Moneda" value={v.currency} options={CURRENCIES} onChange={(e) => set({ currency: e.target.value })} />
                  <Select label="Formato regional" value={v.locale} options={LOCALES} onChange={(e) => set({ locale: e.target.value })} />
                </div>
                <p className="field__hint">Ejemplo de precio: {formatPrice('1250', v.currency, v.locale)}</p>
              </Panel>

              <Panel title="SEO" description="Cómo aparece tu sitio en buscadores y al compartirlo.">
                <TextInput
                  label="Título (title)"
                  value={v.seoTitle}
                  maxLength={120}
                  onChange={(e) => set({ seoTitle: e.target.value })}
                  error={errors.seoTitle}
                />
                <TextArea
                  label="Meta descripción"
                  value={v.seoDescription}
                  maxLength={300}
                  rows={3}
                  onChange={(e) => set({ seoDescription: e.target.value })}
                  hint="Recomendado: 120–160 caracteres."
                />
                <div className="serp">
                  <p className="serp__title">{v.seoTitle || 'Título del sitio'}</p>
                  <p className="serp__url">{window.location.host}</p>
                  <p className="serp__desc">{v.seoDescription || 'Descripción del sitio…'}</p>
                </div>
              </Panel>
            </div>

            <div className="panels-grid">
              <Panel title="Catálogo">
                <TextInput
                  label="Título del catálogo"
                  value={v.catalogTitle}
                  maxLength={120}
                  onChange={(e) => set({ catalogTitle: e.target.value })}
                  error={errors.catalogTitle}
                />
                <TextArea
                  label="Subtítulo / descripción"
                  value={v.catalogSubtitle}
                  maxLength={300}
                  rows={2}
                  onChange={(e) => set({ catalogSubtitle: e.target.value })}
                />
                <TextInput
                  label="URL pública del catálogo (opcional)"
                  value={v.catalogUrl}
                  maxLength={300}
                  placeholder="https://tudominio.com/catalogo"
                  onChange={(e) => set({ catalogUrl: e.target.value.trim() })}
                  error={errors.catalogUrl}
                  hint="Se usa en el QR y el PDF. Vacío = URL configurada en el servidor (FRONTEND_URL)."
                />
                <TextInput
                  label="Texto del pie del PDF (opcional)"
                  value={v.pdfFooterText}
                  maxLength={200}
                  onChange={(e) => set({ pdfFooterText: e.target.value })}
                  hint="Vacío = datos de contacto del footer."
                />
              </Panel>

              <Panel title="Imagen para compartir (Open Graph)" description="Se muestra al compartir el enlace en redes. Ideal 1200×630.">
                <ImageUploader
                  label=""
                  value={v.ogImage}
                  onChange={(ogImage) => set({ ogImage })}
                  aspect="1200 / 630"
                  removeConfirm="¿Quitar la imagen para compartir? Se aplicará al guardar."
                />
              </Panel>
            </div>

            <SaveBar dirty={form.dirty} saving={form.saving} onSave={() => form.submit()} onReset={form.reset} />
          </div>
        )}
      </AdminAsync>
    </>
  );
}
