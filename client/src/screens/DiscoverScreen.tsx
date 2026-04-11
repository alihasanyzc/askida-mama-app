import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AxiosError } from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, FONTS, SPACING } from '../constants';
import BlogCard from '../components/common/BlogCard';
import { likePost, listFeedPosts, savePost, unlikePost, unsavePost } from '../services/posts';
import { subscribeToDeletedPosts } from '../hooks/useDeletedPosts';
import { addSavedPostToCache, removeSavedPostFromCache } from '../hooks/useSavedPosts';
import { formatRelativePostTime } from '../utils/formatters';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../types/navigation';
import type { PostRecord, UserProfilePreview } from '../types/domain';

const HEADER_DIMENSIONS = {
  HEIGHT: 40,
  LOGO_SIZE: 48,
  CREATE_BUTTON_SIZE: 40,
  SEARCH_BAR_HEIGHT: 40,
};

const FLATLIST_CONFIG = {
  INITIAL_NUM_TO_RENDER: 5,
  MAX_TO_RENDER_PER_BATCH: 5,
  WINDOW_SIZE: 10,
};

const ICON_SIZES = {
  SEARCH: 16,
  PAW: 24,
};

const DEFAULT_AVATAR_URL =
  'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png';

type DiscoverBlog = {
  id: string;
  category?: string;
  author: {
    id?: string;
    name: string;
    username?: string;
    avatar: string;
  };
  date: string;
  image: string;
  title?: string;
  description: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
};

type DiscoverScreenProps = StackScreenProps<DiscoverStackParamList, 'DiscoverMain'>;

function mapPostToDiscoverBlog(post: PostRecord): DiscoverBlog {
  return {
    id: post.id,
    category: post.category ?? undefined,
    author: {
      id: post.author?.id ?? post.user_id,
      name: post.author?.full_name ?? 'Kullanıcı',
      username: post.author?.username,
      avatar: post.author?.avatar_url ?? DEFAULT_AVATAR_URL,
    },
    date: formatRelativePostTime(post.created_at ?? new Date().toISOString()),
    image: post.image_url,
    title: undefined,
    description: post.content,
    likes: post.likes_count ?? 0,
    comments: post.comments_count ?? 0,
    isLiked: Boolean(post.is_liked),
    isSaved: Boolean(post.is_saved),
  };
}

