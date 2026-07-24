import { createImageEntry, renderImageEntry } from '../../lib/images/imageSupport';

type ImageToolbarProps = {
  onInsertImage: (value: string) => void;
};

export function ImageToolbar({ onInsertImage }: ImageToolbarProps) {
  const handleInsert = () => {
    const image = createImageEntry('/assets/example.png', 'System architecture');
    onInsertImage(renderImageEntry(image));
  };

  return (
    <div className="toolbar-card">
      <button type="button" onClick={handleInsert}>
        Insert figure
      </button>
    </div>
  );
}
