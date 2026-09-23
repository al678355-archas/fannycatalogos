import { siteService } from '../../services/site.js';
import { useEditableForm } from '../../hooks/useEditableForm.js';
import { PageHeader, Panel, AdminAsync, SaveBar } from '../../components/admin/AdminPage.jsx';
import SitePreview from '../../components/admin/SitePreview.jsx';
import Footer from '../../components/layout/Footer.jsx';
import LinksEditor from '../../components/ui/LinksEditor.jsx';
import ImageUploader from '../../components/ui/ImageUploader.jsx';
import { SOCIAL_NETWORKS } from '../../utils/socials.js';
import { TextInput, TextArea, Toggle, ColorInput } from '../../components/ui/Field.jsx';

const pick = ({ footer }) => {
  const { updatedAt: _u, logoId: _l, ...rest } = footer;
  return rest;
};

export default function AdminFooter() {
  const form = useEditableForm({
    load: siteService.getFooter,
    pick,
    save: ({ logo, ...values }) => siteService.updateFooter({ ...values, logoId: logo?.id ?? null }),
  });
  const { values: v, set, errors } = form;

  return (
    <>
      <PageHeader title="Footer" description="Texto, contacto, enlaces, redes sociales y colores del pie de página." />
      <AdminAsync loading={form.loading} error={form.error} onRetry={form.reload}>
        {() => (
          <div className="form-stack">
            <SitePreview>{(site) => <Footer footer={v} site={site} />}</SitePreview>

            <div className="panels-grid">
              <Panel title="Textos">
                <TextArea
                  label="Texto descriptivo"
                  value={v.text}
                  maxLength={500}
                  rows={3}
                  onChange={(e) => set({ text: e.target.value })}
                />
                <TextInput
                  label="Copyright"
                  value={v.copyright}
                  maxLength={160}
                  onChange={(e) => set({ copyright: e.target.value })}
                />
              </Panel>

              <Panel title="Contacto">
                <TextInput
                  label="Email"
                  type="email"
                  value={v.email}
                  maxLength={160}
                  onChange={(e) => set({ email: e.target.value.trim() })}
                  error={errors.email}
                />
                <TextInput
                  label="Teléfono / WhatsApp"
                  value={v.phone}
                  maxLength={40}
                  onChange={(e) => set({ phone: e.target.value })}
                />
                <TextInput
                  label="Dirección"
                  value={v.address}
                  maxLength={200}
                  onChange={(e) => set({ address: e.target.value })}
                />
              </Panel>
            </div>

            <div className="panels-grid">
              <Panel title="Enlaces">
                <LinksEditor items={v.links} onChange={(links) => set({ links })} max={12} />
              </Panel>
              <Panel title="Redes sociales">
                <LinksEditor
                  items={v.socials}
                  onChange={(socials) => set({ socials })}
                  labelKey="network"
                  labelOptions={SOCIAL_NETWORKS}
                  addText="Agregar red social"
                  max={10}
                />
              </Panel>
            </div>

            <div className="panels-grid">
              <Panel title="Elementos visibles">
                <Toggle label="Mostrar logo" checked={v.showLogo} onChange={(showLogo) => set({ showLogo })} />
                <Toggle label="Mostrar contacto" checked={v.showContact} onChange={(showContact) => set({ showContact })} />
                <Toggle label="Mostrar enlaces" checked={v.showLinks} onChange={(showLinks) => set({ showLinks })} />
                <Toggle label="Mostrar redes sociales" checked={v.showSocials} onChange={(showSocials) => set({ showSocials })} />
                <ColorInput label="Fondo del footer" value={v.bgColor} onChange={(bgColor) => set({ bgColor })} />
                <ColorInput label="Texto del footer" value={v.textColor} onChange={(textColor) => set({ textColor })} />
              </Panel>
              <Panel title="Logo del footer" description="Opcional. Si no subes uno, se usa el logo principal.">
                <ImageUploader
                  label=""
                  value={v.logo}
                  onChange={(logo) => set({ logo })}
                  aspect="3 / 1"
                  fit="contain"
                  removeConfirm="¿Quitar el logo del footer? Se aplicará al guardar."
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
