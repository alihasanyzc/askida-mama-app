import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../constants';

const BlogCard = ({ 
  author, 
  date, 
  image, 
  title, 
  description, 
  likes,
  onPress,
  onLike,
  onBookmark 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = (e) => {
    e.stopPropagation(); // Kartın onPress'ini tetiklememek için
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike?.();
  };

  const handleBookmark = (e) => {
    e.stopPropagation(); // Kartın onPress'ini tetiklememek için
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Author Info */}
      <View style={styles.header}>
        <Image 
          source={{ uri: author.avatar }} 
          style={styles.avatar}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{author.name}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>

      {/* Blog Image with Bookmark */}
      {image && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: image }} 
            style={styles.image}
            resizeMode="cover"
          />
          {/* Bookmark Button - Sağ Üst */}
          <TouchableOpacity 
            style={styles.bookmarkButtonTop}
            onPress={handleBookmark}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.bookmarkIconTop,
              isBookmarked && styles.bookmarkIconTopActive
            ]}>
              {isBookmarked ? '🔖' : '🏷️'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
      </View>

      {/* Footer - Sadece Like */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.likeIcon,
            isLiked && styles.likeIconActive
          ]}>
            {isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.likeCount}>{likeCount}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
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
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginTop: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.lightGray,
  },
  bookmarkButtonTop: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.white,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bookmarkIconTop: {
    fontSize: 20,
  },
  bookmarkIconTopActive: {
    fontSize: 22,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  likeIcon: {
    fontSize: 22,
    marginRight: SPACING.xs,
  },
  likeIconActive: {
    fontSize: 24,
  },
  likeCount: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondary,
    fontWeight: '600',
  },
});

export default BlogCard;
