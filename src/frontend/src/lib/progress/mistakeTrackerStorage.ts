// Minimal localStorage read helpers for Mistake Tracker lists

export interface MistakeTrackerItem {
  id: string;
  text: string;
  category: string;
  timestamp: number;
}

export interface MistakeTrackerData {
  learned: MistakeTrackerItem[];
  toImprove: MistakeTrackerItem[];
}

const STORAGE_KEY = 'mistake_tracker_data';

export function getMistakeTrackerData(): MistakeTrackerData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { learned: [], toImprove: [] };
    }
    const parsed = JSON.parse(stored);
    return {
      learned: Array.isArray(parsed.learned) ? parsed.learned : [],
      toImprove: Array.isArray(parsed.toImprove) ? parsed.toImprove : [],
    };
  } catch (error) {
    console.error('Error reading mistake tracker data:', error);
    return { learned: [], toImprove: [] };
  }
}

export function saveMistakeTrackerData(data: MistakeTrackerData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving mistake tracker data:', error);
  }
}
