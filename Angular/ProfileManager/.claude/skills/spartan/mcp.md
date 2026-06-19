# Spartan MCP Server

The MCP server lets AI assistants discover, browse, install, and verify Spartan Angular UI components.

---

## Tools

> **Tip:** MCP tools handle discovery and source code. For project config, use `spartan_project_info`. For installation, use `spartan_install_command` which generates ready-to-run CLI commands.

### Discovery

- **`spartan_list`** — List all components and blocks. Filter by type (`components`, `blocks`) or block category.
- **`spartan_search`** — Fuzzy search across components, blocks, and docs. Scope to `components`, `blocks`, `docs`, or `all`.
- **`spartan_view`** — View detailed component API: Brain directives, Helm components, inputs/outputs, signal models, code examples, install snippets. Sections: `api`, `examples`, `install`, `all`.
- **`spartan_dependencies`** — Show component dependency graph: direct deps, transitive deps (configurable depth), and reverse dependents.

### Source Code

- **`spartan_source`** — Fetch Brain/Helm TypeScript source from GitHub. Specify `brain`, `helm`, or `both`.
- **`spartan_block_source`** — Fetch block source code + shared utilities + extracted imports.

### Documentation

- **`spartan_docs`** — Fetch documentation topics: `installation`, `cli`, `theming`, `dark-mode`, `typography`, `figma`, `changelog`.

### Installation

- **`spartan_install_command`** — Generate `nx generate` or `npm install` commands for one or more components. Auto-detects package manager.
- **`spartan_audit`** — Post-installation verification: Angular project, Tailwind config, Spartan preset, Brain/Helm pairing, OnPush reminder.

### Project Context

- **`spartan_project_info`** — Detect Angular/Nx project: Angular version, Nx workspace, Tailwind version, installed Spartan packages, package manager, zoneless mode.
- **`spartan_project_components`** — List installed Brain/Helm packages with missing pair detection.

### Cache & Registry

- **`spartan_cache`** — Check cache status, clear, or trigger rebuild. Shows memory + file stats and GitHub rate limit.
- **`spartan_registry_refresh`** — Refresh component registry from live Analog API. Reports added/updated/removed components.

---

## Workflow

1. Use `spartan_project_info` to understand the project
2. Use `spartan_search` to find components
3. Use `spartan_view` to get API details and examples
4. Use `spartan_dependencies` to check what else is needed
5. Use `spartan_install_command` to generate install commands
6. Run the install command
7. Use `spartan_audit` to verify installation

---

## Resources (spartan:// URIs)

| URI | Description |
|-----|-------------|
| `spartan://components/list` | All components with Brain/Helm availability |
| `spartan://blocks/list` | All blocks by category |
| `spartan://project/info` | Registry metadata |
| `spartan://component/{name}/api` | Brain & Helm API for a component |
| `spartan://component/{name}/examples` | Code examples for a component |

---

## Prompts

| Prompt | Purpose |
|--------|---------|
| `spartan-get-started` | Installation + API overview + basic usage for a component |
| `spartan-compare-layers` | Side-by-side Brain vs Helm comparison |
| `spartan-implement` | Step-by-step feature implementation guide |
| `spartan-use-block` | Block integration guide with source fetching |
| `spartan-migrate` | Version migration guide with generators |
