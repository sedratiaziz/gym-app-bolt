import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, Trash2, Save } from 'lucide-react-native';
import { ExerciseForm } from '@/components/ExerciseForm';
import { saveWorkout } from '@/utils/storage';

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('Strength');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  
  const handleAddExercise = (exercise) => {
    setExercises([...exercises, exercise]);
    setShowExerciseForm(false);
  };

  const handleRemoveExercise = (index) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
  };

  const handleSaveWorkout = () => {
    if (workoutName.trim() === '') {
      // Show validation error
      return;
    }

    if (exercises.length === 0) {
      // Show validation error
      return;
    }

    const newWorkout = {
      id: Date.now(),
      name: workoutName,
      type: workoutType,
      date: new Date().toISOString(),
      exercises: exercises,
      duration: calculateTotalDuration(exercises),
      isTemplate: saveAsTemplate,
    };

    saveWorkout(newWorkout);
    router.push('/workouts');
  };

  const calculateTotalDuration = (exercises) => {
    // Simple calculation based on exercise count
    return exercises.length * 5;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Workout</Text>
        <TouchableOpacity onPress={handleSaveWorkout} style={styles.saveButton}>
          <Save size={20} color="#0066FF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Workout Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={workoutName}
              onChangeText={setWorkoutName}
              placeholder="e.g. Morning Strength Session"
              placeholderTextColor="#C7C7CC"
            />
          </View>

          <View style={styles.typeSelector}>
            <Text style={styles.inputLabel}>Type</Text>
            <View style={styles.typeOptions}>
              <TouchableOpacity 
                style={[
                  styles.typeOption, 
                  workoutType === 'Strength' && styles.typeOptionSelected
                ]}
                onPress={() => setWorkoutType('Strength')}
              >
                <Text style={[
                  styles.typeOptionText,
                  workoutType === 'Strength' && styles.typeOptionTextSelected
                ]}>Strength</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.typeOption, 
                  workoutType === 'Cardio' && styles.typeOptionSelected
                ]}
                onPress={() => setWorkoutType('Cardio')}
              >
                <Text style={[
                  styles.typeOptionText,
                  workoutType === 'Cardio' && styles.typeOptionTextSelected
                ]}>Cardio</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.typeOption, 
                  workoutType === 'Flexibility' && styles.typeOptionSelected
                ]}
                onPress={() => setWorkoutType('Flexibility')}
              >
                <Text style={[
                  styles.typeOptionText,
                  workoutType === 'Flexibility' && styles.typeOptionTextSelected
                ]}>Flexibility</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Save as template</Text>
            <Switch
              value={saveAsTemplate}
              onValueChange={setSaveAsTemplate}
              trackColor={{ false: '#E5E5EA', true: '#0066FF' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetail}>
                    {exercise.sets} sets • {exercise.reps} reps
                    {exercise.weight > 0 ? ` • ${exercise.weight} kg` : ''}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleRemoveExercise(index)}
                  style={styles.removeButton}
                >
                  <Trash2 size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyExercises}>
              <Text style={styles.emptyExercisesText}>No exercises added yet</Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.addExerciseButton}
            onPress={() => setShowExerciseForm(true)}
          >
            <Plus size={20} color="#0066FF" />
            <Text style={styles.addExerciseText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showExerciseForm && (
        <ExerciseForm 
          onAddExercise={handleAddExercise} 
          onCancel={() => setShowExerciseForm(false)} 
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  typeSelector: {
    marginBottom: 16,
  },
  typeOptions: {
    flexDirection: 'row',
  },
  typeOption: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  typeOptionSelected: {
    backgroundColor: '#E6F2FF',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  typeOptionTextSelected: {
    color: '#0066FF',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  exercisesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  removeButton: {
    padding: 8,
  },
  emptyExercises: {
    padding: 16,
    alignItems: 'center',
  },
  emptyExercisesText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  addExerciseText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#0066FF',
  },
});