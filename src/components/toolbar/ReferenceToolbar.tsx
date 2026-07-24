import { createHeadingReference, renderHeadingReference } from '../../lib/refs/headingReferences';

type ReferenceToolbarProps = {
  onInsertReference: (value: string) => void;
};

export function ReferenceToolbar({ onInsertReference }: ReferenceToolbarProps) {
  const handleInsert = () => {
    const reference = createHeadingReference('intro', 'Introduction');
    onInsertReference(renderHeadingReference(reference));
  };

  return (
    <div className="toolbar-card">
      <button type="button" onClick={handleInsert}>
        Insert heading reference
      </button>
    </div>
  );
}
