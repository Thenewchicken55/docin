import { useState } from 'react';
import { insertSnippet } from '../../features/markdown/snippets';
import {
  createHeadingReference,
  renderHeadingReference,
} from '../../lib/refs/headingReferences';
import {
  createFigureReference,
  renderFigureReference,
} from '../../lib/refs/figureReferences';
import { createImageEntry, renderImageEntry } from '../../lib/images/imageSupport';

type ToolbarSection = {
  id: string;
  title: string;
  actions: {
    label: string;
    onClick: () => string;
  }[];
};

type CollapsibleToolbarProps = {
  onInsert: (value: string) => void;
};

export function CollapsibleToolbar({ onInsert }: CollapsibleToolbarProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const sections: ToolbarSection[] = [
    {
      id: 'insert',
      title: 'Insert',
      actions: [
        {
          label: 'Table',
          onClick: () => insertSnippet('table'),
        },
        {
          label: 'Code Block',
          onClick: () => insertSnippet('code'),
        },
        {
          label: 'Callout',
          onClick: () => insertSnippet('callout'),
        },
        {
          label: 'Checklist',
          onClick: () => insertSnippet('checklist'),
        },
        {
          label: 'Link',
          onClick: () => insertSnippet('link'),
        },
        {
          label: 'Diagram',
          onClick: () => insertSnippet('diagram'),
        },
      ],
    },
    {
      id: 'references',
      title: 'References',
      actions: [
        {
          label: 'Heading Reference',
          onClick: () => {
            const ref = createHeadingReference('intro', 'Introduction');
            return renderHeadingReference(ref);
          },
        },
        {
          label: 'Figure Reference',
          onClick: () => {
            const ref = createFigureReference(1, 'Figure 1');
            return renderFigureReference(ref);
          },
        },
      ],
    },
    {
      id: 'images',
      title: 'Images',
      actions: [
        {
          label: 'Insert Figure',
          onClick: () => {
            const image = createImageEntry('/assets/example.png', 'System architecture');
            return renderImageEntry(image);
          },
        },
      ],
    },
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  const handleActionClick = (onClick: () => string) => {
    const value = onClick();
    onInsert(value);
    setOpenSection(null);
  };

  return (
    <div className="collapsible-toolbar">
      {sections.map(section => (
        <div key={section.id} className="toolbar-section">
          <button
            className="section-header"
            onClick={() => toggleSection(section.id)}
            aria-expanded={openSection === section.id}
          >
            <span>{section.title}</span>
            <span className="chevron">{openSection === section.id ? '▼' : '▶'}</span>
          </button>
          {openSection === section.id && (
            <div className="section-actions">
              {section.actions.map((action, index) => (
                <button
                  key={index}
                  className="action-button"
                  onClick={() => handleActionClick(action.onClick)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
