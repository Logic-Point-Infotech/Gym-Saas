// macromate-backend/scripts/testAutomations.js
const { generateAutomatedReport } = require('../services/automatedHealthReportService');
const { analyzeHealthProgress } = require('../services/aiHealthAnalysisService');
const { analyzeMealPhoto } = require('../services/nutritionVisionService');
const { getClientProgressSummary } = require('../services/progressMonitoringService');
const {
  getTrainerAutomatedInsights,
  getTrainerClientReport,
  executeTrainerQuickAction,
} = require('../services/trainerAutomationService');

async function runAutomationTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING VYAYAMAI AUTOMATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // 1. AUTOMATION 1: Automated Health Reports
  try {
    console.log('▶ [TEST 1] Automated Health Reports...');
    const report = await generateAutomatedReport(3);
    console.log('   Client:', report.client_name, `(${report.member_id})`);
    console.log('   Health Composite Score:', report.health_score, '| Status:', report.status);
    console.log('   BMR:', report.biometrics.bmr, 'kcal | TDEE:', report.biometrics.tdee, 'kcal');
    console.log('   Workout Adherence:', `${report.workouts.adherence_pct}%`);
    console.log('   Nutrition Compliance:', `${report.nutrition.adherence_pct}%`);
    console.log('   Executive Narrative Snippet:\n   ', report.summary_text.slice(0, 150) + '...\n');

    if (report.health_score > 0 && report.biometrics.bmr > 0 && report.summary_text) {
      console.log('   ✅ PASS: Automated Health Report generated successfully with zero manual data entry.\n');
      passed++;
    } else {
      throw new Error('Report data missing essential fields');
    }
  } catch (e) {
    console.error('   ❌ FAIL: Test 1 failed:', e.message);
    failed++;
  }

  // 2. AUTOMATION 2: AI Health Analysis
  try {
    console.log('▶ [TEST 2] AI Health Analysis...');
    const analysis = await analyzeHealthProgress(3);
    console.log('   Trajectory Title:', analysis.trajectory_title);
    console.log('   Velocity:', `${analysis.velocity.weekly_kg_change} kg/week`);
    console.log('   BMI Category Shift:', `${analysis.bmi_analysis.initial_category} -> ${analysis.bmi_analysis.current_category}`);
    console.log('   Identified Changes count:', analysis.identified_changes.length);
    analysis.identified_changes.forEach(c => {
      console.log(`     • ${c.metric}: ${c.change} (${c.from} -> ${c.to})`);
    });
    console.log('   AI Narrative:', analysis.narrative_insight.slice(0, 140) + '...\n');

    if (analysis.identified_changes.length > 0 && analysis.trajectory_title) {
      console.log('   ✅ PASS: AI Health Analysis identified metric changes and trajectory velocity automatically.\n');
      passed++;
    } else {
      throw new Error('Analysis missing metric changes');
    }
  } catch (e) {
    console.error('   ❌ FAIL: Test 2 failed:', e.message);
    failed++;
  }

  // 3. AUTOMATION 3: Automated Nutrition Tracking
  try {
    console.log('▶ [TEST 3] Automated Nutrition Tracking from Photo...');
    const nutrition = await analyzeMealPhoto({
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
      mealType: 'auto',
      autoLog: true,
      clientId: 3,
    });

    console.log('   Auto-Inferred Meal Type:', nutrition.meal_type);
    console.log('   Detected Dishes:', nutrition.detected_foods.join(', '));
    console.log(`   Calculated Macros: ${nutrition.totals.calories} kcal | ${nutrition.totals.protein}g Protein | ${nutrition.totals.carbs}g Carbs | ${nutrition.totals.fat}g Fat`);
    console.log('   Macro Distribution:', `${nutrition.macro_breakdown.protein_pct}% P, ${nutrition.macro_breakdown.carbs_pct}% C, ${nutrition.macro_breakdown.fat_pct}% F`);
    console.log('   Auto-Logged to DB:', nutrition.auto_logged ? 'YES (Zero-Click Confirmation)' : 'NO');

    if (nutrition.totals.calories > 0 && nutrition.totals.protein > 0 && nutrition.detected_foods.length > 0) {
      console.log('   ✅ PASS: Automated Nutrition Tracking successfully calculated calories & macros from photo.\n');
      passed++;
    } else {
      throw new Error('Nutrition tracking failed to calculate macros');
    }
  } catch (e) {
    console.error('   ❌ FAIL: Test 3 failed:', e.message);
    failed++;
  }

  // 4. AUTOMATION 4: Progress Monitoring Over Time
  try {
    console.log('▶ [TEST 4] Progress Monitoring & Summary Generation...');
    const progress = await getClientProgressSummary(3, 30);
    console.log('   Start Weight:', progress.metrics_summary.start_weight_kg, 'kg -> Current Weight:', progress.metrics_summary.current_weight_kg, 'kg');
    console.log('   Total Net Delta:', `${progress.metrics_summary.total_weight_delta_kg} kg (${progress.metrics_summary.total_weight_delta_pct}%)`);
    console.log('   Projected Goal ETA:', `${progress.metrics_summary.projected_weeks_to_goal} weeks`);
    console.log('   Chart Points count:', progress.chart_series.weight_series.length);
    console.log('   Auto-Generated Progress Narrative:\n   ', progress.narrative_summary.slice(0, 160) + '...\n');

    if (progress.chart_series.weight_series.length > 0 && progress.narrative_summary) {
      console.log('   ✅ PASS: Progress Monitoring successfully generated time series and narrative progress summary.\n');
      passed++;
    } else {
      throw new Error('Progress summary failed');
    }
  } catch (e) {
    console.error('   ❌ FAIL: Test 4 failed:', e.message);
    failed++;
  }

  // 5. AUTOMATION 5: Automated Trainer Insights
  try {
    console.log('▶ [TEST 5] Automated Trainer Insights...');
    const insights = await getTrainerAutomatedInsights(2);
    console.log('   Clients Monitored:', insights.overview.total_clients);
    console.log('   On Track:', insights.overview.on_track, '| At Risk:', insights.overview.at_risk, '| Plateaus:', insights.overview.plateau);
    console.log('   Generated Progress Alerts count:', insights.progress_alerts.length);
    insights.progress_alerts.forEach(a => {
      console.log(`     [${a.severity.toUpperCase()}] ${a.title} -> Action: ${a.recommended_action}`);
    });
    console.log('   AI Daily Briefing Priorities count:', insights.daily_briefing.priorities.length);

    // Test 1-Tap Quick Action
    console.log('   Testing 1-Tap Quick Action execution...');
    const actionResult = await executeTrainerQuickAction({
      trainerId: 2,
      clientId: 3,
      actionType: 'send_notification',
      payload: { title: 'Test Motivation', message: 'Keep pushing, session logged!' },
    });
    console.log('   Action Execution Result:', actionResult.message);

    if (insights.client_reports.length > 0 && insights.progress_alerts.length > 0 && actionResult.success) {
      console.log('   ✅ PASS: Automated Trainer Insights generated client-wise reports, alerts, and 1-tap actions.\n');
      passed++;
    } else {
      throw new Error('Trainer insights missing reports or alerts');
    }
  } catch (e) {
    console.error('   ❌ FAIL: Test 5 failed:', e.message);
    failed++;
  }

  console.log('====================================================');
  console.log(`🏁 TEST SUITE COMPLETED: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');
}

runAutomationTests();
