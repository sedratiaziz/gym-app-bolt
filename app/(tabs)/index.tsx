import React, { useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, HelpCircle, Pen, TrendingUp } from 'lucide-react-native';
import { router } from 'expo-router';
import { WorkoutsContext } from './_layout';
import Svg, { Path, G, Circle } from 'react-native-svg';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Training frequency levels and their colors
const TRAINING_LEVELS = {
  NONE: '#22332B', // Dark Gray
  LOW: '#FF6B6B',    // Red for 1 or less
  MEDIUM: '#FFD93D', // Yellow for 2
  HIGH: '#6FCF97',   // Green for 3+
};

interface BodyPart {
  id: string;
  name: string;
  path: string;
  trainingLevel: keyof typeof TRAINING_LEVELS;
  muscleGroups: string[];
  view: 'front' | 'back';
  workoutCount?: number;
}

// Note: These SVG paths are approximations derived from the provided image
// to represent major muscle groups. They are not anatomically exact.
// Creating precise paths typically requires vector graphics software.
const bodyParts: BodyPart[] = [
  // Front View
  {
    id: 'chest-front',
    name: 'Chest',
    path: 'M50 30 C60 30 70 35 75 45 C80 55 75 65 70 70 L65 65 C60 60 40 60 35 65 L30 70 C25 65 20 55 25 45 C30 35 40 30 50 30 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['chest', 'pectoralis'],
    view: 'front',
  },
  {
    id: 'abs-front',
    name: 'Abs',
    path: 'M40 65 C45 70 55 70 60 65 L60 75 C55 80 45 80 40 75 L40 65 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['abs', 'core'],
    view: 'front',
  },
  {
    id: 'quads-front-left',
    name: 'Quads (L)',
    path: 'M40 80 L45 110 Q50 120 45 130 L40 120 Q35 110 40 80 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['quads', 'legs', 'lower body'],
    view: 'front',
  },
   {
    id: 'quads-front-right',
    name: 'Quads (R)',
    path: 'M60 80 L55 110 Q50 120 55 130 L60 120 Q65 110 60 80 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['quads', 'legs', 'lower body'],
    view: 'front',
  },
  {
    id: 'shoulders-front-left',
    name: 'Shoulders (L)',
    path: 'M30 40 Q25 45 30 50 Q35 45 30 40 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['shoulders', 'deltoids'],
    view: 'front',
  },
   {
    id: 'shoulders-front-right',
    name: 'Shoulders (R)',
    path: 'M70 40 Q75 45 70 50 Q65 45 70 40 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['shoulders', 'deltoids'],
    view: 'front',
  },
  {
    id: 'biceps-front-left',
    name: 'Biceps (L)',
    path: 'M25 55 Q30 60 25 65 Q20 60 25 55 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['biceps', 'arms', 'upper body'],
    view: 'front',
  },
  {
    id: 'biceps-front-right',
    name: 'Biceps (R)',
    path: 'M75 55 Q70 60 75 65 Q80 60 75 55 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['biceps', 'arms', 'upper body'],
    view: 'front',
  },
  {
    id: 'forearms-front-left',
    name: 'Forearms (L)',
    path: 'M20 65 L22 85 Q20 90 18 85 L20 65 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['forearms', 'arms'],
    view: 'front',
  },
   {
    id: 'forearms-front-right',
    name: 'Forearms (R)',
    path: 'M80 65 L78 85 Q80 90 82 85 L80 65 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['forearms', 'arms'],
    view: 'front',
  },

  // Back View (coordinates shifted by 100 on the x-axis)
   {
    id: 'traps-back',
    name: 'Traps',
    path: 'M140 25 Q150 20 160 25 Q150 30 140 25 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['traps', 'upper back', 'back'],
    view: 'back',
  },
  {
    id: 'lats-back-left',
    name: 'Lats (L)',
    path: 'M125 40 Q135 50 125 60 Q115 50 125 40 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['lats', 'back', 'upper back'],
    view: 'back',
  },
  {
    id: 'lats-back-right',
    name: 'Lats (R)',
    path: 'M175 40 Q165 50 175 60 Q185 50 175 40 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['lats', 'back', 'upper back'],
    view: 'back',
  },
  {
    id: 'lower-back-back',
    name: 'Lower Back',
    path: 'M140 65 Q150 60 160 65 Q150 70 140 65 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['lower back', 'back', 'core'],
    view: 'back',
  },
  {
    id: 'glutes-back-left',
    name: 'Glutes (L)',
    path: 'M140 90 Q145 95 140 100 Q135 95 140 90 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['glutes', 'lower body'],
    view: 'back',
  },
  {
    id: 'glutes-back-right',
    name: 'Glutes (R)',
    path: 'M160 90 Q155 95 160 100 Q165 95 160 90 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['glutes', 'lower body'],
    view: 'back',
  },
  {
    id: 'hamstrings-back-left',
    name: 'Hamstrings (L)',
    path: 'M140 110 Q145 120 140 130 Q135 120 140 110 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['hamstrings', 'legs', 'lower body'],
    view: 'back',
  },
  {
    id: 'hamstrings-back-right',
    name: 'Hamstrings (R)',
    path: 'M160 110 Q155 120 160 130 Q165 120 160 110 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['hamstrings', 'legs', 'lower body'],
    view: 'back',
  },
  {
    id: 'calves-back-left',
    name: 'Calves (L)',
    path: 'M145 140 Q150 150 145 160 Q140 150 145 140 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['calves', 'legs', 'lower body'],
    view: 'back',
  },
   {
    id: 'calves-back-right',
    name: 'Calves (R)',
    path: 'M155 140 Q150 150 155 160 Q160 150 155 140 Z',
    trainingLevel: 'NONE',
    muscleGroups: ['calves', 'legs', 'lower body'],
    view: 'back',
  },
];

