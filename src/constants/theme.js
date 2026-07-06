// src/constants/theme.js

export const lightTheme = {
  mode: 'light',
  background: '#F0F0F5', // Contrasting with Deep Void
  surface: '#FFFFFF',    // Contrasting with Off Black
  border: '#D0D0D0',     // Contrasting with Coal
  muted: '#A0A0A0',      // Contrasting with Ash
  textSecondary: '#606060', // Contrasting with Silver
  textPrimary: '#303030',   // Contrasting with Mist
  heading: '#0A0A12',       // Contrasting with White Smoke
  primary: '#E8E840',       // Keep Electric Lime
  secondary: '#484868',     // Contrasting with Lavender Mist
  onPrimary: '#0A0A12',     // Dark text on Yellow
  success: '#15803D',
  error: '#B91C1C',
  warning: '#B45309',
};

export const darkTheme = {
  mode: 'dark',
  background: '#0A0A12', // Deep Void
  surface: '#1A1A1A',    // Off Black
  border: '#303030',     // Coal
  muted: '#606060',      // Ash
  textSecondary: '#909090', // Silver
  textPrimary: '#C0C0C0',   // Mist
  heading: '#F0F0F0',       // White Smoke
  primary: '#E8E840',       // Electric Lime
  secondary: '#B8B8D8',     // Lavender Mist
  onPrimary: '#0A0A12',     // Dark text on Yellow
  success: '#22C55E',
  error: '#F87171',
  warning: '#EAB308',
};

const theme = darkTheme; // Default export
export default theme;

export const SIZES = {
  base: 8,
  font: 14,
  radius: 16,
  padding: 20,
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  gutter: 16,
};

export const FONTS = {
  display: { fontSize: 48, fontWeight: '700' },
  headline: { fontSize: 32, fontWeight: '700' },
  headlineMobile: { fontSize: 24, fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '600' },
  bodyLarge: { fontSize: 16, fontWeight: '400' },
  bodySmall: { fontSize: 14, fontWeight: '400' },
  labelCaps: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  bold: { fontWeight: '700' },
};
