import { siteService } from '../../services/site.js';
import { useEditableForm } from '../../hooks/useEditableForm.js';
import { PageHeader, Panel, AdminAsync, SaveBar } from '../../components/admin/AdminPage.jsx';
import LinksEditor from '../../components/ui/LinksEditor.jsx';
import Button from '../../components/ui/Button.jsx';
import { TextInput, TextArea } from '../../components/ui/Field.jsx';
import { SOCIAL_NETWORKS } from '../../utils/socials.js';

// Los textos de la página viven en la configuración del sitio; email, teléfono,
// dirección y redes son los mismos del footer (se editan aquí o en Footer).
const load = async () => {
  const [{ site }, { footer }] = await Promise.all([siteService.getSettings(), siteService.getFooter()]);
  return { site, footer };
};

const pick = ({ site, footer }) => ({
  contactTitle: site.contact.title,
  contactSubtitle: site.contact.subtitle,
  contactText: site.contact.text,
  contactWhatsapp: site.contact.whatsapp,
  contactWhatsappMessage: site.contact.whatsappMessage,
  contactHours: site.contact.hours,
  contactMapUrl: site.contact.mapUrl,
  email: footer.email,
  phone: footer.phone,
  address: footer.address,
  socials: footer.socials,
});

const save = async ({ email, phone, address, socials, ...contact }) => {
  const { site } = await siteService.updateSettings(contact);
  const { footer } = await siteService.updateFooter({ email, phone, address, socials });
  return { site, footer };
};

export default function AdminContact() {
  const form = useEditableForm({ load, pick, save, successMessage: 'Página de contacto guardada' });
  const { values: v, set, errors } = form;

  return (
    <>
      <PageHeader
        title="Página de contacto"
        description="Contenido de /contacto. Email, teléfono, dirección y redes también se muestran en el footer."
        actions={
          <Button variant="outline" href="/contacto" target="_blank" rel="noopener noreferrer">
            Ver página ↗
          </Button>
        }
      />
      <AdminAsync loading={form.loading} error={form.error} onRetry={form.reload}>
        {() => (
          <div className="form-stack">
            <div className="panels-grid">
              <Panel title="Textos">
                <TextInput
                  label="Título"
                  value={v.contactTitle}
                  maxLength={120}
                  onChange={(e) => set({ contactTitle: e.target.value })}
                  error={errors.contactTitle}
                />
                <TextInput
                  label="Subtítulo"
                  value={v.contactSubtitle}
                  maxLength={300}
                  onChange={(e) => set({ contactSubtitle: e.target.value })}
                />
                <TextArea
                  label="Texto"
                  hint="Deja una línea en blanco para separar párrafos."
                  value={v.contactText}
                  maxLength={2000}
                  rows={5}
                  onChange={(e) => set({ contactText: e.target.value })}
                />
                <TextArea
                  label="Horario de atención"
                  placeholder={'Lunes a viernes: 10:00 – 19:00\nSábado: 10:00 – 14:00'}
                  value={v.contactHours}
                  maxLength={500}
                  rows={3}
                  onChange={(e) => set({ contactHours: e.target.value })}
                />
              </Panel>

              <Panel title="WhatsApp" description="Se muestra como botón principal. Déjalo vacío para ocultarlo.">
                <TextInput
                  label="Número de WhatsApp"
                  inputMode="tel"
                  placeholder="5215512345678"
                  value={v.contactWhatsapp}
                  maxLength={20}
                  onChange={(e) => set({ contactWhatsapp: e.target.value })}
                  error={errors.contactWhatsapp}
                  hint="Con lada del país, sin espacios. México: 52 + 1 + 10 dígitos."
                />
                <TextArea
                  label="Mensaje inicial"
                  value={v.contactWhatsappMessage}
                  maxLength={300}
                  rows={2}
                  onChange={(e) => set({ contactWhatsappMessage: e.target.value })}
                  hint="Texto que aparece escrito al abrir el chat."
                />
              </Panel>
            </div>

            <div className="panels-grid">
              <Panel title="Datos de contacto" description="Compartidos con el footer.">
                <TextInput
                  label="Email"
                  type="email"
                  value={v.email}
                  maxLength={160}
                  onChange={(e) => set({ email: e.target.value.trim() })}
                  error={errors.email}
                />
                <TextInput
                  label="Teléfono"
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
                <TextInput
                  label="Enlace del mapa (opcional)"
                  placeholder="https://maps.app.goo.gl/…"
                  value={v.contactMapUrl}
                  maxLength={500}
                  onChange={(e) => set({ contactMapUrl: e.target.value.trim() })}
                  error={errors.contactMapUrl}
                  hint="Pega el enlace de Google Maps para mostrar “Ver mapa” junto a la dirección."
                />
              </Panel>

              <Panel title="Redes sociales" description="Compartidas con el footer.">
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

            <SaveBar dirty={form.dirty} saving={form.saving} onSave={() => form.submit()} onReset={form.reset} />
          </div>
        )}
      </AdminAsync>
    </>
  );
}
