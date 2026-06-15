import { StyleSheet, Platform } from 'react-native';
import { colors } from './colors';

export const typography = {
  displayLg: {
    fontSize: 42,
    lineHeight: 50,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: colors.onSurface,
  },
  displaySm: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.onSurface,
  },
  headlineLg: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.onSurface,
  },
  headlineMd: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.onSurface,
  },
  headlineSm: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.onSurface,
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
    color: colors.onSurface,
  },
  bodyMd: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
    color: colors.onSurface,
  },
  labelMd: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.onSurface,
  },
  labelSm: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  lg: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 12,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
};
