# Docin

Docin is a dedicated Markdown documentation IDE for building structured, maintainable software docs without hand-managing Markdown complexity.

## Vision

Most documentation tools either feel like general note apps or publishing frameworks with weak authoring experiences. Docin fills the gap by combining:

- a developer-friendly Markdown editor,
- project-level documentation organization,
- automatic heading and figure reference management,
- visual authoring helpers for common documentation elements,
- and a local-first workflow that fits software teams.

The first version focuses on authoring. Publishing and export come later.

## Problem Space and Gap

### What existing tools do well

- Obsidian: excellent local-note workflow, backlinks, and a pleasant editor experience.
- VS Code Markdown editing: strong code editing ergonomics and extension ecosystem.
- Docusaurus: very strong static-site publishing for technical docs.
- MkDocs: simple, fast, and widely adopted for static documentation sites.
- GitBook: polished documentation authoring and publishing experience for teams.

### What is missing

None of these tools fully combine all of the following in one focused experience:

- a documentation-first IDE rather than a generic notes product,
- multi-file project awareness for a single documentation workspace,
- automatic numbering and reference management for headings and figures,
- easy insertion of images, captions, tables, code blocks, callouts, and diagrams,
- and a simple local-first workflow that developers can use without custom Markdown plumbing.

Docin is designed to be the missing middle ground: structured, intelligent Markdown authoring for documentation teams.

## Proposed Product Name Options

- Docin
- DocForge
- MarkFlow
- DocStudio
- WriteDocs
- DocCanvas
- MarkPath
- DocCraft
- DocPilot
- Docside

### Recommendation

Use Docin.

It is short, memorable, clearly tied to documentation, and leaves room for future expansion into publishing and collaboration.

## MVP Scope

### Must-have for v1

- Markdown editor with live preview
- Project-based workspace with multiple Markdown files
- Ability to view multiple Markdown files as one continuous document
- Insert and manage images
- Automatic figure captions and numbering
- Automatic heading detection
- Easy insertion of heading references and figure references
- Auto-update references when headings or figures are renamed
- Common authoring helpers for:
  - links
  - tables
  - code blocks
  - callouts
  - checklists
  - diagrams placeholders
  - references
- Local file system access and basic save/open behavior

### Later features

- publishing and export workflows
- full-site preview
- collaborative editing
- version history and Git-based review flows
- richer diagrams and embedded assets
- templates and documentation themes
- AI-assisted drafting and content suggestions

## Recommended Tech Stack

### Recommended primary stack

- Frontend: React + TypeScript + Vite
- Desktop runtime: Tauri
- Editor: CodeMirror 6 or Monaco-based editor surface
- Markdown processing: unified + remark + rehype
- State management: Zustand or Redux Toolkit
- Styling: Tailwind CSS
- Testing: Vitest + Playwright
- Data persistence: local filesystem, JSON workspace metadata

### Why this stack

Tauri is the best fit for the first version because it provides:

- local-first desktop behavior,
- straightforward filesystem access,
- easy integration with Git and local docs folders,
- lower overhead than Electron,
- and a path to future export/publishing features without forcing a web-first architecture.

### Why not a pure web app first

A web app would be easier to deploy, but it would make local file access and project-oriented editing less natural. A desktop-first local app makes the documentation workspace feel more native and trustworthy for authors.

### Why not Electron first

Electron works, but it is heavier and less efficient for a focused docs tool. Tauri is simpler and more modern for this use case.

## Proposed Project Structure

```text
src/
  app/
    App.tsx
    routes/
  components/
    editor/
    preview/
    explorer/
    sidebar/
    toolbar/
  features/
    workspace/
    markdown/
    references/
    images/
    export/
  lib/
    markdown/
    parser/
    refs/
    files/
    storage/
  store/
    workspaceStore.ts
    documentStore.ts
  types/
    workspace.ts
    document.ts
    reference.ts
  styles/
    globals.css
    themes.css

src-tauri/
  src/
    main.rs
    lib.rs
  Cargo.toml
  tauri.conf.json

tests/
  unit/
  integration/
  fixtures/

docs/
  architecture.md
  roadmap.md

assets/
  icons/
  images/
```

## Development Setup (Draft)

### Prerequisites

- Node.js 20 LTS
- pnpm
- Rust stable toolchain

### Planned commands

```bash
pnpm install
pnpm tauri dev
```

## Roadmap

### Phase 1 — Authoring MVP

- project workspace and file explorer
- editor and live preview
- headings and reference tracking
- image insertion and captions
- basic tests and local persistence

### Phase 2 — Documentation Workflow

- multi-file document composition
- improved navigation and outline view
- richer insertion helpers
- templates and snippets

### Phase 3 — Publishing

- export to static site or Markdown bundle
- preview generation
- Git integration and publishing hooks

## Notes

This repository is currently in planning mode. The implementation work will begin after this README and the implementation plan are approved.
