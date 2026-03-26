"use client"

/**
 * Design System Showcase Page
 *
 * Interactive demo of all atomic components.
 * All styling via: Design_Tokens.json → globals.css (CSS vars) → Tailwind → atoms
 * Zero hard-coded colors, fonts, or spacing.
 */

import { useState } from "react"
import { DsHeader } from "@/components/design-system/DsHeader"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, AlertCircle, Info, Zap, Search, Eye, EyeOff, User, Mail, Lock } from "lucide-react"

// ── Atomic components (all token-based) ──────────────────────────────────────
import {
  DsButton,
  DsInput,
  DsCard, DsCardHeader, DsCardTitle, DsCardContent, DsCardFooter,
  DsModal, DsModalTrigger, DsModalContent, DsModalHeader,
  DsModalTitle, DsModalDescription, DsModalBody, DsModalFooter,
} from "@/components/atoms"

// ── Token color swatches ──────────────────────────────────────────────────────
const colorTokens = [
  { name: "primary",     token: "colors.light.primary",     cls: "bg-primary",     hex: "#3B82F6" },
  { name: "secondary",   token: "colors.light.secondary",   cls: "bg-secondary",   hex: "#F5F5F4" },
  { name: "accent",      token: "colors.light.accent",      cls: "bg-accent",      hex: "#FB923C" },
  { name: "destructive", token: "colors.light.destructive", cls: "bg-destructive", hex: "#EF4444" },
  { name: "success",     token: "colors.light.success",     cls: "bg-devpro-success", hex: "#10B981" },
  { name: "warning",     token: "colors.light.warning",     cls: "bg-devpro-warning", hex: "#F59E0B" },
  { name: "muted",       token: "colors.light.muted",       cls: "bg-muted",       hex: "#F0F0EE" },
  { name: "border",      token: "colors.light.border",      cls: "bg-border",      hex: "#E7E5E4" },
  { name: "sidebar",     token: "colors.light.sidebar",     cls: "bg-sidebar",     hex: "#FAFAF8" },
  { name: "card",        token: "colors.light.card",        cls: "bg-card",        hex: "#FFFFFF" },
]

// ── Typography scale ──────────────────────────────────────────────────────────
const typeScale = [
  { name: "display",    token: "textStyles.display",    cls: "text-5xl font-bold",     sample: "Display" },
  { name: "h1",         token: "textStyles.h1",         cls: "text-4xl font-bold",     sample: "Heading 1" },
  { name: "h2",         token: "textStyles.h2",         cls: "text-3xl font-semibold", sample: "Heading 2" },
  { name: "h3",         token: "textStyles.h3",         cls: "text-2xl font-semibold", sample: "Heading 3" },
  { name: "h4",         token: "textStyles.h4",         cls: "text-xl font-semibold",  sample: "Heading 4" },
  { name: "body",       token: "textStyles.body",       cls: "text-base font-normal",  sample: "Body text — default reading size" },
  { name: "bodySmall",  token: "textStyles.bodySmall",  cls: "text-sm font-normal",    sample: "Body small — secondary descriptions" },
  { name: "caption",    token: "textStyles.caption",    cls: "text-xs font-normal",    sample: "Caption — timestamps, helpers" },
  { name: "label",      token: "textStyles.label",      cls: "text-sm font-medium",    sample: "Label — form labels, button text" },
  { name: "code",       token: "textStyles.code",       cls: "text-sm font-normal font-mono", sample: "code { font: mono; }" },
]

