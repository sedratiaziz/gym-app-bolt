import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Filter, Dumbbell, Clock } from 'lucide-react-native';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';
import { formatDate } from '@/utils/dateUtils';

export default function WorkoutsScreen() {
  const router = useRouter();
  const { getAllWorkouts } = useWorkoutHistory();
  const [workouts, setWorkouts] = useState([]);
  const [filterOption, setFilterOption] = useState('all');

  useEffect(() => {
    setWorkouts(getAllWorkouts());
  }, []);

  const renderWorkoutItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.workoutCard}
      onPress={() => router.push(`/workouts/${item.id}`)}
    >
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <View style={styles.workoutTypeTag}>
          <Text style={styles.workoutTypeText}>{item.type}</Text>
        </View>
      </View>
      <View style={styles.workoutDetails}>
        <View style={styles.workoutDetailItem}>
          <Dumbbell size={16} color="#8E8E93" />
          <Text style={styles.workoutDetailText}>{item.exercises.length} exercises</Text>
        </View>
        <View style={styles.workoutDetailItem}>
          <Clock size={16} color="#8E8E93" />
          <Text style={styles.workoutDetailText}>{item.duration} min</Text>
        </View>
      </View>
      <Text style={styles.workoutDate}>{formatDate(new Date(item.date))}</Text>
    </TouchableOpacity>
  );

  const filterWorkouts = () => {
    switch (filterOption) {
      case 'recent':
        return [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'strength':
        return workouts.filter(workout => workout.type === 'Strength');
      case 'cardio':
        return workouts.filter(workout => workout.type === 'Cardio');
      default:
        return workouts;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {
            // Cycle through filter options
            const options = ['all', 'recent', 'strength', 'cardio'];
            const currentIndex = options.indexOf(filterOption);
            const nextIndex = (currentIndex + 1) % options.length;
            setFilterOption(options[nextIndex]);
          }}
        >
          <Filter size={20} color="#0066FF" />
          <Text style={styles.filterText}>
            {filterOption === 'all' ? 'All' : 
             filterOption === 'recent' ? 'Recent' : 
             filterOption === 'strength' ? 'Strength' : 'Cardio'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/workouts/create')}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>New Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.push('/workouts/templates')}
          >
            <Text style={styles.secondaryButtonText}>Templates</Text>
          </TouchableOpacity>
        </View>

        {workouts.length > 0 ? (
          <FlatList
            data={filterWorkouts()}
            renderItem={renderWorkoutItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.workoutList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Dumbbell size={48} color="#E5E5EA" />
            <Text style={styles.emptyStateTitle}>No workouts yet</Text>
            <Text style={styles.emptyStateText}>Start tracking your fitness journey today</Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => router.push('/workouts/create')}
            >
              <Text style={styles.emptyStateButtonText}>Create Your First Workout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#0066FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#F0F8FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066FF',
  },
  workoutList: {
    paddingBottom: 16,
  },
  workoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  workoutTypeTag: {
    backgroundColor: '#F0F8FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  workoutTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0066FF',
  },
  workoutDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  workoutDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  workoutDetailText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  workoutDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});