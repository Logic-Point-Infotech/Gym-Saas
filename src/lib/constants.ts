export const APP_NAME = 'Vyayam AI'
export const APP_DESCRIPTION = 'Executive Fitness & AI Health Analytics Platform'

export const MEMBERSHIP_PLANS = [
  { name: 'Basic', amount: 999, duration: 30 },
  { name: 'Standard', amount: 1999, duration: 90 },
  { name: 'Premium', amount: 4999, duration: 180 },
  { name: 'Annual', amount: 8999, duration: 365 },
] as const

export const SPECIALIZATIONS = [
  'Weight Training',
  'Cardio',
  'Yoga',
  'CrossFit',
  'Calisthenics',
  'Martial Arts',
  'Swimming',
  'Pilates',
  'Functional Training',
  'Sports Conditioning',
] as const

export const NOTIFICATION_TYPES = [
  { value: 'RENEWAL_REMINDER', label: 'Renewal Reminder' },
  { value: 'EXPIRY_ALERT', label: 'Expiry Alert' },
  { value: 'HOLIDAY_NOTICE', label: 'Holiday Notice' },
  { value: 'MAINTENANCE', label: 'Maintenance Notice' },
  { value: 'GENERAL', label: 'General' },
] as const

export const ITEMS_PER_PAGE = 10

export const NAV_ITEMS = [
  {
    section: 'MAIN',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    ],
  },
  {
    section: 'MANAGEMENT',
    items: [
      { label: 'Members', href: '/members', icon: 'Users' },
      { label: 'Memberships', href: '/memberships', icon: 'CreditCard' },
      { label: 'Trainers', href: '/trainers', icon: 'Dumbbell' },
      { label: 'Allocations', href: '/allocations', icon: 'GitBranch' },
    ],
  },
  {
    section: 'TRACKING',
    items: [
      { label: 'Health Metrics', href: '/health-metrics', icon: 'HeartPulse' },
      { label: 'Nutrition', href: '/nutrition', icon: 'Apple' },
    ],
  },
  {
    section: 'COMMUNICATION',
    items: [
      { label: 'Notifications', href: '/notifications', icon: 'Bell' },
    ],
  },
  {
    section: 'ANALYTICS',
    items: [
      { label: 'Reports', href: '/reports', icon: 'BarChart3' },
    ],
  },
  {
    section: 'SYSTEM',
    items: [
      { label: 'Settings', href: '/settings', icon: 'Settings' },
    ],
  },
] as const
