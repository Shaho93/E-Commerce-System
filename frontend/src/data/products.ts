// Automatisch erzeugt: identisch mit backend/src/main/resources/db/migration/V2__seed_products.sql
import type { Product } from "../api/types";

export const seedProducts: Product[] = [
  {
    "id": 1,
    "slug": "espresso-classico",
    "name": "Espresso Classico",
    "category": "Kaffee",
    "shortDescription": "Kräftiger Espresso mit Noten von Zartbitterschokolade und Haselnuss.",
    "description": "Unsere Hausmischung aus 70 % Arabica und 30 % Robusta, langsam im Trommelröster geröstet. Ideal für Siebträger und Vollautomat. 250 g ganze Bohnen.",
    "priceCents": 890,
    "stock": 40,
    "emoji": "☕",
    "color": "#6b3e26"
  },
  {
    "id": 2,
    "slug": "cafe-creme-mild",
    "name": "Café Crème Mild",
    "category": "Kaffee",
    "shortDescription": "Sanfter, ausgewogener Kaffee für jeden Tag.",
    "description": "Helle Röstung mit wenig Säure und einem weichen Körper. Passt zu Filter, French Press und Vollautomat. 250 g ganze Bohnen.",
    "priceCents": 790,
    "stock": 55,
    "emoji": "☕",
    "color": "#a0673f"
  },
  {
    "id": 3,
    "slug": "aethiopien-yirgacheffe",
    "name": "Äthiopien Yirgacheffe",
    "category": "Kaffee",
    "shortDescription": "Single Origin mit floralen Noten und Zitrus.",
    "description": "Gewaschener Arabica aus der Region Yirgacheffe, angebaut auf 1.900 m Höhe. Helle Röstung, perfekt für den Handfilter. 250 g ganze Bohnen.",
    "priceCents": 1190,
    "stock": 18,
    "emoji": "☕",
    "color": "#c08552"
  },
  {
    "id": 4,
    "slug": "kolumbien-huila",
    "name": "Kolumbien Huila",
    "category": "Kaffee",
    "shortDescription": "Karamell, rote Äpfel und eine feine Süße.",
    "description": "Arabica aus kleinbäuerlichem Anbau in Huila. Mittlere Röstung, vielseitig für Filter und Espresso. 250 g ganze Bohnen.",
    "priceCents": 1090,
    "stock": 25,
    "emoji": "☕",
    "color": "#8c5a3c"
  },
  {
    "id": 5,
    "slug": "entkoffeiniert-swiss-water",
    "name": "Entkoffeiniert Swiss Water",
    "category": "Kaffee",
    "shortDescription": "Voller Geschmack, ohne Koffein, schonend entkoffeiniert.",
    "description": "Mit dem chemiefreien Swiss-Water-Verfahren entkoffeiniert. Schokoladig und rund, auch spät am Abend. 250 g ganze Bohnen.",
    "priceCents": 950,
    "stock": 30,
    "emoji": "☕",
    "color": "#7a5230"
  },
  {
    "id": 6,
    "slug": "cold-brew-blend",
    "name": "Cold Brew Blend",
    "category": "Kaffee",
    "shortDescription": "Grob gemahlen für kalt aufgegossenen Kaffee.",
    "description": "Eine Mischung, die kalt extrahiert besonders süß und mild schmeckt. Bereits grob gemahlen, einfach mit Wasser ansetzen. 250 g.",
    "priceCents": 990,
    "stock": 22,
    "emoji": "🧊",
    "color": "#4f6d7a"
  },
  {
    "id": 7,
    "slug": "earl-grey-bio",
    "name": "Earl Grey Bio",
    "category": "Tee",
    "shortDescription": "Schwarzer Tee mit Bergamotte aus kontrolliert biologischem Anbau.",
    "description": "Kräftiger Ceylon-Schwarztee, aromatisiert mit natürlichem Bergamotteöl. 100 g loser Tee.",
    "priceCents": 650,
    "stock": 35,
    "emoji": "🫖",
    "color": "#3d5a40"
  },
  {
    "id": 8,
    "slug": "sencha-japan",
    "name": "Grüner Tee Sencha",
    "category": "Tee",
    "shortDescription": "Frischer, grasiger Grüntee aus Japan.",
    "description": "Gedämpfter Sencha aus der Präfektur Shizuoka. Mit 70–80 °C heißem Wasser aufgießen. 100 g loser Tee.",
    "priceCents": 720,
    "stock": 28,
    "emoji": "🍵",
    "color": "#6a8d4f"
  },
  {
    "id": 9,
    "slug": "kraeutertee-sommerwiese",
    "name": "Kräutertee Sommerwiese",
    "category": "Tee",
    "shortDescription": "Pfefferminze, Zitronenmelisse und Kamille.",
    "description": "Koffeinfreie Kräutermischung für den Abend. 80 g lose Kräuter.",
    "priceCents": 590,
    "stock": 40,
    "emoji": "🌿",
    "color": "#7fa36b"
  },
  {
    "id": 10,
    "slug": "handfilter-keramik",
    "name": "Handfilter aus Keramik",
    "category": "Zubehör",
    "shortDescription": "Für 1–2 Tassen, passend für Filtergröße 2.",
    "description": "Handgefertigter Porzellan-Handfilter, der die Wärme hält und eine gleichmäßige Extraktion ermöglicht. Spülmaschinenfest.",
    "priceCents": 2490,
    "stock": 12,
    "emoji": "🫗",
    "color": "#d9cbb7"
  },
  {
    "id": 11,
    "slug": "milchkaennchen",
    "name": "Milchkännchen 350 ml",
    "category": "Zubehör",
    "shortDescription": "Edelstahl-Kännchen für Milchschaum und Latte Art.",
    "description": "Aus gebürstetem Edelstahl mit präziser Ausgießtülle. Ideal für Cappuccino und Flat White.",
    "priceCents": 1990,
    "stock": 20,
    "emoji": "🥛",
    "color": "#9aa5ad"
  },
  {
    "id": 12,
    "slug": "handmuehle-pro",
    "name": "Handmühle Pro",
    "category": "Zubehör",
    "shortDescription": "Kegelmahlwerk aus Edelstahl, 40 Mahlstufen.",
    "description": "Präzise Handmühle für Espresso bis French Press. Wenige Stück auf Lager.",
    "priceCents": 4900,
    "stock": 3,
    "emoji": "⚙️",
    "color": "#55606a"
  },
  {
    "id": 13,
    "slug": "geschenkset-entdecker",
    "name": "Geschenkset Entdecker",
    "category": "Zubehör",
    "shortDescription": "Drei Single Origins à 100 g in einer schönen Box.",
    "description": "Äthiopien, Kolumbien und Brasilien zum Probieren, verpackt in einer Geschenkbox mit Verkostungskarte.",
    "priceCents": 3490,
    "stock": 15,
    "emoji": "🎁",
    "color": "#b5654a"
  }
];
