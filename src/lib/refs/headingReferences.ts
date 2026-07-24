export type HeadingReference = {
  id: string;
  targetSlug: string;
  label: string;
};

export function createHeadingReference(targetSlug: string, label: string): HeadingReference {
  return {
    id: `${targetSlug}-${Math.random().toString(36).slice(2, 8)}`,
    targetSlug,
    label
  };
}

export function renderHeadingReference(reference: HeadingReference): string {
  return `[${reference.label}](#${reference.targetSlug})`;
}
