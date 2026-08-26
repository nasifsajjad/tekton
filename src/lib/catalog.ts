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

/** Supplied raster logo sheets, keyed by category name. */
export const CATALOG_LOGOS: Record<string, string> = {
  "Valves, Actuation & Flow Control": "/catalog/brands/category-logos/Valves,%20Actuation%20%26%20Flow%20Control.png",
  "Pumps & Pumping Systems": "/catalog/brands/category-logos/Pumps%20%26%20Pumping%20Systems.png",
  "Hydraulics & Pneumatics": "/catalog/brands/category-logos/Hydraulics%20%26%20Pneumatics.png",
  "Compressors & Compressed Air Systems": "/catalog/brands/category-logos/Compressors%20%26%20Compressed%20Air%20Systems.png",
  "Motors, Drives & Power Transmission": "/catalog/brands/category-logos/Motors,%20Drives%20%26%20Power%20Transmission.png",
  "Electrical, Automation & Control": "/catalog/brands/category-logos/Electrical,%20Automation%20%26%20Control.png",
  "Instrumentation, Calibration & Measurement": "/catalog/brands/category-logos/Instrumentation,%20Calibration%20%26%20Measurement.png",
  "IT & Industrial Computing": "/catalog/brands/category-logos/IT%20%26%20Industrial%20Computing.png",
  "Mechanical Equipment & Industrial Spare Parts": "/catalog/brands/category-logos/Mechanical%20Equipment%20%26%20Industrial%20Spares.png",
  "Piping, Fittings & Pipeline Products": "/catalog/brands/category-logos/Piping,%20Fittings%20%26%20Pipeline%20Products.png",
  "Filters, Filtration & Separation": "/catalog/brands/category-logos/Filters,%20Filtration%20%26%20Separation.png",
  "Safety, Fire & Emergency Equipment": "/catalog/brands/category-logos/Safety,%20Fire%20%20%26%20Emergency%20Equipment.png",
  "Tools, Fabrication & Workshop Equipment": "/catalog/brands/category-logos/Tools,%20Fabrication%20%26%20Workshop%20Equipment.png",
  "Lifting & Material Handling": "/catalog/brands/category-logos/Lifting%20%26%20Material%20Handling.png",
  "Industrial Consumables & Packaging": "/catalog/brands/category-logos/Industrial%20Consumables%20%26%20Packaging.png",
  "HVAC, Cooling & Ventilation": "/catalog/brands/category-logos/HVAC,%20Cooling%20%26%20Ventilation.png",
  "Desalination & Water Treatment": "/catalog/brands/category-logos/Desalination%20%26%20Water%20Treatment.png",
  "Industrial Lubricants": "/catalog/brands/category-logos/Industrial%20Lubricants.png",
  "Marine, Offshore & Ship Supply": "/catalog/brands/category-logos/Marine,%20Offshore%20%26%20Ship%20Supply.png",
};

/** Supplied product images, keyed by category name so shared icons stay distinct. */
export const CATALOG_CATEGORY_IMAGES: Record<string, string> = {
  "Valves, Actuation & Flow Control": "/catalog/category-products/Valves,%20Actuation%20%26%20Flow%20Control.png",
  "Pumps & Pumping Systems": "/catalog/category-products/Pumps%20%26%20Pumping%20Systems.png",
  "Hydraulics & Pneumatics": "/catalog/category-products/Hydraulics%20%26%20Pneumatics.png",
  "Compressors & Compressed Air Systems": "/catalog/category-products/Compressors%20%26%20Compressed%20Air%20Systems.png",
  "Motors, Drives & Power Transmission": "/catalog/category-products/Motors,%20Drives%20%26%20Power%20Transmission.png",
  "Electrical, Automation & Control": "/catalog/category-products/Electrical,%20Automation%20%26%20Control.png",
  "Instrumentation, Calibration & Measurement": "/catalog/category-products/Instrumentation,%20Calibration%20%26%20Measurement.png",
  "IT & Industrial Computing": "/catalog/category-products/IT%20%26%20Industrial%20Computing.png",
  "Mechanical Equipment & Industrial Spare Parts": "/catalog/category-products/Mechanical%20Equipment%20%26%20Industrial%20Spares.png",
  "Piping, Fittings & Pipeline Products": "/catalog/category-products/Piping,%20Fittings%20%26%20Pipeline%20Products.png",
  "Pipe Testing, Isolation & Pipeline Tools": "/catalog/category-products/Pipe%20Testing,%20Isolation%20%26%20Pipeline%20Tools.png",
  "Filters, Filtration & Separation": "/catalog/category-products/Filters,%20Filtration%20%26%20Separation.png",
  "Safety, Fire & Emergency Equipment": "/catalog/category-products/Safety,%20Fire%20%26%20Emergency%20Equipment.png",
  "Tools, Fabrication & Workshop Equipment": "/catalog/category-products/Tools,%20Fabrication%20%26%20Workshop%20Equipment.png",
  "Lifting & Material Handling": "/catalog/category-products/Lifting%20%26%20Material%20Handling.png",
  "Industrial Consumables & Packaging": "/catalog/category-products/Industrial%20Consumables%20%26%20Packaging.png",
  "HVAC, Cooling & Ventilation": "/catalog/category-products/HVAC,%20Cooling%20%26%20Ventilation.png",
  "Desalination & Water Treatment": "/catalog/category-products/Desalination%20%26%20Water%20Treatment.png",
  "Industrial Lubricants": "/catalog/category-products/Industrial%20Lubricants.png",
  "Marine, Offshore & Ship Supply": "/catalog/category-products/Marine,%20Offshore%20%26%20Ship%20Supply.png",
};

