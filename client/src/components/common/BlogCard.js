import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../constants';
import CommentsModal from './CommentsModal';
import LikesModal from './LikesModal';

const BlogCard = ({ 
  author, 
  date, 
  image, 
  title, 
  description, 
  likes,
  comments = 20, // Mock yorum sayısı
  category,
  onPress,
  onLike,
  onBookmark,
  onAuthorPress,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [likeAnimations, setLikeAnimations] = useState([]);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const lastTap = useRef(null);

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike?.();
  };

  const handleDoubleTap = (event) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (lastTap.current && (now - lastTap.current) < DOUBLE_PRESS_DELAY) {
      const { locationX, locationY } = event.nativeEvent;
      
      const newAnimation = {
        id: Date.now(),
        x: locationX,
        y: locationY,
        opacity: new Animated.Value(1),
        translateY: new Animated.Value(0),
        scale: new Animated.Value(0),
      };
      
      setLikeAnimations(prev => [...prev, newAnimation]);
      
      if (!isLiked) {
        setIsLiked(true);
        setLikeCount(likeCount + 1);
        onLike?.();
      }
      
      Animated.parallel([
        Animated.timing(newAnimation.opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(newAnimation.translateY, {
          toValue: -80,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(newAnimation.scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(newAnimation.scale, {
            toValue: 0.8,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setLikeAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
      });
    } else {
      lastTap.current = now;
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };

  const handleOpenComments = (e) => {
    e?.stopPropagation();
    setCommentsModalVisible(true);
  };

  const handleCloseComments = () => {
    setCommentsModalVisible(false);
  };

  const handleOpenLikes = (e) => {
    e?.stopPropagation();
    setLikesModalVisible(true);
  };

  const handleCloseLikes = () => {
    setLikesModalVisible(false);
  };

  // Liked by listesi için mock avatarlar
  const likedByAvatars = [
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
  ];

  return (
    <View style={styles.card}>
      {/* Author Info */}
      <TouchableOpacity 
        style={styles.header}
        onPress={onAuthorPress}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: author.avatar }} 
          style={styles.avatar}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{author.name}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </TouchableOpacity>

      {/* Title/Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.caption} numberOfLines={3}>
          {description}
        </Text>
      </View>

      {/* Blog Image */}
      {image && (
        <TouchableWithoutFeedback onPress={handleDoubleTap}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: image }} 
              style={styles.image}
              resizeMode="cover"
            />
            
            {/* Heart Animations */}
            {likeAnimations.map((animation) => (
              <Animated.View
                key={animation.id}
                style={[
                  styles.heartAnimationContainer,
                  {
                    left: animation.x - 25,
                    top: animation.y - 25,
                    opacity: animation.opacity,
                    transform: [
                      { translateY: animation.translateY },
                      { scale: animation.scale },
                    ],
                  },
                ]}
              >
                <Text style={styles.heartAnimation}>❤️</Text>
              </Animated.View>
            ))}
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Footer - Likes and Comments */}
      <View style={styles.footer}>
        {/* Liked by section */}
        <TouchableOpacity 
          style={styles.likedBySection}
          onPress={handleOpenLikes}
          activeOpacity={0.7}
        >
          <View style={styles.avatarGroup}>
            {likedByAvatars.map((avatar, index) => (
              <Image
                key={index}
                source={{ uri: avatar }}
                style={[styles.likedByAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
              />
            ))}
          </View>
          <Text style={styles.likedByText}>
            Liked by <Text style={styles.likedByName}>rebecca_jones</Text> and{' '}
            <Text style={styles.likedByName}>{likeCount - 1} others</Text>
          </Text>
        </TouchableOpacity>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <View style={styles.leftActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleLike}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>
                {isLiked ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleOpenComments}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>💬</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleBookmark}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>
              {isBookmarked ? '🔖' : '🏷️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Comments preview */}
        <TouchableOpacity 
          style={styles.commentsSection}
          onPress={handleOpenComments}
          activeOpacity={0.7}
        >
          <Text style={styles.viewComments}>View all {comments} comments</Text>
          <Text style={styles.commentPreview}>
            <Text style={styles.commentUsername}>drkhensick_hh</Text> Very nice
          </Text>
        </TouchableOpacity>
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
      <LikesModal
        visible={likesModalVisible}
        onClose={handleCloseLikes}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  authorInfo: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  authorName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  date: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    marginTop: 2,
  },
  captionContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  caption: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondary,
    lineHeight: 18,
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
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  heartAnimation: {
    fontSize: 50,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  likedByText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.secondary,
    flex: 1,
  },
  likedByName: {
    fontWeight: '600',
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
  },
  actionIcon: {
    fontSize: 24,
  },
  commentsSection: {
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  viewComments: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  commentPreview: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.secondary,
  },
  commentUsername: {
    fontWeight: '600',
  },
});

export default BlogCard;
