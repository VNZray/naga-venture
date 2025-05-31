import { accommodations, reviews as initialReviews } from '@/app/Controller/AccommodationData';
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
};

interface RoomRatingsProps {
  roomId: string;
}

// Utility function to round to the nearest 0.5
const sanitizeRating = (value: number) => {
  return Math.max(0, Math.min(5, Math.round(value * 2) / 2));
};

const RoomRatings: React.FC<RoomRatingsProps> = ({ roomId }) => {
  const { user } = useAuth();
  const rId = Number(roomId);

  const [reviews, setReviews] = useState(
    initialReviews.filter((review) => review.roomId === rId)
  );
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddReview = () => {
    if (!user || newReview.trim() === '') return;

    const newReviewObj = {
      id: reviews.length + 3,
      userId: user.id,
      accommodationId: null,
      roomId: rId,
      rating: sanitizeRating(rating),
      date: new Date().toISOString().split('T')[0],
      message: newReview.trim(),
    };

    setReviews([newReviewObj, ...reviews]);
    setNewReview('');
    setRating(5);
    setModalVisible(false);
  };

  console.log('Current reviews:', reviews);
  console.log('Current user:', user);
  console.log('New review:', newReview);
  console.log('Current rating:', rating);

  return (
    <View>
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
                      rating={sanitizeRating(rating)}
                      onChange={(value) => setRating(sanitizeRating(value))}
                      starSize={28}
                      color="#FFD700"
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
            const userData: User | undefined = users.find((u) => u.id === review.userId);
            const reviewerName = userData?.name || 'Unknown User';

            const profileImageUri =
              review.userId === 1
                ? 'https://randomuser.me/api/portraits/women/1.jpg'
                : 'https://randomuser.me/api/portraits/men/2.jpg';

            const imageUri =
              accommodations.find((acc) => acc.id === review.accommodationId)?.imageUri ||
              'https://media-cdn.tripadvisor.com/media/photo-p/2e/4f/53/15/uma-hotel-residences.jpg';

            return (
              <View key={review.id} style={{ marginTop: 16 }}>
                <ReviewCard
                  reviewerName={reviewerName}
                  reviewDate={review.date}
                  reviewText={review.message}
                  imageUri={imageUri}
                  profileImageUri={profileImageUri}
                  elevation={3}
                  rating={sanitizeRating(review.rating)}
                />
              </View>
            );
          })}
        </>
      ) : (
        <ThemedText>No reviews available for this room.</ThemedText>
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

export default RoomRatings;
