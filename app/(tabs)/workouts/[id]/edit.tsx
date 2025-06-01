import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, ArrowLeft, Trash2, Plus } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { WorkoutsContext, Workout } from '../../_layout';

interface Exercise {
  id?: number;
  name: string;
  weights: number[];
}

export default function Edit() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { workouts, setWorkouts } = useContext(WorkoutsContext);

  const workoutId = params?.id ? String(params.id) : null;

  if (!workoutId) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Invalid Workout ID</Text>
        </View>
      </SafeAreaView>
    );
  }

  const workout = workouts?.find((w) => {
    if (!w || typeof w.id !== 'number') return false;
    return String(w.id) === workoutId;
  });

  if (!workout) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Workout Not Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const [name, setName] = useState(workout.name);
  const [reps, setReps] = useState(String(workout.reps));
  const [selectedDay, setSelectedDay] = useState(workout.day.charAt(0).toUpperCase() + workout.day.slice(1));
  const [exercises, setExercises] = useState<Exercise[]>(workout.exercises || []);
  const [editingExercise, setEditingExercise] = useState<number | null>(null);

  const handleSetChange = (exerciseIndex: number, setIndex: number, value: string) => {
    const num = value === '' ? 0 : parseInt(value);
    setExercises(prev => {
      const newExercises = [...prev];
      if (!newExercises[exerciseIndex].weights) {
        newExercises[exerciseIndex].weights = [];
      }
      newExercises[exerciseIndex].weights[setIndex] = num;
      return newExercises;
    });
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    setExercises(prev => {
      const newExercises = [...prev];
      newExercises[exerciseIndex].weights.splice(setIndex, 1);
      return newExercises;
    });
  };

  const handleAddSet = (exerciseIndex: number) => {
    setExercises(prev => {
      const newExercises = [...prev];
      if (!newExercises[exerciseIndex].weights) {
        newExercises[exerciseIndex].weights = [];
      }
      newExercises[exerciseIndex].weights.push(0);
      return newExercises;
    });
  };

  const handleSave = () => {
    if (!workout) return;
    
    // Update the workout with new exercises
    const updatedWorkout: Workout = {
      ...workout,
      exercises: exercises,
    };
    // Update in context
    const updatedWorkouts = workouts.map(w => w.id === workout.id ? updatedWorkout : w);
    setWorkouts(updatedWorkouts);
    // Navigate back to the home page
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Workout</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.sectionTitle}>Target Muscle</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Workout Name"
          placeholderTextColor="#A3C1B4"
        />
        <Text style={styles.sectionTitle}>Day</Text>        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDay}
            onValueChange={(itemValue) => setSelectedDay(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <Picker.Item key={day} label={day} value={day} color="#fff" />
            ))}
          </Picker>
        </View>
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Exercises</Text>
        {exercises.length > 0 ? (
          exercises.map((exercise: Exercise, idx: number) => (
            <View key={exercise.id || idx} style={{ marginBottom: 24 }}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseTitle}>
                  {exercise.name}
                </Text>
                <TouchableOpacity 
                  onPress={() => setEditingExercise(editingExercise === idx ? null : idx)}
                  style={styles.editButton}
                >
                  <Pencil size={20} color="#16A06A" />
                </TouchableOpacity>
              </View>
              <View style={styles.setsContainer}>
                {Array.isArray(exercise.weights) ? (
                  <>
                    {exercise.weights.map((weight: number, setIndex: number) => (
                      <View key={setIndex} style={styles.setRow}>
                        <View style={styles.setNumberContainer}>
                          <Text style={styles.setNumber}>Set {setIndex + 1}</Text>
                        </View>
                        <View style={styles.setDetails}>
                          {editingExercise === idx ? (
                            <View style={styles.setInputRow}>
                              <TextInput
                                style={styles.weightInput}
                                keyboardType="number-pad"
                                value={weight ? weight.toString() : ''}
                                onChangeText={(value) => handleSetChange(idx, setIndex, value)}
                                placeholder="Weight"
                                placeholderTextColor="#A3C1B4"
                                maxLength={4}
                              />
                              <TouchableOpacity 
                                onPress={() => handleRemoveSet(idx, setIndex)}
                                style={styles.trashButton}
                              >
                                <Trash2 size={20} color="#FF6B6B" />
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <Text style={styles.setWeight}>{weight ? `${weight} kg` : 'No weight'}</Text>
                          )}
                        </View>
                      </View>
                    ))}
                    {editingExercise === idx && (
                      <TouchableOpacity 
                        onPress={() => handleAddSet(idx)}
                        style={styles.addSetButton}
                      >
                        <Plus size={20} color="#16A06A" />
                        <Text style={styles.addSetText}>Add Set</Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <Text style={styles.setNumber}>No sets recorded</Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.setNumber}>No exercises found.</Text>
        )}
      </ScrollView>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14241C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 24,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#14241C',
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#14241C',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exerciseTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
    flex: 1,
  },
  setsContainer: {
    marginTop: 12,
    backgroundColor: '#223D33',
    borderRadius: 12,
    padding: 12,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A4A3D',
  },
  setNumberContainer: {
    width: 80,
  },
  setNumber: {
    fontSize: 16,
    color: '#6FCF97',
    fontWeight: '500',
  },
  setDetails: {
    flex: 1,
  },
  setWeight: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '400',
  },
  weightInput: {
    width: 80,
    height: 36,
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#14241C',
  },
  editButton: {
    padding: 8,
    marginLeft: 12,
  },
  buttonRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1DB87A',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  setInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trashButton: {
    padding: 4,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2A4A3D',
    gap: 8,
  },
  addSetText: {
    color: '#16A06A',
    fontSize: 16,
    fontWeight: '600',
  },
});