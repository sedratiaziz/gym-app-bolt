import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import { formatDate } from '@/utils/dateUtils';
import { logWeight } from '@/utils/storage';

export function WeightLogForm({ onSave, onCancel }) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date());

  const handleSubmit = () => {
    if (!weight || isNaN(parseFloat(weight))) {
      // Validation error
      return;
    }

    logWeight({
      value: parseFloat(weight),
      date: formatDate(date),
      timestamp: date.toISOString(),
    });

    onSave();
  };

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
            <Text style={styles.modalTitle}>Log Weight</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="70.5"
                placeholderTextColor="#C7C7CC"
                autoFocus
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <View style={styles.dateDisplay}>
                <Text style={styles.dateText}>{formatDate(date)}</Text>
                <Text style={styles.dateHint}>Today</Text>
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    color: '#000000',
  },
  dateDisplay: {
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#000000',
  },
  dateHint: {
    fontSize: 14,
    color: '#8E8E93',
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
  saveButton: {
    backgroundColor: '#0066FF',
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});