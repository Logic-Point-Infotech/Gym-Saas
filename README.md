# MacroMate: AI Fitness & Nutrition Ecosystem

A professional-grade fitness platform consisting of a React Native Android App and a Node.js Express/MySQL Backend.

## 🚀 Features
- **AI Meal Camera**: Instant food detection and macro logging.
- **Health Reports**: PDF analysis and biometric tracking.
- **Workout Engine**: Daily routines assigned by trainers with session logging.
- **Portal Ecosystem**: Integration ready for Admin and Trainer dashboards.
- **Dual Theme**: High-performance "Deep Void & Electric Lime" design.

---

## 🛠️ Backend Setup (macromate-backend)

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- Android Studio (for emulator)

### Installation
1.  **Clone and Install**:
    ```bash
    cd macromate-backend
    npm install
    ```
2.  **Environment Config**:
    Create a `.env` file:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=macromate_db
    JWT_SECRET=your_secret
    NODE_ENV=development
    ```
3.  **Database Seeding**:
    Run the `seed.sql` script in your MySQL workbench to populate the initial gym, trainer, and test client.

4.  **Launch**:
    ```bash
    npm run dev
    ```

---

## 📱 App Setup (MacroMateClientApp)

### Run instructions
1.  **Start Metro**:
    ```bash
    npx react-native start
    ```
2.  **Connect Device**:
    ```bash
    adb reverse tcp:5000 tcp:5000
    ```
3.  **Launch Android**:
    ```bash
    $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
    npx react-native run-android
    ```

### Test Credentials
- **Email**: `client@macromate.com`
- **Password**: `Client123`

---

## 🔗 API Endpoints Summary
- `POST /api/auth/login` - Auth Entry
- `GET /api/profile` - User Context
- `GET /api/nutrition/log/today` - Calories/Macros
- `POST /api/health/blood-report` - AI OCR Analysis
- `GET /api/workout/plan` - Routine Delivery
