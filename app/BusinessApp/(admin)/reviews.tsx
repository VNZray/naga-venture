import OverallRating from '@/components/OverallRating';
import { ThemedText } from '@/components/ThemedText';
import CardContainer from '@/components/web-components/CardContainer';
import ReviewCard from '@/components/web-components/ReviewCard';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
};

const initialReviews: Review[] = [
  {
    id: '1',
    user: 'Jane D.',
    rating: 5,
    comment: 'Excellent service and clean rooms!',
    date: '2025-06-12',
  },
  {
    id: '2',
    user: 'Mark S.',
    rating: 3,
    comment: 'Good overall, but the WiFi was slow.',
    date: '2025-06-10',
  },
];

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [replies, setReplies] = useState<Record<string, string>>({});

  const submitReply = (id: string) => {
    const reply = replies[id]?.trim();
    if (!reply) {
      Alert.alert('Error', 'Reply cannot be empty.');
      return;
    }

    const updated = reviews.map((r) => (r.id === id ? { ...r, reply } : r));
    setReviews(updated);
    setReplies((prev) => ({ ...prev, [id]: '' }));
    Alert.alert('Reply Sent', 'Your reply has been saved.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.columns}>
        {/* Left Column: Tourist Reviews */}
        <View style={styles.leftColumn}>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              reviewerName={review.user}
              reviewDate={review.date}
              reviewText={review.comment}
              rating={review.rating}
              style={{ marginBottom: 12, padding: 16 }}
            >
              {review.reply ? (
                <View style={styles.replyBox}>
                  <ThemedText darkColor="#000" style={styles.replyLabel}>
                    Your Reply:
                  </ThemedText>
                  <ThemedText darkColor="#000">{review.reply}</ThemedText>
                </View>
              ) : (
                <>
                  <TextInput
                    placeholder="Write a reply..."
                    style={styles.replyInput}
                    multiline
                    value={replies[review.id] || ''}
                    onChangeText={(text) =>
                      setReplies((prev) => ({ ...prev, [review.id]: text }))
                    }
                  />
                  <Pressable
                    onPress={() => submitReply(review.id)}
                    style={styles.replyButton}
                  >
                    <ThemedText darkColor="#000" style={styles.replyButtonText}>
                      Send Reply
                    </ThemedText>
                  </Pressable>
                </>
              )}
            </ReviewCard>
          ))}
        </View>

        {/* Right Column: Review Summary */}
        <CardContainer height={180} style={styles.rightColumn}>
          <OverallRating reviews={reviews} />
        </CardContainer>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  columns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  leftColumn: {
    flex: 1,
    width: '60%',
  },
  rightColumn: {
    width: '40%',
    padding: 16,
  },
  replyInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    marginBottom: 6,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  replyButton: {
    backgroundColor: '#0A1B47',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  replyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  replyBox: {
    backgroundColor: '#eef6ff',
    padding: 16,
    borderRadius: 6,
    marginTop: 8,
  },
  replyLabel: {
    fontWeight: 'bold',
    color: '#0A1B47',
    marginBottom: 4,
  },
});

export default Reviews;
