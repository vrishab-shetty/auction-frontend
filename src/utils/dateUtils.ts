/**
 * Formats a target date relative to the current time into a human-readable string.
 * 
 * Formats:
 * - Xd Xh (if > 24 hours)
 * - Xh Xm (if < 24 hours)
 * - Xm Xs (if < 1 hour)
 * 
 * @param targetDate The date to compare against now
 * @returns A formatted relative time string
 */
export const formatRelativeTime = (targetDate: Date): string => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return 'Finished';
  }

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const days = totalDays;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  if (totalDays >= 1) {
    return `${days}d ${hours}h`;
  }

  if (totalHours >= 1) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m ${seconds}s`;
};
