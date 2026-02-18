import { useState, useEffect } from 'react';
import { getMistakeTrackerData, saveMistakeTrackerData, MistakeTrackerData } from '@/lib/progress/mistakeTrackerStorage';

export function useMistakeTracker() {
  const [data, setData] = useState<MistakeTrackerData>({ learned: [], toImprove: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const trackerData = getMistakeTrackerData();
      setData(trackerData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const updateData = (newData: MistakeTrackerData) => {
    setData(newData);
    saveMistakeTrackerData(newData);
  };

  return {
    learned: data.learned,
    toImprove: data.toImprove,
    isLoading,
    updateData,
  };
}
