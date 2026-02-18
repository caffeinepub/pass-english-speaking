import { useState, useEffect } from 'react';
import { useLocalSettings } from './useLocalSettings';
import { useGetUnlockedDaysCount } from './useCourseProgress';
import { useGetCurrentStreak } from './useStreakBadges';
import {
  requestNotificationPermission,
  scheduleReminder,
  shouldShowInAppReminder,
  markInAppReminderShown,
  getReminderMessage,
} from '@/lib/reminders/dailyReminder';

export function useDailyReminder() {
  const { settings, updateDailyReminderEnabled } = useLocalSettings();
  const { data: unlockedDays = 1 } = useGetUnlockedDaysCount();
  const { data: currentStreak = 0 } = useGetCurrentStreak();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [showInAppReminder, setShowInAppReminder] = useState(false);

  // Check permission status on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Schedule reminder when enabled
  useEffect(() => {
    if (settings.dailyReminderEnabled && permissionStatus === 'granted') {
      const dayNumber = Math.max(unlockedDays, currentStreak, 1);
      scheduleReminder(dayNumber);
    }
  }, [settings.dailyReminderEnabled, permissionStatus, unlockedDays, currentStreak]);

  // Check for in-app reminder fallback
  useEffect(() => {
    if (settings.dailyReminderEnabled && shouldShowInAppReminder()) {
      setShowInAppReminder(true);
    }
  }, [settings.dailyReminderEnabled]);

  const enableReminder = async () => {
    const permission = await requestNotificationPermission();
    setPermissionStatus(permission);
    updateDailyReminderEnabled(true);
  };

  const disableReminder = () => {
    updateDailyReminderEnabled(false);
    setShowInAppReminder(false);
  };

  const dismissInAppReminder = () => {
    markInAppReminderShown();
    setShowInAppReminder(false);
  };

  const dayNumber = Math.max(unlockedDays, currentStreak, 1);
  const reminderMessage = getReminderMessage(dayNumber);

  return {
    isEnabled: settings.dailyReminderEnabled,
    permissionStatus,
    showInAppReminder,
    reminderMessage,
    enableReminder,
    disableReminder,
    dismissInAppReminder,
  };
}
