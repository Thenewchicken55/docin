export type ImageEntry = {
  src: string;
  alt: string;
  caption: string;
  figureNumber: number;
};

let nextFigureNumber = 1;

export function createImageEntry(src: string, alt: string): ImageEntry {
  const entry: ImageEntry = {
    src,
    alt,
    caption: `Figure ${nextFigureNumber}: ${alt}`,
    figureNumber: nextFigureNumber
  };

  nextFigureNumber += 1;
  return entry;
}

export function renderImageEntry(entry: ImageEntry): string {
  return `![${entry.alt}](${entry.src})\n\n*${entry.caption}*`;
}
