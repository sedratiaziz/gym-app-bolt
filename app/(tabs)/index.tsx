import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';

interface Workout {
  id: number;
  day: string;
  name: string;
  reps: number;
  image: string;
}
const workouts: Workout[] = [];

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];


export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.fbIcon} />
        </View>
        <Text style={styles.appTitle}>Dumbbell Plus</Text>
        <TouchableOpacity style={styles.plusButton} onPress={() => router.push('/workouts/create')}>
          <Plus size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {days.map((day) => (
          <>
            <Text style={styles.sectionHeader}>{day}'s Workouts</Text>
            {workouts.filter((workout) => workout.day === day).length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No workouts added yet.</Text>
              </View>
            ) : (
              <View style={styles.workoutGrid}>
                {workouts.filter((workout) => workout.day === day).map((w) => (
                  <TouchableOpacity onPress={() => { router.push(`/workouts/details?id=${w.id}` as any) }} key={w.id} style={styles.workoutCard}>
                    <Image source={{ uri: w.image }} style={styles.workoutImage} />
                    <Text style={styles.workoutName}>{w.name}</Text>
                    <Text style={styles.workoutReps}>{w.reps} reps</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12221C',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
  },
  topBarLeft: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fbIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22332B',
    borderWidth: 2,
    borderColor: '#fff',
  },
  appTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  plusButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 10,
  },
  workoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  workoutCard: {
    width: '48%',
    backgroundColor: '#1B2A23',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  workoutImage: {
    width: '100%',
    height: 90,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  workoutName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginLeft: 12,
  },
  workoutReps: {
    color: '#6FCF97',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginLeft: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#12221C',
    borderTopWidth: 1,
    borderTopColor: '#22332B',
    height: 70,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    width: 28,
    height: 28,
    marginBottom: 2,
    tintColor: '#6FCF97',
  },
  navLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.7,
  },
  navLabelActive: {
    color: '#6FCF97',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    minHeight: 60,
  },
  emptyText: {
    color: '#A3C1B4',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});