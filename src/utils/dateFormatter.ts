/**
 * Format date to user-friendly format
 * Examples: "Today at 3:30 PM", "Yesterday at 2:45 PM", "2 days ago", "Feb 8, 2:30 PM"
 */
export function formatNotificationTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Reset time to compare dates only
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const notificationDate = new Date(date);
    notificationDate.setHours(0, 0, 0, 0);
    
    // Format time part
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
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
    const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo < 7 && daysAgo > 0) {
      return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    }
    
    // Older dates: show month and day with time
    const monthDayFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    
    return monthDayFormatter.format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Recently';
  }
}

/**
 * Format date for display in tables (alternative shorter format)
 * Examples: "Feb 8", "Today", "Yesterday"
 */
export function formatNotificationDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const notificationDate = new Date(date);
    notificationDate.setHours(0, 0, 0, 0);
    
    if (notificationDate.getTime() === today.getTime()) {
      return 'Today';
    }
    
    if (notificationDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }
    
    // Otherwise show month and day
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    });
    
    return formatter.format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Recently';
  }
}
