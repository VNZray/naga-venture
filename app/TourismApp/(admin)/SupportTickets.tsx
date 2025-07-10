import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';

const SupportTicketUpdate = () => {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setTitle('');
      setDescription('');
      Alert.alert('Success', 'Timeline update added!');
      router.back();
    }, 1000);
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>
        Add Timeline Update for Report ID: {id}
      </Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          minHeight: 80,
        }}
      />
      <Button
        title={submitting ? 'Submitting...' : 'Add Update'}
        onPress={handleSubmit}
        disabled={submitting}
      />
    </View>
  );
};

export default SupportTicketUpdate;
