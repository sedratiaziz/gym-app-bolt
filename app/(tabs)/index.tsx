import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, HelpCircle, Pen } from 'lucide-react-native'; // Import Pen icon
import { router } from 'expo-router';
import { WorkoutsContext } from './_layout';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function HomeScreen() {
  const { workouts, setWorkouts } = useContext(WorkoutsContext);
  const [deleteMode, setDeleteMode] = useState(false);

  // Check if there are any workouts for any day
  const hasAnyWorkouts = days.some(day => workouts.some(workout => workout.day === day));

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setWorkouts((prev: any) => prev.filter((w: any) => w.id !== id)),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.penButton} onPress={() => setDeleteMode((v) => !v)}>
          <Pen size={24} color={deleteMode ? "#6FCF97" : "#fff"} />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Dumbbell Plus</Text>
        <TouchableOpacity style={styles.plusButton} onPress={() => router.push('/workouts/create')}>
          <Plus size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {hasAnyWorkouts ? (
          days
            .filter((day) => workouts.some((workout) => workout.day === day))
            .map((day) => (
              <React.Fragment key={day}>
                <Text style={styles.sectionHeader}>{day}'s Workouts</Text>
                <View style={styles.workoutGrid}>
                  {workouts
                    .filter((workout) => workout.day === day)
                    .map((w) => (
                      <TouchableOpacity
                        onPress={() => {
                          if (deleteMode) {
                            handleDelete(w.id);
                          } else {
                            router.push(`/workouts/details?id=${w.id}` as any);
                          }
                        }}
                        key={w.id}
                        style={[
                          styles.workoutCard,
                          deleteMode && { borderColor: '#E57373', borderWidth: 2 },
                        ]}
                      >
                        <Image source={{ uri: w.image }} style={styles.workoutImage} />
                        <Text style={styles.workoutName}>{w.name}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </React.Fragment>
            ))
        ) : (
          <View style={styles.emptyContainer}>
            <HelpCircle size={44} color="#A3C1B4" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyText}>Nothing here!{"\n"}Add some workouts and hit the gym.</Text>
          </View>
        )}
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
  penButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  fbIcon: {
    display: 'none', // Hide the old circle
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