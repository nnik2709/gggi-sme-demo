import { createContext, useContext, useState, useEffect } from 'react';
import smesData from '../data/smes.json';

const SMEContext = createContext();

export const useSME = () => {
  const context = useContext(SMEContext);
  if (!context) throw new Error('useSME must be used within SMEProvider');
  return context;
};

export const SMEProvider = ({ children }) => {
  const [smes, setSMEs] = useState([]);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [pendingSyncs, setPendingSyncs] = useState(0);
  const [surveysCompleted, setSurveysCompleted] = useState(4);

  useEffect(() => {
    setSMEs(smesData);
    const pending = localStorage.getItem('pendingSyncs');
    if (pending) setPendingSyncs(parseInt(pending, 10));
  }, []);

  const getSMEById = (id) => smes.find(sme => sme.id === id);

  const searchSMEs = (query, filters = {}) => {
    let filtered = [...smes];
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(sme =>
        sme.business_name.toLowerCase().includes(lowerQuery) ||
        sme.sector.toLowerCase().includes(lowerQuery) ||
        sme.province.toLowerCase().includes(lowerQuery)
      );
    }
    if (filters.province?.length) filtered = filtered.filter(s => filters.province.includes(s.province));
    if (filters.sector?.length)   filtered = filtered.filter(s => filters.sector.includes(s.sector));
    if (filters.women_led)        filtered = filtered.filter(s => s.women_led);
    if (filters.youth_led)        filtered = filtered.filter(s => s.youth_led);
    if (filters.climate_sensitive) filtered = filtered.filter(s => s.climate?.climate_sensitive_sector);
    if (filters.ipa_verified)     filtered = filtered.filter(s => s.ipa_verified);
    if (filters.status)           filtered = filtered.filter(s => s.status === filters.status);
    return filtered;
  };

  const saveSurvey = (surveyData) => {
    setCurrentSurvey(surveyData);
    localStorage.setItem('currentSurvey', JSON.stringify(surveyData));
  };

  const submitSurvey = () => {
    const newPending = pendingSyncs + 1;
    setPendingSyncs(newPending);
    localStorage.setItem('pendingSyncs', newPending.toString());
    setSurveysCompleted(prev => prev + 1);
    setCurrentSurvey(null);
    localStorage.removeItem('currentSurvey');
  };

  const syncData = () => {
    setPendingSyncs(0);
    localStorage.setItem('pendingSyncs', '0');
  };

  const getStatistics = () => {
    const total = smes.length;
    if (!total) return { total: 0 };

    const womenLed = smes.filter(s => s.women_led).length;
    const youthLed = smes.filter(s => s.youth_led).length;
    const pwdOwned = smes.filter(s => s.pwd_owned).length;
    const femaleDecisionMaker = smes.filter(s => s.female_decision_maker).length;
    const pending = smes.filter(s => s.status === 'Pending').length;

    // Finance
    const banked = smes.filter(s => s.banking_status && !s.banking_status.includes('Unbanked')).length;
    const financeAccess = smes.filter(s => s.access_to_finance).length;
    const mobileMoneyUsers = smes.filter(s => s.mobile_money_usage && s.mobile_money_usage !== 'None').length;

    // Climate
    const climateSensitive = smes.filter(s => s.climate?.climate_sensitive_sector).length;
    const hasGreenPractices = smes.filter(s =>
      s.climate?.green_practices?.length > 0 && !s.climate.green_practices.includes('None')
    ).length;

    // IPA/TIN
    const ipaVerified = smes.filter(s => s.ipa_verified).length;
    const tinVerified = smes.filter(s => s.tin_verified).length;

    // Credit
    const avgCredit = smes.length
      ? Math.round(smes.reduce((sum, s) => sum + (s.credit_readiness_score || 0), 0) / smes.length)
      : 0;
    const creditHigh = smes.filter(s => (s.credit_readiness_score || 0) >= 80).length;
    const creditMid  = smes.filter(s => (s.credit_readiness_score || 0) >= 50 && (s.credit_readiness_score || 0) < 80).length;
    const creditLow  = smes.filter(s => (s.credit_readiness_score || 0) < 50).length;

    // Avg quality
    const avgQuality = Math.round(smes.reduce((sum, s) => sum + (s.data_quality_score || 0), 0) / smes.length);

    // Distributions
    const provinceStats = smes.reduce((acc, sme) => {
      acc[sme.province] = (acc[sme.province] || 0) + 1;
      return acc;
    }, {});
    const sectorStats = smes.reduce((acc, sme) => {
      acc[sme.sector] = (acc[sme.sector] || 0) + 1;
      return acc;
    }, {});

    return {
      total, pending,
      womenLed, womenLedPercent: Math.round((womenLed / total) * 100),
      youthLed, youthLedPercent: Math.round((youthLed / total) * 100),
      pwdOwned, femaleDecisionMaker,
      banked, financeAccess, mobileMoneyUsers,
      climateSensitive, hasGreenPractices,
      ipaVerified, tinVerified,
      avgCredit, creditHigh, creditMid, creditLow,
      avgQuality,
      provinceStats, sectorStats,
    };
  };

  const value = {
    smes, currentSurvey, pendingSyncs, surveysCompleted,
    getSMEById, searchSMEs, saveSurvey, submitSurvey, syncData, getStatistics,
  };

  return <SMEContext.Provider value={value}>{children}</SMEContext.Provider>;
};