export default function DesignSystemPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const simulateLoad = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const validateEmail = (v: string) => {
    setInputValue(v)
    setEmailError(v && !v.includes("@") ? "Enter a valid email address" : "")
  }

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── Proof component: DsHeader ── */}
      <DsHeader
        title="Design System"
        subtitle="DevPro Flow Enterprise"
        breadcrumbs={["Home", "Design System", "Showcase"]}
      />

      {/* ── Token proof banner ── */}
      <div className="border-b border-border bg-primary/5 px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-primary font-medium">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>
            All atoms sourced from{" "}
            <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs">
              Design_Tokens.json → globals.css → Tailwind
            </code>
            {" "}— hover, active, focus, disabled interactions consistent across Web + Mobile.
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-14 px-6 py-10">

        {/* ════════════════════════════════════════════════════════
            SECTION 1 — DsButton
        ════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="DsButton"
            token="bg-primary → colors.light.primary → #3B82F6"
            description="Interaction: hover→bg-primary/90 | active→scale-[0.97] | focus→ring-ring | disabled→opacity-50 | loading→Spinner"
          />

          {/* Standard variants */}
          <DsCard elevation="sm" padding="md" className="mb-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Standard Variants — colors.light.*
            </p>
            <div className="flex flex-wrap gap-3">
              <DsButton variant="default">Default</DsButton>
              <DsButton variant="secondary">Secondary</DsButton>
              <DsButton variant="outline">Outline</DsButton>
              <DsButton variant="ghost">Ghost</DsButton>
              <DsButton variant="link">Link</DsButton>
              <DsButton variant="destructive">Destructive</DsButton>
            </div>
          </DsCard>

          {/* Extended + states */}
          <DsCard elevation="sm" padding="md" className="mb-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Extended Variants + States
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <DsButton variant="success" leftIcon={<CheckCircle2 className="size-4" />}>Success</DsButton>
              <DsButton variant="warning" leftIcon={<AlertCircle className="size-4" />}>Warning</DsButton>
              <DsButton variant="devpro" leftIcon={<Zap className="size-4" />}>DevPro Gradient</DsButton>
              <DsButton variant="default" disabled>Disabled</DsButton>
              <DsButton variant="default" loading={isLoading} onClick={simulateLoad}>
                {isLoading ? "Loading…" : "Click to load"}
              </DsButton>
            </div>
          </DsCard>

          {/* Sizes */}
          <DsCard elevation="sm" padding="md">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Sizes — spacing.scale tokens
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <DsButton size="xs">xs (h-7)</DsButton>
              <DsButton size="sm">sm (h-8)</DsButton>
              <DsButton size="default">default (h-9)</DsButton>
              <DsButton size="lg">lg (h-10)</DsButton>
              <DsButton size="xl">xl (h-12)</DsButton>
              <DsButton size="icon" variant="outline"><Info className="size-4" /></DsButton>
              <DsButton size="default" fullWidth className="mt-1">Full Width</DsButton>
            </div>
          </DsCard>
        </section>

        <Separator />

        {/* ════════════════════════════════════════════════════════
            SECTION 2 — DsInput
        ════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="DsInput"
            token="border-border → hover:border-primary/60 → focus:ring-ring focus:border-primary"
            description="Interaction: focus→ring-2 ring-ring border-primary (150ms) | error→border-destructive | disabled→opacity-50 | animated 150ms"
          />

          <div className="grid gap-6 md:grid-cols-2">
            {/* Default input */}
            <DsCard elevation="sm" padding="md">
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Default variant</p>
              <div className="space-y-4">
                <DsInput
                  label="Full Name"
                  placeholder="Enter your name"
                  leftIcon={<User className="size-4" />}
                  helperText="Used for your profile display"
                  isRequired
                />
                <DsInput
                  label="Email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="size-4" />}
                  value={inputValue}
                  onChange={e => validateEmail(e.target.value)}
                  errorText={emailError}
                  type="email"
                />
              </div>
            </DsCard>

            {/* Filled + Flushed + States */}
            <DsCard elevation="sm" padding="md">
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Variants + states</p>
              <div className="space-y-4">
                <DsInput
                  label="Password (filled variant)"
                  variant="filled"
                  placeholder="••••••••"
                  leftIcon={<Lock className="size-4" />}
                  type={showPassword ? "text" : "password"}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="pointer-events-auto">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  }
                />
                <DsInput
                  label="Search (flushed variant)"
                  variant="flushed"
                  placeholder="Search..."
                  leftIcon={<Search className="size-4" />}
                />
                <DsInput
                  label="Disabled input"
                  placeholder="Cannot type here"
                  disabled
                  value="Locked value"
                  helperText="opacity-50 — matches token disabled:opacity-50"
                />
              </div>
            </DsCard>
          </div>
        </section>

        <Separator />

        {/* ════════════════════════════════════════════════════════
            SECTION 3 — DsCard
        ════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="DsCard"
            token="bg-card border-border rounded-lg shadow-md → hover:shadow-lg hover:-translate-y-0.5"
            description="Interaction: hoverable→lift effect | clickable→active:scale-[0.99] | elevation variants from shadows.* tokens"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Flat */}
            <DsCard elevation="flat" padding="md" bordered>
              <DsCardTitle>Flat</DsCardTitle>
              <p className="mt-1 text-xs text-muted-foreground">elevation="flat"<br />shadows.none</p>
            </DsCard>

            {/* sm elevation */}
            <DsCard elevation="sm" padding="md">
              <DsCardTitle>Small</DsCardTitle>
              <p className="mt-1 text-xs text-muted-foreground">elevation="sm"<br />shadows.sm token</p>
            </DsCard>

            {/* md (default) + hoverable */}
            <DsCard elevation="md" padding="md" hoverable>
              <DsCardTitle>Hoverable ✦</DsCardTitle>
              <p className="mt-1 text-xs text-muted-foreground">elevation="md" hoverable<br />hover: shadow-lg -translate-y-0.5</p>
            </DsCard>

            {/* lg + clickable */}
            <DsCard elevation="lg" padding="md" clickable onClick={() => {}}>
              <DsCardTitle>Clickable ✦</DsCardTitle>
              <p className="mt-1 text-xs text-muted-foreground">elevation="lg" clickable<br />active: scale-[0.99]</p>
            </DsCard>
          </div>

          {/* Full card with header/footer */}
          <DsCard
            elevation="md"
            padding="none"
            hoverable
            className="mt-4"
            header={
              <span className="font-semibold text-foreground">
                KPI Card — with header + footer slots
              </span>
            }
            footer={
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-muted-foreground">Updated 2 mins ago</span>
                <DsButton size="sm" variant="outline">View Details</DsButton>
              </div>
            }
          >
            <div className="flex items-end gap-3 py-2">
              <span className="text-4xl font-bold text-foreground">248</span>
              <span className="mb-1 text-sm font-medium text-devpro-success">↑ 12%</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Applications — token: textStyles.kpiValue</p>
          </DsCard>
        </section>

        <Separator />

        {/* ════════════════════════════════════════════════════════
            SECTION 4 — DsModal
        ════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="DsModal"
            token="bg-background border-border rounded-lg shadow-xl overlay:bg-black/50 backdrop-blur-sm"
            description="Interaction: open→fade-in + zoom-in-95 (200ms) | close→fade-out + zoom-out-95 | overlay click→close | focus trapped"
          />

          <DsCard elevation="sm" padding="md">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Click a trigger to open modal — animations sourced from animations.duration.normal (200ms)
            </p>
            <div className="flex flex-wrap gap-3">

              {/* Default modal */}
              <DsModal>
                <DsModalTrigger asChild>
                  <DsButton variant="default">Open Modal (default)</DsButton>
                </DsModalTrigger>
                <DsModalContent size="default">
                  <DsModalHeader>
                    <DsModalTitle>Confirm Action</DsModalTitle>
                    <DsModalDescription>
                      This action uses tokens: bg-background, border-border, rounded-lg (radius.base = 1rem).
                    </DsModalDescription>
                  </DsModalHeader>
                  <DsModalBody>
                    <div className="space-y-4">
                      <DsInput
                        label="Application ID"
                        placeholder="APP-2026-001"
                        leftIcon={<Search className="size-4" />}
                        helperText="Enter the ID to proceed"
                      />
                      <p className="text-sm text-muted-foreground">
                        Overlay uses <code className="font-mono text-xs bg-muted px-1 rounded">bg-black/50 backdrop-blur-sm</code>.
                        Close button uses <code className="font-mono text-xs bg-muted px-1 rounded">hover:bg-accent</code>.
                      </p>
                    </div>
                  </DsModalBody>
                  <DsModalFooter>
                    <DsButton variant="outline" asChild>
                      <DsModalClose>Cancel</DsModalClose>
                    </DsButton>
                    <DsButton variant="default" asChild>
                      <DsModalClose>Confirm</DsModalClose>
                    </DsButton>
                  </DsModalFooter>
                </DsModalContent>
              </DsModal>

              {/* Destructive modal */}
              <DsModal>
                <DsModalTrigger asChild>
                  <DsButton variant="destructive">Delete Confirmation</DsButton>
                </DsModalTrigger>
                <DsModalContent size="sm">
                  <DsModalHeader>
                    <DsModalTitle>Delete Application?</DsModalTitle>
                    <DsModalDescription>
                      This cannot be undone. Uses <code className="font-mono text-xs">--destructive</code> token.
                    </DsModalDescription>
                  </DsModalHeader>
                  <DsModalFooter>
                    <DsButton variant="outline" asChild>
                      <DsModalClose>Cancel</DsModalClose>
                    </DsButton>
                    <DsButton variant="destructive" asChild>
                      <DsModalClose>Delete</DsModalClose>
                    </DsButton>
                  </DsModalFooter>
                </DsModalContent>
              </DsModal>

              {/* Large modal */}
              <DsModal>
                <DsModalTrigger asChild>
                  <DsButton variant="outline">Large Modal (lg)</DsButton>
                </DsModalTrigger>
                <DsModalContent size="lg">
                  <DsModalHeader>
                    <DsModalTitle>Pengajuan KPR Baru</DsModalTitle>
                    <DsModalDescription>
                      Form size lg — max-w-2xl. All form elements use DsInput atoms.
                    </DsModalDescription>
                  </DsModalHeader>
                  <DsModalBody>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <DsInput label="Nama Pemohon" placeholder="Budi Santoso" isRequired leftIcon={<User className="size-4" />} />
                      <DsInput label="Email" placeholder="budi@example.com" type="email" leftIcon={<Mail className="size-4" />} />
                      <DsInput label="Nomor Unit" placeholder="A-12" />
                      <DsInput label="Nilai KPR" placeholder="Rp 450.000.000" />
                    </div>
                  </DsModalBody>
                  <DsModalFooter>
                    <DsButton variant="outline" asChild><DsModalClose>Batal</DsModalClose></DsButton>
                    <DsButton variant="success" leftIcon={<CheckCircle2 className="size-4" />} asChild>
                      <DsModalClose>Kirim Pengajuan</DsModalClose>
                    </DsButton>
                  </DsModalFooter>
                </DsModalContent>
              </DsModal>

            </div>
          </DsCard>
        </section>

        <Separator />

        {/* ════════════════════════════════════════════════════════
            SECTION 5 — Color Token Swatches
        ════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader title="Color Tokens" token="colors.light.* → --primary → bg-primary" description="" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {colorTokens.map((t) => (
              <div key={t.name} className="overflow-hidden rounded-lg border border-border">
                <div className={`${t.cls} h-16 w-full`} />
                <div className="bg-card p-2">
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{t.hex}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">{t.token}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* ════════════════════════════════════════════════════════
            SECTION 6 — Typography Scale
        ════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="Typography Scale"
            token="typography.fontFamily.sans → Plus Jakarta Sans, Inter"
            description=""
          />
          <DsCard elevation="sm" padding="none">
            <div className="divide-y divide-border">
              {typeScale.map((t) => (
                <div key={t.name} className="flex items-baseline gap-4 px-5 py-3">
                  <div className="w-24 shrink-0">
                    <span className="text-xs font-mono text-muted-foreground">{t.name}</span>
                  </div>
                  <div className={`${t.cls} text-foreground leading-tight flex-1`}>{t.sample}</div>
                  <div className="hidden md:block shrink-0">
                    <span className="text-xs font-mono text-muted-foreground">{t.token}</span>
                  </div>
                </div>
              ))}
            </div>
          </DsCard>
        </section>

        <Separator />

        {/* ════════════════════════════════════════════════════════
            SECTION 7 — Platform Interaction Parity
        ════════════════════════════════════════════════════════ */}
        <section>
          <SectionHeader title="Interaction Parity — Web ↔ Mobile" token="" description="" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="py-3 px-4 text-left font-semibold text-foreground">State</th>
                  <th className="py-3 px-4 text-left font-semibold text-primary">Web (Tailwind)</th>
                  <th className="py-3 px-4 text-left font-semibold text-devpro-success">Mobile (React Native)</th>
                  <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Token</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { state: "Hover / Pressed",    web: "hover:bg-primary/90",            mob: "android_ripple + opacity 0.8",          tok: "colors.light.primary" },
                  { state: "Active / Pressed",   web: "active:scale-[0.97]",             mob: "Animated scale → 0.97 (Reanimated)",    tok: "animations.duration.fast" },
                  { state: "Focus (Input)",       web: "focus:ring-2 focus:border-primary", mob: "Animated border color (150ms)",        tok: "colors.light.ring / primary" },
                  { state: "Error (Input)",       web: "border-destructive ring-destructive", mob: "borderColor = colors.destructive",   tok: "colors.light.destructive" },
                  { state: "Disabled",            web: "opacity-50 pointer-events-none", mob: "opacity: 0.5 + disabled prop",           tok: "opacity.50" },
                  { state: "Loading",             web: "Spinner SVG + aria-busy",        mob: "ActivityIndicator",                     tok: "colors.*.primary" },
                  { state: "Card hover",          web: "hover:shadow-lg -translate-y-0.5", mob: "pressed scale → 0.99",                tok: "shadows.lg" },
                  { state: "Modal open",          web: "fade-in + zoom-in-95 (200ms)",   mob: "opacity 0→1 + translateY 80→0 (200ms)", tok: "animations.duration.normal" },
                  { state: "Modal close",         web: "fade-out + zoom-out-95",         mob: "opacity 1→0 + translateY 0→80",         tok: "animations.duration.fast" },
                  { state: "Border radius",       web: "rounded-lg (--radius = 1rem)",   mob: "borderRadius = 16 (spacing.borderRadius.lg)", tok: "radius.base" },
                ].map(row => (
                  <tr key={row.state} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-foreground">{row.state}</td>
                    <td className="py-2.5 px-4 font-mono text-xs text-primary">{row.web}</td>
                    <td className="py-2.5 px-4 font-mono text-xs text-devpro-success">{row.mob}</td>
                    <td className="py-2.5 px-4 font-mono text-xs text-muted-foreground">{row.tok}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  )
}

// ── Section heading helper ─────────────────────────────────────────────────────
function SectionHeader({ title, token, description }: { title: string; token: string; description: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3 flex-wrap">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        {token && (
          <code className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary">{token}</code>
        )}
      </div>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
