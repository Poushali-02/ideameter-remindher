export const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const getSelectedDatesForMonth = (allSelectedDates: string[], monthDate: Date) => {
  return allSelectedDates.filter(dateStr => {
    const date = new Date(dateStr);
    return date.getMonth() === monthDate.getMonth() && 
           date.getFullYear() === monthDate.getFullYear();
  });
};

export const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'high': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const groupDatesByMonth = (dates: string[]) => {
  return dates.reduce((acc, date) => {
    const monthKey = new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(date);
    return acc;
  }, {} as Record<string, string[]>);
};
