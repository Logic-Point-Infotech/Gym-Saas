// src/utils/mockData.js

export const MOCK_USER = {
  id: '1',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  age: 25,
  weight: 75,
  height: 175,
  gender: 'Male',
  goal: 'Muscle Gain',
  dietaryPreference: 'Non-Veg',
  membershipStatus: 'Active',
  expiryDate: '15 Dec 2026',
  profilePhoto: 'https://via.placeholder.com/150',
};

export const MOCK_MEALS = [
  {
    id: '1',
    name: 'Oatmeal with Almonds',
    portion: '1 bowl',
    calories: 350,
    protein: 12,
    carbs: 55,
    fat: 8,
    time: '08:30 AM',
    image: 'https://via.placeholder.com/100',
    verificationStatus: 'Verified by Coach',
    coachComment: 'Perfect post-fasting meal. Good protein-carb balance.',
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    portion: '250g',
    calories: 450,
    protein: 45,
    carbs: 10,
    fat: 15,
    time: '01:30 PM',
    image: 'https://via.placeholder.com/100',
    verificationStatus: 'Pending Trainer Verification',
    coachComment: null,
  },
];

export const MOCK_TASKS = [
  { id: '1', title: 'Upload new blood report', dueDate: 'Friday', completed: false, category: 'Medical' },
  { id: '2', title: 'Complete Leg Day workout', dueDate: 'Today', completed: true, category: 'Workout' },
  { id: '3', title: 'Drink 4L water', dueDate: 'Today', completed: false, category: 'Hydration' },
];

export const MOCK_COACH_RECOMMENDATION = {
  id: 'rec1',
  title: 'Active Recovery Focus',
  content: 'Your legs need more rest. Swap tomorrow’s deadlifts for 20 mins of light swimming or cycling.',
  type: 'Quick Action',
  timestamp: '2 hours ago',
};

export const MOCK_WEIGHT_HISTORY = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [82, 80, 78, 77, 76, 75],
      color: (opacity = 1) => `rgba(232, 232, 64, ${opacity})`, // primary yellow
      strokeWidth: 2
    }
  ],
  legend: ["Weight Progress (kg)"]
};

export const MOCK_WORKOUT_PLAN = [
  {
    day: 'Monday',
    focus: 'Chest & Triceps',
    exercises: [
      { id: '1', name: 'Bench Press', sets: 4, reps: 10, notes: 'Focus on form', done: true },
      { id: '2', name: 'Incline Dumbbell Press', sets: 3, reps: 12, notes: '30 degree incline', done: true },
      { id: '3', name: 'Tricep Pushdowns', sets: 4, reps: 15, notes: 'Keep elbows tucked', done: false },
    ],
  },
];

export const BLOOD_REPORT_INSIGHTS = [
  { id: '1', label: 'Vitamin D', value: '15', unit: 'ng/mL', status: 'Low' },
  { id: '2', label: 'Total Cholesterol', value: '180', unit: 'mg/dL', status: 'Normal' },
  { id: '3', label: 'Hemoglobin', value: '13.5', unit: 'g/dL', status: 'Normal' },
];

export const DETECTED_FOODS_POOL = [
  { id: 'd1', foodName: 'Dal Makhani', portion: '1 bowl', calories: 180, protein: 9, carbs: 22, fat: 6 },
  { id: 'd2', foodName: 'Jeera Rice', portion: '1 cup', calories: 220, protein: 4, carbs: 45, fat: 2 },
];

export const DAILY_MEAL_LOG_MOCK = MOCK_MEALS.map(meal => ({
  id: meal.id,
  imageUri: meal.image,
  foodNames: meal.name,
  timeLogged: meal.time,
  totalCalories: meal.calories,
  macros: { protein: meal.protein, carbs: meal.carbs, fat: meal.fat },
  verificationStatus: meal.verificationStatus,
  coachComment: meal.coachComment,
}));
