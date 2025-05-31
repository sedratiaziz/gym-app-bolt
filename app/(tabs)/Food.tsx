import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X } from 'lucide-react-native';

interface Meal {
  name: string;
  calories: number;
  time: string;
}

export default function FoodScreen() {
  const [meals, setMeals] = useState<Meal[]>([
    { name: 'Breakfast', calories: 350, time: '08:00 AM' },
    { name: 'Lunch', calories: 600, time: '12:30 PM' },
    { name: 'Snack', calories: 200, time: '04:00 PM' },
    { name: 'Dinner', calories: 500, time: '07:30 PM' },
  ]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealTime, setMealTime] = useState('');

  const handleAddMeal = () => {
    if (!mealName || !mealCalories || !mealTime) return;
    setMeals([
      ...meals,
      { name: mealName, calories: parseInt(mealCalories), time: mealTime },
    ]);
    setMealName('');
    setMealCalories('');
    setMealTime('');
    setShowAddMeal(false);
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.gradientHeader}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Calorie Intake</Text>
          <TouchableOpacity onPress={() => setShowAddMeal(true)}>
            <Plus size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>Alex</Text>
        <Text style={styles.bigCalories}>{totalCalories} kcal</Text>
        <Text style={styles.caloriesLabel}>Total Calories Today</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 40 }}>
        {meals.length === 0 ? (
          <Text style={styles.emptyText}>No meals logged yet.</Text>
        ) : (
          meals.map((meal, idx) => (
            <View key={idx} style={styles.mealItem}>
              <View>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
            </View>
          ))
        )}
      </ScrollView>
      {showAddMeal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddMeal}
          onRequestClose={() => setShowAddMeal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Meal</Text>
                <TouchableOpacity onPress={() => setShowAddMeal(false)}>
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
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowAddMeal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleAddMeal}>
                  <Text style={styles.saveButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
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
    justifyContent: 'space-between',
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
}); 