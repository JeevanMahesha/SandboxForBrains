# Spartan CLI / Nx Generators Reference

## Component Installation

### Via Nx Generator (recommended)

```bash
npx nx generate @spartan-ng/cli:ui --name=dialog
npx nx generate @spartan-ng/cli:ui --name=button,card,dialog
npx nx generate @spartan-ng/cli:ui  # interactive picker
```

### Via npm (manual)

```bash
# Install both Brain and Helm
npm install @spartan-ng/brain/dialog @spartan-ng/helm/dialog

# Brain only (headless)
npm install @spartan-ng/brain/dialog

# Helm only (requires Brain as peer dependency)
npm install @spartan-ng/helm/dialog
```

## Project Setup

### Initialize Spartan in a project

```bash
npx nx generate @spartan-ng/cli:init
```

### Health check

```bash
npx nx generate @spartan-ng/cli:healthcheck
```

### Add theme

```bash
npx nx generate @spartan-ng/cli:ui-theme
```

## Migration Generators

Run these when upgrading Spartan versions:

| Generator | Purpose |
|-----------|---------|
| `migrate-brain-imports` | Update Brain imports to secondary entrypoints |
| `migrate-helm-imports` | Update Helm imports structure |
| `migrate-module-imports` | Convert NgModule imports to standalone |
| `migrate-icon` | Migrate `hlm-icon` to `ng-icon` |
| `migrate-naming-conventions` | Update to latest naming standards |
| `migrate-helm-libraries` | Update library versions |

### Running migrations

```bash
npx nx generate @spartan-ng/cli:migrate-brain-imports
npx nx generate @spartan-ng/cli:migrate-helm-imports
npx nx generate @spartan-ng/cli:migrate-module-imports
npx nx generate @spartan-ng/cli:migrate-icon
npx nx generate @spartan-ng/cli:migrate-naming-conventions
```

## Package Naming

| Scope | Pattern | Example |
|-------|---------|---------|
| Brain | `@spartan-ng/brain/{name}` | `@spartan-ng/brain/dialog` |
| Helm | `@spartan-ng/helm/{name}` | `@spartan-ng/helm/dialog` |
| Utils | `@spartan-ng/helm/utils` | `hlm()`, `classes()` |
| CLI | `@spartan-ng/cli` | Nx generators |

## Important Notes

- The Nx generator handles both Brain and Helm layers, peer dependencies, and Tailwind preset configuration automatically.
- When installing manually, ensure `@angular/cdk` is installed and the Spartan Tailwind preset is configured.
- Use `spartan_install_command` MCP tool to generate the correct command for your project's package manager.
