import { Text, View } from 'react-native'

const { width } = Dimensions.get('window');

const EventsDirectory = () => {
    const [search, setSearch] = useState('');
    const colorScheme = useColorScheme();
    const color = colorScheme === 'dark' ? '#fff' : '#000';

    const handleSearch = () => {
        console.log('Searching:', search);
    };

    const renderDateSelector = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return (
            <View style={styles.dateSection}>
                <View style={styles.monthHeader}>
                    <ThemedText type="title">October 2024</ThemedText>
                    <View style={styles.navigationButtons}>
                        <FontAwesome5 name="chevron-left" size={20} color={color} />
                        <FontAwesome5 name="chevron-right" size={20} color={color} />
                    </View>
                </View>
                <CardContainer elevation={2} style={styles.daysContainer}>
                    {days.map((day, index) => (
                        <View key={day} style={styles.dayColumn}>
                            <ThemedText style={styles.dayText}>{day}</ThemedText>
                            <View style={[styles.dateCircle, index === 4 && styles.selectedDate]}>
                                <ThemedText style={[styles.dateText, index === 4 && styles.selectedDateText]}>
                                    {index + 1}
                                </ThemedText>
                            </View>
                        </View>
                    ))}
                </CardContainer>
            </View>
        );
    };

    const renderNearbyEvents = () => {
        return (
            <View style={styles.eventsSection}>
                <ThemedText type="title" style={styles.sectionTitle}>Nearby Events</ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <CardContainer style={styles.eventCard}>
                        <View style={styles.eventImagePlaceholder}>
                            <FontAwesome5 name="users" size={40} color={color} />
                            <ThemedText>Festival Crowd</ThemedText>
                        </View>
                    </CardContainer>
                    <CardContainer style={styles.eventCard}>
                        <View style={styles.eventImagePlaceholder}>
                            <FontAwesome5 name="calendar-alt" size={40} color={color} />
                            <ThemedText>Local Event</ThemedText>
                        </View>
                    </CardContainer>
                </ScrollView>
            </View>
        );
    };

    const renderUpcomingEvents = () => {
        return (
            <View style={styles.eventsSection}>
                <ThemedText type="title" style={styles.sectionTitle}>Upcoming Events</ThemedText>
                <CardContainer style={styles.upcomingEventCard}>
                    <View style={styles.upcomingEventContent}>
                        <FontAwesome5 name="camera" size={40} color={color} />
                        <View style={styles.eventTextContent}>
                            <ThemedText type="title">NAGA WON! 365</ThemedText>
                            <ThemedText type="subtitle">(PHOTO/REEL) CONTEST</ThemedText>
                        </View>
                    </View>
                </CardContainer>
            </View>
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView>
                    <View style={styles.content}>
                        <SearchBar
                            value={search}
                            onChangeText={setSearch}
                            onSearch={handleSearch}
                            placeholder="Search Events"
                        />
                        {renderDateSelector()}
                        {renderNearbyEvents()}
                        {renderUpcomingEvents()}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    dateSection: {
        marginTop: 20,
        marginBottom: 20,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    navigationButtons: {
        flexDirection: 'row',
        gap: 20,
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    dayColumn: {
        alignItems: 'center',
    },
    dayText: {
        fontSize: 12,
        marginBottom: 8,
    },
    dateCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedDate: {
        backgroundColor: '#0A2342',
    },
    dateText: {
        fontSize: 14,
    },
    selectedDateText: {
        color: '#fff',
    },
    eventsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    eventCard: {
        width: width * 0.7,
        height: 180,
        marginRight: 16,
    },
    eventImagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    upcomingEventCard: {
        width: '100%',
        height: 200,
    },
    upcomingEventContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 20,
    },
    eventTextContent: {
        flex: 1,
    },
});

export default EventsDirectory;


