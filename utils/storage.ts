// Mock implementation of storage functions for the example
// In a real app, this would use AsyncStorage or another storage mechanism

let workouts = [
  {
    id: 1,
    name: 'Morning Strength',
    type: 'Strength',
    date: '2025-01-15T08:30:00Z',
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 10, weight: 60, restTime: 60 },
      { name: 'Squats', sets: 3, reps: 12, weight: 80, restTime: 90 },
      { name: 'Rows', sets: 3, reps: 10, weight: 50, restTime: 60 }
    ],
    duration: 45,
    isTemplate: false
  },
  {
    id: 2,
    name: 'Cardio Session',
    type: 'Cardio',
    date: '2025-01-17T17:00:00Z',
    exercises: [
      { name: 'Treadmill Run', sets: 1, reps: 1, weight: 0, restTime: 0 },
      { name: 'Jumping Jacks', sets: 3, reps: 20, weight: 0, restTime: 30 }
    ],
    duration: 30,
    isTemplate: false
  }
];

let weightLogs = [
  { value: 75.5, date: 'Jan 1, 2025', timestamp: '2025-01-01T08:00:00Z' },
  { value: 75.2, date: 'Jan 5, 2025', timestamp: '2025-01-05T08:00:00Z' },
  { value: 74.8, date: 'Jan 10, 2025', timestamp: '2025-01-10T08:00:00Z' },
  { value: 74.5, date: 'Jan 15, 2025', timestamp: '2025-01-15T08:00:00Z' },
];

let templates = [
  {
    id: 3,
    name: 'Upper Body',
    type: 'Strength',
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 10, weight: 60, restTime: 60 },
      { name: 'Shoulder Press', sets: 3, reps: 10, weight: 40, restTime: 60 },
      { name: 'Pull-ups', sets: 3, reps: 8, weight: 0, restTime: 60 }
    ],
    isTemplate: true
  },
  {
    id: 4,
    name: 'Lower Body',
    type: 'Strength',
    exercises: [
      { name: 'Squats', sets: 3, reps: 12, weight: 80, restTime: 90 },
      { name: 'Deadlifts', sets: 3, reps: 8, weight: 100, restTime: 120 },
      { name: 'Leg Press', sets: 3, reps: 12, weight: 120, restTime: 90 }
    ],
    isTemplate: true
  }
];

export function saveWorkout(workout) {
  if (workout.isTemplate) {
    templates.push(workout);
  } else {
    workouts.push(workout);
  }
  return workout;
}

export function getWorkout(id) {
  return workouts.find(w => w.id === id) || null;
}

export function getAllWorkouts() {
  return [...workouts];
}

export function getWorkoutTemplates() {
  return [...templates];
}

export function logWeight(weightEntry) {
  weightLogs.push(weightEntry);
  return weightEntry;
}

export function getAllWeightLogs() {
  return [...weightLogs];
}