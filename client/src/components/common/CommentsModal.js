import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
  Animated,
  Platform,
  Image,
  Dimensions,
  Keyboard,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../../constants';

// Constants
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ANIMATION_CONFIG = {
  SLIDE_SPRING_TENSION: 50,
  SLIDE_SPRING_FRICTION: 8,
  SLIDE_DURATION: 250,
  HEART_SCALE_MAX: 1.3,
  HEART_SCALE_NORMAL: 1,
  HEART_SPRING_TENSION: 400,
  HEART_SPRING_FRICTION: 7,
  SEND_BUTTON_SCALE_MIN: 0.85,
  SEND_BUTTON_SCALE_NORMAL: 1,
  SEND_BUTTON_SPRING_TENSION: 400,
  SEND_BUTTON_SPRING_FRICTION: 7,
};

const INPUT_CONFIG = {
  MIN_HEIGHT: 40,
  MAX_HEIGHT: 100,
  MAX_LENGTH: 500,
  DEFAULT_HEIGHT: 40,
};

const TIMING_CONFIG = {
  DOUBLE_TAP_DELAY: 300,
  MODAL_HEADER_OFFSET: 40,
  INPUT_PADDING_BOTTOM: 8,
  COMMENTS_LIST_BOTTOM_PADDING: 80,
};

const ICON_SIZES = {
  HEART: 16,
  SEND: 14,
  AVATAR: 36,
  INPUT_AVATAR: 32,
  HEADER_HANDLE_WIDTH: 40,
  HEADER_HANDLE_HEIGHT: 4,
};

const COLORS_CONFIG = {
  HEART_LIKED: '#FF3040',
  MODAL_OVERLAY: 'rgba(0, 0, 0, 0.5)',
};

const DEFAULT_PROPS = {
  comments: [],
  category: 'Sağlık',
};

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=10';

/**
 * CommentsModal Component
 * 
 * Displays a bottom sheet modal with comments for a blog post.
 * Features Instagram-style like animations, double-tap to like, and comment input.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Array} props.comments - Array of comments (optional, currently uses mock data)
 * @param {Object} props.postAuthor - Post author information
 * @param {string} props.category - Post category
 * @param {string} props.postTitle - Post title
 */
