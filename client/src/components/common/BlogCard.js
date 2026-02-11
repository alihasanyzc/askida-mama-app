import React, { useState, useRef, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONTS, DISPLAY_FONT_THRESHOLD } from '../../constants';
import CommentsModal from './CommentsModal';
import LikesModal from './LikesModal';

// Constants
const ANIMATION_CONFIG = {
  DOUBLE_TAP_DELAY: 300,
  HEART_SCALE_MAX: 1.3,
  HEART_SCALE_NORMAL: 1,
  SPRING_TENSION: 400,
  SPRING_FRICTION: 7,
  HEART_ANIMATION_DURATION: 800,
  HEART_ANIMATION_TRANSLATE_Y: -80,
  HEART_ANIMATION_SCALE_INITIAL: 0,
  HEART_ANIMATION_SCALE_MAX: 1,
  HEART_ANIMATION_SCALE_FINAL: 0.8,
  HEART_ANIMATION_SCALE_DURATION: 200,
  HEART_ANIMATION_FADE_DURATION: 600,
};

const ICON_SIZES = {
  HEART: 24,
  AVATAR: 40,
  LIKED_BY_AVATAR: 20,
  HEART_ANIMATION: 50,
};

const COLORS_CONFIG = {
  HEART_LIKED: '#FF3040',
  HEART_ANIMATION_OFFSET: 25,
};

const DEFAULT_PROPS = {
  comments: 20,
  likes: 0,
};

const MOCK_LIKED_BY_AVATARS = [
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
];

/**
 * BlogCard Component
 * 
 * Displays a blog post card with author info, image, likes, comments, and bookmarks.
 * Features Instagram-style like animations and double-tap to like functionality.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.author - Author information with name and avatar
 * @param {string} props.date - Post date
 * @param {string} props.image - Image URL
 * @param {string} props.title - Post title
 * @param {string} props.description - Post description/caption
 * @param {number} props.likes - Initial like count
 * @param {number} props.comments - Comment count
 * @param {string} props.category - Post category
 * @param {Function} props.onPress - Callback when card is pressed
 * @param {Function} props.onLike - Callback when like button is pressed
 * @param {Function} props.onBookmark - Callback when bookmark button is pressed
 * @param {Function} props.onAuthorPress - Callback when author is pressed
 */
