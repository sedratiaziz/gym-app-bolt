import { useState, useEffect } from 'react';
import { getAllWorkouts } from '@/utils/storage';

export function useWorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    // Load workouts from storage
    setWorkouts(getAllWorkouts());
  }, []);

  const getRecentWorkouts = (count) => {
    return [...workouts]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, count);
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    
    const weeklyWorkouts = workouts.filter(workout => 
      new Date(workout.date) >= weekStart
    );
    
    const totalDuration = weeklyWorkouts.reduce(
      (sum, workout) => sum + workout.duration, 0
    );
    
    return {
      workouts: weeklyWorkouts.length,
      duration: Math.round(totalDuration / 60 * 10) / 10 // Convert to hours with 1 decimal
    };
  };

  return {
    workouts,
    getRecentWorkouts,
    getWeeklyStats,
    getAllWorkouts: () => workouts,
  };
}