import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  StatusBar 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import CategoryButton from '../components/common/CategoryButton';
import BlogCard from '../components/common/BlogCard';

const DiscoverScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('Hepsi');
  const insets = useSafeAreaInsets();

  const categories = [
    'Hepsi',
    'Sağlık',
    'Mama & Barınma',
    'Yardım Hikayeleri'
  ];

  // 10 adet mock blog verisi (kategorilere göre)
  const allBlogs = [
    {
      id: '1',
      category: 'Sağlık',
      author: {
        name: 'Dr. Zeynep Kaya',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      date: '7 Ara, 2024',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
      title: 'Yaralı bir sokak hayvanını gördüğünüzde ne yapmalısınız?',
      description: 'Sokakta yaralı bir hayvan gördüğünüzde panik yapmadan uygulamanız gereken adımlar ve ilk yardım teknikleri...',
      likes: 342,
    },
    {
      id: '2',
      category: 'Mama & Barınma',
      author: {
        name: 'Dr. Mehmet Arslan',
        avatar: 'https://i.pravatar.cc/150?img=33',
      },
      date: '6 Ara, 2024',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
      title: 'Kış aylarında sokak kedilerine nasıl yardım edebiliriz?',
      description: 'Soğuk hava koşullarında sokak kedilerinin ihtiyaçları ve onlara nasıl destek olabileceğiniz hakkında önemli bilgiler...',
      likes: 428,
    },
    {
      id: '3',
      category: 'Yardım Hikayeleri',
      author: {
        name: 'Ayşe Demir',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
      date: '5 Ara, 2024',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
      title: 'Sokaktan kurtardığım köpeğim artık ailemizin bir parçası',
      description: 'Yağmurlu bir gecede karşılaştığım yaralı köpeği nasıl kurtardım ve hayatımızı nasıl değiştirdi...',
      likes: 892,
    },
    {
      id: '4',
      category: 'Sağlık',
      author: {
        name: 'Dr. Can Yılmaz',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
      date: '4 Ara, 2024',
      image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800',
      title: 'Sokak hayvanlarında en sık görülen hastalıklar',
      description: 'Veteriner olarak en çok karşılaştığım sokak hayvanı hastalıkları ve önleme yöntemleri hakkında bilmeniz gerekenler...',
      likes: 567,
    },
    {
      id: '5',
      category: 'Mama & Barınma',
      author: {
        name: 'Elif Kara',
        avatar: 'https://i.pravatar.cc/150?img=9',
      },
      date: '3 Ara, 2024',
      image: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800',
      title: 'Sokak hayvanları için mama bağışı nasıl yapılır?',
      description: 'Sokaktaki dostlarımıza düzenli mama desteği sağlamanın yolları ve dikkat edilmesi gereken noktalar...',
      likes: 734,
    },
    {
      id: '6',
      category: 'Yardım Hikayeleri',
      author: {
        name: 'Murat Öztürk',
        avatar: 'https://i.pravatar.cc/150?img=15',
      },
      date: '2 Ara, 2024',
      image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800',
      title: 'Mahalle sakinleri olarak kurduk: Sokak Hayvanları Derneği',
      description: 'Komşularımızla bir araya gelerek sokak hayvanlarına yardım için dernek kurma sürecimiz...',
      likes: 1205,
    },
    {
      id: '7',
      category: 'Sağlık',
      author: {
        name: 'Dr. Selin Aydın',
        avatar: 'https://i.pravatar.cc/150?img=20',
      },
      date: '1 Ara, 2024',
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
      title: 'Sokak köpeklerinde kuduz aşısının önemi',
      description: 'Kuduz hastalığı nedir, nasıl bulaşır ve sokak hayvanları için aşılama programları nasıl çalışır?',
      likes: 456,
    },
    {
      id: '8',
      category: 'Mama & Barınma',
      author: {
        name: 'Ahmet Şahin',
        avatar: 'https://i.pravatar.cc/150?img=18',
      },
      date: '30 Kas, 2024',
      image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=800',
      title: 'DIY: Kedi evi yapımı adım adım rehber',
      description: 'Basit malzemelerle sokak kedileri için sıcak ve güvenli bir barınak nasıl yapılır?',
      likes: 923,
    },
    {
      id: '9',
      category: 'Yardım Hikayeleri',
      author: {
        name: 'Zehra Bulut',
        avatar: 'https://i.pravatar.cc/150?img=25',
      },
      date: '29 Kas, 2024',
      image: 'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=800',
      title: '6 ayda 50 kedi kısırlaştırdık: Mahalle projemiz',
      description: 'Sokak kedilerinin kontrolsüz çoğalmasını önlemek için başlattığımız kısırlaştırma projesinin hikayesi...',
      likes: 1567,
    },
    {
      id: '10',
      category: 'Sağlık',
      author: {
        name: 'Dr. Burak Tekin',
        avatar: 'https://i.pravatar.cc/150?img=30',
      },
      date: '28 Kas, 2024',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
      title: 'Sokak hayvanlarında parazit kontrolü',
      description: 'Pire, kene ve iç parazitler sokak hayvanlarını nasıl etkiler ve toplum sağlığı için neden önemlidir?',
      likes: 689,
    },
  ];

  // Filtrelenmiş bloglar - useMemo ile optimize
  const filteredBlogs = useMemo(() => {
    if (activeCategory === 'Hepsi') {
      return allBlogs;
    }
    return allBlogs.filter(blog => blog.category === activeCategory);
  }, [activeCategory]);

  // FlatList renderItem - useCallback ile optimize
  const renderBlogCard = useCallback(({ item }) => (
    <BlogCard
      author={item.author}
      date={item.date}
      image={item.image}
      title={item.title}
      description={item.description}
      likes={item.likes}
      onPress={() => console.log('Blog pressed:', item.id)}
      onLike={() => console.log('Like pressed:', item.id)}
      onBookmark={() => console.log('Bookmark pressed:', item.id)}
    />
  ), []);

  // FlatList keyExtractor - useCallback ile optimize
  const keyExtractor = useCallback((item) => item.id, []);

  // Horizontal category scroll renderItem
  const renderCategory = useCallback(({ item }) => (
    <CategoryButton
      title={item}
      active={activeCategory === item}
      onPress={() => setActiveCategory(item)}
    />
  ), [activeCategory]);

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <View style={styles.createIcon}>
            <Text style={styles.createIconText}>+</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.pawIcon}>🐾</Text>
          </View>
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Ara</Text>
        </View>
      </View>

      {/* Categories - Horizontal FlatList */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

      {/* Blog Posts - Vertical FlatList */}
      <FlatList
        data={filteredBlogs}
        renderItem={renderBlogCard}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
  },
  createButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createIconText: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: '300',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pawIcon: {
    fontSize: 24,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  searchPlaceholder: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
  categoriesContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  categoriesContent: {
    paddingHorizontal: SPACING.md,
  },
  flatListContent: {
    paddingBottom: SPACING.xl,
  },
});

export default DiscoverScreen;
