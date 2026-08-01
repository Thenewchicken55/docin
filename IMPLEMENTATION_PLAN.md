# Docin - Detailed Implementation Plan

> **Status**: Planning Phase
> **Goal**: Transform Docin from a basic markdown editor into a full-featured documentation IDE with native app installation, CI/CD, and comprehensive testing.

---

## 1. Current State Analysis

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite 5
- **Desktop**: Tauri 2
- **Icons**: lucide-react
- **Testing**: Vitest (17 tests passing)
- **State**: React useState/useEffect (no global state manager)

### Current Components
- `MarkdownEditor` — textarea + basic preview (no syntax highlighting, no markdown rendering)
- `SidebarTabs` — file explorer + outline panel
- `CollapsibleToolbar` — insert snippets (table, code, callout, etc.)
- `CompositionModal` — multi-file composition
- `LintPanel` — reference linting
- `MobileBlocker` — mobile screen blocker

### Key Issues
1. **Editor**: Uses plain `<textarea>`, no syntax highlighting, no markdown rendering in preview
2. **State**: All state in App.tsx, no persistence, no global store
3. **UI**: No command palette, no status bar, no keyboard shortcuts
4. **No CI/CD**: No GitHub Actions workflows
5. **Limited tests**: Only unit tests for parsers, no component/integration tests
6. **README**: Missing native app installation instructions

---

## 2. NPM Packages Installed

### Production Dependencies (already installed)
| Package | Purpose |
|---------|---------|
| `zustand` | Global state management with persistence |
| `react-syntax-highlighter` | Syntax highlighting for code blocks |
| `cmdk` | Command palette (VS Code-style) |
| `react-hotkeys-hook` | Keyboard shortcut handling |
| `fuse.js` | Fuzzy search for files |
| `idb` | IndexedDB wrapper for local storage |
| `remark-gfm` | GitHub Flavored Markdown support |
| `rehype-sanitize` | Markdown sanitization |
| `rehype-highlight` | Code block highlighting |
| `@radix-ui/react-dialog` | Accessible modal dialogs |
| `@radix-ui/react-dropdown-menu` | Context menus |
| `@radix-ui/react-toast` | Toast notifications |
| `@radix-ui/react-tooltip` | Tooltips |

### Dev Dependencies (already installed)
| Package | Purpose |
|---------|---------|
| `@testing-library/react` | React component testing |
| `@testing-library/jest-dom` | Custom DOM matchers |
| `@testing-library/user-event` | User interaction simulation |

### Additional Packages to Install
| Package | Purpose |
|---------|---------|
| `react-markdown` | Render markdown to React components |
| `@tabler/icons-react` | Alternative icon set (optional) |
| `react-resizable-panels` | Resizable split panes |
| `clsx` | Conditional class names |

**Install command:**
```bash
npm install --save react-markdown react-resizable-panels clsx
```

---

## 3. Implementation Steps

### Step 1: State Management (Zustand Store)

**File**: `src/store/workspaceStore.ts` (already created)

**What to do:**
- The store is already implemented. Review it and ensure it covers:
  - Files state (CRUD operations)
  - Editor mode (edit/preview/split)
  - Theme (dark/light/auto)
  - Font size, line numbers, word wrap
  - Auto-save toggle
  - Composition paths
  - Dirty/saved state
- Replace all `useState` in `App.tsx` with store hooks
- Remove the `starterFiles` import from App.tsx (use store instead)

**Migration in App.tsx:**
```typescript
// Replace all useState with:
import { useWorkspaceStore } from './store/workspaceStore';

const files = useWorkspaceStore(state => state.files);
const selectedPath = useWorkspaceStore(state => state.selectedPath);
const editorMode = useWorkspaceStore(state => state.editorMode);
const addFile = useWorkspaceStore(state => state.addFile);
const updateFileContent = useWorkspaceStore(state => state.updateFileContent);
// ... etc
```

### Step 2: Markdown Rendering Service

**File**: `src/lib/markdown/renderer.ts`

**What to do:**
- Create a markdown rendering service using `react-markdown`, `remark-gfm`, `rehype-highlight`, and `rehype-sanitize`
- Handle custom syntax for heading references `[@sec:slug]`
- Handle custom syntax for figure references `[@fig:1]`
- Handle figure/caption rendering

