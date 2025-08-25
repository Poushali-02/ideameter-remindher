export interface PeriodEntry {
  periodDates: string[];
  flow: 'light' | 'medium' | 'heavy'; 
  symptoms: string[]; 
  missedPeriods: boolean;
}

export interface CycleAnalysis {
  cycleLengths: number[];
  averageCycleLength: number;
  irregularityRisk: 'low' | 'medium' | 'high';
  warnings: string[];
  recommendations: string[];
}

export type FlowStep = 'dateSelection' | 'formEntry' | 'analysis';

export type FlowType = 'light' | 'medium' | 'heavy';
