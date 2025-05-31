import { reviews as initialReviews } from '@/app/Controller/AccommodationData';
import { users } from '@/app/Controller/User';
import OverallRating from '@/components/OverallRating';
import ReviewCard from '@/components/ReviewCard';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import {
  Button,
  Modal,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import StarRating from 'react-native-star-rating-widget';

type User = {
  id: number;
  name: string;
  email: string;
};

interface AccommodationRatingsProps {
  accommodationId: string;
}

const AccommodationRatings: React.FC<AccommodationRatingsProps> = ({ accommodationId }) => {
  const accId = Number(accommodationId);
  const { user } = useAuth();

  const [reviews, setReviews] = useState(
    initialReviews.filter((review) => review.accommodationId === accId)
  );
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddReview = () => {
    if (!user || newReview.trim() === '') return;

    const safeRating = Math.min(5, Math.max(1, rating));

    const newReviewObj = {
      id: reviews.length + 5,
      userId: user.id,
      accommodationId: accId,
      roomId: null,
      rating: safeRating,
      date: new Date().toISOString().split('T')[0],
      message: newReview.trim(),
    };

    setReviews([newReviewObj, ...reviews]);
    setNewReview('');
    setRating(5);
    setModalVisible(false);

    console.log('New review added:', newReviewObj);
  };

  return (
    <View style={{ padding: 16, paddingTop: 0 }}>
      {reviews.length > 0 ? (
        <>
          <OverallRating reviews={reviews} />

          {user ? (
            <>
              <View style={{ marginTop: 16 }}>
                <Button title="Leave a Review" onPress={() => setModalVisible(true)} />
              </View>

              <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <ThemedText style={styles.label}>Leave a review:</ThemedText>
                    <StarRating
                      rating={rating}
                      onChange={setRating}
                      starSize={28}
                      color="#FFD700"
                      maxStars={5}
                      enableHalfStar={true}
                      style={{ marginBottom: 16 }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Write a review..."
                      value={newReview}
                      onChangeText={setNewReview}
                      multiline
                    />
                    <View style={styles.modalButtonRow}>
                      <Button title="Cancel" onPress={() => setModalVisible(false)} />
                      <Button title="Submit Review" onPress={handleAddReview} />
                    </View>
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <ThemedText>Please log in to leave a review.</ThemedText>
          )}
          {reviews.map((review) => {
            const reviewer = users.find((u) => u.id === review.userId);
            const reviewerName = reviewer?.name || 'Unknown User';

            const profileImageUri =
              review.userId === 1
                ? 'https://randomuser.me/api/portraits/women/1.jpg'
                : 'https://randomuser.me/api/portraits/men/2.jpg';

            const reviewDate = new Date(review.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <View key={review.id} style={{ marginTop: 16 }}>
                <ReviewCard
                  profileImageUri={profileImageUri}
                  reviewerName={reviewerName}
                  reviewDate={reviewDate}
                  reviewText={review.message}
                  rating={review.rating}
                />
              </View>
            );
          })}
        </>
      ) : (
        <ThemedText>No reviews available for this accommodation.</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  label: {
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AccommodationRatings;