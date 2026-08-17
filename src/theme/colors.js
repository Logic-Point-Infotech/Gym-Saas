// ─── Official Brand Palette ───────────────────────────────────────────────────

export const darkTheme = {
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

  // Surface aliases
  surfaceBright:            '#222228',
  surfaceDim:               '#111116',
  surfaceVariant:           '#222228',
  surfaceContainerLowest:   '#0A0A12',
  surfaceContainerLow:      '#141418',
  surfaceContainer:         '#1A1A1A',
  surfaceContainerHigh:     '#222228',
  surfaceContainerHighest:  '#2C2C30',

  error:                    '#F44336',
  errorContainer:           'rgba(244,67,54,0.12)',
  onPrimary:                '#0A0A12',

  white:                    '#FFFFFF',
  black:                    '#000000',
  transparent:              'transparent',
};

export const lightTheme = {
  // Backgrounds
  background:   '#F8F9FA',   // Off white
  surface:      '#FFFFFF',   // White (cards, sidebar, navbar)
  surfaceHigh:  '#F1F3F5',   // Slightly elevated surface
  surfaceLow:   '#E9ECEF',   // Deeper surface

  // Borders
  border:       '#DEE2E6',   // Light gray
  borderLight:  '#E9ECEF',   // Extra light border

  // Text hierarchy
  textMuted:    '#ADB5BD',   // Lighter gray — disabled / placeholder
  textSecondary:'#6C757D',   // Medium gray — secondary labels
  textBody:     '#495057',   // Dark gray — body text
  heading:      '#212529',   // Near black — headings / primary text

  // Accents
  accent:       '#C4C41B',   // Darker Electric Lime for visibility on light
  accentDim:    'rgba(196, 196, 27, 0.12)',
  accentSecondary: '#6B6B99', // Darker Lavender
  accentSecondaryDim: 'rgba(107, 107, 153, 0.12)',

  // Status colors
  statusActive:     '#2E7D32', // Darker green
  statusActiveBg:   'rgba(46, 125, 50, 0.12)',
  statusInactive:   '#6C757D',
  statusInactiveBg: 'rgba(108, 117, 125, 0.12)',
  statusSuspended:  '#D32F2F', // Darker red
  statusSuspendedBg:'rgba(211, 47, 47, 0.12)',
  statusAlert:      '#E65100', // Darker orange
  statusAlertBg:    'rgba(230, 81, 0, 0.12)',
  statusNew:        '#6B6B99',
  statusNewBg:      'rgba(107, 107, 153, 0.12)',

  // Chart colors
  chartPrimary:   '#C4C41B',
  chartSecondary: '#6B6B99',
  chartTertiary:  '#2E7D32',
  chartQuaternary:'#E65100',

  // Surface aliases
  surfaceBright:            '#FFFFFF',
  surfaceDim:               '#E9ECEF',
  surfaceVariant:           '#F1F3F5',
  surfaceContainerLowest:   '#FFFFFF',
  surfaceContainerLow:      '#F8F9FA',
  surfaceContainer:         '#F1F3F5',
  surfaceContainerHigh:     '#E9ECEF',
  surfaceContainerHighest:  '#DEE2E6',

  error:                    '#D32F2F',
  errorContainer:           'rgba(211,47,47,0.12)',
  onPrimary:                '#FFFFFF',

  white:                    '#FFFFFF',
  black:                    '#000000',
  transparent:              'transparent',
};

// Toggle this between darkTheme and lightTheme to switch modes
// For a fully dynamic theme, you would use a React Context instead of static export
export const colors = darkTheme;

export const gradients = {
  hero:      ['#1A1A1A', '#0F0F1A', '#0A0A12'],
  heroAccent:['rgba(232,232,64,0.15)', 'rgba(232,232,64,0.03)', 'transparent'],
  heroAngle: { x: 0, y: 0 },
  heroEnd:   { x: 1, y: 1 },
  lime:      ['#E8E840', '#C8C820'],
  lavender:  ['#B8B8D8', '#8888B8'],
};
