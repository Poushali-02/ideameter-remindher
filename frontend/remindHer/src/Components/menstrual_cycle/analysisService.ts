import type { PeriodEntry, CycleAnalysis } from './types';

export const analyzeCycle = (entry: PeriodEntry): CycleAnalysis => {
  const allDates = [...entry.periodDates].sort();
  
  if (allDates.length < 2) {
    return {
      cycleLengths: [],
      averageCycleLength: 0,
      irregularityRisk: 'low',
      warnings: ['Need at least 2 period dates to analyze cycle patterns'],
      recommendations: ['Continue tracking your periods for better analysis']
    };
  }

  const cycleLengths: number[] = [];
  for (let i = 1; i < allDates.length; i++) {
    const daysDiff = Math.floor(
      (new Date(allDates[i]).getTime() - new Date(allDates[i-1]).getTime()) / (1000 * 60 * 60 * 24)
    );
    cycleLengths.push(daysDiff);
  }

  const averageLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let irregularityRisk: 'low' | 'medium' | 'high' = 'low';

  // Check cycle length irregularities
  const shortCycles = cycleLengths.filter(length => length < 21).length;
  const longCycles = cycleLengths.filter(length => length > 35).length;
  const veryShortCycles = cycleLengths.filter(length => length < 14).length;

  if (veryShortCycles > 0) {
    warnings.push(`${veryShortCycles} cycle(s) shorter than 14 days detected - this may indicate serious hormonal imbalances`);
    irregularityRisk = 'high';
  } else if (shortCycles > 0) {
    warnings.push(`${shortCycles} cycle(s) shorter than 21 days detected - may indicate hormonal irregularities`);
    irregularityRisk = irregularityRisk === 'low' ? 'medium' : irregularityRisk;
  }

  if (longCycles > 0) {
    warnings.push(`${longCycles} cycle(s) longer than 35 days detected - may indicate irregular ovulation`);
    irregularityRisk = irregularityRisk === 'low' ? 'medium' : irregularityRisk;
  }

  // Check for missed periods
  if (entry.missedPeriods) {
    warnings.push('Recent missed periods detected - this could indicate hormonal changes or other health factors');
    irregularityRisk = irregularityRisk === 'low' ? 'medium' : 'high';
  }

  // Check for multiple periods in same month
  const datesByMonth = entry.periodDates.reduce((acc, date) => {
    const monthKey = new Date(date).toISOString().slice(0, 7); // YYYY-MM
    acc[monthKey] = (acc[monthKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const multiplePeriodMonths = Object.values(datesByMonth).filter(count => count > 1).length;
  if (multiplePeriodMonths > 0) {
    warnings.push('Multiple periods within the same month detected - this may indicate hormonal fluctuations');
    irregularityRisk = 'high';
  }

  // Check flow patterns
  if (entry.flow === 'heavy' && entry.symptoms.includes('Heavy bleeding')) {
    warnings.push('Heavy flow with concerning bleeding patterns detected - may require medical attention');
    irregularityRisk = 'high';
  }

  // Check for concerning symptoms
  const concerningSymptoms = ['Irregular bleeding', 'Spotting', 'Heavy bleeding', 'Prolonged bleeding'];
  const hasConcerningSymptoms = entry.symptoms.some(symptom => concerningSymptoms.includes(symptom));
  
  if (hasConcerningSymptoms) {
    warnings.push('Irregular bleeding patterns detected - monitor closely');
    irregularityRisk = irregularityRisk === 'low' ? 'medium' : 'high';
  }

  // Generate recommendations
  if (irregularityRisk === 'high') {
    recommendations.push('Consult with a healthcare provider or gynecologist immediately');
    recommendations.push('Keep detailed tracking of symptoms and cycle patterns');
    recommendations.push('Consider discussing hormonal evaluation with your doctor');
    recommendations.push('Track additional factors like stress, weight changes, and medications');
  } else if (irregularityRisk === 'medium') {
    recommendations.push('Continue monitoring for 2-3 more cycles');
    recommendations.push('Note any lifestyle changes, stress, or dietary factors');
    recommendations.push('Consider tracking basal body temperature');
    recommendations.push('Schedule a routine gynecological check-up');
  } else {
    recommendations.push('Your cycle patterns appear within normal variation');
    recommendations.push('Continue regular tracking for overall health monitoring');
    recommendations.push('Maintain healthy lifestyle habits');
  }

  return {
    cycleLengths,
    averageCycleLength: Math.round(averageLength),
    irregularityRisk,
    warnings,
    recommendations
  };
};
