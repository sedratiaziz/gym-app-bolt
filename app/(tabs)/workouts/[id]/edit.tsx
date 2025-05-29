import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Pencil } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const mockExercise = {
  name: 'Bench Press',
  sets: 3,
  reps: 10,
  weight: '135 lbs',
  setDetails: [
    { reps: 10, weight: '135 lbs' },
    { reps: 10, weight: '135 lbs' },
    { reps: 10, weight: '135 lbs' },
  ],
};

export default function EditWorkout() {
  const router = useRouter();
  const [showSetEdit, setShowSetEdit] = useState(false);
  const [editSetIndex, setEditSetIndex] = useState<number | null>(null);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const handlePencilPress = (index: number) => {
    setEditSetIndex(index);
    setReps(mockExercise.setDetails[index].reps.toString());
    setWeight(mockExercise.setDetails[index].weight.replace(' lbs', ''));
    setShowSetEdit(true);
  };

  const handleSave = () => {
    // Here you would update the set details in state or backend
    setShowSetEdit(false);
  };

  const handleCancel = () => {
    setShowSetEdit(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>  
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push(`/(tabs)`)} style={styles.closeButton}>
          <X size={36} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Workout</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.sectionTitle}>Day of the Week</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDay}
            onValueChange={(itemValue: string) => setSelectedDay(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Sunday" value="Sunday" />
            <Picker.Item label="Monday" value="Monday" />
            <Picker.Item label="Tuesday" value="Tuesday" />
            <Picker.Item label="Wednesday" value="Wednesday" />
            <Picker.Item label="Thursday" value="Thursday" />
            <Picker.Item label="Friday" value="Friday" />
            <Picker.Item label="Saturday" value="Saturday" />
          </Picker>
        </View>
        <Text style={styles.sectionTitle}>Exercise</Text>
        <Text style={styles.exerciseName}>{mockExercise.name}</Text>
        <Text style={styles.exerciseMeta}>{`${mockExercise.sets} sets · ${mockExercise.reps} reps · ${mockExercise.weight}`}</Text>
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Sets</Text>
        {mockExercise.setDetails.map((set, i) => (
          <View key={i} style={styles.setRow}>
            <View>
              <Text style={styles.setTitle}>{`Set ${i + 1}`}</Text>
              <Text style={styles.setMeta}>{`${set.reps} reps · ${set.weight}`}</Text>
            </View>
            <TouchableOpacity style={styles.pencilButton} onPress={() => handlePencilPress(i)}>
              <Pencil size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      {showSetEdit && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSetEdit}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Set</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  value={reps}
                  onChangeText={setReps}
                  keyboardType="numeric"
                  placeholder="Reps"
                  placeholderTextColor="#C7C7CC"
                  autoFocus
                />
                <TextInput
                  style={[styles.input, { flex: 1, marginLeft: 8 }]}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="Weight (lbs)"
                  placeholderTextColor="#C7C7CC"
                />
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save</Text>
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
  closeButton: {
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
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    marginTop: 8,
  },
  exerciseName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '400',
    marginBottom: 4,
  },
  exerciseMeta: {
    fontSize: 18,
    color: '#7FC1A4',
    fontWeight: '400',
    marginBottom: 16,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  setTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '400',
    marginBottom: 2,
  },
  setMeta: {
    fontSize: 18,
    color: '#7FC1A4',
    fontWeight: '400',
  },
  pencilButton: {
    padding: 8,
  },
  saveButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    width: '92%',
    backgroundColor: '#10B981',
    borderRadius: 24,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#14241C',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
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
  pickerContainer: {
    backgroundColor: '#223D33',
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  picker: {
    color: '#fff',
    height: 48,
    width: '100%',
  },
}); 