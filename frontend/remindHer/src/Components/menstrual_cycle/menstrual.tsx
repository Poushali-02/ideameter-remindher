import React, { useState } from 'react';
import type { FlowStep, PeriodEntry, CycleAnalysis, FlowType } from './types';
import { formatDate } from './utils';
import { analyzeCycle } from './analysisService';
import Calendar from './calender';
import SelectedDatesDisplay from './selectedDates';
import FormModal from './formModals';
import AnalysisResults from './analysisResults';

const MenstrualCycleDetector: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('dateSelection');
  const [viewingDate, setViewingDate] = useState(new Date());
  const [allSelectedDates, setAllSelectedDates] = useState<string[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [cycleAnalysis, setCycleAnalysis] = useState<CycleAnalysis | null>(null);

  // Simplified form states - single values for all periods
  const [flow, setFlow] = useState<FlowType>('medium');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [missedPeriods, setMissedPeriods] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<PeriodEntry | null>(null);

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(viewingDate.getFullYear(), viewingDate.getMonth(), day);
    const dateStr = formatDate(clickedDate);
    
    setAllSelectedDates(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(date => date !== dateStr);
      } else if (prev.length < 6) {
        return [...prev, dateStr].sort();
      }
      return prev;
    });
  };

  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    setViewingDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleContinueToForm = () => {
    if (allSelectedDates.length > 0) {
      setShowEntryForm(true);
      setCurrentStep('formEntry');
    }
  };

  const handleSubmitEntry = () => {
    const newEntry: PeriodEntry = {
      periodDates: allSelectedDates,
      flow,
      symptoms,
      missedPeriods
    };

    setCurrentEntry(newEntry);
    
    // Fix: Properly call the analyzeCycle function and set the result
    const analysis = analyzeCycle(newEntry);
    setCycleAnalysis(analysis);
    
    setShowEntryForm(false);
    setCurrentStep('analysis');
  };

  const handleCheckAgain = () => {
    setCurrentStep('dateSelection');
    setAllSelectedDates([]);
    setFlow('medium');
    setSymptoms([]);
    setMissedPeriods(false);
    setCurrentEntry(null);
    setCycleAnalysis(null);
    setViewingDate(new Date());
  };

  const handleFlowChange = (newFlow: FlowType) => {
    setFlow(newFlow);
  };

  const handleSymptomsChange = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  // Fix: Proper conditional rendering with correct prop passing
  if (currentStep === 'analysis' && cycleAnalysis && currentEntry) {
    return (
      <AnalysisResults
        cycleAnalysis={cycleAnalysis}
        currentEntry={currentEntry}
        onCheckAgain={handleCheckAgain}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Menstrual Cycle Irregularity Detector
        </h1>
        <p className="text-gray-600">Select your period dates to assess cycle regularity (up to 6 periods total)</p>
      </div>

      {currentStep === 'dateSelection' && (
        <>
          <Calendar
            viewingDate={viewingDate}
            allSelectedDates={allSelectedDates}
            onDateClick={handleDateClick}
            onNavigateMonth={handleNavigateMonth}
          />

          <SelectedDatesDisplay
            allSelectedDates={allSelectedDates}
            onContinueToForm={handleContinueToForm}
          />
        </>
      )}

      <FormModal
        isOpen={showEntryForm}
        allSelectedDates={allSelectedDates}
        flow={flow}
        symptoms={symptoms}
        missedPeriods={missedPeriods}
        onClose={() => setShowEntryForm(false)}
        onSubmit={handleSubmitEntry}
        onMissedPeriodsChange={setMissedPeriods}
        onFlowChange={handleFlowChange}
        onSymptomsChange={handleSymptomsChange}
      />
    </div>
  );
};

export default MenstrualCycleDetector;
