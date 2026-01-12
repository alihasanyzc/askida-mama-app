import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const { width } = Dimensions.get('window');

const DonationScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { type } = route?.params || { type: 'food' }; // 'food' or 'medical'
  const [selectedTab, setSelectedTab] = useState('cat'); // 'dog' or 'cat'

  // Mock data - Köpek mamaları
  const dogFoods = [
    {
      id: 1,
      name: 'Yavru Köpek Maması (Puppy)',
      description: 'Yavru köpekler için büyüme ve gelişim desteği',
      price: 115,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop',
      category: 'Köpek',
      weight: '1 kg',
    },
    {
      id: 2,
      name: 'Yetişkin Köpek Maması',
      description: 'Yetişkin köpekler için tam ve dengeli beslenme',
      price: 100,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400&h=400&fit=crop',
      category: 'Köpek',
      weight: '1 kg',
    },
    {
      id: 3,
      name: 'Büyük Irk Köpek Maması',
      description: 'Büyük ırklar için eklem sağlığı destekli mama',
      price: 130,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=400&fit=crop',
      category: 'Köpek',
      weight: '1 kg',
    },
    {
      id: 4,
      name: 'Küçük Irk Köpek Maması',
      description: 'Küçük ırk köpekler için küçük taneli mama',
      price: 105,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1591768575646-e48764c36b37?w=400&h=400&fit=crop',
      category: 'Köpek',
      weight: '1 kg',
    },
  ];

  // Mock data - Kedi mamaları
  const catFoods = [
    {
      id: 5,
      name: 'Yavru Kedi Maması (Kitten)',
      description: 'Yavru kediler için büyüme ve gelişim desteği',
      price: 110,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop',
      category: 'Kedi',
      weight: '1 kg',
    },
    {
      id: 6,
      name: 'Yetişkin Kedi Maması',
      description: 'Yetişkin kediler için tam ve dengeli beslenme',
      price: 95,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400&h=400&fit=crop',
      category: 'Kedi',
      weight: '1 kg',
    },
    {
      id: 7,
      name: 'Kısırlaştırılmış Kedi Maması',
      description: 'Kısırlaştırılmış kediler için özel formül',
      price: 120,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=400&fit=crop',
      category: 'Kedi',
      weight: '1 kg',
    },
    {
      id: 8,
      name: 'Hassas Kedi Maması',
      description: 'Hassas mideleri olan kediler için kolayca sindirilir',
      price: 125,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1591768575646-e48764c36b37?w=400&h=400&fit=crop',
      category: 'Kedi',
      weight: '1 kg',
    },
  ];

  const currentFoods = selectedTab === 'dog' ? dogFoods : catFoods;

  const handleDonate = (item) => {
    navigation.navigate('ProductDetail', { product: item });
  };

  const handleCardPress = (item) => {
    navigation.navigate('ProductDetail', { product: item });
  };

  const renderFoodCard = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.foodCard}
      activeOpacity={0.7}
      onPress={() => handleCardPress(item)}
    >
      <Image 
        source={{ uri: item.image }}
        style={styles.foodImage}
        resizeMode="cover"
      />
      
      <View style={styles.foodInfo}>
        <View style={styles.foodHeader}>
          <Text style={styles.foodName}>{item.name}</Text>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>
              {item.price} ₺/{item.unit}
            </Text>
          </View>
        </View>
        
        <Text style={styles.foodDescription}>{item.description}</Text>
        
        <View style={styles.foodFooter}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{selectedTab === 'dog' ? '🐕' : '🐱'}</Text>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Text style={styles.weightText}>• {item.weight}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.donateButton}
            activeOpacity={0.7}
            onPress={() => handleDonate(item)}
          >
            <Text style={styles.donateButtonText}>Bağışla</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.xs }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mama Bağışı</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'cat' && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab('cat')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>🐱</Text>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'cat' && styles.tabTextActive,
            ]}
          >
            Kedi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'dog' && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab('dog')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>🐕</Text>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'dog' && styles.tabTextActive,
            ]}
          >
            Köpek
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gradient Transition */}
      <LinearGradient
        colors={[COLORS.white, COLORS.background]}
        style={styles.gradient}
      />

      {/* Food List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentFoods.map((item) => renderFoodCard(item))}
        
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
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
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.accentLight,
    gap: SPACING.xs,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  gradient: {
    height: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingTop: 0,
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.md,
    paddingLeft: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: 80,
    alignSelf: 'stretch',
    borderRadius: 12,
    marginRight: SPACING.md,
    backgroundColor: COLORS.lightGray,
  },
  foodInfo: {
    flex: 1,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  foodName: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  priceTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.white,
  },
  foodDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  foodFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  weightText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  donateButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  donateButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default DonationScreen;

