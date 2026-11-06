// src/trainer/context/AIContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { aiApi, trainerAutomationApi } from '../services/api';

const AIContext = createContext({});

export function AIProvider({ children }) {
  const [riskScores, setRiskScores] = useState({ summary: { high: 0, medium: 0, low: 0, total: 0 }, data: [] });
  const [dailyBriefing, setDailyBriefing] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [briefingLoading, setBriefingLoading] = useState(false);

  // Automated Trainer Insights State (Automation #5)
  const [automatedInsights, setAutomatedInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const fetchAutomatedInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const res = await trainerAutomationApi.getAutomatedInsights();
      setAutomatedInsights(res);
      if (res.daily_briefing) {
        setDailyBriefing(res.daily_briefing);
      }
      if (res.overview) {
        setRiskScores({
          summary: {
            high: res.overview.at_risk,
            medium: res.overview.plateau,
            low: res.overview.on_track + res.overview.milestones,
            total: res.overview.total_clients,
          },
          data: (res.client_reports || []).map(c => ({
            id: c.client_id,
            name: c.name,
            risk: c.status === 'At Risk' ? 'high' : (c.status === 'Plateau' || c.status === 'Needs Review' ? 'medium' : 'low'),
            status: c.status,
          })),
        });
      }
    } catch (e) {
      console.log('[AIContext] Automated insights error:', e.message);
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  const fetchRiskScores = useCallback(async () => {
    setRiskLoading(true);
    try {
      const res = await aiApi.riskScores();
      setRiskScores(res);
    } catch (e) {
      console.log('[AIContext] Risk scores unavailable:', e.message);
    } finally {
      setRiskLoading(false);
    }
  }, []);

  const fetchDailyBriefing = useCallback(async () => {
    setBriefingLoading(true);
    try {
      const res = await aiApi.dailyBriefing('Coach Uday');
      setDailyBriefing(res.data);
    } catch (e) {
      console.log('[AIContext] Daily briefing unavailable:', e.message);
    } finally {
      setBriefingLoading(false);
    }
  }, []);

  const executeAction = useCallback(async (actionData) => {
    const res = await trainerAutomationApi.executeQuickAction(actionData);
    await fetchAutomatedInsights();
    return res;
  }, [fetchAutomatedInsights]);

  const getClientRisk = useCallback((clientId) => {
    const found = riskScores.data?.find(c => c.id === clientId);
    return found?.risk ?? 'low';
  }, [riskScores]);

  useEffect(() => {
    fetchAutomatedInsights();
  }, [fetchAutomatedInsights]);

  return (
    <AIContext.Provider value={{
      riskScores,
      riskLoading,
      fetchRiskScores,
      getClientRisk,
      dailyBriefing,
      briefingLoading,
      fetchDailyBriefing,
      automatedInsights,
      insightsLoading,
      fetchAutomatedInsights,
      executeAction,
    }}>
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => useContext(AIContext);
