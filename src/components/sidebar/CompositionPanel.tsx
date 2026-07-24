import type { DocumentFile } from '../../types/workspace';

type CompositionPanelProps = {
  files: DocumentFile[];
  selectedPaths: string[];
  onTogglePath: (path: string) => void;
};

export function CompositionPanel({ files, selectedPaths, onTogglePath }: CompositionPanelProps) {
  return (
    <section className="outline-card">
      <h3>Composition</h3>
      <ul>
        {files.map(file => {
          const isSelected = selectedPaths.includes(file.path);
          return (
            <li key={file.path}>
              <label>
                <input type="checkbox" checked={isSelected} onChange={() => onTogglePath(file.path)} />
                {file.name}
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