const DiscoverScreen = ({ navigation }: DiscoverScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<DiscoverBlog> | null>(null);
  const [blogs, setBlogs] = useState<DiscoverBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const headerHeight = useMemo(() => (
    insets.top +
    SPACING.xs +
    HEADER_DIMENSIONS.HEIGHT +
    SPACING.xs +
    SPACING.xs +
    HEADER_DIMENSIONS.SEARCH_BAR_HEIGHT +
    SPACING.xs
  ), [insets.top]);

  const flatListPaddingTop = useMemo(
    () => headerHeight + SPACING.xs,
    [headerHeight],
  );

  const refreshFeed = useCallback(async () => {
    setIsLoading(true);

    try {
      const posts = await listFeedPosts();
      setBlogs(posts.map(mapPostToDiscoverBlog));
      setErrorMessage(null);
    } catch (error) {
      setBlogs([]);

      if (error instanceof AxiosError && error.response?.status === 503) {
        setErrorMessage('Feed servisine şu anda ulaşılamıyor.');
      } else {
        setErrorMessage('Feed yüklenirken bir hata oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshFeed();

    const unsubscribe = navigation.addListener('focus', () => {
      void refreshFeed();
    });

    return unsubscribe;
  }, [navigation, refreshFeed]);

  useEffect(() => {
    const unsubscribe = subscribeToDeletedPosts((postId) => {
      setBlogs((currentBlogs) => currentBlogs.filter((blog) => blog.id !== postId));
    });

    return unsubscribe;
  }, []);

  const handleLogoPress = useCallback(() => {
    flatListRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, []);

  const handleAuthorPress = useCallback((item: DiscoverBlog) => {
    if (!item.author.id || !item.author.username) {
      return;
    }

    const user: UserProfilePreview = {
      id: item.author.id,
      name: item.author.name,
      username: item.author.username,
      avatar: item.author.avatar,
    };

    navigation.navigate('UserProfile', { user });
  }, [navigation]);

  const renderBlogCard = useCallback(({ item }: { item: DiscoverBlog }) => (
    <BlogCard
      postId={item.id}
      author={item.author}
      date={item.date}
      image={item.image}
      title={item.title}
      description={item.description}
      likes={item.likes}
      comments={item.comments}
      isInitiallyLiked={item.isLiked}
      isInitiallyBookmarked={item.isSaved}
      category={item.category}
      onLike={(isLiked) => (isLiked ? likePost(item.id) : unlikePost(item.id))}
      onBookmark={async (isBookmarked) => {
        const updatedPost = isBookmarked ? await savePost(item.id) : await unsavePost(item.id);

        setBlogs((currentBlogs) =>
          currentBlogs.map((blog) =>
            blog.id === item.id ? { ...blog, isSaved: Boolean(updatedPost.is_saved) } : blog,
          ),
        );

        if (isBookmarked) {
          addSavedPostToCache(updatedPost);
        } else {
          removeSavedPostFromCache(item.id);
        }
      }}
      onAuthorPress={() => handleAuthorPress(item)}
    />
  ), [handleAuthorPress]);

  const keyExtractor = useCallback((item: DiscoverBlog) => item.id, []);

  const renderEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {errorMessage ?? 'Takip ettiğiniz kullanıcıların gönderileri burada görünecek'}
        </Text>
      </View>
    );
  }, [errorMessage, isLoading]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <View
        style={[
          styles.headerContainer,
          {
            paddingTop: insets.top + SPACING.xs,
          },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreatePost')}
            activeOpacity={0.7}
            accessibilityLabel="Yeni post oluştur"
            accessibilityRole="button"
          >
            <View style={styles.createIcon}>
              <Text style={styles.createIconText}>+</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoContainer}
            onPress={handleLogoPress}
            activeOpacity={0.7}
            accessibilityLabel="Ana sayfaya dön"
            accessibilityRole="button"
            testID="logo-button"
          >
            <View style={styles.logo} accessibilityLabel="Askıda Mama">
              <Text style={styles.pawIcon}>🐾</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.placeholder} />
        </View>

        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.7}
          accessibilityLabel="Arama yap"
          accessibilityRole="button"
          testID="search-button"
        >
          <View style={styles.searchBar}>
            <Entypo
              name="magnifying-glass"
              size={ICON_SIZES.SEARCH}
              color={COLORS.gray}
              style={styles.searchIcon}
            />
            <Text style={styles.searchPlaceholder}>Ara</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={blogs}
        renderItem={renderBlogCard}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.flatListContent,
          { paddingTop: flatListPaddingTop },
        ]}
        initialNumToRender={FLATLIST_CONFIG.INITIAL_NUM_TO_RENDER}
        maxToRenderPerBatch={FLATLIST_CONFIG.MAX_TO_RENDER_PER_BATCH}
        windowSize={FLATLIST_CONFIG.WINDOW_SIZE}
        removeClippedSubviews={true}
        ListEmptyComponent={renderEmptyComponent}
        refreshing={isLoading && blogs.length > 0}
        onRefresh={refreshFeed}
        testID="blog-posts-list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xs,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  createButton: {
    width: HEADER_DIMENSIONS.CREATE_BUTTON_SIZE,
    height: HEADER_DIMENSIONS.CREATE_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createIcon: {
    width: HEADER_DIMENSIONS.CREATE_BUTTON_SIZE,
    height: HEADER_DIMENSIONS.CREATE_BUTTON_SIZE,
    borderRadius: SPACING.sm,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createIconText: {
    fontSize: 40,
    color: COLORS.primary,
    fontWeight: '300',
    lineHeight: HEADER_DIMENSIONS.CREATE_BUTTON_SIZE,
    textAlign: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: HEADER_DIMENSIONS.LOGO_SIZE,
    height: HEADER_DIMENSIONS.LOGO_SIZE,
    borderRadius: HEADER_DIMENSIONS.LOGO_SIZE / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pawIcon: {
    fontSize: ICON_SIZES.PAW,
  },
  placeholder: {
    width: HEADER_DIMENSIONS.CREATE_BUTTON_SIZE,
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchPlaceholder: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
  flatListContent: {
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.text,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default DiscoverScreen;
