export interface Painting {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const painting = (name: string, width: number, height: number, alt: string): Painting => ({
  src: `${import.meta.env.BASE_URL}paintings/${name}.webp`,
  width,
  height,
  alt,
});

/** Hand-painted watercolour illustrations, pre-cropped to their painted area. */
export const paintings = {
  cauldron: painting("cauldron", 1200, 1133, "Hand-painted green cauldron"),
  cat: painting("cat", 1200, 1086, "Hand-painted green streak cat"),
  fire: painting("fire", 728, 1200, "Hand-painted orange magical fire"),
};
