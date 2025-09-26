/**
 * Format date for HTML input elements (YYYY-MM-DD format)
 */
export const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toISOString().split('T')[0];
};

/**
 * Format date for datetime-local input (YYYY-MM-DDTHH:MM format)
 */
export const formatDateTimeForInput = (date: Date | string | null | undefined): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  // Get local timezone offset and adjust
  const offset = dateObj.getTimezoneOffset();
  const localDate = new Date(dateObj.getTime() - (offset * 60 * 1000));

  return localDate.toISOString().slice(0, 16);
};

/**
 * Format date for display (human readable)
 */
export const formatDateForDisplay = (date: Date | string | null | undefined): string => {
  if (!date) return 'No date';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return 'Invalid date';

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Parse string from input back to Date object
 */
export const parseInputDate = (dateString: string): Date | null => {
  if (!dateString) return null;

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};
