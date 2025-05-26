import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Calendar, TrendingUp, Clock, Plus, Dumbbell } from 'lucide-react-native';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';
import { formatDate } from '@/utils/dateUtils';

export default function Dashboard() {
  const router = useRouter();
  const { getRecentWorkouts, getWeeklyStats } = useWorkoutHistory();
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({ workouts: 0, duration: 0 });
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setRecentWorkouts(getRecentWorkouts(3));
    setWeeklyStats(getWeeklyStats());
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi there,</Text>
          <Text style={styles.title}>Ready for your workout?</Text>
        </View>

        <View style={styles.dateContainer}>
          <Calendar size={20} color="#0066FF" />
          <Text style={styles.date}>{formatDate(currentDate)}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Dumbbell size={24} color="#FFFFFF" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{weeklyStats.workouts}</Text>
              <Text style={styles.statLabel}>Workouts this week</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#00D1C1' }]}>
              <Clock size={24} color="#FFFFFF" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{weeklyStats.duration}</Text>
              <Text style={styles.statLabel}>Hours this week</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          <TouchableOpacity onPress={() => router.push('/workouts')}>
            <Text style={styles.sectionLink}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentWorkouts.length > 0 ? (
          recentWorkouts.map((workout, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.workoutCard}
              onPress={() => router.push(`/workouts/${workout.id}`)}
            >
              <View style={styles.workoutCardLeft}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutMeta}>
                  {workout.exercises.length} exercises • {workout.duration} min
                </Text>
              </View>
              <View style={styles.workoutCardRight}>
                <Text style={styles.workoutDate}>{formatDate(new Date(workout.date), 'short')}</Text>
                <TrendingUp size={16} color="#0066FF" />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent workouts</Text>
            <TouchableOpacity 
              style={styles.startWorkoutButton}
              onPress={() => router.push('/workouts/create')}
            >
              <Text style={styles.startWorkoutButtonText}>Start your first workout</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
        </View>

        <View style={styles.quickStartContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickStartScrollContent}
          >
            <TouchableOpacity 
              style={styles.quickStartCard}
              onPress={() => router.push('/workouts/templates')}
            >
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg' }} 
                style={styles.quickStartImage}
              />
              <Text style={styles.quickStartName}>Upper Body</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickStartCard}
              onPress={() => router.push('/workouts/templates')}
            >
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/4761767/pexels-photo-4761767.jpeg' }} 
                style={styles.quickStartImage}
              />
              <Text style={styles.quickStartName}>Lower Body</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickStartCard}
              onPress={() => router.push('/workouts/templates')}
            >
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/3823173/pexels-photo-3823173.jpeg' }} 
                style={styles.quickStartImage}
              />
              <Text style={styles.quickStartName}>Cardio</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickStartCard, styles.createTemplateCard]}
              onPress={() => router.push('/workouts/create')}
            >
              <View style={styles.createTemplateIconContainer}>
                <Plus size={24} color="#0066FF" />
              </View>
              <Text style={styles.createTemplateName}>Create New</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 8,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0066FF',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0066FF',
  },
  workoutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  workoutCardLeft: {
    flex: 3,
  },
  workoutCardRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  workoutMeta: {
    fontSize: 14,
    color: '#8E8E93',
  },
  workoutDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 16,
  },
  startWorkoutButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startWorkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  quickStartContainer: {
    marginBottom: 24,
  },
  quickStartScrollContent: {
    paddingRight: 16,
  },
  quickStartCard: {
    width: 140,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickStartImage: {
    width: '100%',
    height: 100,
  },
  quickStartName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    padding: 12,
  },
  createTemplateCard: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 143,
  },
  createTemplateIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  createTemplateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066FF',
  },
});