export type CompositionSelection = {
  selectedPaths: string[];
};

export function buildCompositionContent(parts: string[]): string {
  return parts.filter(Boolean).join('\n\n');
}
