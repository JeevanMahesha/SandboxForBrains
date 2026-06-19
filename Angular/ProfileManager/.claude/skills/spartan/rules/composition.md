# Component Composition

## Contents

- Dialog always needs a Title
- Full Card composition
- TabsTrigger inside TabsList
- Avatar needs AvatarFallback
- Overlay selection guide
- Use components, not custom markup

---

## Dialog always needs a Title

`hlmDialogTitle` is required for accessibility. Use `class="sr-only"` if visually hidden.

**Incorrect:**

```html
<brn-dialog>
  <button brnDialogTrigger hlmBtn>Open</button>
  <hlm-dialog-content *brnDialogContent>
    <p>Content without a title</p>
  </hlm-dialog-content>
</brn-dialog>
```

**Correct:**

```html
<brn-dialog>
  <button brnDialogTrigger hlmBtn>Open</button>
  <hlm-dialog-content *brnDialogContent>
    <hlm-dialog-header>
      <h3 hlmDialogTitle>Edit Profile</h3>
      <p hlmDialogDescription>Update your details.</p>
    </hlm-dialog-header>
    <!-- content here -->
    <hlm-dialog-footer>
      <button hlmBtn hlmDialogClose>Close</button>
    </hlm-dialog-footer>
  </hlm-dialog-content>
</brn-dialog>
```

**Key patterns:**

- `brnDialogTrigger` is an attribute on `<button>` (not an element component)
- `hlm-dialog-content` is an element component with `*brnDialogContent` structural directive
- `hlmDialogClose` is Helm — don't mix with `brnDialogClose` on the same element
- Same pattern applies to **Sheet** (`hlmSheetTitle`) and **AlertDialog** (`hlmAlertDialogTitle`)

---

## Full Card composition

Don't dump everything into a single element.

**Incorrect:**

```html
<section hlmCard>
  <h2>Title</h2>
  <p>Everything dumped together</p>
</section>
```

**Correct:**

```html
<section hlmCard>
  <div hlmCardHeader>
    <h3 hlmCardTitle>Team Members</h3>
    <p hlmCardDescription>Manage your team.</p>
  </div>
  <div hlmCardContent>
    <!-- content -->
  </div>
  <div hlmCardFooter>
    <button hlmBtn>Invite</button>
  </div>
</section>
```

---

## TabsTrigger inside TabsList

Never render triggers directly in Tabs.

**Incorrect:**

```html
<brn-tabs value="account">
  <button brnTabsTrigger="account">Account</button>
  <button brnTabsTrigger="password">Password</button>
  <div brnTabsContent="account">...</div>
</brn-tabs>
```

**Correct:**

```html
<brn-tabs value="account">
  <brn-tabs-list hlmTabsList>
    <button brnTabsTrigger="account" hlmTabsTrigger>Account</button>
    <button brnTabsTrigger="password" hlmTabsTrigger>Password</button>
  </brn-tabs-list>
  <div brnTabsContent="account" hlmTabsContent>...</div>
</brn-tabs>
```

---

## Avatar always needs AvatarFallback

**Correct:**

```html
<brn-avatar hlmAvatar>
  <brn-avatar-image hlmAvatarImage src="/avatar.png" alt="User" />
  <brn-avatar-fallback hlmAvatarFallback>JD</brn-avatar-fallback>
</brn-avatar>
```

---

## Overlay selection guide

| Use case | Component |
|----------|-----------|
| Focused task that requires input | `BrnDialog` + `HlmDialog*` |
| Destructive action confirmation | `BrnAlertDialog` + `HlmAlertDialog*` |
| Side panel with details or filters | `BrnSheet` + `HlmSheet*` |
| Quick info on hover | `BrnHoverCard` + `HlmHoverCard*` |
| Contextual content on click | `BrnPopover` + `HlmPopover*` |
| Command palette | `BrnCommand` inside `BrnDialog` |

---

## Use components, not custom markup

| Instead of | Use |
|------------|-----|
| `<hr>` or `<div class="border-t">` | `<brn-separator hlmSeparator />` |
| `<div class="animate-pulse">` with styled divs | `<hlm-skeleton class="h-4 w-3/4" />` |
| `<span class="rounded-full bg-green-100 ...">` | `<span hlmBadge variant="secondary">` |
| Custom styled callout div | `<div hlmAlert>` with `hlmAlertTitle` + `hlmAlertDescription` |
| Custom empty state markup | `<hlm-empty>` with title, description, action |
| Custom toast implementation | `<hlm-toaster />` + `toast()` from `@spartan-ng/brain/sonner` |
