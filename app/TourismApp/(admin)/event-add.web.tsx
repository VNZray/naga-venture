import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

const AddEventForm = ({
  isVisible,
  onClose,
  onEventAdded,
}: {
  isVisible: boolean;
  onClose: () => void;
  onEventAdded: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    category: '',
    start_time: '',
    end_time: '',
  });

  const handleSave = () => {
    if (!formData.name || !formData.address || !formData.category || !formData.start_time || !formData.end_time) {
      alert('Please fill in all required fields, including start and end date/time.');
      return;
    }
    console.log('New Event:', formData);
    // Here you would typically save the data to your backend
    // After saving, navigate back to the events list
    onEventAdded();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <ThemedText type="title" darkColor="#000">
              Add New Event
            </ThemedText>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={32} color="#000" />
            </Pressable>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Event Name</ThemedText>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter event name"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Address</ThemedText>
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(text) =>
                  setFormData({ ...formData, address: text })
                }
                placeholder="Enter event address"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Category</ThemedText>
              <TextInput
                style={styles.input}
                value={formData.category}
                onChangeText={(text) =>
                  setFormData({ ...formData, category: text })
                }
                placeholder="Enter event category"
              />
            </View>
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Start Date & Time</ThemedText>
              <TextInput
                style={styles.input}
                value={formData.start_time}
                onChangeText={(text) => setFormData({ ...formData, start_time: text })}
                placeholder="YYYY-MM-DD HH:MM"
              />
            </View>
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>End Date & Time</ThemedText>
              <TextInput
                style={styles.input}
                value={formData.end_time}
                onChangeText={(text) => setFormData({ ...formData, end_time: text })}
                placeholder="YYYY-MM-DD HH:MM"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <ThemedText style={styles.saveButtonText}>Save Event</ThemedText>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 600,
    maxHeight: 500,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    width: '100%',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingVertical: Platform.OS === 'web' ? 10 : 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#0A1B47',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEventForm; 