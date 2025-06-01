import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { WorkoutsContext } from '../_layout'; // Adjust path if needed

export default function Details() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { workouts } = useContext(WorkoutsContext);
  const workout = workouts.find((w: any) => w.id.toString() === params.id);

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>  
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{workout.name}</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 120 }}>
        {Array.isArray(workout.exercises) && workout.exercises.length > 0 ? (
          workout.exercises.map((exercise: any, i: number) => (
            <View key={i} style={{ marginBottom: 24 }}>
              <Text style={styles.exerciseTitle}>{`Exercise ${i + 1}: ${exercise.name}`}</Text>
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
          ))
        ) : (
          <Text style={styles.setNumber}>No exercises found.</Text>
        )}
      </ScrollView>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => router.push(`/(tabs)/workouts/${params.id}/edit` as any)} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.buttonText}>Start Workout</Text>
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
  exerciseTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    marginTop: 8,
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
  editButton: {
    flex: 1,
    backgroundColor: '#1DB87A',
    borderRadius: 32,
    marginRight: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    flex: 1,
    backgroundColor: '#223D33',
    borderRadius: 32,
    marginLeft: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});