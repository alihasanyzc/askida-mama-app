import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants';
import BlogCard from '../components/common/BlogCard';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../types/navigation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const buildBlogKey = (blog: BlogItem, index: number): string => {
  const parts = [
    blog.author?.name ?? 'author',
    blog.date ?? 'date',
    blog.title ?? 'title',
    blog.image ?? 'image',
    blog.description ?? 'description',
    String(index),
  ];

  return `blog-${parts
    .join('-')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')}`;
};

/**
 * Instagram tarzı dikey kaydırmalı blog galerisi.
 * Profil grid'den bir posta tıklanınca açılır; yukarı/aşağı kaydırarak
 * bir sonraki/önceki postlar görüntülenir.
 */
type BlogItem = {
  author: {
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
};

type BlogDetailScreenProps = StackScreenProps<ProfileStackParamList, 'BlogDetail'>;

const BlogDetailScreen = ({ route, navigation }: BlogDetailScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const { blogs = [], initialIndex = 0 } = route.params || {};

  const getItemLayout = useCallback(
    (_data, index) => ({
      length: SCREEN_HEIGHT,
      offset: SCREEN_HEIGHT * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item: blog }: { item: BlogItem }) => (
      <View style={[styles.cardPage, { height: SCREEN_HEIGHT }]}>
        <View style={styles.cardWrap}>
          <BlogCard
            author={blog.author}
            date={blog.date}
            image={blog.image}
            title={blog.title}
            description={blog.description}
            likes={blog.likes}
            comments={blog.comments}
            category={blog.category}
          />
        </View>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: BlogItem, index: number) => buildBlogKey(item, index),
    [],
  );

  if (!blogs || blogs.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 12 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 12 }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>

      <FlatList
        data={blogs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialScrollIndex={Math.min(initialIndex, Math.max(0, blogs.length - 1))}
        initialNumToRender={Math.max(initialIndex + 1, 3)}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        bounces={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    position: 'absolute',
    left: SPACING.md,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardPage: {
    width: '100%',
    justifyContent: 'center',
  },
  cardWrap: {
    paddingHorizontal: SPACING.sm,
  },
});

export default BlogDetailScreen;
