import { siteService } from '../../services/site.js';
import { useEditableForm } from '../../hooks/useEditableForm.js';
import { PageHeader, Panel, AdminAsync, SaveBar } from '../../components/admin/AdminPage.jsx';
import SitePreview from '../../components/admin/SitePreview.jsx';
import Header from '../../components/layout/Header.jsx';
import LinksEditor from '../../components/ui/LinksEditor.jsx';
import { TextInput, Toggle, ColorInput } from '../../components/ui/Field.jsx';

const pick = ({ header }) => {
  const { updatedAt: _u, ...rest } = header;
  return rest;
};

export default function AdminHeader() {
  const form = useEditableForm({ load: siteService.getHeader, pick, save: siteService.updateHeader });
  const { values: v, set, errors } = form;

  return (
    <>
      <PageHeader title="Header" description="Logo, marca, enlaces, botón y colores de la barra superior." />
      <AdminAsync loading={form.loading} error={form.error} onRetry={form.reload}>
        {() => (
          <div className="form-stack">
            <SitePreview>{(site) => <Header header={{ ...v, sticky: false }} site={site} />}</SitePreview>

            <div className="panels-grid">
              <Panel title="Marca">
                <TextInput
                  label="Nombre / marca"
                  value={v.brandText}
                  maxLength={80}
                  onChange={(e) => set({ brandText: e.target.value })}
                  error={errors.brandText}
                />
                <TextInput
                  label="Texto secundario (eslogan)"
                  value={v.tagline}
                  maxLength={120}
                  onChange={(e) => set({ tagline: e.target.value })}
                />
                <Toggle label="Mostrar logo" checked={v.showLogo} onChange={(showLogo) => set({ showLogo })} hint="El logo se administra en Apariencia." />
                <Toggle label="Mostrar nombre" checked={v.showBrand} onChange={(showBrand) => set({ showBrand })} />
                <Toggle label="Header fijo al hacer scroll" checked={v.sticky} onChange={(sticky) => set({ sticky })} />
              </Panel>

              <Panel title="Colores">
                <ColorInput label="Fondo del header" value={v.bgColor} onChange={(bgColor) => set({ bgColor })} />
                <ColorInput label="Texto del header" value={v.textColor} onChange={(textColor) => set({ textColor })} />
              </Panel>
            </div>

            <Panel title="Navegación" description="El apartado Catálogo siempre se muestra; puedes cambiar su texto.">
              <TextInput
                label="Texto del enlace al catálogo"
                value={v.catalogLabel}
                maxLength={40}
                onChange={(e) => set({ catalogLabel: e.target.value })}
                error={errors.catalogLabel}
              />
              <p className="field__label">Otros enlaces</p>
              <LinksEditor items={v.links} onChange={(links) => set({ links })} max={8} />
            </Panel>

            <Panel title="Botón destacado">
              <Toggle label="Mostrar botón" checked={v.showCta} onChange={(showCta) => set({ showCta })} />
              <div className="form-row">
                <TextInput
                  label="Texto del botón"
                  value={v.ctaText}
                  maxLength={40}
                  onChange={(e) => set({ ctaText: e.target.value })}
                />
                <TextInput
                  label="Enlace del botón"
                  value={v.ctaUrl}
                  maxLength={300}
                  placeholder="#contacto"
                  onChange={(e) => set({ ctaUrl: e.target.value.trim() })}
                  error={errors.ctaUrl}
                />
              </div>
            </Panel>

            <SaveBar dirty={form.dirty} saving={form.saving} onSave={() => form.submit()} onReset={form.reset} />
          </div>
        )}
      </AdminAsync>
    </>
  );
}
