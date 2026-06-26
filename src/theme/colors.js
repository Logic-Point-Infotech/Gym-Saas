// ─── Official Brand Palette ───────────────────────────────────────────────────
export const colors = {
  // Backgrounds
  background:   '#0A0A12',   // Deep Void
  surface:      '#1A1A1A',   // Off Black (cards, sidebar, navbar)
  surfaceHigh:  '#222228',   // Slightly elevated surface
  surfaceLow:   '#141418',   // Deeper surface

  // Borders
  border:       '#303030',   // Coal
  borderLight:  '#3A3A3A',   // Slightly lighter border

  // Text hierarchy
  textMuted:    '#606060',   // Ash — disabled / placeholder
  textSecondary:'#909090',   // Silver — secondary labels
  textBody:     '#C0C0C0',   // Mist — body text
  heading:      '#F0F0F0',   // White Smoke — headings / primary text

  // Accents
  accent:       '#E8E840',   // Electric Lime — primary CTA, active states
  accentDim:    'rgba(232, 232, 64, 0.12)',  // Lime tint for backgrounds
  accentSecondary: '#B8B8D8', // Lavender Mist — secondary accent
  accentSecondaryDim: 'rgba(184, 184, 216, 0.12)',

  // Status colors
  statusActive:     '#4CAF50',
  statusActiveBg:   'rgba(76, 175, 80, 0.12)',
  statusInactive:   '#909090',
  statusInactiveBg: 'rgba(144, 144, 144, 0.12)',
  statusSuspended:  '#F44336',
  statusSuspendedBg:'rgba(244, 67, 54, 0.12)',
  statusAlert:      '#FF9800',
  statusAlertBg:    'rgba(255, 152, 0, 0.12)',
  statusNew:        '#B8B8D8',
  statusNewBg:      'rgba(184, 184, 216, 0.12)',

  // Chart colors
  chartPrimary:   '#E8E840',
  chartSecondary: '#B8B8D8',
  chartTertiary:  '#4CAF50',
  chartQuaternary:'#FF9800',

  // Legacy aliases for backward compat with existing screens
  primary:                '#E8E840',
  primaryContainer:       'rgba(232, 232, 64, 0.15)',
  onPrimary:              '#0A0A12',
  primaryFixed:           'rgba(232, 232, 64, 0.08)',
  primaryFixedDim:        'rgba(232, 232, 64, 0.2)',
  onPrimaryFixed:         '#E8E840',
  onPrimaryFixedVariant:  '#C0C0A0',
  inversePrimary:         '#0A0A12',

  secondary:              '#B8B8D8',
  secondaryContainer:     'rgba(184,184,216,0.15)',
  onSecondary:            '#0A0A12',
  onSecondaryContainer:   '#B8B8D8',
  secondaryFixed:         'rgba(184,184,216,0.1)',
  secondaryFixedDim:      '#B8B8D8',
  onSecondaryFixed:       '#0A0A12',
  onSecondaryFixedVariant:'#909090',

  tertiary:               '#4CAF50',
  tertiaryContainer:      'rgba(76,175,80,0.15)',
  onTertiary:             '#0A0A12',
  onTertiaryContainer:    '#4CAF50',
  tertiaryFixed:          'rgba(76,175,80,0.1)',
  tertiaryFixedDim:       '#4CAF50',
  onTertiaryFixed:        '#0A0A12',
  onTertiaryFixedVariant: '#388E3C',

  // Surface aliases
  surfaceBright:            '#222228',
  surfaceDim:               '#111116',
  surfaceVariant:           '#222228',
  surfaceTint:              '#E8E840',
  onBackground:             '#F0F0F0',
  onSurface:                '#F0F0F0',
  onSurfaceVariant:         '#909090',
  inverseSurface:           '#F0F0F0',
  inverseOnSurface:         '#0A0A12',

  surfaceContainerLowest:   '#0A0A12',
  surfaceContainerLow:      '#141418',
  surfaceContainer:         '#1A1A1A',
  surfaceContainerHigh:     '#222228',
  surfaceContainerHighest:  '#2C2C30',

  outline:                  '#606060',
  outlineVariant:           '#303030',

  error:                    '#F44336',
  errorContainer:           'rgba(244,67,54,0.12)',
  onError:                  '#FFFFFF',
  onErrorContainer:         '#F44336',

  white:                    '#FFFFFF',
  black:                    '#000000',
  transparent:              'transparent',
};

export const gradients = {
  hero:      ['#1A1A1A', '#0F0F1A', '#0A0A12'],
  heroAccent:['rgba(232,232,64,0.15)', 'rgba(232,232,64,0.03)', 'transparent'],
  heroAngle: { x: 0, y: 0 },
  heroEnd:   { x: 1, y: 1 },
  lime:      ['#E8E840', '#C8C820'],
  lavender:  ['#B8B8D8', '#8888B8'],
};