const BodyFigure = ({ workoutAnalysis, selectedPart, handlePartPress }: { workoutAnalysis: BodyPart[], selectedPart: string | null, handlePartPress: (partId: string) => void }) => {
  const selectedBodyPart = workoutAnalysis.find(part => part.id === selectedPart);

  // Approximate a position for the tooltip indicator based on the selected part's view
  const tooltipIndicatorX = selectedBodyPart?.view === 'front' ? 50 : 150;
  const tooltipIndicatorY = 10; // Position at the top

  return (
    <View style={styles.bodyGraphic}>
      <Svg width="100%" height="100%" viewBox="0 0 200 180">
        <G>
          {workoutAnalysis.map((part) => (
            <Path
              key={part.id}
              d={part.path}
              fill={TRAINING_LEVELS[part.trainingLevel]}
              stroke="#A3C1B4"
              strokeWidth="1"
              onPress={() => handlePartPress(part.id)}
            />
          ))}
        </G>
         {selectedPart && selectedBodyPart && (
            <Circle
              cx={tooltipIndicatorX}
              cy={tooltipIndicatorY}
              r="3"
              fill="#6FCF97"
            />
          )}
      </Svg>
      {selectedPart && selectedBodyPart && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            {selectedBodyPart.name}
            {' - '}
            {selectedBodyPart.workoutCount} workouts
          </Text>
        </View>
      )}
    </View>
  );
};

