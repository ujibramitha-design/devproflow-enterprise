/**
 * Atomic Components — 02_Web_Application
 *
 * All components source style from:
 *   Design_Tokens.json → globals.css (CSS vars) → Tailwind → component
 *
 * Interaction parity with Mobile:
 *   hover/active  → scale-[0.97], bg-primary/90       (Mobile: pressed scale + ripple)
 *   focus         → ring-2 ring-ring                  (Mobile: border color animation)
 *   disabled      → opacity-50 pointer-events-none    (Mobile: opacity-50 + disabled prop)
 *   loading       → Spinner replaces content           (Mobile: ActivityIndicator)
 */

// ── Button ──────────────────────────────────────────────────────────────────
export { DsButton, dsButtonVariants } from './DsButton'
export type { DsButtonProps } from './DsButton'

// ── Input ───────────────────────────────────────────────────────────────────
export { DsInput } from './DsInput'
export type { DsInputProps } from './DsInput'

// ── Card ────────────────────────────────────────────────────────────────────
export {
  DsCard,
  DsCardHeader,
  DsCardTitle,
  DsCardDescription,
  DsCardContent,
  DsCardFooter,
} from './DsCard'
export type { DsCardProps } from './DsCard'

// ── Modal ───────────────────────────────────────────────────────────────────
export {
  DsModal,
  DsModalTrigger,
  DsModalContent,
  DsModalOverlay,
  DsModalHeader,
  DsModalTitle,
  DsModalDescription,
  DsModalBody,
  DsModalFooter,
  DsModalClose,
  DsModalPortal,
} from './DsModal'
