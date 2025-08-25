import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { CycleAnalysis, PeriodEntry } from './types';
import { getRiskColor } from './utils';
import { DOT_COLORS } from './constants';

interface AnalysisResultsProps {
  cycleAnalysis: CycleAnalysis;
  currentEntry: PeriodEntry;
  onCheckAgain: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  cycleAnalysis,
  currentEntry,
  onCheckAgain
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Cycle Analysis Results
        </h1>
        <p className="text-gray-600">Your menstrual cycle irregularity assessment</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Analysis Results */}
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center gap-3">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Cycle Assessment
          </h2>
          
          <div className="space-y-4">
            {cycleAnalysis.averageCycleLength > 0 && (
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
                <div className="text-sm text-gray-600">Average Cycle Length</div>
                <div className="text-2xl font-bold text-purple-700">
                  {cycleAnalysis.averageCycleLength} days
                </div>
              </div>
            )}

            {cycleAnalysis.cycleLengths.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <div className="text-sm text-gray-600">Cycle Lengths</div>
                <div className="text-lg font-bold text-indigo-700">
                  {cycleAnalysis.cycleLengths.join(', ')} days
                </div>
              </div>
            )}

            <div className={`rounded-xl p-4 ${getRiskColor(cycleAnalysis.irregularityRisk)}`}>
              <div className="flex items-center gap-2">
                {cycleAnalysis.irregularityRisk !== 'low' && (
                  <ExclamationTriangleIcon className="w-5 h-5" />
                )}
                <span className="font-semibold">
                  {cycleAnalysis.irregularityRisk.charAt(0).toUpperCase() + 
                   cycleAnalysis.irregularityRisk.slice(1)} Risk Level
                </span>
              </div>
            </div>

            {cycleAnalysis.warnings.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Detected Issues
                </h3>
                {cycleAnalysis.warnings.map((warning, index) => (
                  <div key={index} className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
                    {warning}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center gap-3">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Health Recommendations
          </h2>
          
          <div className="space-y-3">
            {cycleAnalysis.recommendations.map((rec, index) => (
              <div key={index} className="text-sm text-purple-600 bg-purple-50 rounded-lg p-3">
                {rec}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6">
        <h3 className="text-xl font-bold text-purple-700 mb-4">Your Input Summary</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* All Periods */}
          <div>
            <div className="text-sm text-gray-600 font-medium mb-2">Selected Period Dates</div>
            <div className="space-y-2">
              {currentEntry.periodDates.map((date, index) => (
                <div key={date} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${DOT_COLORS[index] || DOT_COLORS[0]}`}></div>
                  <span className="text-sm font-medium">
                    {new Date(date).toLocaleDateString('en-US', { 
                      month: 'short', day: 'numeric', year: 'numeric' 
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Typical Flow Intensity</div>
              <div className="font-semibold text-purple-700 capitalize">{currentEntry.flow}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Missed Periods Recently</div>
              <div className="font-semibold text-purple-700">{currentEntry.missedPeriods ? 'Yes' : 'No'}</div>
            </div>
            {currentEntry.symptoms.length > 0 && (
              <div>
                <div className="text-sm text-gray-600 mb-2">Reported Symptoms</div>
                <div className="flex flex-wrap gap-1">
                  {currentEntry.symptoms.map((symptom, index) => (
                    <span key={index} className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Check Again Button */}
      <div className="text-center">
        <button
          onClick={onCheckAgain}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-colors shadow-lg font-semibold text-lg"
        >
          Check Again
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;
