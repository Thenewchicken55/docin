# Implementation Plan for Docin

This plan breaks the work into small, independently commit-able steps. The work starts after the README and this plan are approved.

## Step 1 — Create the initial project scaffold

- Goal: Set up the base app structure and tooling.
- Files changed:
  - package.json
  - pnpm-lock.yaml (generated)
  - vite.config.ts
  - tsconfig.json
  - tsconfig.node.json
  - index.html
  - src/main.tsx
  - src/App.tsx
  - src/styles/globals.css
  - src-tauri/Cargo.toml
  - src-tauri/tauri.conf.json
- Acceptance criteria:
  - The app boots locally in development mode.
  - The Tauri app shell starts without runtime errors.
  - The basic UI renders a simple welcome screen.
- Suggested git commit message:
  - feat: scaffold Docin app shell

## Step 2 — Add a basic workspace model and file explorer

- Goal: Represent a documentation workspace and list Markdown files from disk.
- Files changed:
  - src/types/workspace.ts
  - src/lib/files/workspace.ts
  - src/store/workspaceStore.ts
  - src/components/explorer/WorkspaceExplorer.tsx
  - src/components/sidebar/Sidebar.tsx
- Acceptance criteria:
  - The app can open a local folder containing Markdown files.
  - The explorer shows the files and folders inside the workspace.
  - Selecting a file updates the active document state.
- Suggested git commit message:
  - feat: add workspace model and file explorer

## Step 3 — Create the Markdown editor shell

- Goal: Add a usable editor surface with live preview support.
- Files changed:
  - src/components/editor/MarkdownEditor.tsx
  - src/components/preview/MarkdownPreview.tsx
  - src/features/markdown/markdownService.ts
  - src/lib/markdown/parser.ts
- Acceptance criteria:
  - Users can type Markdown in the editor.
  - The preview pane reflects the current content.
  - The editor and preview stay synchronized.
- Suggested git commit message:
  - feat: add markdown editor and preview

## Step 4 — Add heading detection and outline support

- Goal: Parse headings from the active document and expose them in an outline.
- Files changed:
  - src/lib/markdown/headings.ts
  - src/features/markdown/headingService.ts
  - src/components/sidebar/OutlinePanel.tsx
- Acceptance criteria:
  - Heading levels are detected from Markdown content.
  - The outline shows the headings in order.
  - Clicking a heading focuses the corresponding section in the editor.
- Suggested git commit message:
  - feat: add heading detection and outline

## Step 5 — Add reference management for headings

- Goal: Support inserting and updating heading references.
- Files changed:
  - src/lib/refs/headingRefs.ts
  - src/features/references/headingReferenceService.ts
  - src/components/toolbar/ReferenceToolbar.tsx
- Acceptance criteria:
  - Users can insert a heading reference into the document.
  - References are stored and rendered as linkable references.
  - Renaming a heading updates references that point to it.
- Suggested git commit message:
  - feat: add heading reference management

## Step 6 — Add image insertion and caption support

- Goal: Make image insertion simple and add automatic captions.
- Files changed:
  - src/features/images/imageService.ts
  - src/lib/markdown/images.ts
  - src/components/toolbar/ImageToolbar.tsx
- Acceptance criteria:
  - Users can insert an image into the document.
  - Captions are added automatically when an image is inserted.
  - Figure numbering is generated from image entries.
- Suggested git commit message:
  - feat: add image insertion and captions

## Step 7 — Add figure reference support

- Goal: Enable figure references that update when figures are renamed.
- Files changed:
  - src/lib/refs/figureRefs.ts
  - src/features/references/figureReferenceService.ts
  - src/components/toolbar/FigureReferenceToolbar.tsx
- Acceptance criteria:
  - Users can insert a figure reference into the document.
  - The figure reference resolves to the correct numbered figure.
  - Renaming a figure updates references automatically.
- Suggested git commit message:
  - feat: add figure reference management

## Step 8 — Add common authoring helpers

- Goal: Provide quick insertion tools for common Markdown constructs.
- Files changed:
  - src/components/toolbar/InsertToolbar.tsx
  - src/features/markdown/snippets.ts
  - src/components/editor/CommandPalette.tsx
- Acceptance criteria:
  - Users can insert tables, code blocks, callouts, checklists, and links from the UI.
  - Inserted content follows a consistent Markdown format.
  - The experience feels faster than writing raw Markdown manually.
- Suggested git commit message:
  - feat: add markdown authoring helpers

## Step 9 — Add multi-file document composition

- Goal: Allow multiple Markdown files to be composed into one continuous documentation view.
- Files changed:
  - src/features/workspace/compositionService.ts
  - src/components/preview/CompositePreview.tsx
  - src/components/sidebar/CompositionPanel.tsx
- Acceptance criteria:
  - A group of selected Markdown files can be rendered as one document.
  - The composed preview preserves heading and reference structure.
  - The user can choose which files participate in the composition.
- Suggested git commit message:
  - feat: add multi-file document composition

## Step 10 — Add tests and polish the first release

- Goal: Stabilize the MVP with coverage and UX refinements.
- Files changed:
  - tests/unit/\*
  - tests/integration/\*
  - src/components/editor/EditorToolbar.tsx
  - src/styles/themes.css
- Acceptance criteria:
  - Core parser and reference logic are covered by tests.
  - The app can be launched and used for basic documentation authoring.
  - Obvious UX rough edges are cleaned up.
- Suggested git commit message:
  - chore: add tests and polish MVP