```typescript
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';

export function renderMarkdown(content: string): React.ReactNode {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeSanitize]}
      components={{
        // Custom components for references, figures, etc.
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

### Step 3: Improved Markdown Editor

**File**: `src/components/editor/MarkdownEditor.tsx`

**What to do:**
- Replace `<textarea>` with a proper code editor component
- Options:
  - **Option A**: Use `react-syntax-highlighter` with a custom textarea overlay
  - **Option B**: Use CodeMirror 6 (requires additional install)
  - **Option C**: Use Monaco Editor (requires additional install, heavier)
- Recommended: Option A (lightweight, uses already-installed package)
- Add line numbers support
- Add word wrap toggle
- Add font size adjustment
- Add proper keyboard shortcuts (Ctrl+S to save, Ctrl+/ for comments, etc.)
- Add tab indentation (2 spaces for markdown)
- Add bracket matching
- Add cursor position tracking (line:column)

**Key changes:**
- Replace `<textarea>` with a styled `<pre>` + `<textarea>` overlay technique
- Add line number gutter
- Track cursor position for status bar
- Handle tab key for indentation
- Handle Ctrl+S for save

### Step 4: Command Palette

**File**: `src/components/CommandPalette.tsx`

**What to do:**
- Use `cmdk` package to create a VS Code-style command palette
- Trigger with `Ctrl/Cmd + Shift + P`
- Commands to include:
  - `file.new` — Create new file
  - `file.rename` — Rename current file
  - `file.delete` — Delete current file
  - `file.save` — Save current file
  - `editor.togglePreview` — Toggle preview mode
  - `editor.fontSize.increase` — Increase font size
  - `editor.fontSize.decrease` — Decrease font size
  - `editor.toggleLineNumbers` — Toggle line numbers
  - `editor.toggleWordWrap` — Toggle word wrap
  - `view.compose` — Open composition modal
  - `theme.toggle` — Toggle theme
  - `search.files` — Search files (use Fuse.js)

```typescript
import { Command } from 'cmdk';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  
  // Register keyboard shortcut
  useHotkeys('mod+shift+p', () => setOpen(true));
  
  return (
    <Command open={open} onOpenChange={setOpen}>
      <Command.Dialog>
        <Command.Input placeholder="Type a command or search..." />
        <Command.List>
          <Command.Item onSelect={() => {}}>New File</Command.Item>
          // ... more items
        </Command.List>
      </Command.Dialog>
    </Command>
  );
}
```

### Step 5: Status Bar

**File**: `src/components/StatusBar.tsx`

**What to do:**
- Add an IDE-like status bar at the bottom of the app
- Show:
  - Current file name and path
  - Cursor position (line:column)
  - Word count / character count
  - Editor mode (edit/preview/split)
  - Theme indicator
  - Auto-save status (saved/dirty)
  - Last saved timestamp

```typescript
export function StatusBar() {
  const { selectedPath, editorMode, isDirty, lastSaved, fontSize } = useWorkspaceStore();
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  
  return (
    <footer className="status-bar">
      <div className="status-left">
        <span className="status-item">{fileName}</span>
        <span className="status-item">Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
        <span className="status-item">{wordCount} words</span>
      </div>
      <div className="status-right">
        <span className="status-item">{editorMode}</span>
        <span className="status-item">{isDirty ? '●' : '✓'}</span>
        <span className="status-item">{theme}</span>
      </div>
    </footer>
  );
}
```

### Step 6: Keyboard Shortcuts

**File**: `src/hooks/useKeyboardShortcuts.ts`

**What to do:**
- Use `react-hotkeys-hook` to register global keyboard shortcuts
- Shortcuts:
  - `Cmd/Ctrl + S` — Save file
  - `Cmd/Ctrl + Shift + P` — Open command palette
  - `Cmd/Ctrl + /` — Toggle comment (insert comment snippet)
  - `Cmd/Ctrl + Shift + F` — Search in files
  - `Cmd/Ctrl + P` — Quick file open (search files)
  - `Cmd/Ctrl + B` — Toggle sidebar
  - `F11` — Toggle fullscreen
  - `Cmd/Ctrl + =` — Increase font size
  - `Cmd/Ctrl + -` — Decrease font size
  - `Alt + 1/2/3` — Switch editor mode (edit/preview/split)

```typescript
import { useHotkeys } from 'react-hotkeys-hook';

