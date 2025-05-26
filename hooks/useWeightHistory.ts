import { useState, useEffect } from 'react';
import { getAllWeightLogs } from '@/utils/storage';

export function useWeightHistory() {
  const [weightEntries, setWeightEntries] = useState([]);

  useEffect(() => {
    // Load weight entries from storage
    setWeightEntries(getAllWeightLogs());
  }, []);

  const getRecentWeightEntries = (count) => {
    return [...weightEntries]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, count);
  };

  const getWeightTrend = () => {
    if (weightEntries.length === 0) {
      return { current: 0, change: 0, average: 0 };
    }

    const sortedEntries = [...weightEntries].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    const current = sortedEntries[0].value;
    
    // Calculate change over the last month
    const now = new Date();
    const monthAgo = new Date(now);
    monthAgo.setMonth(now.getMonth() - 1);
    
    const monthAgoEntry = weightEntries.find(entry => 
      new Date(entry.timestamp) <= monthAgo
    );
    
    const change = monthAgoEntry 
      ? Math.round((current - monthAgoEntry.value) * 10) / 10
      : 0;
    
    // Calculate average
    const average = Math.round(
      weightEntries.reduce((sum, entry) => sum + entry.value, 0) / 
      weightEntries.length * 10
    ) / 10;
    
    return { current, change, average };
  };

  return {
    weightEntries,
    getRecentWeightEntries,
    getWeightTrend,
    getAllWeightEntries: () => weightEntries,
  };
}