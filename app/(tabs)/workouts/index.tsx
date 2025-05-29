import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';

// Define Workout type
interface Workout {
  id: string | number;
  name: string;
}

export default function WorkoutsScreen() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);


  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <View style={styles.workoutRow}>
      <Text style={styles.workoutName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push(`/workouts/${item.id}/edit` as any)}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>  
      <View style={styles.header}>
        <Text style={styles.title}>Excercises</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/workouts/create')}
        >
          <Plus size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.workoutList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14241C', // dark green/black
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F8F8F8',
    textAlign: 'center',
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    right: 24,
    top: 32,
    backgroundColor: 'transparent',
    padding: 4,
  },
  workoutList: {
    paddingHorizontal: 0,
    paddingBottom: 24,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 0,
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 24,
    color: '#F8F8F8',
    fontWeight: '400',
  },
  editButton: {
    backgroundColor: '#223D33',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#F8F8F8',
    fontSize: 22,
    fontWeight: '400',
  },
});