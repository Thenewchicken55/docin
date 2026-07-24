import { createFigureReference, renderFigureReference } from '../../lib/refs/figureReferences';

type FigureReferenceToolbarProps = {
  onInsertReference: (value: string) => void;
};

export function FigureReferenceToolbar({ onInsertReference }: FigureReferenceToolbarProps) {
  const handleInsert = () => {
    const reference = createFigureReference(1, 'Figure 1');
    onInsertReference(renderFigureReference(reference));
  };

  return (
    <div className="toolbar-card">
      <button type="button" onClick={handleInsert}>
        Insert figure reference
      </button>
    </div>
  );
}
