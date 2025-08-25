import React from 'react';
import type { FlowType } from './types';
import { DOT_COLORS, AVAILABLE_SYMPTOMS } from './constants';

interface FormModalProps {
  isOpen: boolean;
  allSelectedDates: string[];
  flow: FlowType;
  symptoms: string[];
  missedPeriods: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onMissedPeriodsChange: (missed: boolean) => void;
  onFlowChange: (flow: FlowType) => void;
  onSymptomsChange: (symptom: string) => void;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  allSelectedDates,
  flow,
  symptoms,
  missedPeriods,
  onClose,
  onSubmit,
  onMissedPeriodsChange,
  onFlowChange,
  onSymptomsChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <h3 className="text-3xl font-bold text-purple-700 mb-4">
          Period Assessment Form
        </h3>
        
        {/* Selected dates overview */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-purple-700 mb-3">Selected Period Start Dates ({allSelectedDates.length})</h4>
          <div className="max-h-32 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {allSelectedDates.map((date, index) => (
                <div key={date} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${DOT_COLORS[index] || DOT_COLORS[0]}`}></div>
                  <span className="text-sm">{new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                  })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Missed Periods Question */}
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Have you missed any periods recently?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onMissedPeriodsChange(false)}
                className={`p-4 rounded-xl font-medium transition-all ${
                  !missedPeriods
                    ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                No
              </button>
              <button
                onClick={() => onMissedPeriodsChange(true)}
                className={`p-4 rounded-xl font-medium transition-all ${
                  missedPeriods
                    ? 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Yes
              </button>
            </div>
          </div>

          {/* General Flow Intensity */}
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Typical Flow Intensity
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {(['light', 'medium', 'heavy'] as const).map(flowType => (
                <button
                  key={flowType}
                  onClick={() => onFlowChange(flowType)}
                  className={`p-4 rounded-xl font-medium transition-all ${
                    flow === flowType
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                      : 'bg-pink-50 text-purple-700 hover:bg-pink-100'
                  }`}
                >
                  {flowType.charAt(0).toUpperCase() + flowType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* General Symptoms */}
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Common Symptoms & Signs
            </h2>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {AVAILABLE_SYMPTOMS.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => onSymptomsChange(symptom)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    symptoms.includes(symptom)
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                      : 'bg-pink-50 text-purple-700 hover:bg-pink-100'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 p-4 border border-pink-200 text-purple-700 rounded-xl hover:bg-pink-50 transition-colors font-semibold"
            >
              Back to Calendar
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-colors shadow-lg font-semibold"
            >
              Analyze My Cycles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
