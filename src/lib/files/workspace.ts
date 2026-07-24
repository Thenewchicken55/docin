import type { DocumentFile } from '../../types/workspace';

export const starterFiles: DocumentFile[] = [
  {
    path: 'docs/intro.md',
    name: 'intro.md',
    content: '# Welcome to Docin\n\nThis is your first documentation workspace.'
  },
  {
    path: 'docs/architecture.md',
    name: 'architecture.md',
    content: '# Architecture\n\nDocument structure will appear here.'
  }
];

export function getSelectedFile(files: DocumentFile[], selectedPath: string | null) {
  return files.find(file => file.path === selectedPath) ?? files[0] ?? null;
}
