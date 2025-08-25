import React from 'react';
import type { FlowType } from './types';
import { AVAILABLE_SYMPTOMS, DOT_COLORS } from './constants';

interface PeriodFormProps {
  date: string;
  index: number;
  flow: FlowType;
  symptoms: string[];
  onFlowChange: (index: number, flow: FlowType) => void;
  onSymptomsChange: (index: number, symptom: string) => void;
}

const PeriodForm: React.FC<PeriodFormProps> = ({
  date,
  index,
  flow,
  symptoms,
  onFlowChange,
  onSymptomsChange
}) => {
  return (
    <div className="border-2 border-pink-100 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full ${DOT_COLORS[index] || DOT_COLORS[0]}`}></div>
        Period on {new Date(date).toLocaleDateString('en-US', { 
          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
        })}
      </h3>
      
      {/* Flow selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-purple-700 mb-2">Flow Intensity</label>
        <div className="grid grid-cols-3 gap-2">
          {(['light', 'medium', 'heavy'] as const).map(flowType => (
            <button
              key={flowType}
              onClick={() => onFlowChange(index, flowType)}
              className={`p-2 rounded-lg font-medium transition-all text-sm ${
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

      {/* Symptoms selection */}
      <div>
        <label className="block text-sm font-semibold text-purple-700 mb-2">Symptoms</label>
        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
          {AVAILABLE_SYMPTOMS.map(symptom => (
            <button
              key={symptom}
              onClick={() => onSymptomsChange(index, symptom)}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                symptoms?.includes(symptom)
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                  : 'bg-pink-50 text-purple-700 hover:bg-pink-100'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeriodForm;
