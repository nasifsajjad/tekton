export interface CatalogDetail {
  image: string;
  imageAlt: string;
  brands: string[];
  page: number;
}

export interface CatalogImage {
  src: string;
  alt: string;
}

export const CATALOG_DETAILS: Record<string, CatalogDetail> = {
  electrical: {
    image: "/catalog/electrical-electronics.webp",
    imageAlt: "Industrial circuit protection components from the Tekton catalogue",
    brands: ["Allen-Bradley", "Eaton", "Finder", "Omron", "Siemens", "Schneider Electric", "SMC", "Phoenix Contact", "ABB", "ifm"],
    page: 4,
  },
  generators: {
    image: "/catalog/generators.webp",
    imageAlt: "Industrial standby generator set from the Tekton catalogue",
    brands: ["Powerol by Mahindra", "Perkins", "Kirloskar", "Caterpillar", "Cummins"],
    page: 9,
  },
  "it-printing": {
    image: "/catalog/it-printing.webp",
    imageAlt: "Printing machine spares and access-floor components",
    brands: ["Heidelberg", "manroland", "Habasit", "Kolbus"],
    page: 15,
  },
  "hydraulics-pneumatics": {
    image: "/catalog/hydraulics-pneumatics.webp",
    imageAlt: "Industrial hydraulic pump from the Tekton catalogue",
    brands: ["ASCO", "Aventics", "Bürkert", "Festo", "HYDAC", "Camozzi", "Parker", "Norgren", "AirTAC", "Bosch Rexroth", "Legris", "Turck", "Yuken", "Rego", "Metal Work"],
    page: 7,
  },
  "pumps-motors": {
    image: "/catalog/pumps-motors.webp",
    imageAlt: "Industrial end-suction pump from the Tekton catalogue",
    brands: ["Lowara", "Watreco", "Ebara", "Hyosung", "Denley", "ClydeUnion Pumps", "Wilden", "SEW-Eurodrive", "Armstrong", "Flowserve", "Busch", "Honda", "Pentair", "Goulds Pumps", "KSB", "Grundfos", "Kirloskar", "ABB", "Danfoss", "Siemens", "Franklin Electric", "LEWA"],
    page: 8,
  },
  compressors: {
    image: "/catalog/compressors.webp",
    imageAlt: "Industrial reciprocating compressor from the Tekton catalogue",
    brands: ["Ingersoll Rand", "CompAir", "ABAC", "BOGE", "ELGi", "Campbell Hausfeld", "Atlas Copco", "Kaeser"],
    page: 9,
  },
  "fittings-fasteners": {
    image: "/catalog/fittings-fasteners.webp",
    imageAlt: "Industrial valves and stainless-steel fittings",
    brands: ["ALCO Valves", "Bollen & Schäfer", "BSD", "Apollo Flow Controls", "AVR", "Pfister", "V&M", "DeBerit", "GWC", "MIR Valve", "Pratt", "Cameron", "Della Foglia"],
    page: 11,
  },
  coupling: {
    image: "/catalog/coupling.webp",
    imageAlt: "Industrial shaft couplings from the Tekton catalogue",
    brands: ["Falk", "Renold", "Lovejoy", "KTR", "Dodge", "Dixon"],
    page: 14,
  },
  "lifting-handling": {
    image: "/catalog/lifting-handling.webp",
    imageAlt: "Wire rope, industrial light and castor wheel",
    brands: ["Demag", "Aberdare Cables", "Konecranes", "Metreel", "Liebherr", "J.W. Speaker", "Street", "Stahl", "GH"],
    page: 10,
  },
  instrumentation: {
    image: "/catalog/instrumentation.webp",
    imageAlt: "Industrial measurement and calibration instruments",
    brands: ["Senko", "Marsh Bellofram", "Endress+Hauser", "General", "Badotherm", "Dungs", "Fluke", "Megger", "WIKA", "Barksdale", "Krohne", "Winters", "Nuova Fima"],
    page: 13,
  },
  filters: {
    image: "/catalog/filters.webp",
    imageAlt: "Industrial filter cartridges and panel filters",
    brands: ["Donaldson", "Masoneilan", "Serfilco", "Harmsco", "Ingersoll Rand", "MP Filtri", "Fleetguard", "Pall", "HYDAC"],
    page: 10,
  },
  "pipe-testing-plugs": {
    image: "/catalog/pipe-testing-plugs.webp",
    imageAlt: "Plugger pipe-testing plugs, hose and pressure-gauge accessories",
    brands: ["Plugger"],
    page: 14,
  },
  desalination: {
    image: "/catalog/desalination.webp",
    imageAlt: "Reverse-osmosis membranes and water-treatment vessel",
    brands: ["Blue Water Desalination", "BWT", "Doosan", "Wallace & Tiernan"],
    page: 15,
  },
  "chemicals-lubricants": {
    image: "/catalog/chemicals-lubricants.webp",
    imageAlt: "Industrial cleaning chemicals and lubricants",
    brands: ["Arrow Solutions", "Mobil", "Kaeser", "Molykote", "JAX", "Cummins"],
    page: 12,
  },
  packaging: {
    image: "/catalog/packaging.webp",
    imageAlt: "Pallet stretch-wrapping machine from the Tekton catalogue",
    brands: ["Robopac", "Atlanta Stretch", "LoeschPack", "Viking Masek", "Poly Pack"],
    page: 13,
  },
  "sawing-tools": {
    image: "/catalog/sawing-tools.webp",
    imageAlt: "Industrial drill and circular saw",
    brands: ["Emmegi", "Hoffmann Group", "Harrison", "Ryobi", "DoALL", "Addison", "DeWalt", "Bosch", "RIDGID"],
    page: 13,
  },
  marine: {
    image: "/catalog/marine.webp",
    imageAlt: "Marine steel plate, electronics, bollard and fenders",
    brands: [],
    page: 11,
  },
  "hvac-safety": {
    image: "/catalog/hvac-safety.webp",
    imageAlt: "Fire extinguishers, ventilation fan and industrial coveralls",
    brands: ["Spirax Sarco", "McQuay", "Bradford White", "Rittal", "NovaFlex", "Vortice", "American Water Heaters", "ebm-papst", "Honeywell", "Manrose", "uvex"],
    page: 12,
  },
};

