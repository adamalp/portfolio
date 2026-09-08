/**
 * Apartment photos shown under the hero. Files live in public/photos/.
 * Order matters: the first is the lead (largest) tile.
 */
export const photos: { src: string; alt: string; position?: string }[] = [
  { src: "/photos/living-room.jpg", alt: "Living room: cream modular sectional with teal pillows, round orange leather ottoman, orange accent chair, wall-mounted TV with speakers and turntable, arc floor lamp, monstera" },
  { src: "/photos/living-room-2.jpg", alt: "Living room from the window side: sectional and ottoman on the blue rug, orange chair, wooden side table, narrow shelving, monstera and bird of paradise, dining area beyond" },
  { src: "/photos/dining.jpg", alt: "Dining area: dark walnut extendable table with green chairs on a beige rug, entryway console with lamp, kitchen beyond" },
  { src: "/photos/bedroom.jpg", alt: "Bedroom: grey upholstered bed, white fluffy rug, side tables with lamps, light-wood dresser with wall-mounted TV" },
  { src: "/photos/bedroom-entry.jpg", alt: "Bedroom from the entry: TV console, narrow bookshelf, round marble kitchenette table with blue chairs, bed and rug", position: "center 70%" },
];
