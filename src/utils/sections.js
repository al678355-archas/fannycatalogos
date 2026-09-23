// Tipos de sección disponibles en el CMS (deben coincidir con SECTION_TYPES del backend)
export const SECTION_TYPES = {
  hero: { label: 'Portada (hero)', image: true, items: false },
  text: { label: 'Texto', image: false, items: false },
  imageText: { label: 'Imagen + texto', image: true, items: false },
  features: { label: 'Tarjetas / características', image: false, items: true },
  cta: { label: 'Llamado a la acción', image: false, items: false },
};