export default function HomeScreen() {
  const { workouts, setWorkouts } = useContext(WorkoutsContext);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // Analyze workout frequency for the past 7 days
  const workoutAnalysis = useMemo(() => {
    const muscleGroupCounts: { [key: string]: number } = {};
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Count workouts for each muscle group
    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      if (workoutDate >= sevenDaysAgo) {
        workout.muscleGroups?.forEach(group => {
          muscleGroupCounts[group.toLowerCase()] = (muscleGroupCounts[group.toLowerCase()] || 0) + 1;
        });
      }
    });

    // Update body parts with training levels and count
    return bodyParts.map(part => {
      const count = part.muscleGroups.reduce((sum, group) => 
        sum + (muscleGroupCounts[group.toLowerCase()] || 0), 0);
      
      let level: keyof typeof TRAINING_LEVELS = 'NONE';
      if (count >= 3) level = 'HIGH';
      else if (count === 2) level = 'MEDIUM';
      else if (count > 0) level = 'LOW';

      return {
        ...part,
        trainingLevel: level,
        workoutCount: count,
      };
    });
  }, [workouts]);

  // Identify undertrained muscle groups
  const undertrainedMuscleGroups = useMemo(() => {
    const undertrained = workoutAnalysis.filter(part => part.trainingLevel === 'LOW' || part.trainingLevel === 'MEDIUM');
    return undertrained.map(part => part.name).join(', ');
  }, [workoutAnalysis]);

  const handlePartPress = (partId: string) => {
    setSelectedPart(partId);
  };

  // Check if there are any workouts for any day
  const hasAnyWorkouts = days.some(day => workouts.some(workout => workout.day === day));

  const handleDelete = (id: number) => {
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
        {/* Past Week Section */}
        <View style={styles.pastWeekSection}>
          <View style={styles.sectionHeaderContainer}>
            <TrendingUp size="24" color="#6FCF97" />
            <Text style={styles.sectionHeader}>Past Week</Text>
          </View>
          
          <View style={styles.bodyGraphicContainer}>
            <BodyFigure 
              workoutAnalysis={workoutAnalysis}
              selectedPart={selectedPart}
              handlePartPress={handlePartPress}
            />
            
            {/* Color Legend */}
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Training Frequency (Past 7 Days)</Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: TRAINING_LEVELS.HIGH }]} />
                  <Text style={styles.legendText}>3+ workouts</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: TRAINING_LEVELS.MEDIUM }]} />
                  <Text style={styles.legendText}>2 workouts</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: TRAINING_LEVELS.LOW }]} />
                  <Text style={styles.legendText}>1 or less workout</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: TRAINING_LEVELS.NONE }]} />
                  <Text style={styles.legendText}>No workouts</Text>
                </View>
              </View>
            </View>

            {/* Needs Improvement Section */}
            {undertrainedMuscleGroups && undertrainedMuscleGroups.length > 0 && (
              <View style={styles.improvementSection}>
                <Text style={styles.improvementTitle}>Needs Improvement:</Text>
                <Text style={styles.improvementList}>{undertrainedMuscleGroups}</Text>
              </View>
            )}

            <View style={styles.improvementNotes}>
              <Text style={styles.improvementTitle}>Weekly Progress</Text>
              <View style={styles.noteItem}>
                <View style={styles.noteDot} />
                <Text style={styles.noteText}>Increased bench press by 5kg</Text>
              </View>
              <View style={styles.noteItem}>
                <View style={styles.noteDot} />
                <Text style={styles.noteText}>Improved squat form</Text>
              </View>
              <View style={styles.noteItem}>
                <View style={styles.noteDot} />
                <Text style={styles.noteText}>Added 2 new exercises</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Existing Workouts Section */}
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
  pastWeekSection: {
    marginBottom: 24,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bodyGraphicContainer: {
    backgroundColor: '#1B2A23',
    borderRadius: 16,
    padding: 16,
  },
  bodyGraphic: {
    width: '100%',
    aspectRatio: 200 / 180,
    backgroundColor: '#22332B',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  improvementNotes: {
    backgroundColor: '#22332B',
    borderRadius: 12,
    padding: 16,
  },
  improvementTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6FCF97',
    marginRight: 12,
  },
  noteText: {
    color: '#A3C1B4',
    fontSize: 16,
    flex: 1,
  },
  legendContainer: {
    backgroundColor: '#22332B',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  legendTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '48%', // Two items per row
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    color: '#A3C1B4',
    fontSize: 14,
  },
  improvementSection: {
    backgroundColor: '#22332B',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  improvementList: {
    color: '#FFD93D', // Yellow color for the list
    fontSize: 16,
    marginTop: 8,
  },
});