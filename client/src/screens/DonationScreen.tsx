import React, { useState } from 'react';
import {
  PanResponder,
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
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import type { StackScreenProps } from '@react-navigation/stack';
import type { MapStackParamList } from '../types/navigation';
import type { ProductRecord } from '../types/domain';

const TAB_ICON_SIZE = 28;

const { width } = Dimensions.get('window');

type DonationScreenProps = StackScreenProps<MapStackParamList, 'Donation'>;

type DonationProduct = ProductRecord & {
  id: string;
  image: string;
  category: string;
  unit: string;
  weight: string;
};

const DonationScreen = ({ route, navigation }: DonationScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const { type } = route?.params || { type: 'food' };
  const [selectedTab, setSelectedTab] = useState<'cat' | 'dog'>('cat');
  const swipeResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gestureState) =>
      Math.abs(gestureState.dx) > 24 &&
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.4,
    onPanResponderRelease: (_event, gestureState) => {
      if (Math.abs(gestureState.dx) > 90 && Math.abs(gestureState.vx) > 0.2) {
        navigation.goBack();
      }
    },
  });

  const dogFoods: DonationProduct[] = [
    {
      id: '1',
      name: 'Yavru Köpek Maması (Puppy)',
      description: 'Yavru köpekler için büyüme ve gelişim desteği',
      price: 115,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop',
      category: 'Köpek',
      weight: '1 kg',
    },
    {
      id: '2',
      name: 'Yetişkin Köpek Maması',
      description: 'Yetişkin köpekler için tam ve dengeli beslenme',
      price: 100,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400&h=400&fit=crop',
      category: 'Köpek',
      weight: '1 kg',
    },
    {
      id: '3',
      name: 'Büyük Irk Köpek Maması',
      description: 'Büyük ırklar için eklem sağlığı destekli mama',
      price: 130,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=400&fit=crop',
      category: 'Köpek',
      weight: '1 kg',
    },
    {
      id: '4',
      name: 'Küçük Irk Köpek Maması',
      description: 'Küçük ırk köpekler için küçük taneli mama',
      price: 105,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1591768575646-e48764c36b37?w=400&h=400&fit=crop',
      category: 'Köpek',
      weight: '1 kg',
    },
  ];

  const catFoods: DonationProduct[] = [
    {
      id: '5',
      name: 'Yavru Kedi Maması (Kitten)',
      description: 'Yavru kediler için büyüme ve gelişim desteği',
      price: 110,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop',
      category: 'Kedi',
      weight: '1 kg',
    },
    {
      id: '6',
      name: 'Yetişkin Kedi Maması',
      description: 'Yetişkin kediler için tam ve dengeli beslenme',
      price: 95,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400&h=400&fit=crop',
      category: 'Kedi',
      weight: '1 kg',
    },
    {
      id: '7',
      name: 'Kısırlaştırılmış Kedi Maması',
      description: 'Kısırlaştırılmış kediler için özel formül',
      price: 120,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=400&fit=crop',
      category: 'Kedi',
      weight: '1 kg',
    },
    {
      id: '8',
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

  const openProductDetail = (item: DonationProduct) => {
    navigation.navigate('ProductDetail', {
      product: item,
      products: currentFoods,
      initialIndex: Math.max(0, currentFoods.findIndex((food) => food.id === item.id)),
    });
  };

  const handleDonate = (item: DonationProduct) => {
    openProductDetail(item);
  };

  const handleCardPress = (item: DonationProduct) => {
    openProductDetail(item);
  };

  const renderFoodCard = (item: DonationProduct) => (
    <TouchableOpacity
      key={item.id}
      style={styles.foodCard}
      activeOpacity={0.7}
      onPress={() => handleCardPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.foodImage} resizeMode="cover" />

      <View style={styles.foodInfo}>
        <Text style={styles.foodName} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.foodDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.foodFooter}>
          <Text style={styles.priceText}>{item.price} ₺</Text>

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
    <View style={styles.container} {...swipeResponder.panHandlers}>
      <View style={styles.content}>
        <View style={[styles.topBar, { paddingTop: insets.top + SPACING.xs }]}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={COLORS.secondary} />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'cat' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('cat')}
          activeOpacity={0.7}
        >
          <FontAwesome5
            name="cat"
            size={TAB_ICON_SIZE}
            color={selectedTab === 'cat' ? COLORS.white : COLORS.text}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'dog' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('dog')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="dog-side"
            size={TAB_ICON_SIZE}
            color={selectedTab === 'dog' ? COLORS.white : COLORS.text}
          />
        </TouchableOpacity>
        </View>

        <LinearGradient colors={[COLORS.white, COLORS.background]} style={styles.gradient} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentFoods.map((item) => renderFoodCard(item))}
          <View style={{ height: SPACING.xl }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
    height: 40,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.accentLight,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
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
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 120,
  },
  foodImage: {
    width: 88,
    height: 88,
    borderRadius: 12,
    marginRight: SPACING.md,
    backgroundColor: COLORS.lightGray,
  },
  foodInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  foodDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  foodFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  priceText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
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
