// ─── Mock Data — Zenith AI Trainer Portal ────────────────────────────────────

// Dashboard Screen Data
export const dashboardData = {
  trainerName: 'Coach Alex',
  greeting: 'Good Morning,',
  goalAchievement: '87% Client Goal Achievement',

  // NEW: Stat Cards
  stats: [
    { id: 'total',    label: 'Total Clients',       value: 24, icon: 'people',          color: '#E8E840' },
    { id: 'active',   label: 'Active Members',      value: 18, icon: 'checkmark-circle', color: '#4CAF50' },
    { id: 'inactive', label: 'Inactive Members',    value: 4,  icon: 'pause-circle',     color: '#909090' },
    { id: 'suspend',  label: 'Suspended',           value: 2,  icon: 'ban',              color: '#F44336' },
    { id: 'diets',    label: 'Active Diet Plans',   value: 21, icon: 'nutrition',        color: '#B8B8D8' },
    { id: 'pending',  label: 'Pending Diet Reviews',value: 5,  icon: 'time',             color: '#FF9800' },
    { id: 'blood',    label: 'New Blood Reports',   value: 3,  icon: 'medical',          color: '#F44336' },
  ],

  // NEW: Monthly Member Growth
  monthlyGrowth: [
    { month: 'Jul', count: 14 },
    { month: 'Aug', count: 16 },
    { month: 'Sep', count: 15 },
    { month: 'Oct', count: 18 },
    { month: 'Nov', count: 17 },
    { month: 'Dec', count: 20 },
    { month: 'Jan', count: 19 },
    { month: 'Feb', count: 21 },
    { month: 'Mar', count: 22 },
    { month: 'Apr', count: 23 },
    { month: 'May', count: 21 },
    { month: 'Jun', count: 24 },
  ],

  // NEW: Upcoming Renewals
  upcomingRenewals: [
    { id: 'r1', name: 'Sarah Chen',     expiry: '28 Jun 2026', daysLeft: 2, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBZDl7edE871i9cI4gWGeXpFMG7clC8Vf3ELiQjqJHkp07U0QI0y1WJa--AivxpQmk-okUg0GKOXiSsESBv1lHGb6fzjHbDCY6PdNO8ZiXET9AuGEyuks7MRAK-sB0bUGVvPWVVf34evMeUPcgoKjiZXRGD2uqsfAEGz-8H9OunJg-Qx8JZOJ4ACIPiHarhARercRr5m_6KCIJtkWEB02tze3rjrsZkdsTpAIxa4NBxu7pQ0MqxVoUiJa5ToQO601sFB9r_wXjAn8' },
    { id: 'r2', name: 'Tom Bradley',    expiry: '30 Jun 2026', daysLeft: 4, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtpVOkG4f_61P_9l8V3ZMmDr-LdStINxcxrEQLO8lpqdmN-0PSFRJQnsZHvPCAUpoYfjTBnzGfquezn5mmDLYFEyu-DGHKXlPKfgslLlRisp9eP3_W8P4dK429PtsZlVc0iKaJ_gscR7Isx2HYa_cs1a366gzpHziyueJT_OHa5MKT6nqViMbsw6tB0bh_VUb1JEZtc6K4xwVZpbbH92uzpqYsyAn3VBhmlfs75nVexgCLpm4wECAYD5IEO0F6KFyAYOmVUgeA1pg' },
    { id: 'r3', name: 'James Parker',   expiry: '02 Jul 2026', daysLeft: 6, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm37DPOHI_VUx0H7l0si5s7NPC2jMsEIJdQTKYlo-pghDn8EDMLtrSADgEjiBXSJgBY5RJ9kWUPQvUewBlb27dYiwnZThnj5JNPFl3zWoGj9Xk6KJrWt_UOxEAkUlBg8uvApGSng3KGvNXTFXE9q0TVqBE5c0w53lh14jL_TcnhjZyFjNQmyx5Lz7SlTveTWaiBNkCvWs_PWGFrb2AeVR6Qjj80emAnsHjTAFMrIjPMnv6GAdOHWzJVyVTDTBWfjD3w-9-SalUJ9c' },
    { id: 'r4', name: 'Priya Sharma',   expiry: '05 Jul 2026', daysLeft: 9, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAqknvU_6LhWUt5afIX4KuAV_T22Ho4Yc7L2dEPL3RcYJ4MFSFoS0RI5Hz4YNlfeCrDeB9nZdMGAR0_22h_MmmCMrFiODrhbODthy9j2SGe35r6iHi9AX4XiKH_w1mCdufQlc0UoFXoFLgrGdAvCV40ELSHCrQf6PIv-4-h3F-rlK7IwZVBzQWb9iJYc2bQcrZPZzQsOd6uR2fQ5W7r4B4TM0_ucpIpfF0Qft3V2v3GefcykNKTKR7qNDBz3O3FK1bVzcTW50ew_0' },
  ],

  // NEW: Recent Activities
  recentActivities: [
    { id: 'a1', text: 'Sarah Chen uploaded a blood report',    time: '10 min ago',  icon: 'medical',         color: '#F44336' },
    { id: 'a2', text: 'Marcus Vane updated weight: 87.3 kg',   time: '25 min ago',  icon: 'scale',           color: '#E8E840' },
    { id: 'a3', text: 'Diet plan published for Elena R.',      time: '1 hr ago',    icon: 'nutrition',       color: '#4CAF50' },
    { id: 'a4', text: "Tom Bradley's membership renewed",      time: '2 hrs ago',   icon: 'refresh-circle',  color: '#B8B8D8' },
    { id: 'a5', text: 'Priya Sharma completed monthly review', time: '3 hrs ago',   icon: 'checkmark-circle',color: '#4CAF50' },
    { id: 'a6', text: 'James Parker joined the gym',           time: 'Yesterday',   icon: 'person-add',      color: '#E8E840' },
  ],

  // NEW: Upcoming Tasks
  upcomingTasks: [
    { id: 't1', task: 'Review Marcus Vane blood report',    due: 'Today',    done: false },
    { id: 't2', task: 'Update Sarah Chen diet plan',        due: 'Today',    done: false },
    { id: 't3', task: 'Schedule Elena Rodriguez check-in',  due: 'Tomorrow', done: false },
    { id: 't4', task: 'Send renewal reminder to Tom B.',    due: 'Jun 27',   done: true  },
  ],

  // Existing
  insights: [
    { id: '1', icon: 'trending-up', title: 'VO2 Max Trend', description: 'Client average up by 2 points this week. High engagement in HIIT sessions noted.', color: '#E8E840', bgColor: 'rgba(232,232,64,0.08)' },
    { id: '2', icon: 'moon',        title: 'Recovery Score', description: 'Average recovery at 78%. Suggest increasing rest between Phase 2 strength blocks.', color: '#B8B8D8', bgColor: 'rgba(184,184,216,0.08)' },
  ],

  sessions: [
    { id: '1', name: 'Sarah Jenkins', time: '09:00 AM', type: 'Strength', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAqknvU_6LhWUt5afIX4KuAV_T22Ho4Yc7L2dEPL3RcYJ4MFSFoS0RI5Hz4YNlfeCrDeB9nZdMGAR0_22h_MmmCMrFiODrhbODthy9j2SGe35r6iHi9AX4XiKH_w1mCdufQlc0UoFXoFLgrGdAvCV40ELSHCrQf6PIv-4-h3F-rlK7IwZVBzQWb9iJYc2bQcrZPZzQsOd6uR2fQ5W7r4B4TM0_ucpIpfF0Qft3V2v3GefcykNKTKR7qNDBz3O3FK1bVzcTW50ew_0' },
    { id: '2', name: 'Michael Ross',  time: '10:30 AM', type: 'Cardio',   avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtpVOkG4f_61P_9l8V3ZMmDr-LdStINxcxrEQLO8lpqdmN-0PSFRJQnsZHvPCAUpoYfjTBnzGfquezn5mmDLYFEyu-DGHKXlPKfgslLlRisp9eP3_W8P4dK429PtsZlVc0iKaJ_gscR7Isx2HYa_cs1a366gzpHziyueJT_OHa5MKT6nqViMbsw6tB0bh_VUb1JEZtc6K4xwVZpbbH92uzpqYsyAn3VBhmlfs75nVexgCLpm4wECAYD5IEO0F6KFyAYOmVUgeA1pg' },
    { id: '3', name: "Elena D'Amico", time: '01:00 PM', type: 'Mobility', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwURpHgQdF83_lwpCbT8zpI03mEoD7LDEIN2_qG5RLpOUtU-zjslYL-lw8BUHQFNx3SmAvheB24s-_qGHeoIrMwBGzRdT4Bf0mogghh4GDXV3mdJ95kWuSt1V4tNZHV6WWZYQol3B-lovvRwoIUdLl3NpRwiFY7XKRS_VFWePirSFLFii1OfTvmiDAA-x17TX17kvSxpRjpBU7dPhJ9oZr1oz19jmWC2I58CHY4nDAPeLYAZWcAPN2p8YPA7UMH6itfE8dA3PwpgY' },
  ],

  weeklyProgress: [
    { day: 'Mon', value: 0.75 },
    { day: 'Tue', value: 0.50 },
    { day: 'Wed', value: 0.92 },
    { day: 'Thu', value: 0.67 },
    { day: 'Fri', value: 0.83 },
    { day: 'Sat', value: 0.70 },
    { day: 'Sun', value: 0.95 },
  ],

  macros: { total: 82, protein: 40, carbs: 30, fats: 30 },

  goals: [
    { label: 'Weight Loss',   value: 92, color: '#E8E840' },
    { label: 'Strength Gain', value: 64, color: '#B8B8D8' },
    { label: 'Endurance',     value: 48, color: '#4CAF50' },
  ],
};

// ─── Clients Data ─────────────────────────────────────────────────────────────
export const clientsData = [
  {
    id: '1', name: 'Sarah Chen',      age: 29, weight: '62 kg', height: '165 cm',
    goal: 'Weight Loss',   bmi: 22.8, bmiLabel: 'Normal',    bmiColor: '#4CAF50',
    progress: 65,
    membershipType: 'Premium', membershipExpiry: '28 Jun 2026',
    membershipStatus: 'Active', membershipStart: '28 Dec 2025',
    status: 'Active', statusColor: '#4CAF50', statusBg: 'rgba(76,175,80,0.12)', alert: false,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBZDl7edE871i9cI4gWGeXpFMG7clC8Vf3ELiQjqJHkp07U0QI0y1WJa--AivxpQmk-okUg0GKOXiSsESBv1lHGb6fzjHbDCY6PdNO8ZiXET9AuGEyuks7MRAK-sB0bUGVvPWVVf34evMeUPcgoKjiZXRGD2uqsfAEGz-8H9OunJg-Qx8JZOJ4ACIPiHarhARercRr5m_6KCIJtkWEB02tze3rjrsZkdsTpAIxa4NBxu7pQ0MqxVoUiJa5ToQO601sFB9r_wXjAn8',
  },
  {
    id: '2', name: 'Marcus Vane',     age: 42, weight: '95 kg', height: '183 cm',
    goal: 'Muscle Gain',   bmi: 28.4, bmiLabel: 'Overweight', bmiColor: '#FF9800',
    progress: 82,
    membershipType: 'Standard', membershipExpiry: '15 Jul 2026',
    membershipStatus: 'Active', membershipStart: '15 Jan 2026',
    status: 'Active', statusColor: '#4CAF50', statusBg: 'rgba(76,175,80,0.12)', alert: true,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4LhUQqeaxxY9bw_QDvEgyP1qQKFaz6IB7azxMyjNRdyzIW6WYu5Sxc9t3lGzoTkRvzgZVgGAjqvxCbjP5vVgDNXH0KNXa6XGz6RSBb_O_lziKG27J5WYiLG-FmFwLaEK3jkK09z-3NIOtWf5BcbREjFnam9D6dpvcUoAN4zWcsdl9KtYhgHyjnORk8EyQKYLO6rmwjGn0XgjdEztL-7KC4Id4H8RGRTQscpSQ3Yvcydb5U6YM1wvF-XugFhTWCxHPBk6bD_1vqsU',
  },
  {
    id: '3', name: 'Elena Rodriguez', age: 26, weight: '58 kg', height: '168 cm',
    goal: 'Endurance',     bmi: 20.5, bmiLabel: 'Normal',    bmiColor: '#4CAF50',
    progress: 50,
    membershipType: 'Elite', membershipExpiry: '10 Aug 2026',
    membershipStatus: 'Active', membershipStart: '10 Feb 2026',
    status: 'Active', statusColor: '#4CAF50', statusBg: 'rgba(76,175,80,0.12)', alert: false,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLuaU85sC_0LtPVvmS1WOWo7VGEwF0_F4UyWQxs1J5LWGU9WK-NemhslpiqiwTlXNDE6RHXxIIwMSpHYR8FwttVFZp2NpRO3hu35Q6KTG8QoUPrCNmcENXWJTWdX7RJX7vDN9oOkqQmo4acXFg_DPy97QaVDyYH_VD0b1gOzfzirlVDweHMPFdAAxQKQ_K05lcajYC536lNx-noeB0TCes9yaYTIShR7cHjDyuQvny9qBtu0EXaFh2E46CpyE37G9DyGY2XS53V_U',
  },
  {
    id: '4', name: 'James Parker',    age: 35, weight: '78 kg', height: '175 cm',
    goal: 'Flexibility',   bmi: 25.5, bmiLabel: 'Normal',    bmiColor: '#4CAF50',
    progress: 38,
    membershipType: 'Basic', membershipExpiry: '02 Jul 2026',
    membershipStatus: 'Active', membershipStart: '02 Jan 2026',
    status: 'Inactive', statusColor: '#909090', statusBg: 'rgba(144,144,144,0.12)', alert: false,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm37DPOHI_VUx0H7l0si5s7NPC2jMsEIJdQTKYlo-pghDn8EDMLtrSADgEjiBXSJgBY5RJ9kWUPQvUewBlb27dYiwnZThnj5JNPFl3zWoGj9Xk6KJrWt_UOxEAkUlBg8uvApGSng3KGvNXTFXE9q0TVqBE5c0w53lh14jL_TcnhjZyFjNQmyx5Lz7SlTveTWaiBNkCvWs_PWGFrb2AeVR6Qjj80emAnsHjTAFMrIjPMnv6GAdOHWzJVyVTDTBWfjD3w-9-SalUJ9c',
  },
  {
    id: '5', name: 'Priya Sharma',    age: 31, weight: '70 kg', height: '161 cm',
    goal: 'Weight Loss',   bmi: 27.0, bmiLabel: 'Overweight', bmiColor: '#FF9800',
    progress: 71,
    membershipType: 'Premium', membershipExpiry: '05 Jul 2026',
    membershipStatus: 'Active', membershipStart: '05 Jan 2026',
    status: 'Active', statusColor: '#4CAF50', statusBg: 'rgba(76,175,80,0.12)', alert: false,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAqknvU_6LhWUt5afIX4KuAV_T22Ho4Yc7L2dEPL3RcYJ4MFSFoS0RI5Hz4YNlfeCrDeB9nZdMGAR0_22h_MmmCMrFiODrhbODthy9j2SGe35r6iHi9AX4XiKH_w1mCdufQlc0UoFXoFLgrGdAvCV40ELSHCrQf6PIv-4-h3F-rlK7IwZVBzQWb9iJYc2bQcrZPZzQsOd6uR2fQ5W7r4B4TM0_ucpIpfF0Qft3V2v3GefcykNKTKR7qNDBz3O3FK1bVzcTW50ew_0',
  },
  {
    id: '6', name: 'Tom Bradley',     age: 38, weight: '88 kg', height: '180 cm',
    goal: 'Muscle Gain',   bmi: 27.2, bmiLabel: 'Overweight', bmiColor: '#FF9800',
    progress: 55,
    membershipType: 'Standard', membershipExpiry: '30 Jun 2026',
    membershipStatus: 'Suspended', membershipStart: '30 Dec 2025',
    status: 'Suspended', statusColor: '#F44336', statusBg: 'rgba(244,67,54,0.12)', alert: false,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtpVOkG4f_61P_9l8V3ZMmDr-LdStINxcxrEQLO8lpqdmN-0PSFRJQnsZHvPCAUpoYfjTBnzGfquezn5mmDLYFEyu-DGHKXlPKfgslLlRisp9eP3_W8P4dK429PtsZlVc0iKaJ_gscR7Isx2HYa_cs1a366gzpHziyueJT_OHa5MKT6nqViMbsw6tB0bh_VUb1JEZtc6K4xwVZpbbH92uzpqYsyAn3VBhmlfs75nVexgCLpm4wECAYD5IEO0F6KFyAYOmVUgeA1pg',
  },
];

// ─── Workouts + Nutrition ─────────────────────────────────────────────────────
export const workoutsData = [
  { id: '1', name: 'Full Body HIIT',  duration: '45 min', difficulty: 'Advanced',     difficultyColor: '#F44336', exercises: 12, calories: 520, category: 'HIIT',     assigned: ['Sarah Chen', 'Tom Bradley'],           description: 'High-intensity interval training targeting all major muscle groups with minimal rest periods.' },
  { id: '2', name: 'Strength Builder',duration: '60 min', difficulty: 'Intermediate', difficultyColor: '#FF9800', exercises: 8,  calories: 380, category: 'Strength',  assigned: ['Marcus Vane', 'Tom Bradley'],           description: 'Progressive overload program focused on compound movements for maximum muscle hypertrophy.' },
  { id: '3', name: 'Morning Flow',    duration: '30 min', difficulty: 'Beginner',     difficultyColor: '#4CAF50', exercises: 10, calories: 180, category: 'Mobility',  assigned: ["Elena D'Amico"],                        description: 'Gentle yoga-inspired flow to improve flexibility, posture, and mindfulness.' },
  { id: '4', name: 'Endurance Run',   duration: '50 min', difficulty: 'Intermediate', difficultyColor: '#FF9800', exercises: 5,  calories: 450, category: 'Cardio',    assigned: ['Elena Rodriguez', 'Michael Ross'],      description: 'Structured cardio session with intervals to build aerobic capacity and mental toughness.' },
];

// NEW: Nutrition Logs
export const nutritionData = {
  summary: {
    dailyCalories:   1840,
    weeklyCalories: 12880,
    proteinIntake:    148,  // grams
    complianceRate:    87,  // percent
  },
  meals: [
    { id: 'm1', name: 'Oatmeal + Berries', time: '7:30 AM',  calories: 320, protein: 12, carbs: 52, fat: 6,  emoji: '🥣' },
    { id: 'm2', name: 'Grilled Chicken',   time: '12:00 PM', calories: 480, protein: 52, carbs: 18, fat: 14, emoji: '🍗' },
    { id: 'm3', name: 'Greek Yogurt',      time: '3:00 PM',  calories: 180, protein: 18, carbs: 14, fat: 4,  emoji: '🫙' },
    { id: 'm4', name: 'Salmon + Rice',     time: '7:00 PM',  calories: 560, protein: 44, carbs: 48, fat: 16, emoji: '🐟' },
    { id: 'm5', name: 'Protein Shake',     time: '9:00 PM',  calories: 220, protein: 26, carbs: 12, fat: 4,  emoji: '🥤' },
  ],
};

// ─── Insights / Reports Data ──────────────────────────────────────────────────
export const insightsData = {
  summary: {
    activeClients: 24, avgGoalCompletion: 78, sessionsThisWeek: 18, aiRecommendations: 5,
  },
  topPerformers: [
    { name: 'Elena Rodriguez', improvement: '+18%', metric: 'VO2 Max'     },
    { name: 'Sarah Chen',      improvement: '+12%', metric: 'Weight Loss' },
    { name: 'Marcus Vane',     improvement: '+9%',  metric: 'Strength'    },
  ],
  alerts: [
    { client: 'Marcus Vane', type: 'Recovery',  message: 'Recovery score below threshold for 3 days', severity: 'high'   },
    { client: 'Sarah Chen',  type: 'Nutrition', message: 'Protein intake 15% below target this week', severity: 'medium' },
  ],
  // NEW: Health Metrics
  healthMetrics: {
    weight:  '68.4 kg',
    height:  '172 cm',
    bmi:     '23.1',
    bodyFat: '18.4%',
  },
  // NEW: Blood Report
  bloodReport: [
    { label: 'Vitamin D',   value: '28 ng/mL',    status: 'Low',     statusColor: '#F44336', normal: '30–100 ng/mL' },
    { label: 'Cholesterol', value: '182 mg/dL',   status: 'Normal',  statusColor: '#4CAF50', normal: '<200 mg/dL' },
    { label: 'Blood Sugar', value: '94 mg/dL',    status: 'Normal',  statusColor: '#4CAF50', normal: '70–99 mg/dL' },
    { label: 'Hemoglobin',  value: '13.2 g/dL',   status: 'Low',     statusColor: '#FF9800', normal: '13.5–17.5 g/dL' },
  ],
  // NEW: Report charts
  weightProgress: [
    { month: 'Jan', weight: 72.1 }, { month: 'Feb', weight: 71.4 },
    { month: 'Mar', weight: 70.8 }, { month: 'Apr', weight: 69.9 },
    { month: 'May', weight: 69.2 }, { month: 'Jun', weight: 68.4 },
  ],
  bmiTrend: [
    { month: 'Jan', bmi: 24.3 }, { month: 'Feb', bmi: 24.1 },
    { month: 'Mar', bmi: 23.8 }, { month: 'Apr', bmi: 23.5 },
    { month: 'May', bmi: 23.3 }, { month: 'Jun', bmi: 23.1 },
  ],
  reportSummary: {
    weightLost:      '3.7 kg',
    caloriesTracked: '84,920',
    bmiImprovement:  '−1.2',
    dietCompliance:  '87%',
  },
};

// ─── Client Profile / Membership ─────────────────────────────────────────────
export const clientProfileData = {
  membership: {
    type: 'Premium',
    startDate: '28 Dec 2025',
    endDate: '28 Jun 2026',
    status: 'Active',
  },
  activityTimeline: [
    { id: 'tl1', event: 'Joined the Gym',            date: '28 Dec 2025', icon: 'person-add',       color: '#E8E840' },
    { id: 'tl2', event: 'Uploaded Blood Report',      date: '10 Jan 2026', icon: 'medical',          color: '#F44336' },
    { id: 'tl3', event: 'Updated Weight: 70.2 kg',   date: '01 Feb 2026', icon: 'scale',            color: '#B8B8D8' },
    { id: 'tl4', event: 'Diet Plan Published',        date: '15 Feb 2026', icon: 'nutrition',        color: '#4CAF50' },
    { id: 'tl5', event: 'Completed Monthly Review',   date: '01 Mar 2026', icon: 'checkmark-circle', color: '#4CAF50' },
    { id: 'tl6', event: 'Updated Weight: 68.4 kg',   date: '01 Jun 2026', icon: 'scale',            color: '#E8E840' },
  ],
};
