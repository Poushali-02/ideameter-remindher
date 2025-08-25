import React from 'react';
import { groupDatesByMonth } from './utils';
import { DOT_COLORS } from './constants';

interface SelectedDatesDisplayProps {
  allSelectedDates: string[];
  onContinueToForm: () => void;
}

const SelectedDatesDisplay: React.FC<SelectedDatesDisplayProps> = ({
  allSelectedDates,
  onContinueToForm
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6">
      <h3 className="text-xl font-bold text-purple-700 mb-4">All Selected Period Start Dates</h3>
      
      {allSelectedDates.length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupDatesByMonth(allSelectedDates)).map(([monthKey, dates]) => (
            <div key={monthKey} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
              <div className="text-sm font-semibold text-purple-700 mb-2">{monthKey}</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {dates.map((date) => {
                  const globalIndex = allSelectedDates.indexOf(date);
                  return (
                    <div key={date} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${DOT_COLORS[globalIndex] || DOT_COLORS[0]}`}></div>
                      <span className="text-sm font-medium">
                        {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">
          No dates selected. Navigate through months and click on dates to select period start days.
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={onContinueToForm}
          disabled={allSelectedDates.length === 0}
          className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
            allSelectedDates.length > 0
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Assessment ({allSelectedDates.length} periods selected)
        </button>
      </div>
    </div>
  );
};

export default SelectedDatesDisplay;