const CommentsModal = ({
  visible,
  onClose,
  comments = DEFAULT_PROPS.comments,
  postAuthor,
  category = DEFAULT_PROPS.category,
  postTitle,
}) => {
  const insets = useSafeAreaInsets();
  
  // State management
  const [commentText, setCommentText] = useState('');
  const [inputHeight, setInputHeight] = useState(INPUT_CONFIG.DEFAULT_HEIGHT);
  const [commentLikes, setCommentLikes] = useState({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Refs
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const inputRef = useRef(null);
  const heartScales = useRef({}).current;
  const commentLastTaps = useRef({}).current;
  const sendButtonScale = useRef(new Animated.Value(ANIMATION_CONFIG.SEND_BUTTON_SCALE_NORMAL)).current;

  /**
   * Handles modal slide animation
   */
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: ANIMATION_CONFIG.SLIDE_SPRING_TENSION,
        friction: ANIMATION_CONFIG.SLIDE_SPRING_FRICTION,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: ANIMATION_CONFIG.SLIDE_DURATION,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  /**
   * Handles keyboard show/hide events
   */
  useEffect(() => {
    if (!visible) return;

    const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardWillShow = Keyboard.addListener(keyboardShowEvent, (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    });

    const keyboardWillHide = Keyboard.addListener(keyboardHideEvent, () => {
        setKeyboardHeight(0);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [visible]);

  /**
   * Closes the modal with animation
   */
  const handleClose = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: ANIMATION_CONFIG.SLIDE_DURATION,
      useNativeDriver: true,
    }).start(() => {
      onClose?.();
    });
  }, [slideAnim, onClose]);

  /**
   * Triggers send button scale animation
   */
  const triggerSendButtonAnimation = useCallback(() => {
    Animated.sequence([
      Animated.spring(sendButtonScale, {
        toValue: ANIMATION_CONFIG.SEND_BUTTON_SCALE_MIN,
        useNativeDriver: true,
        tension: ANIMATION_CONFIG.SEND_BUTTON_SPRING_TENSION,
        friction: ANIMATION_CONFIG.SEND_BUTTON_SPRING_FRICTION,
      }),
      Animated.spring(sendButtonScale, {
        toValue: ANIMATION_CONFIG.SEND_BUTTON_SCALE_NORMAL,
        useNativeDriver: true,
        tension: ANIMATION_CONFIG.SEND_BUTTON_SPRING_TENSION,
        friction: ANIMATION_CONFIG.SEND_BUTTON_SPRING_FRICTION,
      }),
    ]).start();
  }, [sendButtonScale]);

  /**
   * Handles sending a comment
   */
  const handleSendComment = useCallback(() => {
    const trimmedText = commentText.trim();
    if (!trimmedText) return;

    // Trigger scale animation
    triggerSendButtonAnimation();

    // TODO: Implement actual comment sending API call
    if (__DEV__) {
      console.log('Yorum gönderiliyor:', trimmedText);
    }

    // Clear input and reset height
      setCommentText('');
    setInputHeight(INPUT_CONFIG.DEFAULT_HEIGHT);
      
    // Blur input to close keyboard
    inputRef.current?.blur();
  }, [commentText, triggerSendButtonAnimation]);

  /**
   * Handles input content size change for multiline input
   */
  const handleContentSizeChange = useCallback((event) => {
    const height = event.nativeEvent.contentSize.height;
    const newHeight = Math.min(
      Math.max(INPUT_CONFIG.MIN_HEIGHT, height),
      INPUT_CONFIG.MAX_HEIGHT
    );
    setInputHeight(newHeight);
  }, []);

  /**
   * Triggers the Instagram-style heart scale animation for a comment
   */
  const triggerCommentHeartAnimation = useCallback((commentId) => {
    if (!heartScales[commentId]) {
      heartScales[commentId] = new Animated.Value(ANIMATION_CONFIG.HEART_SCALE_NORMAL);
    }

    Animated.sequence([
      Animated.spring(heartScales[commentId], {
        toValue: ANIMATION_CONFIG.HEART_SCALE_MAX,
        useNativeDriver: true,
        tension: ANIMATION_CONFIG.HEART_SPRING_TENSION,
        friction: ANIMATION_CONFIG.HEART_SPRING_FRICTION,
      }),
      Animated.spring(heartScales[commentId], {
        toValue: ANIMATION_CONFIG.HEART_SCALE_NORMAL,
        useNativeDriver: true,
        tension: ANIMATION_CONFIG.HEART_SPRING_TENSION,
        friction: ANIMATION_CONFIG.HEART_SPRING_FRICTION,
      }),
    ]).start();
  }, [heartScales]);

  /**
   * Handles like/unlike a comment
   */
  const handleLikeComment = useCallback((commentId, currentLikes, isLiked) => {
    const newLikedState = !isLiked;

    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: {
        likes: newLikedState ? currentLikes + 1 : currentLikes - 1,
        isLiked: newLikedState,
      },
    }));

    if (newLikedState) {
      triggerCommentHeartAnimation(commentId);
    }
  }, [triggerCommentHeartAnimation]);

  /**
   * Handles double tap on comment to like
   */
  const handleCommentDoubleTap = useCallback((commentId, commentLikeState) => {
    const now = Date.now();

    if (
      commentLastTaps[commentId] &&
      now - commentLastTaps[commentId] < TIMING_CONFIG.DOUBLE_TAP_DELAY
    ) {
      // Double tap detected - like the comment if not already liked
      if (!commentLikeState.isLiked) {
        handleLikeComment(commentId, commentLikeState.likes, commentLikeState.isLiked);
      }
      commentLastTaps[commentId] = null;
    } else {
      commentLastTaps[commentId] = now;
    }
  }, [handleLikeComment]);

  /**
   * Gets category-specific mock comments
   * TODO: Replace with actual API call
   */
  const getCategoryComments = useCallback(() => {
    const commentsByCategory = {
      Sağlık: [
        {
          id: '1',
          user: { name: 'Dr. Mehmet Yılmaz', avatar: 'https://i.pravatar.cc/150?img=11' },
          text: 'Çok önemli bilgiler paylaşmışsınız, teşekkürler! 🐾',
          timestamp: '5dk',
          likes: 24,
          isLiked: false,
        },
        {
          id: '2',
          user: { name: 'Ayşe Kaya', avatar: 'https://i.pravatar.cc/150?img=5' },
          text: 'Bu konuda veterinere danışmak en doğrusu',
          timestamp: '12dk',
          likes: 12,
          isLiked: false,
        },
        {
          id: '3',
          user: { name: 'Can Arslan', avatar: 'https://i.pravatar.cc/150?img=12' },
          text: 'Sokak hayvanları için çok faydalı bir paylaşım 🙏',
          timestamp: '1s',
          likes: 89,
          isLiked: true,
        },
        {
          id: '4',
          user: { name: 'Elif Şahin', avatar: 'https://i.pravatar.cc/150?img=16' },
          text: 'Veteriner arkadaşlara sordum, çok doğru bilgiler 👍',
          timestamp: '25dk',
          likes: 34,
          isLiked: false,
        },
      ],
      'Mama & Barınma': [
        {
          id: '1',
          user: { name: 'Zeynep Demir', avatar: 'https://i.pravatar.cc/150?img=9' },
          text: 'Kış aylarında mama desteği çok önemli! 🥘',
          timestamp: '3dk',
          likes: 45,
          isLiked: false,
        },
        {
          id: '2',
          user: { name: 'Murat Öztürk', avatar: 'https://i.pravatar.cc/150?img=15' },
          text: 'Biz de mahallemizde düzenli mama bırakıyoruz',
          timestamp: '8dk',
          likes: 67,
          isLiked: true,
        },
        {
          id: '3',
          user: { name: 'Elif Yıldız', avatar: 'https://i.pravatar.cc/150?img=20' },
          text: 'Harika bir inisiyatif! Nasıl yardımcı olabilirim?',
          timestamp: '15dk',
          likes: 23,
          isLiked: false,
        },
        {
          id: '4',
          user: { name: 'Ali Kılıç', avatar: 'https://i.pravatar.cc/150?img=14' },
          text: 'Bizim mahallede de başlatalım bunu 🐕',
          timestamp: '30dk',
          likes: 56,
          isLiked: false,
        },
      ],
      'Yardım Hikayeleri': [
        {
          id: '1',
          user: { name: 'Ahmet Kara', avatar: 'https://i.pravatar.cc/150?img=13' },
          text: 'Çok duygulandım, harika bir iş yapmışsınız! ❤️',
          timestamp: '2dk',
          likes: 156,
          isLiked: true,
        },
        {
          id: '2',
          user: { name: 'Selin Çelik', avatar: 'https://i.pravatar.cc/150?img=8' },
          text: 'Bu tür hikayeleri okumak çok güzel 🥺',
          timestamp: '7dk',
          likes: 92,
          isLiked: false,
        },
        {
          id: '3',
          user: { name: 'Burak Aksoy', avatar: 'https://i.pravatar.cc/150?img=18' },
          text: 'Siz de meleksiniz! 🙏✨',
          timestamp: '20dk',
          likes: 203,
          isLiked: true,
        },
        {
          id: '4',
          user: { name: 'Fatma Yılmaz', avatar: 'https://i.pravatar.cc/150?img=19' },
          text: 'Ne güzel insanlarsınız, Allah razı olsun 🤲',
          timestamp: '45dk',
          likes: 178,
          isLiked: false,
        },
      ],
    };

    return commentsByCategory[category] || commentsByCategory[DEFAULT_PROPS.category];
  }, [category]);

  // Memoized values
  const mockComments = useMemo(() => getCategoryComments(), [getCategoryComments]);
  const modalHeight = useMemo(
    () => SCREEN_HEIGHT - insets.top - TIMING_CONFIG.MODAL_HEADER_OFFSET,
    [insets.top]
  );
  const inputPaddingBottom = useMemo(
    () => (Platform.OS === 'ios' ? Math.max(insets.bottom, TIMING_CONFIG.INPUT_PADDING_BOTTOM) : TIMING_CONFIG.INPUT_PADDING_BOTTOM),
    [insets.bottom]
  );
  const placeholderText = useMemo(
    () => `${postAuthor?.name || 'Gönderi'} için yorum ekle...`,
    [postAuthor?.name]
  );
  const hasCommentText = useMemo(() => commentText.trim().length > 0, [commentText]);

  /**
   * Renders a single comment item
   */
  const renderComment = useCallback(({ item }) => {
    const commentLikeState = commentLikes[item.id] || {
      likes: item.likes,
      isLiked: item.isLiked,
    };

    // Initialize heart scale animation for this comment if not exists
    if (!heartScales[item.id]) {
      heartScales[item.id] = new Animated.Value(ANIMATION_CONFIG.HEART_SCALE_NORMAL);
    }

    const heartIconName = commentLikeState.isLiked ? 'heart' : 'heart-o';
    const heartIconColor = commentLikeState.isLiked
      ? COLORS_CONFIG.HEART_LIKED
      : COLORS.secondary;
    
    return (
      <View style={styles.commentItem} testID={`comment-item-${item.id}`}>
        <Image
          source={{ uri: item.user.avatar }}
          style={styles.commentAvatar}
          resizeMode="cover"
          accessibilityLabel={`${item.user.name} avatar`}
        />
        <TouchableWithoutFeedback
          onPress={() => handleCommentDoubleTap(item.id, commentLikeState)}
          accessibilityRole="button"
        >
        <View style={styles.commentContent}>
          <View style={styles.commentTextContainer}>
              <Text style={styles.commentUsername} numberOfLines={1}>
                {item.user.name}
              </Text>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
          <View style={styles.commentFooter}>
            <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
            {commentLikeState.likes > 0 && (
              <>
                <Text style={styles.commentDot}>•</Text>
                  <Text style={styles.commentLikes}>
                    {commentLikeState.likes} beğeni
                  </Text>
              </>
            )}
          </View>
        </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity 
          style={styles.commentLikeButton}
          onPress={() =>
            handleLikeComment(item.id, commentLikeState.likes, commentLikeState.isLiked)
          }
          activeOpacity={0.7}
          accessibilityLabel={
            commentLikeState.isLiked ? 'Unlike comment' : 'Like comment'
          }
          accessibilityRole="button"
          accessibilityState={{ selected: commentLikeState.isLiked }}
        >
          <Animated.View
            style={[
              styles.commentHeartContainer,
              {
                transform: [{ scale: heartScales[item.id] }],
              },
            ]}
          >
            <FontAwesome
              name={heartIconName}
              size={ICON_SIZES.HEART}
              color={heartIconColor}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }, [commentLikes, handleCommentDoubleTap, handleLikeComment, heartScales]);

  /**
   * Key extractor for FlatList
   */
  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
      testID="comments-modal"
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={handleClose}
          accessibilityLabel="Close comments modal"
          accessibilityRole="button"
        />
        
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
              height: modalHeight,
              maxHeight: modalHeight,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerHandle} />
            <Text style={styles.headerTitle}>Yorumlar</Text>
          </View>

          {/* Comments List */}
          <FlatList
            data={mockComments}
            renderItem={renderComment}
            keyExtractor={keyExtractor}
            style={styles.commentsList}
            contentContainerStyle={styles.commentsListContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            testID="comments-list"
          />

          {/* Input Area */}
          <View 
            style={[
              styles.inputContainer, 
              { 
                bottom: keyboardHeight > 0 ? keyboardHeight : 0,
                paddingBottom: inputPaddingBottom,
              },
            ]}
          >
            <Image
              source={{ uri: DEFAULT_AVATAR }}
              style={styles.inputAvatar}
              resizeMode="cover"
              accessibilityLabel="Your avatar"
            />
            <View style={[styles.inputWrapper, { height: inputHeight }]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={placeholderText}
                placeholderTextColor={COLORS.gray}
                value={commentText}
                onChangeText={setCommentText}
                onContentSizeChange={handleContentSizeChange}
                multiline
                maxLength={INPUT_CONFIG.MAX_LENGTH}
                textAlignVertical="center"
                returnKeyType="send"
                blurOnSubmit={true}
                onSubmitEditing={handleSendComment}
                accessibilityLabel="Comment input"
                accessibilityHint="Type your comment here"
              />
              {hasCommentText && (
                <TouchableOpacity
                  style={styles.sendButton}
                  activeOpacity={0.7}
                  onPress={handleSendComment}
                  accessibilityLabel="Send comment"
                  accessibilityRole="button"
                  testID="send-comment-button"
                >
                  <Animated.View
                    style={[
                      styles.sendButtonIconContainer,
                      {
                        transform: [{ scale: sendButtonScale }],
                      },
                    ]}
                  >
                    <FontAwesome
                      name="send"
                      size={ICON_SIZES.SEND}
                      color={COLORS.white}
                    />
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Memoize component to prevent unnecessary re-renders
const MemoizedCommentsModal = memo(CommentsModal);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS_CONFIG.MODAL_OVERLAY,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
    position: 'relative',
  },
  headerHandle: {
    width: ICON_SIZES.HEADER_HANDLE_WIDTH,
    height: ICON_SIZES.HEADER_HANDLE_HEIGHT,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.text, // SF Pro Text (16px is below Display threshold)
    fontWeight: '600',
    color: COLORS.secondary,
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    paddingVertical: SPACING.sm,
    paddingBottom: TIMING_CONFIG.COMMENTS_LIST_BOTTOM_PADDING,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: ICON_SIZES.AVATAR,
    height: ICON_SIZES.AVATAR,
    borderRadius: ICON_SIZES.AVATAR / 2,
    backgroundColor: COLORS.lightGray,
  },
  commentContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  commentTextContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  commentUsername: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.text, // SF Pro Text for usernames
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  commentText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.text, // SF Pro Text for comment text
    color: COLORS.secondary,
    lineHeight: FONT_SIZES.sm * 1.5,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingLeft: SPACING.md,
  },
  commentTimestamp: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.text, // SF Pro Text for small text
    color: COLORS.gray,
  },
  commentDot: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.text, // SF Pro Text
    color: COLORS.gray,
    marginHorizontal: SPACING.xs,
  },
  commentLikes: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.text, // SF Pro Text
    color: COLORS.gray,
    fontWeight: '600',
  },
  commentLikeButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentHeartContainer: {
    width: ICON_SIZES.HEART,
    height: ICON_SIZES.HEART,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.accentLight,
    backgroundColor: COLORS.white,
    zIndex: 10,
  },
  inputAvatar: {
    width: ICON_SIZES.INPUT_AVATAR,
    height: ICON_SIZES.INPUT_AVATAR,
    borderRadius: ICON_SIZES.INPUT_AVATAR / 2,
    backgroundColor: COLORS.lightGray,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    marginLeft: SPACING.sm,
    paddingRight: 40,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.text, // SF Pro Text for input text
    color: COLORS.secondary,
    textAlignVertical: 'center',
    minHeight: INPUT_CONFIG.MIN_HEIGHT,
  },
  sendButton: {
    position: 'absolute',
    right: SPACING.xs,
    bottom: SPACING.xs,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonIconContainer: {
    width: ICON_SIZES.SEND,
    height: ICON_SIZES.SEND,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MemoizedCommentsModal;
