import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Star, X } from 'lucide-react-native';
import Lottie from 'lottie-react-native';
import { createReview } from '../../apis/createReview';

const WriteReviewBottomSheet = ({ innerRef, onSubmit, productId }) => {
  const modalRef = useRef(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!innerRef) return;
    innerRef.current = {
      present: () => modalRef.current?.present?.(),
      dismiss: () => modalRef.current?.dismiss?.(),
      close: () => modalRef.current?.dismiss?.(),
    };
  }, [innerRef]);

  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
        pressBehavior="close"
      />
    ),
    [],
  );

  const renderHandle = useCallback(
    () => (
      <View style={styles.handleContainer}>
        <View style={styles.handleIndicator} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Write a Review</Text>
          <TouchableOpacity
            onPress={() => modalRef.current?.dismiss()}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [],
  );

  const handleStarPress = star => {
    if (reviewRating === star) {
      setReviewRating(0);
    } else {
      setReviewRating(star);
    }
  };

  const handleSubmit = async () => {
    if (reviewRating === 0) {
      Alert.alert('Rating Required', 'Please select a rating');
      return;
    }
    if (reviewText.trim().length < 4) {
      Alert.alert('Review Required', 'Please write at least 4 characters');
      return;
    }
    const reviewData = {
      productId,
      review: reviewText.trim(),
      rating: reviewRating,
    };
    setSubmitting(true);
    try {
      const response = await createReview(reviewData);
      Alert.alert('Success', 'Your review has been submitted successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setReviewRating(0);
            setReviewText('');
            modalRef.current?.dismiss();
            if (onSubmit) {
              onSubmit(response);
            }
          },
        },
      ]);
    } catch (error) {
      console.log('Error submitting review:', error);

      // Show error message
      Alert.alert(
        'Error',
        error?.message || 'Failed to submit review. Please try again.',
        [{ text: 'OK' }],
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setReviewRating(0);
    setReviewText('');
    modalRef.current?.dismiss();
  };

  const isSubmitDisabled =
    reviewRating === 0 || reviewText.trim().length < 4 || submitting;

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      handleComponent={renderHandle}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Share your experience with Product</Text>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionLabel}>
            Your Rating <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
                activeOpacity={0.7}
                disabled={submitting}
              >
                <Star
                  size={40}
                  color="#F59A11"
                  fill={star <= reviewRating ? '#F59A11' : 'none'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Review Input Section */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionLabel}>
            Your Review <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Tell us about your experience with this product..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={6}
            value={reviewText}
            onChangeText={setReviewText}
            textAlignVertical="top"
            editable={!submitting}
          />
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          By submitting this review, you agree to our review guidelines. Your
          review will be published publicly and may be used for marketing
          purposes.
        </Text>

        {/* Buttons */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitDisabled && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
          activeOpacity={0.8}
        >
          {submitting ? (
            <Lottie
              source={require('../../lottie/loading.json')}
              autoPlay
              loop
              style={{ width: 26, height: 26 }}
            />
          ) : (
            <Text style={styles.submitButtonText}>Submit Review</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          activeOpacity={0.8}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
  },
  handleIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginBottom: 8,
  },
  header: {
    backgroundColor: '#F5E6D3',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 32,
  },
  ratingSection: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  required: {
    color: '#EF4444',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  reviewSection: {
    marginBottom: 20,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#1F2937',
    minHeight: 120,
    backgroundColor: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 13,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#F59A11',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 17,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 17,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#4B5563',
    letterSpacing: 0.5,
  },
});

export default WriteReviewBottomSheet;
