import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Plus, Trash, Pen } from 'lucide-react-native';
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
  };

  const handleAddSelectedExercises = () => {
    // Gather all exercises (built-in and custom) from the modal
    const allExercises = Object.values(allGroupedExercises).flat();
    const toAdd = allExercises.filter(e => selectedExercises[e.name]);
    setExercises([...exercises, ...toAdd]);
    setShowExerciseMenu(false);
    setSelectedExercises({});
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
    // Create a new workout object
    const newWorkout = {
      id: Date.now(),
      day: selectedDay.toLowerCase(),
      name: workoutName,
      reps: exercises.length > 0 ? exercises[0].reps : 0,
      image: exercises.length > 0 ? (exercises[0].imageUrl || exercises[0].image || 'https://images.pexels.com/photos/136404/pexels-photo-136404.jpeg') : 'https://images.pexels.com/photos/136404/pexels-photo-136404.jpeg',
      exercises: exercises, // <-- Add this line to include the array of exercises
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
        <Text style={styles.label}>Workout Name</Text>
        <TextInput
          style={styles.input}
          value={workoutName}
          onChangeText={setWorkoutName}
          placeholder="Workout Name"
          placeholderTextColor="#A3C1B4"
        />
        <Text style={styles.label}>Exercises</Text>
        <View style={styles.exerciseRow}>
          <Text style={styles.addExerciseText}>Add Exercise</Text>
          <TouchableOpacity onPress={() => setShowExerciseMenu(true)}>
            <Plus size={28} color="#E6F2E9" />
          </TouchableOpacity>
        </View>
        {/* List of selected exercises */}
        {exercises.length > 0 && (
          <View style={styles.selectedExercisesList}>
            {exercises.map((exercise, idx) => (
              <View key={exercise.name + idx} style={styles.selectedExerciseRow}>
                <Text style={styles.selectedExerciseName}>{exercise.name}</Text>
                <TouchableOpacity onPress={() => handleRemoveExercise(idx)} style={styles.trashButton}>
                  <Trash size={20} color="#FF4545" />
                </TouchableOpacity>
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
                          <TouchableOpacity
                            onPress={() => handleToggleExercise(exercise)}
                            activeOpacity={0.7}
                            style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                          >
                            <View style={styles.checkbox}>
                              {selectedExercises[exercise.name] && <View style={styles.checkboxChecked} />}
                            </View>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                          </TouchableOpacity>
                          {/* Show trash bin for all exercises in editing mode only */}
                          {showCustomInputFor === category && (
                            <TouchableOpacity onPress={() => handleRemoveCustomExercise(category, exercise.name)} style={styles.trashButton}>
                              <Trash size={18} color="#FF4545" />
                            </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  selectedExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#223D33',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  selectedExerciseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  trashButton: {
    marginLeft: 'auto',
    paddingLeft: 12,
    paddingVertical: 2,
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
});