import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getDaysInMonth, getFirstDayOfMonth, formatDate, getSelectedDatesForMonth } from './utils';
import { SELECTION_COLORS, INDICATOR_COLORS, MAX_PERIODS } from './constants';

interface CalendarProps {
  viewingDate: Date;
  allSelectedDates: string[];
  onDateClick: (day: number) => void;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

const Calendar: React.FC<CalendarProps> = ({
  viewingDate,
  allSelectedDates,
  onDateClick,
  onNavigateMonth
}) => {
  const getSelectionColor = (globalIndex: number) => {
    return SELECTION_COLORS[globalIndex] || SELECTION_COLORS[0];
  };

  const getSelectionIndicatorColor = (globalIndex: number) => {
    return INDICATOR_COLORS[globalIndex] || INDICATOR_COLORS[0];
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(viewingDate);
    const firstDay = getFirstDayOfMonth(viewingDate);
    const days = [];
    const monthSelectedDates = getSelectedDatesForMonth(allSelectedDates, viewingDate);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-3"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(new Date(viewingDate.getFullYear(), viewingDate.getMonth(), day));
      const isSelected = allSelectedDates.includes(dateStr);
      const globalIndex = allSelectedDates.indexOf(dateStr);
      
      days.push(
        <div
          key={day}
          onClick={() => onDateClick(day)}
          className={`
            p-3 cursor-pointer rounded-xl transition-all duration-200 text-center relative
            hover:bg-gradient-to-br hover:from-pink-200 hover:to-purple-200 hover:scale-105 hover:shadow-lg
            ${isSelected ? getSelectionColor(globalIndex) : 'bg-white border border-pink-100'}
            ${allSelectedDates.length >= MAX_PERIODS && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span className="font-medium">{day}</span>
          {isSelected && (
            <div className="absolute top-1 right-1">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                getSelectionIndicatorColor(globalIndex)
              }`}>
                {globalIndex + 1}
              </div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center gap-3">
        <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Select Your Current Period Start Date
      </h2>
      
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onNavigateMonth('prev')}
          className="p-3 rounded-full hover:bg-pink-100 transition-colors"
        >
          <ChevronLeftIcon className="w-6 h-6 text-purple-600" />
        </button>
        <h3 className="text-2xl font-bold text-purple-700">
          {viewingDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={() => onNavigateMonth('next')}
          className="p-3 rounded-full hover:bg-pink-100 transition-colors"
        >
          <ChevronRightIcon className="w-6 h-6 text-purple-600" />
        </button>
      </div>

      {/* Current month selection count */}
      <div className="text-center mb-4">
        <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          {getSelectedDatesForMonth(allSelectedDates, viewingDate).length} periods selected in {viewingDate.toLocaleDateString('en-US', { month: 'long' })}
        </span>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center font-semibold text-purple-600 text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {renderCalendar()}
      </div>

      {/* Total selection count */}
      <div className="text-xs text-gray-500 mt-3 text-center">
        {allSelectedDates.length}/{MAX_PERIODS} total periods selected across all months
      </div>
    </div>
  );
};

export default Calendar;
