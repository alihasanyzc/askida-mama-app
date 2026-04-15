import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';

import { COLORS, FONT_SIZES, SPACING } from '../constants';
import type { ProductRecord } from '../types/domain';
import type { MapStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');
const carouselWidth = width - SPACING.lg * 2;

type ProductDetailScreenProps = StackScreenProps<MapStackParamList, 'ProductDetail'>;

type ProductDetailView = Partial<ProductRecord> & {
  image?: string;
};

function getAnimalLabel(product: ProductDetailView) {
  if (product.animal_type === 'dog' || product.category === 'Köpek') {
    return 'Köpek Maması';
  }

  if (product.animal_type === 'cat' || product.category === 'Kedi') {
    return 'Kedi Maması';
  }

  return 'Mama Ürünü';
}

const ProductDetailScreen = ({ route, navigation }: ProductDetailScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const product = (route.params?.product as ProductDetailView | undefined) ?? {
    name: 'Mama ürünü',
    price: 0,
    description: 'Ürün açıklaması bulunamadı.',
    nutrition_info: null,
  };
  const products =
    (route.params?.products as ProductDetailView[] | undefined)?.length
      ? (route.params?.products as ProductDetailView[])
      : [product];
  const [selectedIndex, setSelectedIndex] = useState(
    Math.min(Math.max(route.params?.initialIndex ?? 0, 0), products.length - 1),
  );
  const detailProduct = product;

  const [quantity, setQuantity] = useState(1);
  const animalLabel = getAnimalLabel(detailProduct);
  const nutritionInfo = detailProduct.nutrition_info?.trim() || 'Bu ürün için besin bilgisi eklenmemiş.';
  const productPrice = detailProduct.price ?? 0;
  const totalPrice = productPrice * quantity;

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const increaseQuantity = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const handleDonate = () => {
    navigation.navigate('Payment', { amount: totalPrice });
  };

  const handleImageSwipe = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / carouselWidth);
    setSelectedIndex(Math.min(Math.max(nextIndex, 0), products.length - 1));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, SPACING.sm) }]}
      >
        <View style={[styles.topBar, { paddingTop: insets.top + SPACING.xs }]}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={COLORS.secondary} />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.productName}>{detailProduct.name}</Text>
          <Text style={styles.productCategory}>{animalLabel}</Text>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageCarousel}
            contentOffset={{ x: selectedIndex * carouselWidth, y: 0 }}
            onMomentumScrollEnd={handleImageSwipe}
          >
            {products.map((item, index) => {
              const itemImageUri = item.image_url ?? item.image;

              return (
                <View key={`${item.id ?? item.name ?? 'product'}-${index}`} style={styles.imageWrap}>
                  {itemImageUri ? (
                    <Image source={{ uri: itemImageUri }} style={styles.productImage} resizeMode="contain" />
                  ) : (
                    <View style={[styles.productImage, styles.imageFallback]}>
                      <MaterialCommunityIcons name="food-drumstick-outline" size={58} color={COLORS.primary} />
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.sliderDots}>
            {products.map((item, index) => (
              <View
                key={`${item.id ?? item.name ?? 'dot'}-${index}`}
                style={[styles.dot, selectedIndex === index && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.descriptionText}>{detailProduct.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Besin Bilgisi</Text>
            <Text style={styles.nutritionText}>{nutritionInfo}</Text>
          </View>

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Fiyat:</Text>
              <Text style={styles.priceValue}>{totalPrice} ₺</Text>
              <Text style={styles.unitPriceText}>{productPrice} ₺ / adet</Text>
            </View>
            <View style={styles.quantityControl}>
              <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity} activeOpacity={0.75}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity} activeOpacity={0.75}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85} onPress={handleDonate}>
            <Text style={styles.ctaText}>Bağış Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md,
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
  hero: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  productCategory: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  imageCarousel: {
    width: carouselWidth,
    marginTop: SPACING.lg,
  },
  imageWrap: {
    width: carouselWidth,
    height: width * 0.78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: COLORS.accentLight,
  },
  sliderDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.lightGray,
  },
  dotActive: {
    width: 28,
    backgroundColor: COLORS.primary,
  },
  content: {
    paddingBottom: 0,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: SPACING.md,
  },
  descriptionText: {
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  priceLabel: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  priceValue: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.primary,
  },
  unitPriceText: {
    marginTop: 2,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  quantityButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  quantityButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '900',
    color: COLORS.primary,
    lineHeight: 24,
  },
  quantityText: {
    minWidth: 34,
    textAlign: 'center',
    fontSize: FONT_SIZES.md,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  nutritionText: {
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  ctaButton: {
    height: 62,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  ctaText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.white,
  },
});

export default ProductDetailScreen;