export function useKeyboardShortcuts() {
  useHotkeys('mod+s', (e) => {
    e.preventDefault();
    // Save logic
  });
  
  useHotkeys('mod+shift+p', () => {
    // Open command palette
  });
  
  useHotkeys('mod+/', (e) => {
    e.preventDefault();
    // Insert comment
  });
}
```

### Step 7: Improved App Layout

**File**: `src/App.tsx`

**What to do:**
- Restructure the app layout to be more IDE-like:
  - **Top**: Menu bar (File, Edit, View, Insert, Theme)
  - **Main**: Grid with sidebar (left), editor (center), lint panel (right)
  - **Bottom**: Status bar
- Add menu bar with dropdowns:
  - **File**: New, Open, Save, Save All, Delete, Exit
  - **Edit**: Undo, Redo, Cut, Copy, Paste, Find, Replace
  - **View**: Toggle Sidebar, Toggle Preview, Toggle Status Bar, Font Size
  - **Insert**: Table, Code Block, Callout, Checklist, Link, Image, Diagram
  - **Theme**: Dark, Light, Auto
- Use Radix UI DropdownMenu for menus
- Add resizable panels using `react-resizable-panels`
- Integrate CommandPalette and StatusBar components

### Step 8: Resizable Panels

**What to do:**
- Install `react-resizable-panels`
- Replace the current CSS grid layout with resizable panels
- Make sidebar width adjustable
- Make editor/preview split adjustable
- Make lint panel width adjustable

```typescript
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from 'react-resizable-panels';

// In App.tsx:
<ResizablePanelGroup direction="horizontal" className="app-shell">
  <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
    <SidebarTabs ... />
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={60}>
    <MarkdownEditor ... />
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
    <LintPanel ... />
  </ResizablePanel>
