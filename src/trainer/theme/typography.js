// src/trainer/theme/typography.js
import { colors } from './colors';

export const typography = {
  displayLg: {
    fontSize: 42,
    lineHeight: 50,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: colors.heading,
  },
  displaySm: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.heading,
  },
  headlineLg: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.heading,
  },
  headlineMd: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.heading,
  },
  headlineSm: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.heading,
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
    color: colors.textBody,
  },
  bodyMd: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
    color: colors.textBody,
  },
  labelMd: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.heading,
  },
  labelSm: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    color: colors.textSecondary,
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
