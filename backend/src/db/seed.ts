import bcrypt from "bcryptjs";
import { getDatabase } from "./mongo.js";
import { config } from "../config.js";
import { User } from "../models/user.js";
import { ProductDocument, categoryToSlug } from "../models/product.js";

export const INITIAL_PRODUCTS: Omit<ProductDocument, "_id">[] = [
  // 1. Steel - Amman Try Steel
  {
    id: "amman-try-fe550d-tmt-rebars",
    name: "Amman Try Fe 550D TMT Rebars",
    slug: "amman-try-fe550d-tmt-rebars",
    brand: "Amman Try Steel",
    brandLogo: "/images/logos/amman-try.svg",
    category: "Steel",
    categoryId: "steel",
    image: "/images/products/amman-try-fe550d-tmt-bars.jpeg",
    imageAlt: "Amman Try Fe 550D TMT Rebars bundle",
    shortDescription: "High-ductility Fe 550D ribbed TMT reinforcement steel bars for residential and commercial structures.",
    description: "Amman-TRY Fe 550D TMT bars engineered with superior rib patterns for reinforced concrete bonding, high earthquake resistance, and uniform tensile strength. Available in standard construction diameters.",
    specifications: {
      "Brand": "Amman Try Steel",
      "Grade": "Fe 550D",
      "Application": "Foundation, Columns, Beams & Slabs",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 2. Steel - Viki TMT
  {
    id: "viki-tmt-550d-bars",
    name: "Viki TMT 550D Steel Bars",
    slug: "viki-tmt-550d-bars",
    brand: "Viki TMT",
    brandLogo: "/images/logos/viki-tmt.png",
    category: "Steel",
    categoryId: "steel",
    image: "/images/products/steel-tmt-bars.jpg",
    imageAlt: "Viki TMT 550D reinforcement steel bars",
    shortDescription: "Durable Fe 550D thermo-mechanically treated steel rebars for reinforced concrete construction.",
    description: "Viki TMT 550D reinforcement bars providing enhanced bendability, high yield strength, and thermal resistance for building frames and civil structures.",
    specifications: {
      "Brand": "Viki TMT",
      "Grade": "550D TMT",
      "Standard": "IS 1786 Certified",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 3. Cement - UltraTech Cement
  {
    id: "ultratech-ppc-cement",
    name: "UltraTech Cement (PPC)",
    slug: "ultratech-ppc-cement",
    brand: "UltraTech Cement",
    brandLogo: "/images/logos/ultratech.jpg",
    category: "Cement",
    categoryId: "cement",
    image: "/images/products/cement-bags.jpg",
    imageAlt: "UltraTech Cement 50kg bag",
    shortDescription: "Premium Portland Pozzolana Cement for structural concrete, foundations, and brick masonry.",
    description: "UltraTech Portland Pozzolana Cement engineered for high compressive strength, low heat of hydration, and long-term durability in residential and commercial construction.",
    specifications: {
      "Brand": "UltraTech Cement",
      "Packaging": "50kg Bag",
      "Type": "PPC (Portland Pozzolana)",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 4. Cement - UltraTech Building Solutions
  {
    id: "ultratech-building-solutions-super",
    name: "UltraTech Building Solutions Weather Pro",
    slug: "ultratech-building-solutions-super",
    brand: "UltraTech Building Solutions",
    brandLogo: "/images/logos/ultratech.jpg",
    category: "Cement",
    categoryId: "cement",
    image: "/images/products/UltraTech-Weather-Pro-Top-Shield.jpg",
    imageAlt: "UltraTech Building Solutions Weather Pro Cement",
    shortDescription: "Water-repellent specialized building solution cement engineered to prevent dampness and efflorescence.",
    description: "UltraTech Building Solutions Weather Pro cement infused with active water-repellent micro-particles to protect walls and foundations against moisture intrusion, dampness, and efflorescence.",
    specifications: {
      "Brand": "UltraTech Building Solutions",
      "Type": "Water Repellent Specialized Cement",
      "Packaging": "50kg Bag",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 5. MS Pipe - Square Pipes
  {
    id: "ms-square-pipes",
    name: "MS Square Hollow Section Pipes",
    slug: "ms-square-pipes",
    brand: "Unbranded / Generic",
    category: "MS Pipe",
    categoryId: "ms-pipe",
    image: "/images/products/ms-square-pipes.jpg",
    imageAlt: "Mild Steel Square Hollow Section Pipes",
    shortDescription: "Mild steel square hollow sections for fabrication, structural framing, gates, and grills.",
    description: "High-grade mild steel square pipes manufactured to precise tolerances for structural trusses, gates, railings, and industrial frames. Uniform wall thickness with clean cut ends.",
    specifications: {
      "Product Type": "Square Hollow Section (SHS)",
      "Material": "Mild Steel (MS)",
      "Usage": "Fabrication, Gates, Railings, Trusses",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 6. MS Pipe - Round Pipes
  {
    id: "ms-round-pipes",
    name: "MS Round Hollow Steel Pipes",
    slug: "ms-round-pipes",
    brand: "Unbranded / Generic",
    category: "MS Pipe",
    categoryId: "ms-pipe",
    image: "/images/products/ms-round-pipes.jpg",
    imageAlt: "Mild Steel Round Hollow Pipes",
    shortDescription: "Mild steel circular hollow ERW pipes for structural scaffolding, shed columns, and utility fluid lines.",
    description: "Circular mild steel ERW tubes engineered for structural weight-bearing applications, handrails, scaffolding, and utility ducting.",
    specifications: {
      "Product Type": "Round Pipe / Circular Hollow Section",
      "Material": "Mild Steel (MS)",
      "Usage": "Structural Columns, Handrails, Sheds",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 7. MS Pipe - Flat Sections
  {
    id: "ms-flat-sections",
    name: "MS Flat Sections",
    slug: "ms-flat-sections",
    brand: "Unbranded / Generic",
    category: "MS Pipe",
    categoryId: "ms-pipe",
    image: "/images/products/ms-flat-sections.jpg",
    imageAlt: "Mild Steel Flat Bar Sections",
    shortDescription: "Solid rectangular mild steel flat bar sections for grills, base plates, brackets, and bracing.",
    description: "Hot rolled mild steel flat bars offering excellent weldability and machinability. Ideal for structural brackets, base plates, grill fabrication, and mechanical bracing.",
    specifications: {
      "Product Type": "Flat Section (MS Flats)",
      "Material": "Mild Steel (MS)",
      "Usage": "Grills, Brackets, Structural Bracing",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 8. MS Pipe - L-Angles
  {
    id: "ms-l-angles",
    name: "MS L-Angle Steel Profiles",
    slug: "ms-l-angles",
    brand: "Unbranded / Generic",
    category: "MS Pipe",
    categoryId: "ms-pipe",
    image: "/images/products/ms-l-angles.jpg",
    imageAlt: "Mild Steel L-Angle Equal Angle Iron Profiles",
    shortDescription: "Mild steel equal 90-degree angle iron profiles for structural support frames and corner reinforcement.",
    description: "90-degree equal angle mild steel profiles offering robust cross-sectional rigidity for warehouse sheds, corner edging, purlins, and mechanical framework.",
    specifications: {
      "Product Type": "L-Angle (Equal Angle Profile)",
      "Material": "Mild Steel (MS)",
      "Usage": "Roof Sheds, Purlins, Corner Frames",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 9. Paint - Birla Opus
  {
    id: "birla-opus-interior-emulsion",
    name: "Birla Opus Calista Interior Emulsion",
    slug: "birla-opus-interior-emulsion",
    brand: "Birla Opus",
    brandLogo: "/images/logos/birla-opus.png",
    category: "Paint",
    categoryId: "paint",
    image: "/images/products/paint-emulsion.jpg",
    imageAlt: "Birla Opus Calista Interior Emulsion Paint",
    shortDescription: "Premium architectural interior emulsion delivering rich sheen, stain resistance, and high wall coverage.",
    description: "Birla Opus Calista decorative interior emulsion formulated with advanced polymer technology for a smooth rich finish, washability, and long-lasting wall color depth.",
    specifications: {
      "Brand": "Birla Opus",
      "Type": "Interior Wall Emulsion",
      "Finish": "Rich Smooth Sheen",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 10. Paint - Asian Paints
  {
    id: "asian-paints-apex-exterior",
    name: "Asian Paints Apex Weatherproof Emulsion",
    slug: "asian-paints-apex-exterior",
    brand: "Asian Paints",
    brandLogo: "/images/logos/asian-paints.svg",
    category: "Paint",
    categoryId: "paint",
    image: "/images/products/paint-emulsion.jpg",
    imageAlt: "Asian Paints Apex Exterior Emulsion",
    shortDescription: "Weatherproof exterior emulsion paint with UV resistance and anti-algal protection.",
    description: "Asian Paints Apex exterior wall emulsion designed to withstand tropical weather, heavy monsoon rain, and UV exposure. Features anti-fungal microbicides for clean exterior walls.",
    specifications: {
      "Brand": "Asian Paints",
      "Type": "Exterior Emulsion",
      "Protection": "All-Weather & Anti-Algal",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 11. Paint - I Max Paint
  {
    id: "i-max-synthetic-enamel",
    name: "I Max Synthetic Enamel Paint",
    slug: "i-max-synthetic-enamel",
    brand: "I Max Paint",
    category: "Paint",
    categoryId: "paint",
    image: "/images/products/paint-emulsion.jpg",
    imageAlt: "I Max Synthetic Enamel Paint",
    shortDescription: "High-gloss protective enamel for wood surfaces, metal grills, and architectural ironwork.",
    description: "I Max high-gloss synthetic enamel paint engineered for wood and metal protection against rust, weather wear, and daily abrasion with a mirror-like sheen.",
    specifications: {
      "Brand": "I Max Paint",
      "Type": "Synthetic Enamel Paint",
      "Usage": "Metal Grills, Doors, Gates & Woodwork",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 12. Power Tools - Bosch
  {
    id: "bosch-angle-grinder",
    name: "Bosch Professional Angle Grinder",
    slug: "bosch-angle-grinder",
    brand: "Bosch",
    brandLogo: "/images/logos/bosch.svg",
    category: "Power Tools",
    categoryId: "power-tools",
    image: "/images/products/angle-grinder.jpg",
    imageAlt: "Bosch Professional Angle Grinder",
    shortDescription: "Heavy-duty electric angle grinder for metal fabrication, rebar cutting, and masonry grinding.",
    description: "Bosch professional corded angle grinder featuring powerful motor output, ergonomic slim barrel grip, and burst-proof wheel guard for site cutting and surface finishing.",
    specifications: {
      "Brand": "Bosch",
      "Type": "Angle Grinder",
      "Usage": "Metal Cutting, Grinding, Weld Dressing",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 13. Power Tools - Makita
  {
    id: "makita-cordless-drill",
    name: "Makita Cordless Driver Drill",
    slug: "makita-cordless-drill",
    brand: "Makita",
    brandLogo: "/images/logos/makita.svg",
    category: "Power Tools",
    categoryId: "power-tools",
    image: "/images/products/cordless-drill.jpg",
    imageAlt: "Makita Cordless Driver Drill",
    shortDescription: "High-torque rechargeable cordless driver drill for steel, wood, and concrete fastening.",
    description: "Makita professional cordless drill engineered with variable speed trigger, keyless chuck, and high capacity lithium-ion battery for construction fastening on site.",
    specifications: {
      "Brand": "Makita",
      "Type": "Cordless Driver Drill",
      "Chuck": "Keyless Ratcheting Chuck",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 14. Power Tools - Ferm
  {
    id: "ferm-marble-cutter",
    name: "Ferm Professional Marble Cutter",
    slug: "ferm-marble-cutter",
    brand: "Ferm",
    category: "Power Tools",
    categoryId: "power-tools",
    image: "/images/products/angle-grinder.jpg",
    imageAlt: "Ferm Marble Cutter",
    shortDescription: "High-precision diamond blade cutter for tiles, marble, granite, and masonry slabs.",
    description: "Ferm professional cutting machine with robust base plate and high-speed motor designed for clean, chip-free wet and dry cuts through ceramic tiles and natural stones.",
    specifications: {
      "Brand": "Ferm",
      "Type": "Marble & Tile Cutter",
      "Usage": "Tiles, Granite, Kadappa Stone Slabs",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 15. Power Tools - Caltex
  {
    id: "caltex-cut-off-machine",
    name: "Caltex Heavy Duty Cut-Off Machine",
    slug: "caltex-cut-off-machine",
    brand: "Caltex",
    category: "Power Tools",
    categoryId: "power-tools",
    image: "/images/products/angle-grinder.jpg",
    imageAlt: "Caltex Cut-Off Machine",
    shortDescription: "Heavy-duty chop saw cut-off tool for rapid cutting of steel pipes, angles, and rebars.",
    description: "Caltex industrial cut-off saw featuring high torque motor and rigid steel base for fast repetitive section cutting of steel pipes, angles, and reinforcement rods.",
    specifications: {
      "Brand": "Caltex",
      "Type": "Metal Chop Saw / Cut-Off Tool",
      "Usage": "Steel Pipes, Channels, L-Angles",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 16. Roofing Sheets - Everest
  {
    id: "everest-fibre-cement-roofing",
    name: "Everest Fibre Cement Roofing Sheets",
    slug: "everest-fibre-cement-roofing",
    brand: "Everest",
    brandLogo: "/images/logos/everest.png",
    category: "Roofing Sheets",
    categoryId: "roofing-sheets",
    image: "/images/products/roofing-sheets.jpg",
    imageAlt: "Everest Fibre Cement Corrugated Roofing Sheets",
    shortDescription: "Fire-resistant, thermally insulating corrugated fibre cement roofing sheets for industrial and rural sheds.",
    description: "Everest corrugated fibre cement roofing sheets formulated for non-corrosive performance, noise reduction during rains, and high structural weather durability.",
    specifications: {
      "Brand": "Everest",
      "Material": "Fibre Cement Composite",
      "Features": "Rust-proof, Thermal & Sound Insulation",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 17. Roofing Sheets - Tata
  {
    id: "tata-shaktee-gc-sheets",
    name: "Tata Shaktee Galvanised Corrugated Sheets",
    slug: "tata-shaktee-gc-sheets",
    brand: "Tata",
    brandLogo: "/images/logos/tata.svg",
    category: "Roofing Sheets",
    categoryId: "roofing-sheets",
    image: "/images/products/roofing-sheets.jpg",
    imageAlt: "Tata Shaktee Galvanised Corrugated Sheets",
    shortDescription: "High-tensile zinc-coated corrugated steel roofing sheets offering corrosion protection.",
    description: "Tata Shaktee GC sheets engineered with uniform zinc coating and high yield strength steel, providing exceptional durability against monsoon rains and corrosion.",
    specifications: {
      "Brand": "Tata",
      "Sub-brand": "Tata Shaktee",
      "Type": "Galvanised Corrugated (GC) Sheet",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 18. Roofing Sheets - JSW
  {
    id: "jsw-colouron-profile-sheets",
    name: "JSW Colouron+ Profile Roofing Sheets",
    slug: "jsw-colouron-profile-sheets",
    brand: "JSW",
    brandLogo: "/images/logos/jsw.png",
    category: "Roofing Sheets",
    categoryId: "roofing-sheets",
    image: "/images/products/roofing-sheets.jpg",
    imageAlt: "JSW Colouron+ Profile Roofing Sheets",
    shortDescription: "Pre-painted colour coated profile steel roofing sheets with high UV and corrosion protection.",
    description: "JSW Colouron+ pre-painted profiled metal roofing sheets with multi-layer organic coating technology for vibrant fade-resistant colors, leak resistance, and long service life.",
    specifications: {
      "Brand": "JSW",
      "Sub-brand": "JSW Colouron+",
      "Type": "Colour Coated Trapezoidal Profile Sheet",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 19. Motor Pumps - CG
  {
    id: "cg-monoblock-pump",
    name: "CG Monoblock Water Pump",
    slug: "cg-monoblock-pump",
    brand: "CG",
    brandLogo: "/images/logos/cg-power.png",
    category: "Motor Pumps",
    categoryId: "motor-pumps",
    image: "/images/products/monoblock-pump.jpg",
    imageAlt: "CG Monoblock Water Pump",
    shortDescription: "Crompton Greaves (CG) high-efficiency centrifugal monoblock pump for domestic and overhead tank supply.",
    description: "CG electric monoblock water pump built with robust cast iron body, copper motor windings, and brass impeller for reliable water delivery to overhead tanks.",
    specifications: {
      "Brand": "CG (Crompton Greaves)",
      "Type": "Centrifugal Monoblock Pump",
      "Motor": "High Efficiency Copper Wound",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 20. Motor Pumps - V-Guard
  {
    id: "v-guard-submersible-pump",
    name: "V-Guard Submersible Motor Pump",
    slug: "v-guard-submersible-pump",
    brand: "V-Guard",
    brandLogo: "/images/logos/v-guard.jpg",
    category: "Motor Pumps",
    categoryId: "motor-pumps",
    image: "/images/products/monoblock-pump.jpg",
    imageAlt: "V-Guard Submersible Motor Pump",
    shortDescription: "Submersible water pump motor for deep borewells and openwell agricultural and household requirements.",
    description: "V-Guard submersible pump engineered for deep well water lifting with energy-efficient electrical design and corrosion-proof stainless steel components.",
    specifications: {
      "Brand": "V-Guard",
      "Type": "Submersible Borewell / Openwell Pump",
      "Application": "Deep Well & Overhead Storage",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 21. Motor Pumps - Laxmi
  {
    id: "laxmi-water-pump",
    name: "Laxmi Self-Priming Regenerative Pump",
    slug: "laxmi-water-pump",
    brand: "Laxmi",
    category: "Motor Pumps",
    categoryId: "motor-pumps",
    image: "/images/products/monoblock-pump.jpg",
    imageAlt: "Laxmi Self-Priming Regenerative Pump",
    shortDescription: "Self-priming domestic water pump suitable for residential water circulation and shallow sumps.",
    description: "Laxmi regenerative water pump designed for quick self-priming, compact installation, and steady pressure delivery in residential water piping.",
    specifications: {
      "Brand": "Laxmi",
      "Type": "Self-Priming Regenerative Pump",
      "Usage": "Domestic Water Supply & Sumps",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 22. Bathware and Fittings - Neycer
  {
    id: "neycer-ceramic-water-closet",
    name: "Neycer Ceramic Floor Mount Water Closet",
    slug: "neycer-ceramic-water-closet",
    brand: "Neycer",
    brandLogo: "/images/logos/neycer.png",
    category: "Bathware and Fittings",
    categoryId: "bathware-fittings",
    image: "/images/products/bathware-basin.jpg",
    imageAlt: "Neycer Ceramic Water Closet",
    shortDescription: "Vitreous china ceramic sanitary closet offering stain-resistant glaze and efficient flushing.",
    description: "Neycer sanitaryware floor mount EWC water closet crafted from vitreous china ceramic with non-porous antimicrobial glaze for effortless bathroom hygiene.",
    specifications: {
      "Brand": "Neycer",
      "Type": "Sanitaryware Water Closet (EWC)",
      "Material": "Vitreous China Glazed Ceramic",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 23. Bathware and Fittings - Johnson Pedder
  {
    id: "johnson-pedder-wash-basin",
    name: "Johnson Pedder Countertop Wash Basin",
    slug: "johnson-pedder-wash-basin",
    brand: "Johnson Pedder",
    brandLogo: "/images/logos/johnson-pedder.png",
    category: "Bathware and Fittings",
    categoryId: "bathware-fittings",
    image: "/images/products/bathware-basin.jpg",
    imageAlt: "Johnson Pedder Wash Basin",
    shortDescription: "Contemporary ceramic wash basin featuring deep bowl ergonomics and smooth glossy finish.",
    description: "Johnson Pedder ceramic wash basin engineered with precision glazing, splash-resistant depth, and clean minimalist lines suited for modern bathroom counters.",
    specifications: {
      "Brand": "Johnson Pedder",
      "Type": "Countertop / Wall-Hung Wash Basin",
      "Material": "High Gloss Ceramic",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 24. Bathware and Fittings - Parryware
  {
    id: "parryware-cp-mixer-tap",
    name: "Parryware Single Lever Bathroom Mixer Tap",
    slug: "parryware-cp-mixer-tap",
    brand: "Parryware",
    category: "Bathware and Fittings",
    categoryId: "bathware-fittings",
    image: "/images/products/bathware-basin.jpg",
    imageAlt: "Parryware Single Lever Bathroom Mixer Tap",
    shortDescription: "Chrome plated brass single lever basin mixer tap with ceramic disc cartridge.",
    description: "Parryware CP bathroom faucet engineered with solid brass body, mirror-shine chrome electroplating, and smooth ceramic disc cartridge for precise temperature and water volume control.",
    specifications: {
      "Brand": "Parryware",
      "Type": "Single Lever Basin Mixer / CP Tap",
      "Finish": "Polished Chrome",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 25. Electrical - Fybros
  {
    id: "fybros-modular-switch-plate",
    name: "Fybros Modular Switch & Socket Plate",
    slug: "fybros-modular-switch-plate",
    brand: "Fybros",
    brandLogo: "/images/logos/fybros.png",
    category: "Electrical",
    categoryId: "electrical",
    image: "/images/products/electrical-switches-wire.jpg",
    imageAlt: "Fybros Modular Switch & Socket Plate",
    shortDescription: "Fire-retardant modular switch grid plate and socket accessories for domestic electrical installations.",
    description: "Fybros modular switch assemblies designed with polycarbonate flame-retardant casing, silver contact points, and smooth silent rocker actuation.",
    specifications: {
      "Brand": "Fybros",
      "Type": "Modular Switch & Socket Assembly",
      "Material": "Polycarbonate Flame Retardant",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 26. Electrical - Kundan
  {
    id: "kundan-copper-house-wire",
    name: "Kundan FR PVC Insulated Copper House Wire",
    slug: "kundan-copper-house-wire",
    brand: "Kundan",
    brandLogo: "/images/logos/kundan.png",
    category: "Electrical",
    categoryId: "electrical",
    image: "/images/products/electrical-switches-wire.jpg",
    imageAlt: "Kundan Copper House Wire Coil",
    shortDescription: "Flame retardant (FR) multi-strand electrolytic copper house wire coils for safe building wiring.",
    description: "Kundan 100% electrolytic annealed copper wires insulated with high oxygen index flame retardant PVC compound for residential and industrial distribution.",
    specifications: {
      "Brand": "Kundan",
      "Type": "FR PVC Insulated Building Wire",
      "Conductor": "Electrolytic Annealed Copper",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 27. Electrical - HiFi
  {
    id: "hifi-modular-gang-box",
    name: "HiFi Modular Enclosures & Gang Box",
    slug: "hifi-modular-gang-box",
    brand: "HiFi",
    category: "Electrical",
    categoryId: "electrical",
    image: "/images/products/electrical-switches-wire.jpg",
    imageAlt: "HiFi Modular Enclosures",
    shortDescription: "Heavy-duty concealed and surface electrical gang boxes and distribution enclosures.",
    description: "HiFi electrical enclosures manufactured from impact-resistant polymers and zinc-passivated metal for safe conduit connection and secure switch mounting.",
    specifications: {
      "Brand": "HiFi",
      "Type": "Electrical Enclosures & Gang Box",
      "Usage": "Concealed Wall Conduit & Modular Plates",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 28. Electrical - Eveready
  {
    id: "eveready-led-bulbs",
    name: "Eveready Cool Day Light LED Bulbs",
    slug: "eveready-led-bulbs",
    brand: "Eveready",
    brandLogo: "/images/logos/eveready.png",
    category: "Electrical",
    categoryId: "electrical",
    image: "/images/products/electrical-switches-wire.jpg",
    imageAlt: "Eveready Cool Day Light LED Bulb",
    shortDescription: "Energy-efficient LED lighting lamps offering high lumens output and surge protection.",
    description: "Eveready B22 base LED lighting bulbs providing flicker-free bright daylight illumination, low power consumption, and long operational lifespan.",
    specifications: {
      "Brand": "Eveready",
      "Type": "Energy-Efficient LED Bulb",
      "Base": "B22 Standard Base",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 29. Electrical - Sturlite
  {
    id: "sturlite-slim-led-panel",
    name: "Sturlite Slim Recessed LED Panel Light",
    slug: "sturlite-slim-led-panel",
    brand: "Sturlite",
    category: "Electrical",
    categoryId: "electrical",
    image: "/images/products/electrical-switches-wire.jpg",
    imageAlt: "Sturlite Slim LED Panel Light",
    shortDescription: "Ultra-slim recessed architectural ceiling LED panel for uniform glare-free room lighting.",
    description: "Sturlite slim LED downlight panel engineered with aluminium heat sink and diffused acrylic light guide plate for modern ceiling illumination in residences and shops.",
    specifications: {
      "Brand": "Sturlite",
      "Type": "Recessed Slim LED Ceiling Panel",
      "Light": "Cool White Glare-Free Diffused",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 30. Hardware - SS Butt Hinges & Tower Bolts
  {
    id: "ss-butt-hinges-tower-bolts",
    name: "Stainless Steel Door Butt Hinges & Tower Bolts",
    slug: "ss-butt-hinges-tower-bolts",
    brand: "Unbranded / Generic",
    category: "Hardware",
    categoryId: "hardware",
    image: "/images/products/hardware-hinges-fasteners.jpg",
    imageAlt: "Stainless Steel Door Butt Hinges and Tower Bolts",
    shortDescription: "Corrosion-resistant stainless steel butt hinges, tower bolt latches, and architectural fittings.",
    description: "Heavy-gauge grade 304/202 stainless steel butt hinges and solid tower bolt latches designed for smooth door movement, anti-rust longevity, and secure locking.",
    specifications: {
      "Product Type": "Door Butt Hinges & Tower Bolts",
      "Material": "Stainless Steel (SS)",
      "Usage": "Main Doors, Windows, Cabinets",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 31. Hardware - Screws & Fasteners
  {
    id: "screws-fasteners-anchors",
    name: "High Tensile Screws, Fasteners & Anchor Bolts",
    slug: "screws-fasteners-anchors",
    brand: "Unbranded / Generic",
    category: "Hardware",
    categoryId: "hardware",
    image: "/images/products/hardware-hinges-fasteners.jpg",
    imageAlt: "High Tensile Screws, Fasteners and Anchor Bolts",
    shortDescription: "Zinc-plated self-drilling screws, wood screws, wall plugs, and masonry anchor bolts.",
    description: "Comprehensive hardware fasteners assortment including self-drilling metal screws, drywall screws, hex bolts, washers, and heavy-duty expansion wedge anchors.",
    specifications: {
      "Product Type": "Screws, Fasteners & Expansion Anchors",
      "Finish": "Zinc Plated Rust Resistant",
      "Usage": "Timber, Masonry & Steel Fixing",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 32. AAC Blocks - Cubecrete
  {
    id: "cubecrete-aac-blocks",
    name: "Cubecrete Lightweight AAC Blocks",
    slug: "cubecrete-aac-blocks",
    brand: "Cubecrete",
    brandLogo: "/images/logos/cubecrete.png",
    category: "AAC Blocks",
    categoryId: "aac-blocks",
    image: "/images/products/aac-blocks.jpg",
    imageAlt: "Cubecrete Lightweight Autoclaved Aerated Concrete Blocks",
    shortDescription: "High thermal-insulation autoclaved aerated concrete masonry blocks for fast construction.",
    description: "Cubecrete precision-cut autoclaved aerated concrete (AAC) blocks engineered for lightweight structural masonry, high fire safety, thermal insulation, and low mortar consumption.",
    specifications: {
      "Brand": "Cubecrete",
      "Product": "Autoclaved Aerated Concrete (AAC) Block",
      "Benefits": "Lightweight, Thermal Insulation, Fire Resistant",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 33. Kadappa Stone
  {
    id: "natural-kadappa-black-stone",
    name: "Natural Kadappa Black Limestone Slabs",
    slug: "natural-kadappa-black-stone",
    brand: "Unbranded / Generic",
    category: "Kadappa Stone",
    categoryId: "kadappa-stone",
    image: "/images/products/kadappa-stone.jpg",
    imageAlt: "Natural Kadappa Black Limestone Slabs",
    shortDescription: "Calibrated and rough natural black Kadappa stone slabs for flooring, steps, and kitchen counters.",
    description: "Natural black Kadappa limestone slabs quarried and cut to thickness. Features uniform charcoal black color, non-slip texture, and durability for flooring, stair risers, base skirting, and utility counters.",
    specifications: {
      "Product": "Natural Kadappa Limestone Slabs",
      "Color": "Charcoal Black",
      "Usage": "Flooring, Patios, Counter Slabs, Steps",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 34. Fencing - Tata
  {
    id: "tata-wiron-chainlink-mesh",
    name: "Tata Wiron Galvanised Chainlink Fence Mesh",
    slug: "tata-wiron-chainlink-mesh",
    brand: "Tata",
    brandLogo: "/images/logos/tata.svg",
    category: "Fencing",
    categoryId: "fencing",
    image: "/images/products/fencing-chainlink.jpg",
    imageAlt: "Tata Wiron Galvanised Chainlink Mesh",
    shortDescription: "Heavy-duty galvanised diamond chain link fencing mesh for compound security and boundary protection.",
    description: "Tata Wiron zinc-coated chain link mesh fabricated with uniform diamond apertures and high tensile wire core to withstand weather corrosion and external impact along property perimeters.",
    specifications: {
      "Brand": "Tata",
      "Sub-brand": "Tata Wiron",
      "Type": "Galvanised Chain Link Fence Mesh",
      "Usage": "Boundary Wall, Farm & Industrial Fencing",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 35. Fencing - Other manufacturers
  {
    id: "heavy-galvanised-barbed-wire",
    name: "Heavy Galvanised Barbed Wire Fencing Roll",
    slug: "heavy-galvanised-barbed-wire",
    brand: "Other manufacturers",
    category: "Fencing",
    categoryId: "fencing",
    image: "/images/products/fencing-chainlink.jpg",
    imageAlt: "Heavy Galvanised Barbed Wire Fencing Roll",
    shortDescription: "High-tensile 2-ply 4-point barbed steel wire rolls for farm enclosures and security perimeters.",
    description: "Heavy-duty galvanised 4-point barbed steel wire coils manufactured by certified regional wire manufacturers for perimeter intrusion prevention and farm perimeter demarcation.",
    specifications: {
      "Brand": "Other manufacturers",
      "Type": "Galvanised Barbed Wire Roll",
      "Feature": "4-Point Sharp Barbs, Zinc Coated Core",
      "Availability": "In Store - Pasupathi Kovil"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function seedDatabase(): Promise<void> {
  const db = getDatabase();

  // 1. Idempotent Superadmin Seeding
  const usersCollection = db.collection<User>("users");
  await usersCollection.createIndex({ email: 1 }, { unique: true });

  const existingAdmin = await usersCollection.findOne({
    email: config.superadminEmail.toLowerCase()
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(config.superadminPassword, 10);
    await usersCollection.insertOne({
      email: config.superadminEmail.toLowerCase(),
      passwordHash,
      role: "superadmin",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`[Seed] Superadmin account initialized (${config.superadminEmail})`);
  }

  // 2. Product Catalogue Seeding & Migration to 13 Categories
  const productsCollection = db.collection<ProductDocument>("products");
  await productsCollection.createIndex({ slug: 1 }, { unique: true });
  await productsCollection.createIndex({ id: 1 }, { unique: true });

  // Check if legacy products exist (e.g., category "Plumbing Pipes and Fittings" or "Borewell Pipes")
  const hasLegacyProducts = await productsCollection.findOne({
    category: { $in: ["Plumbing Pipes and Fittings", "Borewell Pipes", "Water Tanks", "Bathroom and Plumbing Taps"] }
  });

  const count = await productsCollection.countDocuments();

  if (count === 0 || hasLegacyProducts) {
    if (hasLegacyProducts) {
      console.log("[Seed] Migrating from legacy categories to official 13-category catalogue...");
      await productsCollection.deleteMany({
        category: { $in: ["Plumbing Pipes and Fittings", "Borewell Pipes", "Water Tanks", "Bathroom and Plumbing Taps", "Steel and Reinforcement Materials", "Other Building Materials"] }
      });
    }

    // Insert or upsert authentic products
    for (const prod of INITIAL_PRODUCTS) {
      await productsCollection.updateOne(
        { slug: prod.slug },
        { $set: prod },
        { upsert: true }
      );
    }
    console.log(`[Seed] Authentic 13-category catalogue initialized with ${INITIAL_PRODUCTS.length} products.`);
  }
}
