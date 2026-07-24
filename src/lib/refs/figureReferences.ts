export type FigureReference = {
  id: string;
  figureNumber: number;
  label: string;
};

export function createFigureReference(figureNumber: number, label: string): FigureReference {
  return {
    id: `figure-${figureNumber}-${Math.random().toString(36).slice(2, 8)}`,
    figureNumber,
    label
  };
}

export function renderFigureReference(reference: FigureReference): string {
  return `[${reference.label}](#figure-${reference.figureNumber})`;
}
