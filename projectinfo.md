# Project Info: MacroMate (Member-Side App)

## What is this project?
**MacroMate** is a premium, AI-powered fitness and nutrition application built for members. The goal is to provide a precision health tool that bridges the gap between professional fitness tracking and medical-grade health insights. It is built using **Pure React Native CLI (v0.74.1)** to ensure maximum performance and native control, moving away from Expo for a more robust professional architecture.

---

## Features in Detail

### 1. AI Meal Camera & Daily Nutrition Log
*   **The Problem:** Traditional calorie counting is tedious and prone to manual entry errors.
*   **The Solution:** A vision-based nutrition tracker.
*   **Meal Camera:** Users capture or upload a photo of their meal. A multi-step UI flow ('capture' -> 'analysing' -> 'results' -> 'success') handles the lifecycle. The app simulates a 2.5-second AI analysis that detects multiple food items (e.g., Dal Makhani, Dosa, Chicken Biryani) and estimates portions and macros.
*   **Daily Log:** A high-contrast dashboard showing total calories consumed vs. daily target with a progress ring. It includes a macro-summary (Protein, Carbs, Fats) and a scrollable list of recent meals with thumbnails.

### 2. Blood Report Analysis & Biometrics
*   **The Problem:** Blood reports are hard for average users to interpret and track over time.
*   **The Solution:** A dedicated health portal to bridge lab results with fitness.
*   **Biometrics Update:** Real-time BMI calculator where users input height and weight. Validates values (30–250kg weight, 100–250cm height) before saving.
*   **PDF Analysis:** A dashed-border upload interface using `react-native-document-picker` (mocked for environment stability). Users "upload" their report, and the app extracts key markers like Vitamin D, Cholesterol, Hemoglobin, and Blood Sugar.
*   **Insights:** Markers are displayed with status tags (Normal, Low, High) color-coded (Green, Amber, Red) to highlight health priorities.

### 3. Dynamic Workout Plans
*   **The Solution:** A routine-based workout tracker.
*   **Daily Routine:** Shows the focus of the day (e.g., "Chest & Triceps").
*   **Exercise Tracking:** A list of specific exercises with sets and reps. Features a native check-button to mark completion, providing immediate visual feedback.

### 4. Professional Multi-Mode UI
*   **The Problem:** Many fitness apps feel too "sporty" (overusing bright oranges/reds) or lack accessibility in different lighting.
*   **The Solution:** A mature "Teal & Slate" palette with full **Dark/Light Mode** support.
*   **Light Mode:** Deep Teal (#0F766E) on cool white backgrounds (#F8FAFC). Clean, medical-grade feel.
*   **Dark Mode:** Pop Teal (#2DD4BF) on deep navy backgrounds (#0A0F1E). Premium, "Whoop-style" high-end wearable feel.

---

## Technical Steps & Update Log

### Step 1: Migration & Environment Stabilization
*   **What:** Migrated from Expo to React Native CLI.
*   **Why:** Expo was causing native build conflicts with specific libraries required for the OCR and document picking features.
*   **How:** 
    *   Updated `package.json` to pure React Native dependencies.
    *   Re-initialized the `android/` and `ios/` folders.
    *   Patched `minSdkVersion` to 24 in `build.gradle` to resolve `react-native-screens` conflicts.
    *   **The NDK Fix:** Identified that the default NDK version was corrupted. Located and pointed the project to a healthy NDK version (`27.1.12297006`) to enable successful APK assembly.

### Step 2: Authentication & Core Navigation
*   **What:** Built the Splash, Login, and Register screens.
*   **Where:** `src/screens/` and `src/navigation/`.
*   **Why:** To establish the user lifecycle. 
*   **How:** Implemented `AppNavigator` with a conditional stack. Fixed a "REPLACE" action error by ensuring the Main tab stack is always available in the navigator so the Login screen can target it immediately upon success.

### Step 3: Nutrition & AI Pipeline
*   **What:** Created `NutritionScreen.js` and `useFoodAnalysis.js`.
*   **How:** Integrated `react-native-image-picker`. Designed a state machine to move users through the capture and analysis phases. Created a pool of 10 Indian meal types in `mockData.js` to simulate random, realistic detection results.

### Step 4: Health markers & Biometrics
*   **What:** Created `BloodReportScreen.js`.
*   **How:** Built a real-time BMI engine using React `useEffect` hooks. Styled a custom dashed-border upload box for PDFs. Since native module linking was failing on the specific physical device connection, I implemented a robust mock-selection fallback so the user can still experience the full UI flow.

### Step 5: Native Icon & Visibility Overhaul
*   **What:** Linked `react-native-vector-icons` and fixed text contrast.
*   **Why:** Icons were showing as "X" or boxes because the font files weren't linked to the Android assets. Text was invisible on some backgrounds.
*   **How:**
    *   Added `apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"` to `android/app/build.gradle`.
    *   Refactored all components to use theme-based colors (`theme.textPrimary`, `theme.primary`, etc.) instead of hardcoded values.

### Step 6: Dark/Light Mode Implementation
*   **What:** Developed `ThemeContext.js`.
*   **Why:** To provide a premium user experience and better accessibility.
*   **How:** 
    *   Wrapped the entire app in a `ThemeProvider`.
    *   Used `AsyncStorage` to persist the user's theme choice.
    *   Updated `CalorieRing` (SVG) and `MacroCard` to respond instantly to theme changes without screen flickering.
    *   Switched the primary brand color from Orange to **Teal**, aligning with the new "Professional/Medical" design direction.

### Step 7: Rebranding to MacroMate
*   **What:** Renamed the app from "Vyayamai" to "MacroMate".
*   **How:** Updated `app.json`, `package.json`, `strings.xml`, and all UI components to reflect the new brand name.
