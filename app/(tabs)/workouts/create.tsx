import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Plus } from 'lucide-react-native';
import { useState } from 'react';

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<any[]>([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);

  const handleAddExercise = (exercise: any) => {
    setExercises([...exercises, exercise]);
    setShowExerciseForm(false);
  };

  const handleSaveWorkout = () => {
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
          <TouchableOpacity onPress={() => setShowExerciseForm(true)}>
            <Plus size={28} color="#E6F2E9" />
          </TouchableOpacity>
        </View>
        {/* List of exercises can go here */}
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
});