/** Manufacturer names transcribed from each supplied category logo sheet. */
export const CATALOG_BRANDS_BY_CATEGORY: Record<string, string[]> = {
  "Valves, Actuation & Flow Control": ["Pratt", "AVR", "Aalberts Integrated Piping Systems", "ALCO Valves", "GWC Italia", "Forbes Marshall", "Spirax Sarco"],
  "Pumps & Pumping Systems": ["Goulds Pumps", "Honda", "KSB", "Kirloskar", "Lowara", "Wilden", "Watreco", "ABB", "Ebara", "Franklin Electric", "Armstrong", "Danfoss", "Pentair", "Flowserve", "Standard Pump", "Xylem", "YMC ChromaCon", "Siemens", "Hyosung"],
  "Hydraulics & Pneumatics": ["AirTAC", "Yuken", "Metal Work Pneumatic", "Janatics", "ALCO Valves", "AVR", "ASCO", "Aventics", "Festo", "Bürkert", "Parker", "HYDAC", "Dover", "IMI", "Camozzi", "Bosch Rexroth", "Turck"],
  "Compressors & Compressed Air Systems": ["ABAC", "CompAir", "Ingersoll Rand", "BOGE", "Atlas Copco", "Campbell Hausfeld", "ELGi", "Kaeser"],
  "Motors, Drives & Power Transmission": ["Eaton", "Rockwell Automation", "Danfoss", "ABB", "Siemens"],
  "Electrical, Automation & Control": ["Belden", "Schneider Electric", "Eurotherm", "Bender", "LAPP", "Landis+Gyr", "Vishay", "Nexans", "Conductix-Wampfler", "Kübler", "Fuji Electric", "Prysmian", "Honeywell", "Pepperl+Fuchs", "Siemens", "ABB", "Phoenix Contact", "SMC", "Eaton", "Rockwell Automation", "ifm", "Jean Müller", "Omron"],
  "Instrumentation, Calibration & Measurement": ["Marsh Bellofram", "Endress+Hauser", "Fluke", "Krohne", "WIKA", "Megger", "Emerson", "General", "Dungs", "Winters Instruments", "Barksdale"],
  "IT & Industrial Computing": ["manroland sheetfed", "Heidelberg", "Habasit", "Kolbus"],
  "Mechanical Equipment & Industrial Spare Parts": ["SKF", "Schaeffler", "NSK", "IKO", "Regal Rexnord", "KTR", "Dixon", "Lovejoy", "Dodge", "FAG", "NTN", "INA", "Timken", "JTEKT"],
  "Piping, Fittings & Pipeline Products": ["ALCO Valves", "GWC USA"],
  "Filters, Filtration & Separation": ["Pall", "HYDAC", "Eaton", "Donaldson", "Serfilco", "Baker Hughes", "Harmsco", "Ingersoll Rand", "MP Filtri"],
  "Safety, Fire & Emergency Equipment": ["3M", "Honeywell", "uvex"],
  "Tools, Fabrication & Workshop Equipment": ["Bosch", "Emmegi", "Toptul", "RIDGID", "DeWalt", "DoALL", "Ryobi", "Hoffmann Group"],
  "Lifting & Material Handling": ["Liebherr", "J.W. Speaker", "Aberdare", "Demag", "Stahl CraneSystems", "Met-Track", "Konecranes"],
  "Industrial Consumables & Packaging": ["Atlanta Stretch", "Poly Pack", "LoeschPack", "Robopac", "Viking Masek"],
  "HVAC, Cooling & Ventilation": ["Daikin Applied", "Spirax Sarco", "Novaflex", "Honeywell", "Vortice", "uvex", "Manrose", "ebm-papst", "Rittal"],
  "Desalination & Water Treatment": ["Blue Water Desalination", "BWT", "Xylem"],
  "Industrial Lubricants": ["Castrol", "Chevron", "JAX", "Cummins", "Mobil", "Kaeser"],
  "Marine, Offshore & Ship Supply": ["Trelleborg"],
};

/**
 * Text equivalent for the supplied logo sheets. Keeping manufacturer names
 * in the catalogue data makes them accessible and searchable even though the
 * visual presentation remains the supplied, unmodified image.
 */
export function getCatalogBrands(categoryName: string, icon: string): string[] {
  const brands = CATALOG_BRANDS_BY_CATEGORY[categoryName] ?? CATALOG_DETAILS[icon]?.brands ?? [];
  return Array.from(new Set(brands)).sort((a, b) => a.localeCompare(b));
}

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

  return images.slice(0, 1).map((image, index) => ({
    src: `/catalog/online/${image}.webp`,
    alt: `${detail.imageAlt.replace(" from the Tekton catalogue", "")} — reference view ${index + 1}`,
  }));
}