export const CATALOG_LOGOS: Record<string, string> = {
  electrical: "/catalog/brands/electrical-electronics-logos.webp",
  generators: "/catalog/brands/generators-logos.webp",
  "it-printing": "/catalog/brands/it-printing-logos.webp",
  "hydraulics-pneumatics": "/catalog/brands/hydraulics-pneumatics-logos.webp",
  "pumps-motors": "/catalog/brands/pumps-motors-logos.webp",
  compressors: "/catalog/brands/compressors-logos.webp",
  "fittings-fasteners": "/catalog/brands/fittings-fasteners-logos.webp",
  coupling: "/catalog/brands/coupling-logos.webp",
  "lifting-handling": "/catalog/brands/lifting-handling-logos.webp",
  instrumentation: "/catalog/brands/instrumentation-logos.webp",
  filters: "/catalog/brands/filters-logos.webp",
  "pipe-testing-plugs": "/catalog/brands/pipe-testing-plugs-logos.webp",
  desalination: "/catalog/brands/desalination-logos.webp",
  "chemicals-lubricants": "/catalog/brands/chemicals-lubricants-logos.webp",
  packaging: "/catalog/brands/packaging-logos.webp",
  "sawing-tools": "/catalog/brands/sawing-tools-logos.webp",
  "hvac-safety": "/catalog/brands/hvac-safety-logos.webp",
};

const ONLINE_GALLERIES: Record<string, string[]> = {
  electrical: ["electrical-electronics-02", "electrical-electronics-03", "electrical-electronics-01"],
  generators: ["generators-03", "compressors-01", "compressors-03"],
  "it-printing": ["it-printing-01", "it-printing-02", "electrical-electronics-03"],
  "hydraulics-pneumatics": ["coupling-01", "instrumentation-03", "filters-01"],
  "pumps-motors": ["pumps-motors-01", "pumps-motors-02", "pumps-motors-03"],
  compressors: ["compressors-01", "compressors-03", "coupling-01"],
  "fittings-fasteners": ["fittings-fasteners-01", "fittings-fasteners-02", "fittings-fasteners-03"],
  coupling: ["coupling-01", "coupling-02", "coupling-03"],
  "lifting-handling": ["lifting-handling-01", "lifting-handling-02", "lifting-handling-03"],
  instrumentation: ["instrumentation-01", "instrumentation-02", "instrumentation-03"],
  filters: ["filters-01", "filters-02", "filters-03"],
  "pipe-testing-plugs": ["fittings-fasteners-01", "instrumentation-01", "pumps-motors-01"],
  desalination: ["filters-01", "filters-02", "filters-03"],
  "chemicals-lubricants": ["chemicals-lubricants-01", "chemicals-lubricants-02", "filters-01"],
  packaging: ["packaging-01", "lifting-handling-01", "it-printing-01"],
  "sawing-tools": ["it-printing-01", "fittings-fasteners-03", "coupling-03"],
  marine: ["lifting-handling-03", "pumps-motors-01", "generators-03"],
  "hvac-safety": ["filters-01", "filters-02", "filters-03"],
};

export function getCatalogGallery(icon: string): CatalogImage[] {
  const detail = CATALOG_DETAILS[icon];
  const images = ONLINE_GALLERIES[icon];

  if (!detail || !images) return [];

  return images.map((image, index) => ({
    src: `/catalog/online/${image}.webp`,
    alt: `${detail.imageAlt.replace(" from the Tekton catalogue", "")} — reference view ${index + 1}`,
  }));
}
