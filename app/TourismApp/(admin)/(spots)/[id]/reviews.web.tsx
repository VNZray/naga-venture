import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

// Dummy review data
const reviews = [
  {
    id: 1,
    user: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 5,
    date: 'Feb 23, 2025',
    text: `I usually go here on not peak hours. Though, it's one of the smallest branch of Jollibee in Naga City. It has a drive-thru, though not recommended on peak hours and queue is long because of the traffic in Panganiban drive. They have the better servings of chicken joy, I don't know why, so I usually go here if I am experiencing "umay" from other fast food. I got to redeem my coca cola code here, though I got it a bit small portion to what I expected. It's free, thanks I guess.`,
    images: [],
    reply: {
      user: 'Camacho Sari Sari Store',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      text: 'Fast shipping and packed securely, madali lang ilagay yung tempered glass kasi may pattern naman, madali lang in alisin yung mga bubbles',
    },
  },
  {
    id: 2,
    user: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 5,
    date: 'Feb 23, 2025',
    text: `I usually go here on not peak hours. Though, it's one of the smallest branch of Jollibee in Naga City. It has a drive-thru, though not recommended on peak hours and queue is long because of the traffic in Panganiban drive. They have the better servings of chicken joy, I don't know why, so I usually go here if I am experiencing "umay" from other fast food. I got to redeem my coca cola code here, though I got it a bit small portion to what I expected. It's free, thanks I guess.`,
    images: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    ],
    reply: {
      user: 'Camacho Sari Sari Store',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      text: 'Fast shipping and packed securely, madali lang ilagay yung tempered glass kasi may pattern naman, madali lang in alisin yung mga bubbles',
    },
  },
];

const metrics = {
  overallRating: 4.8,
  totalReviews: 256,
  responseRate: 98,
  avgResponseTime: '2h',
  touristSatisfaction: 89,
  ratingDistribution: [70, 10, 10, 10, 10],
};

const ReviewsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Metrics Section */}
      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <ThemedText style={styles.metricTitle}>Overall Rating</ThemedText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <ThemedText style={styles.metricValue}>
              {metrics.overallRating}
            </ThemedText>
            <Ionicons
              name="star"
              size={18}
              color="#FFD700"
              style={{ marginLeft: 4 }}
            />
            <ThemedText style={styles.metricSub}>out of 5</ThemedText>
          </View>
          {/* Rating distribution bars */}
          {metrics.ratingDistribution.map((percent, i) => (
            <View key={i} style={styles.ratingBarRow}>
              <ThemedText style={styles.ratingBarLabel}>{5 - i}</ThemedText>
              <View style={styles.ratingBarBg}>
                <View
                  style={[styles.ratingBarFill, { width: `${percent}%` }]}
                />
              </View>
              <ThemedText style={styles.ratingBarPercent}>
                {percent}%
              </ThemedText>
            </View>
          ))}
        </View>
        <View style={styles.metricBox}>
          <ThemedText style={styles.metricTitle}>Total Reviews</ThemedText>
          <ThemedText style={styles.metricValue}>
            {metrics.totalReviews}
          </ThemedText>
          <ThemedText style={styles.metricSub}>reviews</ThemedText>
          <ThemedText style={styles.metricChange}>
            +12% from last month
          </ThemedText>
        </View>
        <View style={styles.metricBox}>
          <ThemedText style={styles.metricTitle}>Response Rate</ThemedText>
          <ThemedText style={styles.metricValue}>
            {metrics.responseRate}%
          </ThemedText>
          <ThemedText style={styles.metricSub}>responded</ThemedText>
          <ThemedText style={styles.metricSub}>
            Avg response time: {metrics.avgResponseTime}
          </ThemedText>
        </View>
        <View style={styles.metricBox}>
          <ThemedText style={styles.metricTitle}>
            Tourist Satisfaction
          </ThemedText>
          <View style={styles.satisfactionBarBg}>
            <View
              style={[
                styles.satisfactionBarFill,
                { width: `${metrics.touristSatisfaction}%` },
              ]}
            />
          </View>
          <ThemedText style={styles.metricValue}>
            {metrics.touristSatisfaction}%
          </ThemedText>
          <ThemedText style={styles.metricSub}>satisfied</ThemedText>
        </View>
      </View>

      {/* Sorting/Filtering Controls */}
      <View style={styles.filterRow}>
        <ThemedText style={styles.recentReviews}>Recent Reviews</ThemedText>
        <View style={styles.filterControls}>
          <View style={styles.filterPill}>
            <ThemedText style={styles.filterText}>All Ratings</ThemedText>
            <Ionicons name="chevron-down" size={16} color="#111" />
          </View>
          <View style={styles.filterPill}>
            <ThemedText style={styles.filterText}>Date</ThemedText>
            <Ionicons name="chevron-down" size={16} color="#111" />
          </View>
          <View style={styles.filterPill}>
            <ThemedText style={styles.filterText}>Rating</ThemedText>
            <Ionicons name="chevron-down" size={16} color="#111" />
          </View>
          <View style={styles.filterPill}>
            <Ionicons name="grid" size={18} color="#111" />
          </View>
        </View>
      </View>

      {/* Reviews List */}
      {reviews.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Image source={{ uri: review.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText style={styles.userName}>{review.user}</ThemedText>
                <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < review.rating ? 'star' : 'star-outline'}
                      size={14}
                      color="#FFD700"
                    />
                  ))}
                </View>
                <ThemedText style={styles.reviewDate}>{review.date}</ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.reportUserBtn}>
              <ThemedText style={styles.reportUser}>Report User</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.reviewText}>{review.text}</ThemedText>
          {review.images.length > 0 && (
            <View style={styles.reviewImagesRow}>
              {review.images.map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: img }}
                  style={styles.reviewImage}
                />
              ))}
            </View>
          )}
          {review.reply && (
            <View style={styles.replyBox}>
              <View style={styles.replyHeader}>
                <Image
                  source={{ uri: review.reply.avatar }}
                  style={styles.replyAvatar}
                />
                <View>
                  <ThemedText style={styles.replyUser}>
                    {review.reply.user}
                  </ThemedText>
                  <ThemedText style={styles.replyRole}>Owner</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.replyText}>
                {review.reply.text}
              </ThemedText>
            </View>
          )}
          <TouchableOpacity style={styles.respondBtn}>
            <ThemedText style={styles.respondBtnText}>Respond</ThemedText>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  metricsRow: { flexDirection: 'row', gap: 24, marginBottom: 32 },
  metricBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    alignItems: 'center',
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  metricTitle: { color: '#222', fontWeight: 'bold', marginBottom: 8 },
  metricValue: { fontSize: 28, fontWeight: 'bold', color: '#0A1B47' },
  metricSub: { color: '#666', fontSize: 12 },
  metricChange: { color: '#1BC47D', fontSize: 12, marginTop: 4 },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  ratingBarLabel: { color: '#222', width: 16, fontSize: 12 },
  ratingBarBg: {
    backgroundColor: '#e5e7eb',
    height: 8,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 6,
  },
  ratingBarFill: {
    backgroundColor: '#0A1B47',
    height: 8,
    borderRadius: 4,
  },
  ratingBarPercent: { color: '#222', width: 32, fontSize: 12 },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  recentReviews: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 20,
  },
  filterText: {
    color: '#111',
    fontWeight: 'bold',
  },
  filterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  reportUserBtn: {
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: { fontWeight: 'bold', color: '#0A1B47', fontSize: 16 },
  reviewDate: { color: '#888', fontSize: 12, marginLeft: 12 },
  reportUser: { color: '#0A1B47', fontWeight: 'bold', fontSize: 12 },
  reviewText: { color: '#222', fontSize: 14, marginBottom: 8 },
  reviewImagesRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  reviewImage: { width: 100, height: 80, borderRadius: 8 },
  replyBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  replyAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  replyUser: { fontWeight: 'bold', color: '#0A1B47', fontSize: 14 },
  replyRole: { color: '#888', fontSize: 12 },
  replyText: { color: '#222', fontSize: 13, marginTop: 4 },
  respondBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#0A1B47',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginTop: 8,
  },
  respondBtnText: { color: '#0A1B47', fontWeight: 'bold' },
  satisfactionBarBg: {
    backgroundColor: '#e5e7eb',
    height: 8,
    borderRadius: 4,
    width: '100%',
    marginVertical: 8,
  },
  satisfactionBarFill: {
    backgroundColor: '#0A1B47',
    height: 8,
    borderRadius: 4,
  },
});

export default ReviewsScreen;