const BlogCard = ({
  author,
  date,
  image,
  title,
  description,
  likes = DEFAULT_PROPS.likes,
  comments = DEFAULT_PROPS.comments,
  category,
  onPress,
  onLike,
  onBookmark,
  onAuthorPress,
}) => {
  // State management
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [likeAnimations, setLikeAnimations] = useState([]);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [likesModalVisible, setLikesModalVisible] = useState(false);

  // Refs
  const lastTap = useRef(null);
  const heartScale = useRef(new Animated.Value(ANIMATION_CONFIG.HEART_SCALE_NORMAL)).current;

  /**
   * Triggers the Instagram-style heart scale animation
   */
  const triggerHeartAnimation = useCallback(() => {
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: ANIMATION_CONFIG.HEART_SCALE_MAX,
        useNativeDriver: true,
        tension: ANIMATION_CONFIG.SPRING_TENSION,
        friction: ANIMATION_CONFIG.SPRING_FRICTION,
      }),
      Animated.spring(heartScale, {
        toValue: ANIMATION_CONFIG.HEART_SCALE_NORMAL,
        useNativeDriver: true,
        tension: ANIMATION_CONFIG.SPRING_TENSION,
        friction: ANIMATION_CONFIG.SPRING_FRICTION,
      }),
    ]).start();
  }, [heartScale]);

  /**
   * Handles like button press
   */
  const handleLike = useCallback((e) => {
    e?.stopPropagation();
    const newLikedState = !isLiked;
    
    setIsLiked(newLikedState);
    setLikeCount((prevCount) => (newLikedState ? prevCount + 1 : prevCount - 1));
    
    if (newLikedState) {
      triggerHeartAnimation();
    }
    
    onLike?.(newLikedState);
  }, [isLiked, triggerHeartAnimation, onLike]);

  /**
   * Creates a new heart animation for double-tap
   */
  const createHeartAnimation = useCallback((locationX, locationY) => {
    const animationId = Date.now();
    const newAnimation = {
      id: animationId,
      x: locationX,
      y: locationY,
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(ANIMATION_CONFIG.HEART_ANIMATION_SCALE_INITIAL),
    };

    setLikeAnimations((prev) => [...prev, newAnimation]);

    // Animate the floating heart
    Animated.parallel([
      Animated.timing(newAnimation.opacity, {
        toValue: 0,
        duration: ANIMATION_CONFIG.HEART_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(newAnimation.translateY, {
        toValue: ANIMATION_CONFIG.HEART_ANIMATION_TRANSLATE_Y,
        duration: ANIMATION_CONFIG.HEART_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(newAnimation.scale, {
          toValue: ANIMATION_CONFIG.HEART_ANIMATION_SCALE_MAX,
          duration: ANIMATION_CONFIG.HEART_ANIMATION_SCALE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(newAnimation.scale, {
          toValue: ANIMATION_CONFIG.HEART_ANIMATION_SCALE_FINAL,
          duration: ANIMATION_CONFIG.HEART_ANIMATION_FADE_DURATION,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setLikeAnimations((prev) => prev.filter((anim) => anim.id !== animationId));
    });

    return newAnimation;
  }, []);

  /**
   * Handles double-tap gesture to like the post
   */
  const handleDoubleTap = useCallback((event) => {
    const now = Date.now();
    const { locationX, locationY } = event.nativeEvent;

    if (lastTap.current && (now - lastTap.current) < ANIMATION_CONFIG.DOUBLE_TAP_DELAY) {
      // Double tap detected
      createHeartAnimation(locationX, locationY);

      if (!isLiked) {
        setIsLiked(true);
        setLikeCount((prevCount) => prevCount + 1);
        triggerHeartAnimation();
        onLike?.(true);
      }

      lastTap.current = null;
    } else {
      lastTap.current = now;
    }
  }, [isLiked, createHeartAnimation, triggerHeartAnimation, onLike]);

  /**
   * Handles bookmark button press
   */
  const handleBookmark = useCallback((e) => {
    e?.stopPropagation();
    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);
    onBookmark?.(newBookmarkedState);
  }, [isBookmarked, onBookmark]);

  /**
   * Opens comments modal
   */
  const handleOpenComments = useCallback((e) => {
    e?.stopPropagation();
    setCommentsModalVisible(true);
  }, []);

  /**
   * Closes comments modal
   */
  const handleCloseComments = useCallback(() => {
    setCommentsModalVisible(false);
  }, []);

  /**
   * Opens likes modal
   */
  const handleOpenLikes = useCallback((e) => {
    e?.stopPropagation();
    setLikesModalVisible(true);
  }, []);

  /**
   * Closes likes modal
   */
  const handleCloseLikes = useCallback(() => {
    setLikesModalVisible(false);
  }, []);

  /**
   * Handles author press
   */
  const handleAuthorPress = useCallback((e) => {
    e?.stopPropagation();
    onAuthorPress?.(author);
  }, [author, onAuthorPress]);

  // Memoized values
  const heartIconName = useMemo(() => (isLiked ? 'heart' : 'heart-o'), [isLiked]);
  const heartIconColor = useMemo(
    () => (isLiked ? COLORS_CONFIG.HEART_LIKED : COLORS.secondary),
    [isLiked]
  );
  const bookmarkIconName = useMemo(() => (isBookmarked ? 'bookmark' : 'bookmark-o'), [isBookmarked]);
  const otherLikesCount = useMemo(() => Math.max(0, likeCount - 1), [likeCount]);

  return (
    <View style={styles.card} testID="blog-card">
      {/* Author Info */}
      <TouchableOpacity
        style={styles.header}
        onPress={handleAuthorPress}
        activeOpacity={0.7}
        accessibilityLabel={`Author: ${author?.name || 'Unknown'}`}
        accessibilityRole="button"
      >
        <Image
          source={{ uri: author?.avatar }}
          style={styles.avatar}
          resizeMode="cover"
          accessibilityLabel={`${author?.name || 'Unknown'} avatar`}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName} numberOfLines={1}>
            {author?.name || 'Unknown'}
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </TouchableOpacity>

      {/* Title/Caption */}
      {description && (
        <View style={styles.captionContainer}>
          <Text style={styles.caption} numberOfLines={3}>
            {description}
          </Text>
        </View>
      )}

      {/* Blog Image */}
      {image && (
        <TouchableWithoutFeedback onPress={handleDoubleTap} accessibilityRole="button">
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel="Blog post image"
            />

            {/* Floating Heart Animations */}
            {likeAnimations.map((animation) => (
              <Animated.View
                key={animation.id}
                style={[
                  styles.heartAnimationContainer,
                  {
                    left: animation.x - COLORS_CONFIG.HEART_ANIMATION_OFFSET,
                    top: animation.y - COLORS_CONFIG.HEART_ANIMATION_OFFSET,
                    opacity: animation.opacity,
                    transform: [
                      { translateY: animation.translateY },
                      { scale: animation.scale },
                    ],
                  },
                ]}
                pointerEvents="none"
              >
                <Text style={styles.heartAnimation}>❤️</Text>
              </Animated.View>
            ))}
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Footer - Likes and Comments */}
      <View style={styles.footer}>
        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <View style={styles.leftActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLike}
              activeOpacity={0.7}
              accessibilityLabel={isLiked ? 'Unlike' : 'Like'}
              accessibilityRole="button"
              accessibilityState={{ selected: isLiked }}
            >
              <Animated.View
                style={[
                  styles.heartIconContainer,
                  {
                    transform: [{ scale: heartScale }],
                  },
                ]}
                testID="heart-icon-container"
              >
                <FontAwesome
                  name={heartIconName}
                  size={ICON_SIZES.HEART}
                  color={heartIconColor}
                />
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleOpenComments}
              activeOpacity={0.7}
              accessibilityLabel={`${comments} comments`}
              accessibilityRole="button"
            >
              <FontAwesome
                name="comment-o"
                size={ICON_SIZES.HEART}
                color={COLORS.secondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleBookmark}
            activeOpacity={0.7}
            accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            accessibilityRole="button"
            accessibilityState={{ selected: isBookmarked }}
          >
            <FontAwesome
              name={bookmarkIconName}
              size={ICON_SIZES.HEART}
              color={COLORS.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Liked by section */}
        {likeCount > 0 && (
          <TouchableOpacity
            style={styles.likedBySection}
            onPress={handleOpenLikes}
            activeOpacity={0.7}
            accessibilityLabel={`${likeCount} likes`}
            accessibilityRole="button"
          >
            <View style={styles.avatarGroup}>
              {MOCK_LIKED_BY_AVATARS.slice(0, 3).map((avatar, index) => (
                <Image
                  key={`${avatar}-${index}`}
                  source={{ uri: avatar }}
                  style={[
                    styles.likedByAvatar,
                    { marginLeft: index > 0 ? -SPACING.sm : 0 },
                  ]}
                  resizeMode="cover"
                />
              ))}
            </View>
            <Text style={styles.likedByText} numberOfLines={1}>
              Liked by <Text style={styles.likedByName}>rebecca_jones</Text>
              {otherLikesCount > 0 && (
                <>
                  {' '}and <Text style={styles.likedByName}>{otherLikesCount} others</Text>
                </>
              )}
            </Text>
          </TouchableOpacity>
        )}

        {/* Comments preview */}
        {comments > 0 && (
          <TouchableOpacity
            style={styles.commentsSection}
            onPress={handleOpenComments}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.viewComments}>View all {comments} comments</Text>
            <Text style={styles.commentPreview} numberOfLines={1}>
              <Text style={styles.commentUsername}>drkhensick_hh</Text> Very nice
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Comments Modal */}
      <CommentsModal
        visible={commentsModalVisible}
        onClose={handleCloseComments}
        postAuthor={author}
        category={category}
        postTitle={title}
      />

      {/* Likes Modal */}
      <LikesModal visible={likesModalVisible} onClose={handleCloseLikes} />
    </View>
  );
};

// Memoize component to prevent unnecessary re-renders
const MemoizedBlogCard = memo(BlogCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  avatar: {
    width: ICON_SIZES.AVATAR,
    height: ICON_SIZES.AVATAR,
    borderRadius: ICON_SIZES.AVATAR / 2,
    backgroundColor: COLORS.lightGray,
  },
  authorInfo: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  authorName: {
    fontSize: FONT_SIZES.md,
    ...(Platform.OS === 'android' && { fontFamily: FONTS.text }), // Only set fontFamily on Android
    fontWeight: '600',
    color: COLORS.secondary,
  },
  date: {
    fontSize: FONT_SIZES.xs,
    ...(Platform.OS === 'android' && { fontFamily: FONTS.text }), // Only set fontFamily on Android
    color: COLORS.gray,
    marginTop: SPACING.xs / 2,
  },
  captionContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  caption: {
    fontSize: FONT_SIZES.sm,
    ...(Platform.OS === 'android' && { fontFamily: FONTS.text }), // Only set fontFamily on Android
    color: COLORS.secondary,
    lineHeight: FONT_SIZES.sm * 1.5,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 400,
    backgroundColor: COLORS.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartAnimationContainer: {
    position: 'absolute',
    width: ICON_SIZES.HEART_ANIMATION,
    height: ICON_SIZES.HEART_ANIMATION,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  heartAnimation: {
    fontSize: ICON_SIZES.HEART_ANIMATION,
  },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  likedBySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarGroup: {
    flexDirection: 'row',
    marginRight: SPACING.sm,
  },
  likedByAvatar: {
    width: ICON_SIZES.LIKED_BY_AVATAR,
    height: ICON_SIZES.LIKED_BY_AVATAR,
    borderRadius: ICON_SIZES.LIKED_BY_AVATAR / 2,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  likedByText: {
    fontSize: FONT_SIZES.xs,
    ...(Platform.OS === 'android' && { fontFamily: FONTS.text }), // Only set fontFamily on Android
    color: COLORS.secondary,
    flex: 1,
  },
  likedByName: {
    fontSize: FONT_SIZES.xs, // Explicit fontSize for nested Text
    ...(Platform.OS === 'android' && { fontFamily: FONTS.text }), // Only set fontFamily on Android
    fontWeight: '600',
    color: COLORS.secondary, // Inherit color
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  leftActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    padding: SPACING.xs,
    minWidth: ICON_SIZES.HEART + SPACING.sm,
    minHeight: ICON_SIZES.HEART + SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIconContainer: {
    transform: [{ scale: 1 }],
  },
  actionIcon: {
    fontSize: ICON_SIZES.HEART,
  },
  commentsSection: {
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  viewComments: {
    fontSize: FONT_SIZES.xs,
    ...(Platform.OS === 'android' && { fontFamily: FONTS.text }), // Only set fontFamily on Android
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  commentPreview: {
    fontSize: FONT_SIZES.xs,
    ...(Platform.OS === 'android' && { fontFamily: FONTS.text }), // Only set fontFamily on Android
    color: COLORS.secondary,
    lineHeight: FONT_SIZES.xs * 1.4, // Better line height for readability
  },
  commentUsername: {
    fontSize: FONT_SIZES.xs, // Explicit fontSize for nested Text
    ...(Platform.OS === 'android' && { fontFamily: FONTS.text }), // Only set fontFamily on Android
    fontWeight: '600',
    color: COLORS.secondary, // Inherit color
  },
});

export default MemoizedBlogCard;