</ResizablePanelGroup>
```

### Step 9: Theme System

**File**: `src/styles/themes.css`

**What to do:**
- Create a proper theme system with CSS variables
- Support dark, light, and auto (system) themes
- Use CSS custom properties for all colors
- Add smooth theme transitions
- Store theme preference in the Zustand store

```css
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --accent: #3b82f6;
  --border: rgba(255, 255, 255, 0.08);
  --editor-bg: #0f172a;
  --editor-text: #e2e8f0;
  --editor-cursor: #3b82f6;
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --accent: #2563eb;
  --border: rgba(0, 0, 0, 0.08);
  --editor-bg: #ffffff;
  --editor-text: #1e293b;
  --editor-cursor: #2563eb;
}
```

### Step 10: Improved Markdown Preview

**File**: `src/components/editor/MarkdownPreview.tsx`

**What to do:**
- Replace `<pre>{draft}</pre>` with proper markdown rendering
- Use the `renderMarkdown` service from Step 2
- Add scroll synchronization between editor and preview
- Add heading anchor links
- Style the rendered markdown with proper typography
- Add table of contents for long documents

### Step 11: File Operations with Tauri

**File**: `src/lib/files/tauri.ts` (already exists)

**What to do:**
- Review existing Tauri file operations
- Add save/open file dialog functionality
- Add directory picker for workspace
- Implement auto-save using Tauri's file system API
- Add file watching for external changes

### Step 12: Toast Notifications

**File**: `src/components/ToastProvider.tsx`

**What to do:**
- Use Radix UI Toast for notifications
- Show notifications for:
  - File saved successfully
  - File deleted
  - File created
  - Errors (save failed, etc.)
  - Reference errors (broken links)

### Step 13: Search Files

**File**: `src/components/SearchFiles.tsx`

**What to do:**
- Use Fuse.js for fuzzy file search
- Trigger with `Cmd/Ctrl + P`
- Show search results with file names and paths
- Navigate to file on selection

---

## 4. CI/CD Workflows

### Workflow 1: CI (`.github/workflows/ci.yml`)

**Triggers**: Push to any branch, pull request to main

**Jobs**:
1. **Test** (Node.js 20)
   - Checkout code
   - Setup Node.js 20
   - Install dependencies
   - Run `npm run test`
   - Upload test results

2. **Type Check**
   - Run `npx tsc --noEmit`
   - Fail on type errors

3. **Lint** (if eslint is added)
   - Run `npm run lint`
   - Fail on lint errors

4. **Build** (Web)
   - Run `npm run build`
   - Upload build artifacts

### Workflow 2: Tauri Build (`.github/workflows/tauri-build.yml`)

**Triggers**: Push to main, release

**Jobs**:
1. **Build for macOS**
   - Setup Rust toolchain
   - Install Node.js 20
   - Install Tauri dependencies
   - Build Tauri app
   - Upload artifact (.app bundle, .dmg)

2. **Build for Windows**
   - Use windows-latest runner
   - Setup Rust + Node.js
   - Build Tauri app
   - Upload artifact (.msi, .exe)

3. **Build for Linux**
   - Use ubuntu-latest runner
   - Install Tauri dependencies (libwebkit2gtk, etc.)
   - Build Tauri app
   - Upload artifact (.deb, .AppImage)

### Workflow 3: Release (`.github/workflows/release.yml`)

**Triggers**: Tag push (v*)

**Jobs**:
1. **Create Release**
   - Build for all platforms
   - Create GitHub Release
   - Upload all artifacts
   - Generate changelog from commits

### Workflow 4: Code Quality (`.github/workflows/code-quality.yml`)

**Triggers**: Push, pull request

**Jobs**:
1. **Code Quality Check**
   - Run type checking
   - Run tests with coverage
   - Check for unused dependencies
   - Upload coverage report

---

## 5. Testing Strategy

### Unit Tests (Vitest)

**Existing tests to keep:**
- `src/lib/markdown/headingParser.test.ts`
- `src/lib/refs/headingReferences.test.ts`
- `src/lib/refs/figureReferences.test.ts`
- `src/lib/images/imageSupport.test.ts`
- `src/features/markdown/snippets.test.ts`

**New unit tests to add:**
- `src/lib/markdown/renderer.test.ts` — Test markdown rendering
- `src/lib/linting/referenceParser.test.ts` — Test reference linting
- `src/lib/files/workspace.test.ts` — Test workspace file operations
- `src/store/workspaceStore.test.ts` — Test store actions
- `src/features/markdown/snippets.test.ts` — Extend with more snippet tests

### Component Tests (Vitest + Testing Library)

**Files to create:**
- `src/components/editor/MarkdownEditor.test.tsx`
- `src/components/sidebar/SidebarTabs.test.tsx`
- `src/components/toolbar/CollapsibleToolbar.test.tsx`
- `src/components/linting/LintPanel.test.tsx`
- `src/components/StatusBar.test.tsx`
- `src/components/CommandPalette.test.tsx`

**Test patterns:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MarkdownEditor } from './MarkdownEditor';

describe('MarkdownEditor', () => {
  it('renders the editor with file content', () => {
    const file = { path: 'test.md', name: 'test.md', content: '# Hello' };
    render(<MarkdownEditor file={file} />);
    expect(screen.getByText('# Hello')).toBeInTheDocument();
  });

  it('updates content when typing', () => {
    const file = { path: 'test.md', name: 'test.md', content: '' };
    render(<MarkdownEditor file={file} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '# New Content' } });
    expect(textarea.value).toBe('# New Content');
  });
});
```

### Integration Tests (Playwright)

**File**: `e2e/app.spec.ts`

**Tests to add:**
- Full app launch and UI rendering
- Create new file
- Edit markdown content
- Switch between edit/preview/split modes
- Insert snippets via toolbar
- Open command palette and run commands
- Toggle theme
- Save file

**Setup:**
1. Install Playwright: `npm install --save-dev @playwright/test`
2. Create `playwright.config.ts`
3. Create `e2e/` directory with test specs
4. Add test script to package.json: `"test:e2e": "playwright test"`

---

## 6. Native App Installation Instructions

### README Updates

**Add a new "Installation" section with:**

#### Prerequisites
- **macOS**: Xcode Command Line Tools (`xcode-select --install`)
- **Windows**: Visual Studio C++ Build Tools
- **Linux**: `libwebkit2gtk-4.0-dev`, `build-essential`, `curl`, `wget`, `file`, `libssl-dev`
- Node.js 20 LTS+
- Rust stable toolchain

#### From Source (Development)
```bash
# 1. Clone the repository
git clone <repo-url>
cd docin

# 2. Install dependencies
npm install

# 3. Run in development mode (web)
npm run dev

# 4. Run as desktop app (Tauri)
npm run tauri dev
```

#### From Source (Production Build)
```bash
# Build for current platform
npm run tauri build

# Built files will be in:
# macOS: src-tauri/target/release/bundle/macos/
# Windows: src-tauri/target/release/bundle/msi/
# Linux: src-tauri/target/release/bundle/deb/
```

#### Installing the Built App

