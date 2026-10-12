// src/trainer/context/AIContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { aiApi } from '../services/api';

const AIContext = createContext({});

export function AIProvider({ children }) {
  const [riskScores,    setRiskScores]    = useState({ summary: { high: 0, medium: 0, low: 0, total: 0 }, data: [] });
  const [dailyBriefing, setDailyBriefing] = useState(null);
  const [riskLoading,   setRiskLoading]   = useState(false);
  const [briefingLoading, setBriefingLoading] = useState(false);

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

  const getClientRisk = useCallback((clientId) => {
    const found = riskScores.data?.find(c => c.id === clientId);
    return found?.risk ?? 'low';
  }, [riskScores]);

  useEffect(() => {
    fetchRiskScores();
    fetchDailyBriefing();
  }, []);

  return (
    <AIContext.Provider value={{
      riskScores, riskLoading, fetchRiskScores, getClientRisk,
      dailyBriefing, briefingLoading, fetchDailyBriefing,
    }}>
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => useContext(AIContext);
