import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X, Search } from 'lucide-react-native';
import { exerciseDatabase } from '@/utils/exerciseDatabase';

export function ExerciseForm({ onAddExercise, onCancel }) {
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('0');
  const [restTime, setRestTime] = useState('60');
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = () => {
    if (exerciseName.trim() === '') {
      // Validation error
      return;
    }

    onAddExercise({
      name: exerciseName,
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight: parseFloat(weight) || 0,
      restTime: parseInt(restTime) || 60,
    });
  };

  const handleExerciseSelect = (exercise) => {
    setExerciseName(exercise.name);
    setShowExerciseSearch(false);
  };

  const filteredExercises = exerciseDatabase.filter(exercise => 
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Exercise Name</Text>
              <View style={styles.nameInputContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={exerciseName}
                  onChangeText={setExerciseName}
                  placeholder="e.g. Bench Press"
                  placeholderTextColor="#C7C7CC"
                />
                <TouchableOpacity 
                  style={styles.searchButton}
                  onPress={() => setShowExerciseSearch(true)}
                >
                  <Search size={20} color="#0066FF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Sets</Text>
                <TextInput
                  style={styles.input}
                  value={sets}
                  onChangeText={setSets}
                  keyboardType="numeric"
                  placeholder="3"
                  placeholderTextColor="#C7C7CC"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Reps</Text>
                <TextInput
                  style={styles.input}
                  value={reps}
                  onChangeText={setReps}
                  keyboardType="numeric"
                  placeholder="10"
                  placeholderTextColor="#C7C7CC"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#C7C7CC"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Rest (sec)</Text>
                <TextInput
                  style={styles.input}
                  value={restTime}
                  onChangeText={setRestTime}
                  keyboardType="numeric"
                  placeholder="60"
                  placeholderTextColor="#C7C7CC"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.addButtonText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showExerciseSearch}
        onRequestClose={() => setShowExerciseSearch(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Exercises</Text>
              <TouchableOpacity 
                onPress={() => setShowExerciseSearch(false)} 
                style={styles.closeButton}
              >
                <X size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color="#8E8E93" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search exercises..."
                placeholderTextColor="#C7C7CC"
                autoFocus
              />
            </View>

            <ScrollView style={styles.exerciseList}>
              {filteredExercises.map((exercise, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.exerciseItem}
                  onPress={() => handleExerciseSelect(exercise)}
                >
                  <View>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    minHeight: '70%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 8,
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    paddingRight: 8,
  },
  nameInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  searchButton: {
    padding: 8,
  },
  input: {
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F7',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#0066FF',
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 16,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  exerciseList: {
    flex: 1,
  },
  exerciseItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  exerciseCategory: {
    fontSize: 14,
    color: '#8E8E93',
  },
});