**macOS:**
```bash
# After building, install the .app bundle
cp src-tauri/target/release/bundle/macos/Docin.app /Applications/

# Or create a DMG installer
# The build process creates a .dmg file
```

**Windows:**
```bash
# Run the MSI installer
src-tauri/target/release/bundle/msi/Docin_0.1.0_x64.msi

# Or use the NSIS installer
src-tauri/target/release/bundle/nsis/Docin_0.1.0_x64.exe
```

**Linux:**
```bash
# Install the .deb package
sudo dpkg -i src-tauri/target/release/bundle/deb/docin_0.1.0_amd64.deb

# Or run the AppImage
chmod +x src-tauri/target/release/bundle/appimage/Docin_0.1.0_x86_64.AppImage
./src-tauri/target/release/bundle/appimage/Docin_0.1.0_x86_64.AppImage
```

#### From Pre-built Releases (Future)
```bash
# Download from GitHub Releases
# macOS: brew install --cask docin (future)
# Or download .dmg from releases page
```

#### First-Time Setup
1. Launch Docin from Applications/Start Menu
2. Click "Open Workspace" to select a folder containing markdown files
3. Or start with the default starter files
4. Configure preferences via the Settings menu

---

## 7. Implementation Order (Recommended)

1. **State management** (Zustand store) — foundation for everything
2. **Markdown rendering service** — needed for preview
3. **Improved editor** — core UX improvement
4. **App layout restructure** — menu bar, status bar, resizable panels
5. **Command palette** — productivity feature
6. **Keyboard shortcuts** — productivity feature
7. **Theme system** — visual polish
8. **CI/CD workflows** — automation
9. **Tests** — quality assurance
10. **README updates** — documentation

---

## 8. Testing the Native App Build

### Local Testing
```bash
# 1. Ensure Rust is installed
rustc --version

# 2. Install Tauri CLI globally
npm install -g @tauri-apps/cli

# 3. Build the app
cd /path/to/docin
npm install
npm run tauri build

# 4. Verify the build output
ls src-tauri/target/release/bundle/

# 5. Test the built app
# macOS: Open the .app bundle
# Linux: Install the .deb and launch
# Windows: Run the .msi installer
```

### CI Testing
- The CI workflow will build for all platforms
- Verify artifacts are uploaded correctly
- Test installation on each platform

### What to Verify
- App launches without errors
- File operations work (open, save, create, delete)
- Editor renders correctly
- Preview renders markdown correctly
- Command palette opens and works
- Keyboard shortcuts work
- Theme switching works
- Status bar shows correct information
- Auto-save works

---

## 9. Package.json Scripts to Add

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "test": "vitest run",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  }
}
```

---

## 10. Files to Create/Modify

### New Files
- `src/store/workspaceStore.ts` ✅ (already created)
- `src/lib/markdown/renderer.ts`
- `src/components/CommandPalette.tsx`
- `src/components/StatusBar.tsx`
- `src/components/ToastProvider.tsx`
- `src/hooks/useKeyboardShortcuts.ts`
- `src/hooks/useCursorPosition.ts`
- `src/components/SearchFiles.tsx`
- `src/styles/themes.css`
- `src/components/editor/MarkdownPreview.tsx`
- `src/components/MenuBar.tsx`
- `e2e/app.spec.ts`
- `.github/workflows/ci.yml`
- `.github/workflows/tauri-build.yml`
- `.github/workflows/release.yml`
- `.github/workflows/code-quality.yml`
- `playwright.config.ts`
- `eslint.config.mjs`

### Files to Modify
- `src/App.tsx` — Major restructure
- `src/components/editor/MarkdownEditor.tsx` — Major improvement
- `src/components/sidebar/SidebarTabs.tsx` — Use store
- `src/components/toolbar/CollapsibleToolbar.tsx` — Use store
- `src/styles/globals.css` — Add IDE styles, status bar, menu bar
- `package.json` — Add scripts, update dependencies
- `README.md` — Add installation instructions
- `tsconfig.json` — Update if needed
- `vitest.config.ts` — Add component testing setup

---

## 11. Quick Start for Implementation

If you want to implement this incrementally:

1. **Week 1**: State management + improved editor + markdown rendering
2. **Week 2**: App layout (menu bar, status bar, resizable panels) + command palette
3. **Week 3**: Keyboard shortcuts + theme system + toasts
4. **Week 4**: CI/CD workflows + tests + README

Each step is independently testable and provides visible improvements.
