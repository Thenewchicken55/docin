# Docin

Docin is a dedicated Markdown documentation IDE for building structured, maintainable software docs without hand-managing Markdown complexity.

## Features

- **IDE-like interface** with menu bar, status bar, resizable panels, and command palette
- **Markdown editor** with line numbers, word wrap, and font size controls
- **Live preview** powered by `react-markdown` with GFM, syntax highlighting, and sanitized output
- **Split/Edit/Preview modes** with keyboard shortcuts to switch between them
- **Command palette** (`Cmd/Ctrl + Shift + P`) for quick access to all features
- **File explorer** with create, rename, and delete operations
- **Outline panel** with heading navigation and reference insertion
- **Automatic heading and figure reference tracking** with lint error detection
- **Collapsible toolbar** for inserting tables, code blocks, callouts, checklists, links, and diagrams
- **Multi-file composition** with preview, copy, and download
- **Keyboard shortcuts** throughout (`Cmd/Ctrl + S`, `Cmd/Ctrl + B`, `Cmd/Ctrl + 1/2/3`)
- **Persistent state** via Zustand with localStorage
- **Mobile blocking** — desktop-only experience (min 768px)

## Installation

### macOS

1. Download the `.dmg` file from [Releases](../../releases)
2. Open the `.dmg` file and drag **Docin** to your Applications folder
3. On first launch, right-click the app and select **Open** to bypass Gatekeeper (or go to System Settings > Privacy & Security > Open Anyway)

### Windows

1. Download the `.exe` (NSIS installer) or `.msi` from [Releases](../../releases)
2. Run the installer and follow the prompts
3. Docin requires **Microsoft Edge WebView2** — the installer will prompt to install it if missing (most Windows 10/11 systems have it pre-installed)

### Linux

**Debian/Ubuntu (.deb):**
```bash
sudo dpkg -i docin_0.1.0_amd64.deb
sudo apt-get install -f  # resolve dependencies if needed
```

**AppImage (any distro):**
```bash
chmod +x docin_0.1.0_x86_64.AppImage
./docin_0.1.0_x86_64.AppImage
```

**System requirements:**
```
libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

Install on Debian/Ubuntu:
```bash
sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

### Web (PWA)

Docin can be installed as a Progressive Web App in any modern browser:

1. Build and serve the web version:
   ```bash
   npm ci
   npm run build
   npm run preview
   ```
2. Open `http://localhost:4173` in Chrome, Edge, or Safari
3. Click the **install icon** in the address bar (or use the browser menu: "Install Docin")
4. The app will open in its own window, just like a native app

## Development

### Prerequisites

- **Node.js 20+** (LTS recommended)
- **npm** (comes with Node)
- **Rust stable toolchain** — install via [rustup](https://rustup.rs/) (only needed for Tauri desktop builds)

**Platform-specific dependencies for Tauri:**

| Platform | Requirements |
|----------|-------------|
| **macOS** | Xcode Command Line Tools (`xcode-select --install`) |
| **Windows** | Microsoft Visual Studio C++ Build Tools |
| **Linux** | `libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf` |

### Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd Docin.MD

# Install dependencies
npm ci
```

### Web Development

```bash
npm run dev
```

Opens the Vite dev server at `http://localhost:5173` with hot module reload.

### Desktop App Development

```bash
npm run tauri dev
```

Launches the Tauri desktop app with hot reload. Requires the Rust toolchain and platform dependencies listed above.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (web) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run tauri dev` | Start Tauri desktop app with hot reload |
| `npm run tauri build` | Build native desktop app |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run Playwright E2E tests |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Save file |
| `Cmd/Ctrl + Shift + P` | Open command palette |
| `Cmd/Ctrl + B` | Toggle sidebar |
| `Cmd/Ctrl + N` | New file |
| `Cmd/Ctrl + 1` | Edit mode |
| `Cmd/Ctrl + 2` | Preview mode |
| `Cmd/Ctrl + 3` | Split mode |
| `Cmd/Ctrl + =` | Increase font size |
| `Cmd/Ctrl + -` | Decrease font size |
| `Tab` | Insert 2 spaces |

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Editor** | CodeMirror 6 (`@codemirror/lang-markdown`) |
| **Preview** | react-markdown + remark-gfm + rehype-highlight |
| **State** | Zustand with localStorage persistence |
| **Desktop** | Tauri 2 |
| **UI** | Radix UI, lucide-react icons |
| **Command palette** | cmdk |
| **Framework** | React 18 + TypeScript + Vite 5 |
| **Styling** | Custom CSS with CSS variables |
| **Testing** | Vitest (unit) + Playwright (E2E) |

## CI/CD

GitHub Actions workflows are configured in `.github/workflows/`:

- **`ci.yml`** — Runs on push/PR: type-check, lint, tests, web build, Tauri builds for macOS/Windows/Linux
- **`release.yml`** — Creates draft GitHub releases with artifacts when a `v*` tag is pushed

### Running CI Locally

```bash
npm run type-check
npm run lint
npm test
npm run build
```

## Testing

### Unit Tests (Vitest)

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
```

Tests cover:
- Markdown heading parser
- Reference extraction and linting
- Heading and figure reference creation
- Image support with figure numbering
- Markdown snippet generation
- Zustand store operations

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

### Native App Testing

```bash
npm run tauri build

# Verify build output
ls src-tauri/target/release/bundle/

# Test the built app:
# - Launch the app
# - Create a new file
# - Edit markdown content
# - Verify live preview
# - Test command palette (Cmd+Shift+P)
# - Test keyboard shortcuts
# - Verify file operations (create, rename, delete)
```

## Roadmap

### Phase 1 — Authoring MVP ✅

- Project workspace and file explorer
- Editor with live preview and multiple modes
- Heading and reference tracking with linting
- Image insertion and captions
- Command palette and keyboard shortcuts

### Phase 2 — Documentation Workflow

- Multi-file document composition (in progress)
- Improved navigation and outline view
- Richer insertion helpers
- Templates and snippets

### Phase 3 — Publishing

- Export to static site or Markdown bundle
- Full-site preview
- Git integration and publishing hooks

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository and create a feature branch from `main`
2. **Install** dependencies: `npm ci`
3. **Make** your changes following the existing code style
4. **Run checks** before committing:
   ```bash
   npm run type-check
   npm run lint
   npm test
   ```
5. **Submit** a pull request with a clear description of the changes

### Guidelines

- Keep PRs focused — one feature or fix per PR
- Add tests for new functionality
- Update documentation if your change affects the public API or user-facing behavior
- Follow the existing commit message style (`feat:`, `fix:`, `refactor:`, etc.)

## License

MIT
