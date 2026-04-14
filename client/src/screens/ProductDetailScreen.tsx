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
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import type { StackScreenProps } from '@react-navigation/stack';
import type { MapStackParamList } from '../types/navigation';
import type { ProductRecord } from '../types/domain';

const { width } = Dimensions.get('window');

type ProductDetailScreenProps = StackScreenProps<MapStackParamList, 'ProductDetail'>;

type ProductDetailView = Partial<ProductRecord> & {
  image?: string;
  category?: string;
  weight?: string;
};

const ProductDetailScreen = ({ route, navigation }: ProductDetailScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const product = (route.params?.product as ProductDetailView | undefined) ?? {
    name: 'Ürün',
    price: 0,
    description: '',
  };
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const totalPrice = product.price * quantity;

  const handleDonate = () => {
    navigation.navigate('Payment', { amount: totalPrice });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.xs }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image ?? product.image_url ?? undefined }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productSubtitle}>
            {product.category === 'Köpek' ? 'Premium Dog' : 'Premium Cat'} • {product.weight}
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Miktar Seçin</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecrease}
                activeOpacity={0.7}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>

              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantity} kg</Text>
                <Text style={styles.quantityPrice}>{product.price} ₺ / kg</Text>
                <Text style={styles.quantityTotal}>Toplam: {totalPrice} ₺</Text>
              </View>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrease}
                activeOpacity={0.7}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoIcon}>📦</Text>
              <Text style={styles.sectionTitle}>İçerik Bilgisi</Text>
            </View>

            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>%28</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Yağ</Text>
                <Text style={styles.nutritionValue}>%15</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Kül</Text>
                <Text style={styles.nutritionValue}>%8</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Ham Lif</Text>
                <Text style={styles.nutritionValue}>%3.5</Text>
              </View>
            </View>

            <View style={styles.ingredientsContainer}>
              <Text style={styles.ingredientsLabel}>İçindekiler</Text>
              <Text style={styles.ingredientsText}>
                Tavuk eti, Pirinç, Mısır, Balık yağı, Vitamin ve mineraller, Prebiyotikler
              </Text>
            </View>
          </View>

          <View style={[styles.section, styles.impactSection]}>
            <View style={styles.impactIcon}>
              <Text style={styles.impactIconText}>❤️</Text>
            </View>
            <View style={styles.impactContent}>
              <Text style={styles.impactTitle}>Bağışınızın Etkisi</Text>
              <Text style={styles.impactText}>
                Bu bağışla yaklaşık {Math.floor(quantity * 4)}-{Math.ceil(quantity * 5)} sokak hayvanının 1 hafta boyunca beslenmesine destek olacaksınız.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.donateButton}
            onPress={handleDonate}
            activeOpacity={0.8}
          >
            <Text style={styles.donateButtonText}>Bağış Yap</Text>
          </TouchableOpacity>

          <View style={{ height: insets.bottom + SPACING.lg }} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  imageContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  productImage: {
    width: '100%',
    height: width * 0.75,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
  },
  productName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  productSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    borderRadius: 16,
    padding: SPACING.md,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  quantityDisplay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  quantityPrice: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  quantityTotal: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  descriptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    padding: SPACING.md,
  },
  nutritionLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  ingredientsContainer: {
    backgroundColor: '#FFF5E6',
    borderRadius: 12,
    padding: SPACING.md,
  },
  ingredientsLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  ingredientsText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  impactSection: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  impactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  impactIconText: {
    fontSize: 28,
  },
  impactContent: {
    flex: 1,
  },
  impactTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  impactText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    lineHeight: 20,
    opacity: 0.9,
  },
  donateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  donateButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default ProductDetailScreen;
