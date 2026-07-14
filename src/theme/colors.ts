/**
 * ANDRÓ palette — the single source of truth for color.
 *
 * This is a FIXED, hand-crafted luxury-fashion palette (light theme only), taken verbatim
 * from the ANDRÓ design (`design/andro-template.html`). It intentionally replaces the old
 * adaptive native `Color` API approach — see `plans/13-andro-redesign.md`. Components reference
 * the semantic `colors.*` tokens below, never a raw hex from `palette`.
 *
 * Rebrand later = repoint the semantic tokens (esp. `accent` / `ink`) at new palette values.
 */

/** Raw brand values. Do not use directly in components — go through `colors` (semantic). */
const palette = {
  // Espresso / ink
  espresso: '#14120E', // darkest — splash, device bezel
  espresso2: '#1C1A15', // dark hero banners
  ink: '#17150F', // primary text + solid buttons
  ink2: '#57534B', // secondary text on light

  // Gold accent
  gold: '#9C7A2C',
  goldSoft: '#F0E8D6', // active-tab pill fill

  // Paper & warm surfaces
  paper: '#FFFFFF',
  cream: '#FAF8F3', // alt canvas (try-home, review cards)
  sand: '#F5F2EC', // primary surface — search fields, icon circles
  sand2: '#EDE9E1', // raised surface / banners
  sand3: '#DED7CB', // avatar / deeper surface

  // Hairlines & borders
  hairline: '#F0ECE4',
  border: '#ECE8E0', // inactive border
  divider: '#E4E0D7',

  // Muted text ramp
  mute: '#8A867C',
  mute2: '#97938A',
  faint: '#B4AFA4',
  strike: '#B8B3A8', // struck-through MRP
  disabled: '#C4BFB4',

  // On dark
  onDark: '#C9C3B6',
  onDarkMute: '#6C675C',
  navInactive: '#9B968C',

  white: '#FFFFFF',
  // Feedback (design uses gold for positive accents; danger refined in Phase G against error screens)
  danger: '#B23A2E',
  success: '#2F7D52',

  // Back-office (staff/admin) status pills & chart accents — plan 14. Soft bg + saturated fg pairs.
  okBg: '#E7F0EA',
  okFg: '#1F8A5B',
  warnBg: '#FBF2E0',
  warnFg: '#B8862A',
  // Offline-sync banner (amber) — recurs on Dashboard + Store Ops.
  warnBorder: '#EBD9B0',
  warnText: '#7A5C1E',
  warnSub: '#9A7E3E',
  warnChevron: '#C6A94E',
  dangerBg: '#FBEDED',
  dangerFg: '#B03A3A',
  infoBg: '#EAF0FB',
  infoFg: '#3C6AB0',
  neutralBg: '#F0ECE4',
  neutralFg: '#8A867C',
  // Back-office canvas (staff/admin screens sit on a warmer greige than the shop's paper).
  officeCanvas: '#F4F1EA',
  // Dark hero (dashboards): translucent tile, muted caption, amber alert figure, KPI deltas.
  heroTile: 'rgba(255,255,255,0.08)',
  heroMute: '#9A9488',
  accentTint: 'rgba(156,122,44,0.18)', // gold role-badge fill on dark hero
  amber: '#E0A24B',
  kpiUp: '#7BD6A0',
  kpiDown: '#E58A8A',
  // Sign-out control outline (staff profile).
  dangerOutline: '#E0C9C9',
} as const;

/** Warm greige placeholders used behind product imagery in the design (10-tone ramp). */
export const productTones = [
  '#E8E4DB',
  '#E2DBD0',
  '#ECE7DF',
  '#DDD6CA',
  '#E4DED3',
  '#EBE6DC',
  '#DFD8CC',
  '#E6E0D5',
  '#E3DDD2',
  '#EAE5DB',
] as const;

/** Semantic tokens — the API components use. */
export const colors = {
  /** Brand accent (gold). Swap to rebrand. */
  accent: palette.gold,
  /** Soft accent fill (active tab pill, subtle highlights). */
  accentSoft: palette.goldSoft,

  /** Screen background. */
  background: palette.paper,
  /** Alternate warm canvas. */
  backgroundAlt: palette.cream,
  /** Raised surface: search fields, chips, icon circles. */
  surface: palette.sand,
  /** Deeper raised surface. */
  surfaceAlt: palette.sand2,
  /** Deepest neutral surface (avatars). */
  surfaceDeep: palette.sand3,

  /** Primary text. */
  label: palette.ink,
  /** Secondary text. */
  label2: palette.ink2,
  /** Muted text. */
  muted: palette.mute,
  /** More muted (placeholders, tertiary labels). */
  muted2: palette.mute2,
  /** Faint text. */
  faint: palette.faint,
  /** Struck-through MRP. */
  strike: palette.strike,
  /** Disabled foreground. */
  disabled: palette.disabled,

  /** Hairline separators. */
  hairline: palette.hairline,
  /** Inactive control borders. */
  border: palette.border,
  /** Section dividers. */
  divider: palette.divider,
  /** Strong (ink) outline — the design's 1.5px selected/CTA outlines. */
  borderStrong: palette.ink,

  /** Solid primary action (near-black). */
  primary: palette.ink,
  /** Foreground on `primary`. */
  onPrimary: palette.white,

  /** Darkest surfaces (splash, dark hero). */
  dark: palette.espresso,
  darkHero: palette.espresso2,
  /** Foreground on dark surfaces. */
  onDark: palette.onDark,
  onDarkMuted: palette.onDarkMute,

  /** Inactive bottom-nav icon/label. */
  navInactive: palette.navInactive,

  danger: palette.danger,
  success: palette.success,

  /** Back-office status-pill pairs (soft background + saturated foreground). */
  okBg: palette.okBg,
  okFg: palette.okFg,
  warnBg: palette.warnBg,
  warnFg: palette.warnFg,
  warnBorder: palette.warnBorder,
  warnText: palette.warnText,
  warnSub: palette.warnSub,
  warnChevron: palette.warnChevron,
  dangerBg: palette.dangerBg,
  dangerFg: palette.dangerFg,
  infoBg: palette.infoBg,
  infoFg: palette.infoFg,
  neutralBg: palette.neutralBg,
  neutralFg: palette.neutralFg,

  /** Warmer greige canvas behind back-office (staff/admin) screens. */
  officeCanvas: palette.officeCanvas,

  /** Dark dashboard hero surfaces & chart accents. */
  heroTile: palette.heroTile,
  heroMute: palette.heroMute,
  accentTint: palette.accentTint,
  amber: palette.amber,
  kpiUp: palette.kpiUp,
  kpiDown: palette.kpiDown,
  dangerOutline: palette.dangerOutline,

  white: palette.white,

  /** @deprecated Phase-0c alias kept so un-rebuilt screens compile; use `muted`. */
  secondaryLabel: palette.mute,
} as const;

export type AppColors = typeof colors;
