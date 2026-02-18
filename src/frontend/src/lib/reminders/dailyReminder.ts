/**
 * Browser-only daily reminder system
 * Uses Notification API when available, with in-app fallback
 */

const STORAGE_KEY = 'daily_reminder_last_shown';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

export function getReminderMessage(dayNumber: number): string {
  return `Officer, your Day ${dayNumber} mission is waiting! Don't break your streak!`;
}

export function scheduleReminder(dayNumber: number): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  // Best-effort: schedule for next day at 9 AM
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const timeUntilReminder = tomorrow.getTime() - now.getTime();

  // Only schedule if within reasonable time (24 hours)
  if (timeUntilReminder > 0 && timeUntilReminder < 24 * 60 * 60 * 1000) {
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('UPSC English Learning', {
          body: getReminderMessage(dayNumber),
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      }
    }, timeUntilReminder);
  }
}

export function shouldShowInAppReminder(): boolean {
  try {
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (!lastShown) return true;

    const lastShownDate = new Date(lastShown);
    const today = new Date();
    
    // Show if last shown was on a different day
    return lastShownDate.toDateString() !== today.toDateString();
  } catch {
    return true;
  }
}

export function markInAppReminderShown(): void {
  try {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Failed to mark reminder as shown:', error);
  }
}
