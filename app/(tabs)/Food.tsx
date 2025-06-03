import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X, Edit2, Trash2 } from 'lucide-react-native';
import { GestureHandlerRootView, LongPressGestureHandler, State } from 'react-native-gesture-handler';

interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string;
}

const DEFAULT_CALORIE_GOAL = 2000; // Default daily calorie goal in kcal

export default function FoodScreen() {
  const [meals, setMeals] = useState<Meal[]>([
    { id: '1', name: 'Breakfast', calories: 350, time: '08:00 AM' },
    { id: '2', name: 'Lunch', calories: 600, time: '12:30 PM' },
    { id: '3', name: 'Snack', calories: 200, time: '04:00 PM' },
    { id: '4', name: 'Dinner', calories: 500, time: '07:30 PM' },
  ]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [calorieGoal, setCalorieGoal] = useState(DEFAULT_CALORIE_GOAL);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState('');
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [activeMealId, setActiveMealId] = useState<string | null>(null);

  const handleAddMeal = () => {
    if (!mealName || !mealCalories || !mealTime) return;
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: mealName,
      calories: parseInt(mealCalories),
      time: mealTime,
    };
    setMeals([...meals, newMeal]);
    setMealName('');
    setMealCalories('');
    setMealTime('');
    setShowAddMeal(false);
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setMealName(meal.name);
    setMealCalories(meal.calories.toString());
    setMealTime(meal.time);
    setShowAddMeal(true);
  };

  const handleUpdateMeal = () => {
    if (!editingMeal || !mealName || !mealCalories || !mealTime) return;
    const updatedMeals = meals.map(meal => 
      meal.id === editingMeal.id 
        ? { ...meal, name: mealName, calories: parseInt(mealCalories), time: mealTime }
        : meal
    );
    setMeals(updatedMeals);
    setMealName('');
    setMealCalories('');
    setMealTime('');
    setShowAddMeal(false);
    setEditingMeal(null);
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  const handleGoalEdit = () => {
    setTempGoal(calorieGoal.toString());
    setIsEditingGoal(true);
  };

  const handleGoalSave = () => {
    const newGoal = parseInt(tempGoal);
    if (!isNaN(newGoal) && newGoal > 0) {
      setCalorieGoal(newGoal);
    }
    setIsEditingGoal(false);
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const progressPercentage = Math.min((totalCalories / calorieGoal) * 100, 100);

  const handleLongPress = (mealId: string) => {
    setActiveMealId(mealId);
  };

  const handleScreenPress = () => {
    setActiveMealId(null);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.gradientHeader}>
          <View style={styles.headerRow}> 
            <TouchableOpacity onPress={() => setShowAddMeal(true)}>
              <Text style={styles.headerTitle}>Add Meal</Text>
              <Plus size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Total Calories Today</Text>
          <Text style={styles.bigCalories}>{totalCalories} kcal</Text>
          
          {/* Calorie Goal Input */}
          <View style={styles.goalContainer}>
            {isEditingGoal ? (
              <View style={styles.goalInputContainer}>
                <TextInput
                  style={styles.goalInput}
                  value={tempGoal}
                  onChangeText={setTempGoal}
                  keyboardType="numeric"
                  placeholder="Enter goal"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  autoFocus
                />
                <TouchableOpacity style={styles.goalSaveButton} onPress={handleGoalSave}>
                  <Text style={styles.goalSaveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.goalDisplayContainer}>
                <Text style={styles.goalText}>Daily Goal: {calorieGoal} kcal</Text>
                <TouchableOpacity style={styles.goalEditButton} onPress={handleGoalEdit}>
                  <Edit2 size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progressPercentage)}% of daily goal
            </Text>
          </View>
        </View>
        <Pressable style={styles.scrollView} onPress={handleScreenPress}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {meals.length === 0 ? (
              <Text style={styles.emptyText}>No meals logged yet.</Text>
            ) : (
              meals.map((meal) => (
                <LongPressGestureHandler
                  key={meal.id}
                  onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.state === State.ACTIVE) {
                      handleLongPress(meal.id);
                    }
                  }}
                >
                  <View style={styles.mealItem}>
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <Text style={styles.mealTime}>{meal.time}</Text>
                    </View>
                    <View style={styles.mealActions}>
                      <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                      {activeMealId === meal.id && (
                        <View style={styles.actionButtons}>
                          <TouchableOpacity 
                            style={styles.actionButton} 
                            onPress={() => handleEditMeal(meal)}
                          >
                            <Edit2 size={18} color="#A3C1B4" />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.actionButton} 
                            onPress={() => handleDeleteMeal(meal.id)}
                          >
                            <Trash2 size={18} color="#FF6B6B" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </LongPressGestureHandler>
              ))
            )}
          </ScrollView>
        </Pressable>
        {showAddMeal && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showAddMeal}
            onRequestClose={() => {
              setShowAddMeal(false);
              setEditingMeal(null);
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {editingMeal ? 'Edit Meal' : 'Add Meal'}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setShowAddMeal(false);
                      setEditingMeal(null);
                    }}
                  >
                    <X size={24} color="#000" />
                  </TouchableOpacity>
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Meal Name</Text>
                  <TextInput
                    style={styles.input}
                    value={mealName}
                    onChangeText={setMealName}
                    placeholder="e.g. Breakfast"
                    placeholderTextColor="#C7C7CC"
                    autoFocus
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Calories</Text>
                  <TextInput
                    style={styles.input}
                    value={mealCalories}
                    onChangeText={setMealCalories}
                    keyboardType="numeric"
                    placeholder="e.g. 350"
                    placeholderTextColor="#C7C7CC"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Time</Text>
                  <TextInput
                    style={styles.input}
                    value={mealTime}
                    onChangeText={setMealTime}
                    placeholder="e.g. 08:00 AM"
                    placeholderTextColor="#C7C7CC"
                  />
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={() => {
                      setShowAddMeal(false);
                      setEditingMeal(null);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.button, styles.saveButton]} 
                    onPress={editingMeal ? handleUpdateMeal : handleAddMeal}
                  >
                    <Text style={styles.saveButtonText}>
                      {editingMeal ? 'Update' : 'Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12221C',
  },
  gradientHeader: {
    width: '100%',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: 'linear-gradient(180deg, #7B2FF2 0%, #F357A8 100%)', // fallback for web, will override below
    backgroundImage: 'linear-gradient(180deg, #7B2FF2 0%, #F357A8 100%)', // for web
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    marginBottom: 18,
    // For React Native, use a View with a gradient library like react-native-linear-gradient
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 6,
  },
  bigCalories: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 2,
  },
  caloriesLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.85,
    marginBottom: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#22332B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    marginHorizontal: 16,
  },
  mealInfo: {
    flex: 1,
  },
  mealActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 4,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  mealName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  mealTime: {
    color: '#A3C1B4',
    fontSize: 14,
    marginTop: 2,
  },
  mealCalories: {
    color: '#6FCF97',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: '#A3C1B4',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#14241C',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
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
    color: '#000',
  },
  modalFooter: {
    flexDirection: 'row',
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#F5F5F7',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  saveButton: {
    backgroundColor: '#6FCF97',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  progressContainer: {
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
  },
  progressBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.9,
  },
  goalContainer: {
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
  },
  goalDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.9,
  },
  goalEditButton: {
    marginLeft: 8,
    padding: 4,
  },
  goalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  goalInput: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    width: 100,
    textAlign: 'center',
  },
  goalSaveButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
  },
  goalSaveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 