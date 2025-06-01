import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Plus, Trash, Pen, Trash2 } from 'lucide-react-native';
import { useState, useContext } from 'react';
import { Picker } from '@react-native-picker/picker';
import { exerciseDatabase } from '@/utils/exerciseDatabase';
import React from 'react';
import { WorkoutsContext } from '../_layout';

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const { workouts, setWorkouts } = useContext(WorkoutsContext);
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<any[]>([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showExerciseMenu, setShowExerciseMenu] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<any>({});
  const [customExercises, setCustomExercises] = useState<Record<string, string[]>>({});
  const [customExerciseInputs, setCustomExerciseInputs] = useState<Record<string, string>>({});
  const [showCustomInputFor, setShowCustomInputFor] = useState<string | null>(null);
  const [removedExercises, setRemovedExercises] = useState<Record<string, string[]>>({});
  const [selectedExerciseSets, setSelectedExerciseSets] = useState<Record<string, number>>({});
  const [selectedExerciseWeights, setSelectedExerciseWeights] = useState<Record<string, number[]>>({});

  // Group exercises by category
  const groupedExercises = exerciseDatabase.reduce((acc, exercise) => {
    if (!acc[exercise.category]) acc[exercise.category] = [];
    acc[exercise.category].push(exercise);
    return acc;
  }, {} as Record<string, typeof exerciseDatabase>);

  // Merge in custom exercises
  const allGroupedExercises = Object.entries(groupedExercises).reduce((acc, [category, exercises]) => {
    acc[category] = [
      ...exercises,
      ...(customExercises[category]?.map(name => ({ name, category })) || [])
    ];
    return acc;
  }, {} as Record<string, any[]>);

  const handleAddCustomExercise = (category: string) => {
    const name = customExerciseInputs[category]?.trim();
    if (!name) return;
    setCustomExercises(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), name],
    }));
    setCustomExerciseInputs(prev => ({ ...prev, [category]: '' }));
  };

  const handleAddExercise = (exercise: any) => {
    setExercises([...exercises, exercise]);
    setShowExerciseForm(false);
  };

  const handleToggleExercise = (exercise: any) => {
    setSelectedExercises((prev: any) => ({
      ...prev,
      [exercise.name]: !prev[exercise.name],
    }));
    // If selecting, initialize sets and weight to 0 if not set
    setSelectedExerciseSets((prev) => {
      if (!selectedExercises[exercise.name]) {
        return { ...prev, [exercise.name]: prev[exercise.name] || 0 };
      } else {
        const { [exercise.name]: _, ...rest } = prev;
        return rest;
      }
    });
    setSelectedExerciseWeights((prev) => {
      if (!selectedExercises[exercise.name]) {
        return { ...prev, [exercise.name]: prev[exercise.name] || [0] };
      } else {
        const { [exercise.name]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleSetInputChange = (exerciseName: string, value: string) => {
    const num = value === '' ? 0 : parseInt(value);
    setSelectedExerciseSets((prev) => {
      const newSets = { ...prev, [exerciseName]: num };
      // Update weights array when sets change
      setSelectedExerciseWeights((weights) => {
        const currentWeights = weights[exerciseName] || [0];
        const newWeights = Array(num).fill(0).map((_, i) => currentWeights[i] || 0);
        return { ...weights, [exerciseName]: newWeights };
      });
      return newSets;
    });
  };

  const handleWeightInputChange = (exerciseName: string, setIndex: number, value: string) => {
    const num = value === '' ? 0 : parseInt(value);
    setSelectedExerciseWeights((prev) => {
      const currentWeights = prev[exerciseName] || [];
      const newWeights = [...currentWeights];
      newWeights[setIndex] = num;
      return { ...prev, [exerciseName]: newWeights };
    });
  };

  const handleAddSelectedExercises = () => {
    // Check if all selected exercises have sets and weights
    const allExercises = Object.values(allGroupedExercises).flat();
    const selectedExercisesList = allExercises.filter(e => selectedExercises[e.name]);
    
    // Validate that all selected exercises have sets and weights
    const invalidExercises = selectedExercisesList.filter(e => {
      const sets = selectedExerciseSets[e.name];
      const weights = selectedExerciseWeights[e.name];
      return !sets || 
             sets <= 0 || 
             !weights || 
             weights.length === 0 || 
             weights.some(w => w === undefined || w === null || w === 0);
    });

    if (invalidExercises.length > 0) {
      // Show error message
      alert('Please enter sets and weights (greater than 0) for all selected exercises');
      return;
    }

    // Gather all exercises (built-in and custom) from the modal
    const toAdd = selectedExercisesList.map(e => ({
      ...e,
      sets: selectedExerciseSets[e.name],
      weights: selectedExerciseWeights[e.name],
    }));
    setExercises([...exercises, ...toAdd]);
    setShowExerciseMenu(false);
    setSelectedExercises({});
    setSelectedExerciseSets({});
    setSelectedExerciseWeights({});
  };

  const handleRemoveExercise = (idxToRemove: number) => {
    setExercises(exercises.filter((_, idx) => idx !== idxToRemove));
  };

  const handleRemoveCustomExercise = (category: string, name: string) => {
    // Remove from custom exercises if present
    setCustomExercises(prev => ({
      ...prev,
      [category]: prev[category].filter(n => n !== name),
    }));
    // For built-in, just hide for this session
    if (!customExercises[category]?.includes(name)) {
      setRemovedExercises(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), name],
      }));
    }
  };

  const handleSaveWorkout = () => {
    // Validate target muscle
    if (!workoutName.trim()) {
      alert('Please enter a target muscle');
      return;
    }

    // Validate that there are exercises
    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    // Create a new workout object
    const newWorkout = {
      id: Date.now(),
      day: selectedDay.toLowerCase(),
      name: workoutName,
      reps: exercises.length > 0 ? exercises[0].reps : 0,
      image: exercises.length > 0 ? (exercises[0].imageUrl || exercises[0].image || 'https://images.pexels.com/photos/136404/pexels-photo-136404.jpeg') : 'https://images.pexels.com/photos/136404/pexels-photo-136404.jpeg',
      exercises: exercises,
    };
    setWorkouts([...workouts, newWorkout]);
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>New Workout</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.label}>Day of the Week</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDay}
            onValueChange={(itemValue: string) => setSelectedDay(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Sunday" value="Sunday" />
            <Picker.Item label="Monday" value="Monday" />
            <Picker.Item label="Tuesday" value="Tuesday" />
            <Picker.Item label="Wednesday" value="Wednesday" />
            <Picker.Item label="Thursday" value="Thursday" />
            <Picker.Item label="Friday" value="Friday" />
            <Picker.Item label="Saturday" value="Saturday" />
          </Picker>
        </View>
        <Text style={styles.label}>Target Muscle Name</Text>
        <TextInput
          
          style={styles.input}
          value={workoutName}
          onChangeText={setWorkoutName}
          placeholder="Target Muscle Name"
          placeholderTextColor="#A3C1B4"
        />
        <Text style={styles.label}>Workouts</Text>
        <View style={styles.exerciseRow}>
          <Text style={styles.addExerciseText}>Add Workouts</Text>
          <TouchableOpacity onPress={() => setShowExerciseMenu(true)}>
            <Plus size={28} color="#E6F2E9" />
          </TouchableOpacity>
        </View>
        {/* List of selected exercises */}
        {exercises.length > 0 && (
          <View style={styles.selectedExercisesList}>
            {exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseContainer}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                  <TouchableOpacity 
                    onPress={() => handleRemoveExercise(index)}
                    style={styles.trashButton}
                  >
                    <Trash2 size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
                <View style={styles.setsContainer}>
                  {Array.isArray(exercise.weights) ? (
                    exercise.weights.map((weight: number, setIndex: number) => (
                      <View key={setIndex} style={styles.setRow}>
                        <View style={styles.setNumberContainer}>
                          <Text style={styles.setNumber}>Set {setIndex + 1}</Text>
                        </View>
                        <View style={styles.setDetails}>
                          <Text style={styles.setWeight}>{weight ? `${weight} kg` : 'No weight'}</Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.setNumber}>No sets recorded</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showExerciseMenu}
          onRequestClose={() => setShowExerciseMenu(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                {Object.entries(allGroupedExercises).map(([category, exercises]) => (
                  <View key={category} style={{ marginBottom: 18 }}>
                    <View style={styles.menuHeaderRow}>
                      <Text style={styles.menuHeader}>{category}</Text>
                      {showCustomInputFor === category ? (
                        <>
                          <TouchableOpacity onPress={() => setShowCustomInputFor(null)} style={styles.penButton}>
                            <X size={18} color="#FF4545" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.saveButtonHeader}
                            onPress={() => setShowCustomInputFor(null)}
                          >
                            <Text style={styles.saveButtonHeaderText}>Save</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity onPress={() => setShowCustomInputFor(category)} style={styles.penButton}>
                          <Pen size={18} color="#16A06A" />
                        </TouchableOpacity>
                      )}
                    </View>
                    {exercises
                      .filter((exercise: any) => !(removedExercises[category]?.includes(exercise.name)))
                      .map((exercise: any) => (
                        <View key={exercise.name} style={styles.checkboxRow}>
                          <View style={styles.exerciseMainRow}>
                            <TouchableOpacity
                              onPress={() => handleToggleExercise(exercise)}
                              activeOpacity={0.7}
                              style={styles.exerciseTouchable}
                            >
                              <View style={styles.checkbox}>
                                {selectedExercises[exercise.name] && <View style={styles.checkboxChecked} />}
                              </View>
                              <Text style={styles.exerciseName}>{exercise.name}</Text>
                            </TouchableOpacity>
                            {showCustomInputFor === category && (
                              <TouchableOpacity onPress={() => handleRemoveCustomExercise(category, exercise.name)} style={styles.trashButton}>
                                <Trash size={18} color="#FF4545" />
                              </TouchableOpacity>
                            )}
                          </View>
                          {/* Set input, only visible if selected */}
                          {selectedExercises[exercise.name] && (
                            <View style={styles.inputsContainer}>
                              <View style={styles.setInputContainer}>
                                <Text style={styles.inputLabel}>Sets</Text>
                                <TextInput
                                  style={styles.setInput}
                                  keyboardType="number-pad"
                                  value={selectedExerciseSets[exercise.name] ? selectedExerciseSets[exercise.name].toString() : ''}
                                  onChangeText={value => handleSetInputChange(exercise.name, value)}
                                  placeholder="Sets"
                                  placeholderTextColor="#A3C1B4"
                                  maxLength={3}
                                />
                              </View>
                              {selectedExerciseSets[exercise.name] > 0 && (
                                <View style={styles.weightsContainer}>
                                  <Text style={styles.weightsLabel}>Weights:</Text>
                                  <View style={styles.weightsInputsRow}>
                                    {Array.from({ length: selectedExerciseSets[exercise.name] }).map((_, index) => (
                                      <View key={index} style={styles.weightInputWrapper}>
                                        <Text style={styles.setNumberLabel}>Set {index + 1}</Text>
                                        <TextInput
                                          style={styles.weightInput}
                                          keyboardType="number-pad"
                                          value={selectedExerciseWeights[exercise.name]?.[index]?.toString() || ''}
                                          onChangeText={value => handleWeightInputChange(exercise.name, index, value)}
                                          placeholder="Weight"
                                          placeholderTextColor="#A3C1B4"
                                          maxLength={4}
                                        />
                                      </View>
                                    ))}
                                  </View>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      ))}
                    {/* Custom exercise input, only show if pen is pressed for this group */}
                    {showCustomInputFor === category && (
                      <View style={styles.customExerciseRow}>
                        <TextInput
                          style={styles.customExerciseInput}
                          value={customExerciseInputs[category] || ''}
                          onChangeText={text => setCustomExerciseInputs(prev => ({ ...prev, [category]: text }))}
                          placeholder={`Add custom exercise...`}
                          placeholderTextColor="#A3C1B4"
                        />
                        <TouchableOpacity
                          style={styles.customExerciseAddButton}
                          onPress={() => handleAddCustomExercise(category)}
                        >
                          <Text style={styles.customExerciseAddText}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
              <View style={styles.menuFooter}>
                <TouchableOpacity style={styles.menuCancelButton} onPress={() => setShowExerciseMenu(false)}>
                  <Text style={styles.menuCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuAddButton} onPress={handleAddSelectedExercises}>
                  <Text style={styles.menuAddText}>Add Selected</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
        <Text style={styles.saveButtonText}>Save Workout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12221C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  label: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#234135',
    borderRadius: 20,
    padding: 18,
    fontSize: 20,
    color: '#fff',
    marginBottom: 30,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addExerciseText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '400',
  },
  saveButton: {
    backgroundColor: '#16A06A',
    borderRadius: 22,
    margin: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  pickerContainer: {
    backgroundColor: '#223D33',
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  picker: {
    color: '#fff',
    height: 48,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxHeight: '80%',
  },
  menuHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#14241C',
    marginBottom: 8,
    textAlign: 'left',
  },
  menuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  penButton: {
    marginLeft: 8,
    padding: 4,
  },
  checkboxRow: {
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#16A06A',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: '#16A06A',
    borderRadius: 3,
  },
  exerciseName: {
    fontSize: 16,
    color: '#14241C',
  },
  menuFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
  },
  menuCancelButton: {
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  menuAddButton: {
    backgroundColor: '#16A06A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  menuCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  menuAddText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  selectedExercisesList: {
    marginBottom: 20,
  },
  exerciseContainer: {
    marginBottom: 24,
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
  trashButton: {
    padding: 8,
    marginLeft: 12,
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
  inputLabel: {
    fontSize: 15,
    color: '#14241C',
    marginRight: 4,
    fontWeight: '500',
    alignSelf: 'center',
  },
  setInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weightsContainer: {
    marginTop: 4,
  },
  weightsLabel: {
    fontSize: 15,
    color: '#14241C',
    fontWeight: '500',
    marginBottom: 4,
  },
  weightsInputsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weightInputWrapper: {
    alignItems: 'center',
  },
  setInput: {
    width: 48,
    height: 32,
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 15,
    color: '#14241C',
  },
  exerciseMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  customExerciseInput: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#14241C',
    marginRight: 8,
  },
  customExerciseAddButton: {
    backgroundColor: '#16A06A',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  customExerciseAddText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButtonHeader: {
    marginLeft: 'auto',
    backgroundColor: '#16A06A',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  saveButtonHeaderText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  inputsContainer: {
    marginLeft: 34,
    marginTop: 8,
  },
  setNumberLabel: {
    fontSize: 13,
    color: '#14241C',
    marginBottom: 2,
  },
  weightInput: {
    width: 60,
    height: 32,
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 15,
    color: '#14241C',
  },
});