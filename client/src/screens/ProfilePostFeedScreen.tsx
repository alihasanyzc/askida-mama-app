import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AxiosError } from 'axios';
import { COLORS, FONT_SIZES, SPACING } from '../constants';
import BlogCard from '../components/common/BlogCard';
import { likePost, savePost, unlikePost, unsavePost } from '../services/posts';
import { subscribeToDeletedPosts } from '../hooks/useDeletedPosts';
import { deleteUserPost } from '../hooks/useUserPosts';
import { addSavedPostToCache, removeSavedPostFromCache } from '../hooks/useSavedPosts';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../types/navigation';

const ESTIMATED_FEED_ITEM_HEIGHT = 640;

const buildPostKey = (post: ProfilePostFeedItem, index: number): string => {
  const parts = [
    post.author?.name ?? 'author',
    post.date ?? 'date',
    post.title ?? 'title',
    post.image ?? 'image',
    post.description ?? 'description',
    String(index),
  ];

  return `blog-${parts
    .join('-')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')}`;
};

/**
 * Profil grid'den bir posta tıklanınca feed akışı içinde o posta odaklanır.
 * Kullanıcı yukarı/aşağı kaydırarak diğer postları doğal feed davranışıyla görür.
 */
type ProfilePostFeedItem = {
  id: string;
  author: {
    id?: string;
    name: string;
    avatar: string;
  };
  date: string;
  image: string;
  title?: string;
  description: string;
  likes?: number;
  comments?: number;
  category?: string;
  isSaved?: boolean;
};

type ProfilePostFeedScreenProps = StackScreenProps<ProfileStackParamList, 'ProfilePostFeed'>;

const ProfilePostFeedScreen = ({
  route,
  navigation,
}: ProfilePostFeedScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<ProfilePostFeedItem> | null>(null);
  const { posts = [], initialIndex = 0, source = 'posts' } = route.params || {};
  const [visiblePosts, setVisiblePosts] = useState<ProfilePostFeedItem[]>(posts);
  const clampedInitialIndex = Math.min(initialIndex, Math.max(0, visiblePosts.length - 1));

  useEffect(() => {
    setVisiblePosts(posts);
  }, [posts]);

  useEffect(() => {
    const unsubscribe = subscribeToDeletedPosts((postId) => {
      setVisiblePosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (visiblePosts.length === 0 && posts.length > 0) {
      navigation.goBack();
    }
  }, [navigation, posts.length, visiblePosts.length]);

  const getItemLayout = useCallback(
    (_data, index) => ({
      length: ESTIMATED_FEED_ITEM_HEIGHT,
      offset: ESTIMATED_FEED_ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item: post }: { item: ProfilePostFeedItem }) => (
      <BlogCard
        postId={post.id}
        author={post.author}
        date={post.date}
        image={post.image}
        title={post.title}
        description={post.description}
        likes={post.likes}
        comments={post.comments}
        category={post.category}
        isInitiallyBookmarked={Boolean(post.isSaved)}
        containerStyle={styles.feedCard}
        onLike={(isLiked) => (isLiked ? likePost(post.id) : unlikePost(post.id))}
        onBookmark={async (isBookmarked) => {
          const updatedPost = isBookmarked ? await savePost(post.id) : await unsavePost(post.id);

          setVisiblePosts((currentPosts) =>
            currentPosts
              .map((currentPost) =>
                currentPost.id === post.id
                  ? { ...currentPost, isSaved: Boolean(updatedPost.is_saved) }
                  : currentPost,
              )
              .filter((currentPost) => (source === 'saved' ? currentPost.id !== post.id || isBookmarked : true)),
          );

          if (isBookmarked) {
            addSavedPostToCache(updatedPost);
          } else {
            removeSavedPostFromCache(post.id);
          }
        }}
        canDelete={source === 'posts'}
        onDelete={async () => {
          try {
            await deleteUserPost(post.id);
          } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
              Alert.alert('Oturum Süresi Doldu', 'Devam etmek için tekrar giriş yapmanız gerekiyor.');
              return;
            }

            throw error;
          }
        }}
      />
    ),
    [source]
  );

  const keyExtractor = useCallback(
    (item: ProfilePostFeedItem, index: number) => buildPostKey(item, index),
    [],
  );

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + SPACING.xs }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Gönderiler</Text>
      <View style={styles.placeholder} />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      {visiblePosts.length > 0 && (
        <FlatList
          ref={flatListRef}
          data={visiblePosts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          initialScrollIndex={clampedInitialIndex}
          initialNumToRender={Math.min(Math.max(clampedInitialIndex + 2, 4), posts.length)}
          contentContainerStyle={styles.feedContent}
          onScrollToIndexFailed={(info) => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: false,
            });
          }}
          showsVerticalScrollIndicator={true}
          bounces={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.secondary,
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  feedContent: {
    backgroundColor: COLORS.white,
  },
  feedCard: {
    marginBottom: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
});

export default ProfilePostFeedScreen;
