# MERGE AUDIT REPORT: MacroMate

This document provides a comprehensive audit comparison between the BASELINE version (`gym_automation`) and the CURRENT working version (`MacroMate`).

---

## A. Complete File Inventory Comparison

| File / Component | BASELINE (`gym_automation`) | CURRENT (`MacroMate`) | Status |
| :--- | :--- | :--- | :--- |
| **App Entry & Navigation** | | | |
| `App.js` | N/A (UI Specs in HTML) | Present (`App.js`) | CURRENT only |
| `index.js` | N/A | Present (`index.js`) | CURRENT only |
| `src/navigation/AppNavigator.js` | N/A | Present | CURRENT only |
| `src/navigation/AuthNavigator.js` | N/A | Present | CURRENT only |
| `src/navigation/TabNavigator.js` | N/A | Present (missing Trainer & DietPlan tabs/stack) | Both (Needs merge) |
| **Screens** | | | |
| `SplashScreen.js` | N/A | Present (`src/screens/SplashScreen.js`) | CURRENT only |
| `LoginScreen.js` | N/A | Present (`src/screens/LoginScreen.js`) | CURRENT only (Member ID Auth) |
| `RegisterScreen.js` | N/A | Present (`src/screens/RegisterScreen.js`) | CURRENT only |
| `RegistrationSuccessScreen.js` | N/A | Present (`src/screens/RegistrationSuccessScreen.js`) | CURRENT only |
| `HomeScreen.js` | Present (`extracted/dashboard/code.html`) | Present (`src/screens/HomeScreen.js`) | Both |
| `NutritionScreen.js` | Present (`extracted/nutrition/code.html`) | Present (`src/screens/NutritionScreen.js`) | Both |
| `DietPlanScreen.js` | Present (`extracted/diet_plan/code.html`) | Present (`src/screens/DietPlanScreen.js`) | Both (Not mounted in Nav) |
| `TrainerScreen.js` | Present (`extracted/trainer/code.html`) | Present (`src/screens/TrainerScreen.js`) | Both (Not mounted in Nav) |
| `WorkoutScreen.js` | N/A | Present (`src/screens/WorkoutScreen.js`) | CURRENT only |
| `ProfileScreen.js` | Present (`extracted/profile/code.html`) | Present (`src/screens/ProfileScreen.js`) | Both |
| `HealthReportScreen.js` | N/A | Present (`src/screens/HealthReportScreen.js`) | CURRENT only |
| `BloodReportScreen.js` | N/A | Present (`src/screens/BloodReportScreen.js`) | CURRENT only (Placeholder redirect shell) |
| `NotificationsScreen.js` | N/A | Present (`src/screens/NotificationsScreen.js`) | CURRENT only |
| `MemberHistoryScreen.js` | N/A | Present (`src/screens/MemberHistoryScreen.js`) | CURRENT only |
| **Components** | | | |
| `CalorieRing.js` | N/A | Present (`src/components/CalorieRing.js`) | CURRENT only |
| `ExerciseItem.js` | N/A | Present (`src/components/ExerciseItem.js`) | CURRENT only |
| `MacroCard.js` | N/A | Present (`src/components/MacroCard.js`) | CURRENT only |
| `MealLogItem.js` | N/A | Present (`src/components/MealLogItem.js`) | CURRENT only |
| `NotificationItem.js` | N/A | Present (`src/components/NotificationItem.js`) | CURRENT only |
| `ProgressChart.js` | N/A | Present (`src/components/ProgressChart.js`) | CURRENT only |
| `ReportInsightItem.js` | N/A | Present (`src/components/ReportInsightItem.js`) | CURRENT only |
| **API Modules & State** | | | |
| `src/api/client.js` | N/A | Present (Axios client with interceptors) | CURRENT only |
| `src/api/authApi.js` | N/A | Present | CURRENT only |
| `src/api/healthApi.js` | N/A | Present | CURRENT only |
| `src/api/notificationApi.js` | N/A | Present | CURRENT only |
| `src/api/nutritionApi.js` | N/A | Present | CURRENT only |
| `src/api/profileApi.js` | N/A | Present | CURRENT only |
| `src/api/workoutApi.js` | N/A | Present | CURRENT only |
| `src/context/AuthContext.js` | N/A | Present | CURRENT only |
| `src/hooks/useFoodAnalysis.js` | N/A | Present | CURRENT only |
| **Constants & Utilities** | | | |
| `src/constants/theme.js` | Present (`DESIGN.md` Kinetic Dark) | Present (Dark Slate Theme #0A0A12) | CURRENT Theme Rules |
| `src/constants/ThemeContext.js` | N/A | Present | CURRENT only |
| `src/utils/helpers.js` | N/A | Present | CURRENT only |
| `src/utils/mockData.js` | N/A | Present | CURRENT only |
| **Backend (Node.js/Express)** | | | |
| `macromate-backend/index.js` | N/A | Present | CURRENT only |
| `macromate-backend/config/db.js` | N/A | Present | CURRENT only |
| `macromate-backend/controllers/*` | N/A | Present (auth, health, notification, nutrition, profile, workout, attendance) | CURRENT only |
| `macromate-backend/routes/*` | N/A | Present | CURRENT only |
| `macromate-backend/middleware/*` | N/A | Present (`authMiddleware.js`) | CURRENT only |
| `macromate-backend/migrations/*` | N/A | Present (`addMemberId.sql`) | CURRENT only |
| `macromate-backend/scripts/*` | N/A | Present (`backfillMemberIds.js`) | CURRENT only |
| `macromate-backend/utils/*` | N/A | Present (`memberIdGenerator.js`) | CURRENT only |

---

## B. Feature Matrix Table

| Feature Name | Exists in BASELINE | Exists in CURRENT | Quality in BASELINE | Quality in CURRENT | File Paths Involved | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Splash & Token Launch Check** | No | Yes | N/A | Complete | `src/screens/SplashScreen.js`, `AppNavigator.js` | Keep CURRENT |
| **Member ID Auth & Login** | No | Yes | N/A | Complete | `LoginScreen.js`, `authApi.js`, `authController.js` | Keep CURRENT |
| **Registration & Member ID Display** | No | Yes | N/A | Complete | `RegisterScreen.js`, `RegistrationSuccessScreen.js` | Keep CURRENT |
| **Home Dashboard** | Yes | Yes | HTML Spec | Complete | `HomeScreen.js`, `CalorieRing.js`, `MacroCard.js` | Keep CURRENT & merge missing widgets |
| **Nutrition & Meal Camera** | Yes | Yes | HTML Spec | Partial/Working | `NutritionScreen.js`, `useFoodAnalysis.js`, `nutritionApi.js` | Merge & complete meal capture |
| **Diet Plan View & Locking** | Yes | Yes | HTML Spec | Complete (Unmounted) | `DietPlanScreen.js`, `TabNavigator.js` | Mount in Navigation & restore |
| **Trainer Profile & Chat** | Yes | Yes | HTML Spec | Complete (Unmounted) | `TrainerScreen.js`, `TabNavigator.js` | Mount in Navigation & restore |
| **Workout Plan & History** | No | Yes | N/A | Complete | `WorkoutScreen.js`, `ExerciseItem.js`, `workoutApi.js` | Keep CURRENT |
| **Profile & Member ID** | Yes | Yes | HTML Spec | Complete | `ProfileScreen.js`, `profileApi.js`, `profileController.js` | Keep CURRENT |
| **Member History Tabs** | No | Yes | N/A | Complete | `MemberHistoryScreen.js`, `profileController.js` | Keep CURRENT |
| **Blood Report & Document Upload** | No | Yes | N/A | Placeholder shell | `BloodReportScreen.js`, `HealthReportScreen.js`, `healthController.js` | Rebuild `BloodReportScreen` with real document picker & multipart upload |
| **Notifications & Read Status** | No | Yes | N/A | Complete | `NotificationsScreen.js`, `notificationApi.js` | Keep CURRENT |

---

## C. Restoration List (Features Missing or Broken in CURRENT)

1. **Mount & Integrate `DietPlanScreen`**:
   - `DietPlanScreen.js` exists in `src/screens/DietPlanScreen.js` based on BASELINE's `extracted/diet_plan/code.html`, but it is currently unmounted from `TabNavigator.js`.
   - **Action:** Add `DietPlanScreen` as a tab or sub-stack in `TabNavigator.js` so users can access their assigned diet plan, daily guidelines, timed meal sections, and trainer lock overlays.
2. **Mount & Integrate `TrainerScreen`**:
   - `TrainerScreen.js` exists in `src/screens/TrainerScreen.js` based on BASELINE's `extracted/trainer/code.html`, but it is currently unmounted from navigation.
   - **Action:** Mount `TrainerScreen` inside `TabNavigator.js` / stack, allowing clients to view trainer details, rating, tips grid, and direct trainer messaging.
3. **Restore `BloodReportScreen` Functionality**:
   - `BloodReportScreen.js` is currently a placeholder shell redirecting to `HealthReportScreen`.
   - **Action:** Restore `BloodReportScreen.js` as a full standalone screen supporting real document/PDF picking (`react-native-document-picker` or image picker), body biometrics update (weight, height, BMI calculation), real multipart API upload to backend `POST /api/health/blood-report`, and AI report insight badge rendering.
4. **Complete Meal Camera Gallery Picker & Confirmation Flow**:
   - Ensure `useFoodAnalysis` and `NutritionScreen` allow selecting images from both Camera and Gallery, displaying detected food macro breakdowns, confirming, and logging to the backend database via `logMeal`.

---

## D. Preserve List (Unique to CURRENT)

1. **Unique Member ID System**:
   - Sequential ID generator (`MM-YYYY-XXXXX`), `addMemberId.sql` migration, `backfillMemberIds.js` script, and `authController` registration/login by `member_id`.
   - `RegistrationSuccessScreen.js` with copy-to-clipboard button and Member ID display.
2. **Context-Based Auth & Theme State**:
   - `AuthContext.js` managing global user token state and seamless login/logout state transitions.
   - `ThemeContext.js` providing dynamic dark slate theme tokens across all screens.
3. **Profile & Member History**:
   - `ProfileScreen.js` displaying Member ID with fingerprint icon and 5-tab `MemberHistoryScreen.js` (Memberships, Trainers, Health, Nutrition, Documents).
4. **Workout Tracker & Workout Plans**:
   - `WorkoutScreen.js` with exercise sets/reps expansion, day completion checkboxes, and workout history logging.
5. **Backend Raw MySQL Database Integration**:
   - Raw `mysql2` parameterized queries across all controllers, JWT authentication middleware, and seed scripts.

---

## E. Style & Coding Rules Extraction (CURRENT)

* **Color Theme Constants (`src/constants/theme.js`)**:
  - `background`: `'#0A0A12'`
  - `surface`: `'#1A1A1A'`
  - `border`: `'#303030'`
  - `muted`: `'#606060'`
  - `textSecondary`: `'#909090'`
  - `textPrimary`: `'#C0C0C0'`
  - `heading`: `'#F0F0F0'`
  - `primary`: `'#E8E840'` (Accent Yellow)
  - `onPrimary`: `'#0A0A12'`
  - `secondary`: `'#B8B8D8'`
  - `success`: `'#4CAF50'`
  - `warning`: `'#FF9800'`
  - `error`: `'#FF5252'`
* **Typography & Spacing**:
  - Derived from `theme.js` using `SIZES`, `SPACING`, and `FONTS`. Hardcoded hex colors in components are strictly prohibited; all colors must be sourced from `theme` or `useTheme()`.
* **State & Network Conventions**:
  - Screen components must **never** invoke `axios` directly; all API calls must use named functions from `src/api/*`.
  - Loading states render `<ActivityIndicator size="large" color={theme.primary} />`.
  - Error states render user-friendly error messages with a Retry button.
  - Empty states render illustrative icons with clear placeholder messages.
* **Storage Keys (`src/utils/helpers.js`)**:
  - `STORAGE_KEYS.TOKEN`: `'macromate_token'`
  - `STORAGE_KEYS.USER`: `'macromate_user'`
* **Backend Coding Standards**:
  - Only raw parameterized SQL placeholders (`?`) with `mysql2` promise pool.
  - All controllers wrapped in `try/catch` passing errors to `next(error)`.
  - Protected endpoints require `protect` JWT middleware attaching `req.user`.

---

## F. List of Conflicts & Resolutions

1. **Conflict: Unmounted `DietPlanScreen` and `TrainerScreen`**:
   - *Baseline:* Both screens are primary sections of the client app interface.
   - *Current:* Both files exist in `src/screens/` but are omitted from `TabNavigator.js`.
   - *Resolution:* Integrate `DietPlanScreen` and `TrainerScreen` into `TabNavigator.js` or `ProfileStack` so users can seamlessly navigate to them.
2. **Conflict: `BloodReportScreen` placeholder redirect**:
   - *Baseline/Current requirement:* `BloodReportScreen` should be a dedicated screen for uploading blood report PDFs and viewing biometrics & AI insights.
   - *Current implementation:* Currently shows "This screen has been integrated into Health Reports."
   - *Resolution:* Re-implement `BloodReportScreen.js` as a full feature screen with document picker and real API upload, while keeping `HealthReportScreen.js` intact.
3. **Conflict: Mock vs Real Data for Food Analysis & Document Upload**:
   - *Baseline/Current:* Food analysis and document upload should connect end-to-end with local pickers and backend endpoints.
   - *Resolution:* Connect `useFoodAnalysis` and `BloodReportScreen` to backend endpoints `POST /api/nutrition/meal` and `POST /api/health/blood-report` with fallback handling.

---
