import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, ArrowLeft, Trash2, Plus, Check, X, Pen } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { WorkoutsContext, Workout } from '../../_layout';
import { exerciseDatabase } from '@/utils/exerciseDatabase';

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
  const [showExerciseMenu, setShowExerciseMenu] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Record<string, boolean>>({});
  const [selectedExerciseSets, setSelectedExerciseSets] = useState<Record<string, number>>({});
  const [selectedExerciseWeights, setSelectedExerciseWeights] = useState<Record<string, number[]>>({});
  const [customExercises, setCustomExercises] = useState<Record<string, string[]>>({});
  const [customExerciseInputs, setCustomExerciseInputs] = useState<Record<string, string>>({});
  const [showCustomInputFor, setShowCustomInputFor] = useState<string | null>(null);
  const [removedExercises, setRemovedExercises] = useState<Record<string, string[]>>({});

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

  const handleAddExercises = () => {
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

    const newExercises = selectedExercisesList.map(e => ({
      name: e.name,
      weights: selectedExerciseWeights[e.name],
    }));

    setExercises([...exercises, ...newExercises]);
    setShowExerciseMenu(false);
    setSelectedExercises({});
    setSelectedExerciseSets({});
    setSelectedExerciseWeights({});
  };

  const handleDeleteExercise = (index: number) => {
    setExercises(exercises.filter((_, idx) => idx !== index));
  };

  const handleToggleEdit = (index: number) => {
    if (editingExercise === index) {
      // Save changes when exiting edit mode
      setEditingExercise(null);
    } else {
      setEditingExercise(index);
    }
  };

  const handleSave = () => {
    if (!workout) return;

    // Validate target muscle
    if (!name.trim()) {
      alert('Please enter a target muscle');
      return;
    }

    // Validate that all exercises have sets and weights
    const invalidExercises = exercises.filter(e => {
      const weights = e.weights;
      return !weights || 
             weights.length === 0 || 
             weights.some(w => w === undefined || w === null || w === 0);
    });

    if (invalidExercises.length > 0) {
      // Show error message
      alert('Please enter weights (greater than 0) for all exercises');
      return;
    }
    
    // Update the workout with new exercises and day
    const updatedWorkout: Workout = {
      ...workout,
      exercises: exercises,
      day: selectedDay.toLowerCase(),
      name: name.trim(),
    };
    // Update in context
    const updatedWorkouts = workouts.map(w => w.id === workout.id ? updatedWorkout : w);
    setWorkouts(updatedWorkouts);
    // Navigate back to the home page
    router.push('/(tabs)');
  };

  const handleAddCustomExercise = (category: string) => {
    const name = customExerciseInputs[category]?.trim();
    if (!name) return;
    setCustomExercises(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), name],
    }));
    setCustomExerciseInputs(prev => ({ ...prev, [category]: '' }));
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

  // Merge in custom exercises
  const allGroupedExercises = Object.entries(exerciseDatabase.reduce((acc, exercise) => {
    if (!acc[exercise.category]) acc[exercise.category] = [];
    acc[exercise.category].push(exercise);
    return acc;
  }, {} as Record<string, typeof exerciseDatabase>)).reduce((acc, [category, exercises]) => {
    acc[category] = [
      ...exercises,
      ...(customExercises[category]?.map(name => ({ name, category })) || [])
    ];
    return acc;
  }, {} as Record<string, any[]>);

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
        <View style={styles.exercisesHeader}>
          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Workouts</Text>
          <TouchableOpacity 
            onPress={() => setShowExerciseMenu(true)}
            style={styles.addExerciseButton}
          >
            <Plus size={24} color="#16A06A" />
          </TouchableOpacity>
        </View>
        {exercises.length > 0 ? (
          exercises.map((exercise: Exercise, idx: number) => (
            <View key={exercise.id || idx} style={styles.exerciseContainer}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseTitle}>
                  {exercise.name}
                </Text>
                <View style={styles.exerciseButtons}>
                  <TouchableOpacity 
                    onPress={() => handleToggleEdit(idx)}
                    style={styles.editButton}
                  >
                    {editingExercise === idx ? (
                      <Check size={20} color="#16A06A" />
                    ) : (
                      <Pencil size={20} color="#16A06A" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleDeleteExercise(idx)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
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
                            onPress={() => setSelectedExercises(prev => ({
                              ...prev,
                              [exercise.name]: !prev[exercise.name]
                            }))}
                            style={styles.exerciseTouchable}
                          >
                            <View style={styles.checkbox}>
                              {selectedExercises[exercise.name] && <View style={styles.checkboxChecked} />}
                            </View>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                          </TouchableOpacity>
                          {showCustomInputFor === category && (
                            <TouchableOpacity 
                              onPress={() => handleRemoveCustomExercise(category, exercise.name)} 
                              style={styles.trashButton}
                            >
                              <Trash2 size={18} color="#FF4545" />
                            </TouchableOpacity>
                          )}
                        </View>
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
              {Object.keys(selectedExercises).some(key => selectedExercises[key]) && (
                <TouchableOpacity style={styles.menuAddButton} onPress={handleAddExercises}>
                  <Text style={styles.menuAddText}>Add Selected</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

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
  exercisesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  addExerciseButton: {
    padding: 8,
  },
  exerciseContainer: {
    marginBottom: 24,
  },
  exerciseButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
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
  exerciseTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
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
  inputsContainer: {
    marginLeft: 34,
    marginTop: 8,
  },
  setInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 15,
    color: '#14241C',
    marginRight: 4,
    fontWeight: '500',
    alignSelf: 'center',
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
  setNumberLabel: {
    fontSize: 13,
    color: '#14241C',
    marginBottom: 2,
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
  menuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  penButton: {
    marginLeft: 8,
    padding: 4,
  },
  exerciseMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
});