/**
 * Format date to user-friendly format (Lagos, Nigeria timezone)
 * Examples: "Today at 3:30 PM", "Yesterday at 2:45 PM", "2 days ago", "Feb 8, 2:30 PM"
 */
export function formatNotificationTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    
    // Convert to Lagos timezone (UTC+1)
    const lagosDate = new Date(date.toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }));
    const now = new Date();
    const lagosNow = new Date(now.toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }));
    
    // Reset time to compare dates only
    const today = new Date(lagosNow);
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const notificationDate = new Date(lagosDate);
    notificationDate.setHours(0, 0, 0, 0);
    
    // Format time part using Nigeria locale and Lagos timezone
    const timeFormatter = new Intl.DateTimeFormat('en-NG', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Lagos',
    });
    const timeStr = timeFormatter.format(date);
    
    // Compare dates
    if (notificationDate.getTime() === today.getTime()) {
      return `Today at ${timeStr}`;
    }
    
    if (notificationDate.getTime() === yesterday.getTime()) {
      return `Yesterday at ${timeStr}`;
    }
    
    // If within last 7 days
    const daysAgo = Math.floor((lagosNow.getTime() - lagosDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo < 7 && daysAgo > 0) {
      return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    }
    
    // Older dates: show month and day with time (Nigeria locale)
    const monthDayFormatter = new Intl.DateTimeFormat('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Lagos',
    });
    
    return monthDayFormatter.format(date);
  } catch (error) {
    return 'Recently';
  }
}

export function formatNotificationDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Convert to Lagos timezone (UTC+1)
    const lagosDate = new Date(date.toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }));
    const lagosNow = new Date(now.toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }));
    
    const today = new Date(lagosNow);
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const notificationDate = new Date(lagosDate);
    notificationDate.setHours(0, 0, 0, 0);
    
    if (notificationDate.getTime() === today.getTime()) {
      return 'Today';
    }
    
    if (notificationDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }
    
    // Otherwise show month and day (Nigeria locale)
    const formatter = new Intl.DateTimeFormat('en-NG', {
      month: 'short',
      day: 'numeric',
      timeZone: 'Africa/Lagos',
    });
    
    return formatter.format(date);
  } catch (error) {
    return 'Recently';
  }
}

/**
 * Format date and time for table display (Lagos timezone)
 * Examples: "8 Feb, 3:30 PM", "10 Feb, 2:45 PM"
 */
export function formatTableDateTime(dateString: string): string {
  try {
    if (!dateString) return '-';
    
    
    
    // If the date string doesn't have a timezone indicator (no Z, +, - at the end),
    // treat it as UTC by appending 'Z'
    let correctedDateString = dateString;
    if (!dateString.includes('Z') && !dateString.includes('+') && !dateString.includes('-', dateString.length - 6)) {
      correctedDateString = dateString + 'Z';
    }
    
    const date = new Date(correctedDateString);
    
    
    
    // Format without forcing timezone - let the system's local interpretation handle it
    // This respects the user's system timezone settings
    const formatter = new Intl.DateTimeFormat('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    
    const formatted = formatter.format(date);
    
    
    return formatted;
  } catch (error) {
    return dateString || '-';
  }
}
