import { getAllTouristSpots } from '@/app/TouristApp/(tabs)/(home)/(touristSpots)/TouristSpotData';
import SearchInput from '@/components/shops/SearchInput';
import { ThemedText } from '@/components/ThemedText';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  BackHandler,
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Breadcrumb = ({ path, onBack }: { path: string; onBack: () => void }) => (
  <View
    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
  >
    <TouchableOpacity onPress={onBack}>
      <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Support</Text>
    </TouchableOpacity>
    <Text style={{ color: '#888', marginHorizontal: 8 }}>{'>'}</Text>
    <Text style={{ color: '#333', fontWeight: 'bold' }}>{path}</Text>
  </View>
);

const SupportTicket = () => {
  const [view, setView] = useState<'menu' | 'new' | 'records'>('menu');
  const [formType, setFormType] = useState<'feedback' | 'report'>('feedback');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  // Placeholder for report records
  const reportRecords = [
    {
      id: '1',
      subject: 'Report: Malabsay Falls cleanliness',
      status: 'In review',
      summary:
        'Your report about trash and cleanliness at Malabsay Falls is being reviewed by our team.',
      timeline: [
        {
          date: '4/20/2025 10:15 AM',
          title: 'Report submitted',
          description:
            'You reported Malabsay Falls for cleanliness issues (trash, littering).',
        },
        {
          date: '4/20/2025 10:20 AM',
          title: 'Review started',
          description:
            'Our team is reviewing your report and will coordinate with local authorities if needed.',
        },
      ],
    },
    {
      id: '2',
      subject: 'Feedback: Add dark mode feature',
      status: 'Resolved',
      summary:
        'Thank you for your feedback! Dark mode is now available in the latest app update.',
      timeline: [
        {
          date: '4/10/2025 2:30 PM',
          title: 'Feedback submitted',
          description: 'You suggested adding a dark mode option to the app.',
        },
        {
          date: '4/12/2025 9:00 AM',
          title: 'Feature planned',
          description:
            'Our development team has added dark mode to the roadmap.',
        },
        {
          date: '4/18/2025 5:00 PM',
          title: 'Feature released',
          description:
            'Dark mode is now available! Update your app to try it out.',
        },
      ],
    },
    {
      id: '3',
      subject: 'Report: Broken signage at Naga Metropolitan Cathedral',
      status: 'Resolved',
      summary:
        'The broken signage at Naga Metropolitan Cathedral has been fixed. Thank you for your report!',
      timeline: [
        {
          date: '4/05/2025 11:00 AM',
          title: 'Report submitted',
          description:
            'You reported a broken tourist information sign at Naga Metropolitan Cathedral.',
        },
        {
          date: '4/06/2025 8:30 AM',
          title: 'Issue confirmed',
          description:
            'Our team confirmed the issue and notified the site management.',
        },
        {
          date: '4/08/2025 3:00 PM',
          title: 'Issue resolved',
          description: 'The signage has been repaired by the site management.',
        },
      ],
    },
  ];

  const touristSpots = getAllTouristSpots();
  const filteredLocations = locationQuery
    ? touristSpots.filter((spot) =>
        spot.name.toLowerCase().includes(locationQuery.toLowerCase())
      )
    : touristSpots;

  const handleSubmit = () => {
    if (formType === 'report' && !selectedLocation) {
      Alert.alert('Error', 'Please select a location.');
      return;
    }
    if (!subject || !message) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubject('');
      setMessage('');
      setSelectedLocation(null);
      setLocationQuery('');
      setFormType('feedback');
      Alert.alert('Success', 'Your ticket has been submitted!');
      setView('menu');
    }, 1000);
  };

  // Intercept the hardware back button and header back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (view !== 'menu') {
          setView('menu');
          return true; // Prevent default back
        }
        return false; // Allow default back
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
      return () => subscription.remove();
    }, [view])
  );

  if (view === 'menu') {
    return (
      <View style={{ flex: 1, padding: 24 }}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#000000',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            backgroundColor: 'transparent',
          }}
          onPress={() => setView('new')}
        >
          <Text style={{ color: '#000000', fontSize: 18 }}>
            New Report / Feedback
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#000000',
            borderRadius: 12,
            padding: 20,
            backgroundColor: 'transparent',
          }}
          onPress={() => setView('records')}
        >
          <Text style={{ color: '#000000', fontSize: 18 }}>
            View My Reports
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (view === 'new') {
    return (
      <View style={{ flex: 1, padding: 24 }}>
        <Breadcrumb path="New Report" onBack={() => setView('menu')} />
        <ThemedText type="title" style={{ marginBottom: 24 }}>
          New Report / Feedback
        </ThemedText>
        <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>Type</Text>
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: formType === 'feedback' ? '#007AFF' : '#eee',
              padding: 10,
              borderRadius: 8,
              marginRight: 8,
            }}
            onPress={() => setFormType('feedback')}
          >
            <Text style={{ color: formType === 'feedback' ? '#fff' : '#333' }}>
              Feedback
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: formType === 'report' ? '#007AFF' : '#eee',
              padding: 10,
              borderRadius: 8,
            }}
            onPress={() => setFormType('report')}
          >
            <Text style={{ color: formType === 'report' ? '#fff' : '#333' }}>
              Report
            </Text>
          </TouchableOpacity>
        </View>
        {formType === 'report' && (
          <>
            <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>
              Location
            </Text>
            <SearchInput
              placeholder="Search location..."
              value={locationQuery}
              onSearch={setLocationQuery}
              onClear={() => setLocationQuery('')}
              style={{
                paddingHorizontal: 0,
                paddingVertical: 0,
                marginBottom: 16,
              }}
              inputStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 0,
                padding: 0,
                backgroundColor: 'transparent',
                fontSize: 16,
                color: '#333',
              }}
              searchContainerStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 0,
                borderWidth: 1,
                borderColor: '#ccc',
                height: 48,
              }}
            />
            {locationQuery.length > 0 &&
              filteredLocations.length > 0 &&
              !selectedLocation && (
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    maxHeight: 200,
                    marginBottom: 8,
                  }}
                >
                  {filteredLocations.map((spot) => (
                    <TouchableOpacity
                      key={spot.id}
                      style={{
                        padding: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                      }}
                      onPress={() => {
                        setSelectedLocation({ id: spot.id, name: spot.name });
                        setLocationQuery(spot.name);
                      }}
                    >
                      <Text>{spot.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            {selectedLocation && (
              <View style={{ marginBottom: 8 }}>
                <Text style={{ color: '#007AFF' }}>
                  Selected: {selectedLocation.name}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedLocation(null);
                    setLocationQuery('');
                  }}
                >
                  <Text style={{ color: 'red', fontSize: 12 }}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>Subject</Text>
        <TextInput
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
        />
        <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>Message</Text>
        <TextInput
          placeholder={
            formType === 'feedback'
              ? 'Your feedback'
              : 'Describe your concern or report'
          }
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            minHeight: 100,
            textAlignVertical: 'top',
          }}
        />
        <Button
          title={submitting ? 'Submitting...' : 'Submit Ticket'}
          onPress={handleSubmit}
          disabled={submitting}
        />
        <TouchableOpacity
          style={{ marginTop: 16, alignSelf: 'center' }}
          onPress={() => setView('menu')}
        >
          <Text style={{ color: '#007AFF', fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (view === 'records') {
    return (
      <View
        style={{
          flex: 1,
          padding: 24,
          backgroundColor: '#f7f7f7',
        }}
      >
        <Breadcrumb path="Reports" onBack={() => setView('menu')} />
        <ThemedText type="title" style={{ marginBottom: 24 }}>
          Reports
        </ThemedText>
        <FlatList
          data={reportRecords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16 }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  setExpandedReportId(
                    expandedReportId === item.id ? null : item.id
                  )
                }
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: '#eee',
                }}
              >
                <Text
                  style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}
                >
                  {item.subject}
                </Text>
                <Text style={{ color: '#888', fontSize: 15, marginBottom: 4 }}>
                  Status: {item.status}
                </Text>
                <Text style={{ color: '#333', fontSize: 15 }}>
                  {item.summary}
                </Text>
                <Text style={{ color: '#007AFF', fontSize: 15, marginTop: 8 }}>
                  {expandedReportId === item.id
                    ? 'Hide details'
                    : 'View details'}
                </Text>
              </TouchableOpacity>
              {expandedReportId === item.id && item.timeline && (
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    padding: 20,
                    marginTop: 8,
                    borderWidth: 1,
                    borderColor: '#eee',
                  }}
                >
                  {item.timeline.map((event: any, idx: number) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        marginBottom: 16,
                      }}
                    >
                      <View style={{ width: 16, alignItems: 'center' }}>
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#bbb',
                            marginTop: 6,
                          }}
                        />
                        {idx < item.timeline.length - 1 && (
                          <View
                            style={{
                              width: 2,
                              height: 48,
                              backgroundColor: '#eee',
                              marginTop: 0,
                            }}
                          />
                        )}
                      </View>
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={{ color: '#888', fontSize: 13 }}>
                          {event.date}
                        </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                          {event.title}
                        </Text>
                        <Text style={{ color: '#333', fontSize: 15 }}>
                          {event.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: '#aaa' }}>No reports found.</Text>
          }
        />
      </View>
    );
  }

  return null;
};

export default SupportTicket;
