/**
 * Mood App Design System
 *
 * Visual language: dark, dreamy base with vivid mood-driven accents.
 * Inspired by synesthesia — each mood has its own color, glow, and personality.
 */

// ─── Core Palette ────────────────────────────────────────────────────────────

export const colors = {
  // Backgrounds
  bg: {
    base: '#0A0A14',       // deep night blue-black
    surface: '#12122A',    // elevated card bg
    elevated: '#1C1C38',   // modal / sheet bg
    overlay: 'rgba(10,10,20,0.7)',
  },

  // Brand
  brand: {
    primary: '#7C6FF7',    // electric violet
    primaryGlow: 'rgba(124,111,247,0.35)',
    secondary: '#FF6B9D',  // bubblegum pink
    secondaryGlow: 'rgba(255,107,157,0.35)',
    accent: '#43E8D8',     // aqua mint
    accentGlow: 'rgba(67,232,216,0.3)',
  },

  // Text
  text: {
    primary: '#EDE9FF',    // soft lavender-white
    secondary: '#9B94CC',  // muted violet-grey
    disabled: '#4A4570',
    inverse: '#0A0A14',
  },

  // Borders & Dividers
  border: {
    default: 'rgba(124,111,247,0.18)',
    subtle: 'rgba(237,233,255,0.06)',
  },

  // Status
  status: {
    success: '#57E5A0',
    warning: '#FFCF5C',
    error: '#FF6B6B',
  },

  // Pure
  white: '#FFFFFF',
  transparent: 'transparent',
};

// ─── Mood Palette ─────────────────────────────────────────────────────────────
// Each mood is a full object: base color, glow, gradient stops, and emoji.

export const moods = {
  dreamy: {
    label: 'Dreamy',
    emoji: '🌙',
    color: '#C3A6FF',
    glow: 'rgba(195,166,255,0.4)',
    gradient: ['#C3A6FF', '#7C6FF7'],
    dark: '#3D2B7A',
  },
  happy: {
    label: 'Happy',
    emoji: '✨',
    color: '#FFD166',
    glow: 'rgba(255,209,102,0.4)',
    gradient: ['#FFD166', '#FF9F2E'],
    dark: '#7A5500',
  },
  calm: {
    label: 'Calm',
    emoji: '🌿',
    color: '#7BC67E',
    glow: 'rgba(123,198,126,0.4)',
    gradient: ['#7BC67E', '#43B08F'],
    dark: '#1D4D2F',
  },
  melancholy: {
    label: 'Melancholy',
    emoji: '🌧',
    color: '#6B9ECC',
    glow: 'rgba(107,158,204,0.4)',
    gradient: ['#6B9ECC', '#4A6FA5'],
    dark: '#1A2F50',
  },
  energized: {
    label: 'Energized',
    emoji: '⚡',
    color: '#FF6B35',
    glow: 'rgba(255,107,53,0.4)',
    gradient: ['#FF6B35', '#FF3085'],
    dark: '#7A2000',
  },
  cozy: {
    label: 'Cozy',
    emoji: '🧸',
    color: '#FFAA80',
    glow: 'rgba(255,170,128,0.4)',
    gradient: ['#FFAA80', '#E07050'],
    dark: '#7A3010',
  },
  nostalgic: {
    label: 'Nostalgic',
    emoji: '📼',
    color: '#D4A5FF',
    glow: 'rgba(212,165,255,0.4)',
    gradient: ['#D4A5FF', '#A05EC8'],
    dark: '#3D1060',
  },
  ethereal: {
    label: 'Ethereal',
    emoji: '🫧',
    color: '#43E8D8',
    glow: 'rgba(67,232,216,0.4)',
    gradient: ['#43E8D8', '#1BBCFF'],
    dark: '#0A3D40',
  },
};

export const moodList = Object.keys(moods);

// ─── Typography ───────────────────────────────────────────────────────────────

export const typography = {
  // Font families (map to custom fonts or system fallbacks)
  fontFamily: {
    display: 'System',    // swap for a rounded display font like "Nunito"
    body: 'System',
    mono: 'Courier',
  },

  // Scale
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 38,
  },

  // Weight
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  tracking: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
};

// Pre-built text styles
export const textStyles = {
  displayLarge: {
    fontSize: typography.size['4xl'],
    fontWeight: typography.weight.black,
    letterSpacing: typography.tracking.tight,
    color: colors.text.primary,
  },
  displayMedium: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    letterSpacing: typography.tracking.tight,
    color: colors.text.primary,
  },
  heading1: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  heading2: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  heading3: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  body: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.regular,
    color: colors.text.secondary,
    lineHeight: typography.size.md * typography.lineHeight.relaxed,
  },
  bodySmall: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.regular,
    color: colors.text.secondary,
  },
  caption: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    letterSpacing: typography.tracking.wide,
    color: colors.text.disabled,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.tracking.wider,
    textTransform: 'uppercase',
    color: colors.text.secondary,
  },
};

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const spacing = {
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

// ─── Border Radius ────────────────────────────────────────────────────────────

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
};

// ─── Shadows & Glows ──────────────────────────────────────────────────────────

export const shadows = {
  sm: {
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  lg: {
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  glow: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  }),
};

// ─── Animation Presets ────────────────────────────────────────────────────────

export const animation = {
  // Durations (ms)
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  // Spring configs for react-native-reanimated
  spring: {
    snappy: { damping: 18, stiffness: 300 },
    bouncy: { damping: 10, stiffness: 200 },
    gentle: { damping: 20, stiffness: 120 },
  },
};

// ─── Z-Index ─────────────────────────────────────────────────────────────────

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  toast: 400,
  tooltip: 500,
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export const layout = {
  tabBarHeight: 80,
  headerHeight: 60,
  cardAspectRatio: 9 / 16,  // vertical video
  maxWidth: 428,             // iPhone 14 Pro Max width
};

// ─── Default export ───────────────────────────────────────────────────────────

const theme = {
  colors,
  moods,
  moodList,
  typography,
  textStyles,
  spacing,
  radius,
  shadows,
  animation,
  zIndex,
  layout,
};

export default theme;
