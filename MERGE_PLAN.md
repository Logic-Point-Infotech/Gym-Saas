# MERGE PLAN: MacroMate

This document outlines the exact ordered steps to complete Phase 3 (Execute the Merge) and Phase 4 (Verification).

---

## Step 1: Foundations (Theme, Constants & Utilities)
* **Goal**: Ensure theme values, color tokens, and helpers strictly conform to CURRENT rules.
* **Files**: `src/constants/theme.js`, `src/constants/ThemeContext.js`, `src/utils/helpers.js`
* **Verification**: Inspect colors (#0A0A12, #1A1A1A, #303030, #E8E840) and storage keys.

## Step 2: API Architecture & Modules
* **Goal**: Ensure all screen data calls go through named API functions without direct Axios usage.
* **Files**: `src/api/client.js`, `src/api/authApi.js`, `src/api/healthApi.js`, `src/api/nutritionApi.js`, `src/api/profileApi.js`, `src/api/workoutApi.js`, `src/api/notificationApi.js`
* **Verification**: Confirm `client.js` uses `localhost:5000/api` with request/response interceptors.

## Step 3: Backend Schema, Controllers & Routes
* **Goal**: Ensure backend database schema, migrations, and controllers support all endpoints (auth, member-history, health metrics, blood report upload, nutrition, workout, attendance).
* **Files**: `macromate-backend/index.js`, `controllers/*`, `routes/*`, `migrations/addMemberId.sql`
* **Verification**: Verify route mounting and raw `mysql2` parameterized queries.

## Step 4: Restore & Mount `DietPlanScreen`
* **Goal**: Restore `DietPlanScreen.js` with full UI, assigned trainer details, guidelines, timed meals, and lock overlay.
* **Files**: `src/screens/DietPlanScreen.js`, `src/navigation/TabNavigator.js`
* **Verification**: Mount in `TabNavigator.js` or stack and confirm rendering.

## Step 5: Restore & Mount `TrainerScreen`
* **Goal**: Restore `TrainerScreen.js` with trainer card, rating badge, daily tips grid, and direct chat input.
* **Files**: `src/screens/TrainerScreen.js`, `src/navigation/TabNavigator.js`
* **Verification**: Mount in `TabNavigator.js` or stack and confirm rendering.

## Step 6: Restore Standalone `BloodReportScreen`
* **Goal**: Replace the redirect placeholder shell in `BloodReportScreen.js` with a full-featured screen for biometrics calculation, document/PDF picking, multipart upload to `POST /api/health/blood-report`, and AI insights display.
* **Files**: `src/screens/BloodReportScreen.js`, `src/screens/HealthReportScreen.js`, `src/api/healthApi.js`, `src/navigation/AppNavigator.js`
* **Verification**: Confirm both `BloodReportScreen` and `HealthReportScreen` are fully functional and navigable.

## Step 7: Verify Meal Camera & Food Scan Flow
* **Goal**: Ensure `NutritionScreen.js` and `useFoodAnalysis.js` allow image picking (Camera / Gallery), AI macro detection, and real meal logging to the backend database.
* **Files**: `src/screens/NutritionScreen.js`, `src/hooks/useFoodAnalysis.js`
* **Verification**: Confirm meal logs persist to backend and reflect in Daily Log.

## Step 8: Full Navigation Integration & Cleanup
* **Goal**: Ensure all screens (`HomeScreen`, `NutritionScreen`, `Workouts`, `Profile`, `DietPlan`, `Trainer`, `HealthReport`, `BloodReport`, `Notifications`, `MemberHistory`, `RegistrationSuccess`) are correctly wired in React Navigation.
* **Files**: `src/navigation/TabNavigator.js`, `src/navigation/AppNavigator.js`, `src/navigation/AuthNavigator.js`
* **Verification**: Check for any unhandled routes or broken navigation targets.

## Step 9: Final End-to-End Verification & Report
* **Goal**: Verify backend startup, test endpoints, check Metro bundle, and produce `MERGE_REPORT.md`.
* **Files**: `MERGE_REPORT.md`
* **Verification**: Run backend health check & full feature audit.

---
