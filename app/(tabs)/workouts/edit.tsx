import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Pencil } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const mockExercise = {
  name: 'Bench Press',
  sets: 3,
  reps: 10,
  weight: '135 lbs',
  setDetails: [
    { reps: 10, weight: '135 lbs' },
    { reps: 10, weight: '135 lbs' },
    { reps: 10, weight: '135 lbs' },
  ],
};

export default function EditWorkout() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>  
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push(`/(tabs)`)} style={styles.closeButton}>
          <X size={36} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Workout</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.sectionTitle}>Exercise</Text>
        <Text style={styles.exerciseName}>{mockExercise.name}</Text>
        <Text style={styles.exerciseMeta}>{`${mockExercise.sets} sets · ${mockExercise.reps} reps · ${mockExercise.weight}`}</Text>
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Sets</Text>
        {mockExercise.setDetails.map((set, i) => (
          <View key={i} style={styles.setRow}>
            <View>
              <Text style={styles.setTitle}>{`Set ${i + 1}`}</Text>
              <Text style={styles.setMeta}>{`${set.reps} reps · ${set.weight}`}</Text>
            </View>
            <TouchableOpacity style={styles.pencilButton}>
              <Pencil size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
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
  closeButton: {
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
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    marginTop: 8,
  },
  exerciseName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '400',
    marginBottom: 4,
  },
  exerciseMeta: {
    fontSize: 18,
    color: '#7FC1A4',
    fontWeight: '400',
    marginBottom: 16,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  setTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '400',
    marginBottom: 2,
  },
  setMeta: {
    fontSize: 18,
    color: '#7FC1A4',
    fontWeight: '400',
  },
  pencilButton: {
    padding: 8,
  },
  saveButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    width: '92%',
    backgroundColor: '#10B981',
    borderRadius: 24,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
}); 