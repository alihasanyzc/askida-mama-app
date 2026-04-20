import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import type { StackScreenProps } from '@react-navigation/stack';
import type { MapStackParamList } from '../types/navigation';
import type { PaymentMethodRecord } from '../types/domain';
import { createDonation, type CreateDonationResult } from '../services/donations';
import { createBowlDonation } from '../services/bowls';
import { listPaymentMethods } from '../services/paymentMethods';
import { formatCurrency } from '../utils/formatters';

type PaymentScreenProps = StackScreenProps<MapStackParamList, 'Payment'>;

type PaymentSuccessState = {
  donationAmount: number;
  totalAmount: number;
};

function getCardBackground(brand: string, isSelected: boolean) {
  if (isSelected) {
    return COLORS.primary;
  }

  switch (brand) {
    case 'visa':
      return '#14213D';
    case 'troy':
      return '#263238';
    case 'amex':
      return '#006D77';
    case 'mastercard':
    default:
      return '#1A1A2E';
  }
}

const PaymentScreen = ({ route, navigation }: PaymentScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const { amount } = route.params || { amount: 50 };
  const bowlId = route.params?.bowlId;
  const preferredSelectedCardId = route.params?.selectedPaymentMethodId;
  const [savedCards, setSavedCards] = useState<PaymentMethodRecord[]>([]);
  const [selectedCard, setSelectedCard] = useState<PaymentMethodRecord | null>(null);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [successResult, setSuccessResult] = useState<PaymentSuccessState | null>(null);
  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.85)).current;

  const fetchSavedCards = useCallback(async () => {
    setIsLoadingCards(true);

    try {
      const cards = await listPaymentMethods();
      setSavedCards(cards);
      setSelectedCard((currentCard) => {
        const preferredCard = cards.find((card) => card.id === preferredSelectedCardId);
        const updatedCurrentCard = cards.find((card) => card.id === currentCard?.id);

        if (preferredCard) {
          return preferredCard;
        }

        if (updatedCurrentCard) {
          return updatedCurrentCard;
        }

        return cards[0] ?? null;
      });
    } catch {
      Alert.alert('Kartlar yüklenemedi', 'Kayıtlı kartlar alınırken bir hata oluştu.');
    } finally {
      setIsLoadingCards(false);
    }
  }, [preferredSelectedCardId]);

  useFocusEffect(useCallback(() => {
    void fetchSavedCards();
  }, [fetchSavedCards]));

  const handleAddNewCard = () => {
    navigation.navigate('AddPaymentMethod', { amount, bowlId });
  };

  const showPaymentSuccess = (result: PaymentSuccessState) => {
    successOpacity.setValue(0);
    successScale.setValue(0.85);
    setSuccessResult(result);

    Animated.parallel([
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(successScale, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleMakePayment = async () => {
    if (!selectedCard) {
      Alert.alert('Kart seçin', 'Lütfen bir kart seçin veya yeni kart ekleyin.');
      return;
    }

    if (!amount || amount <= 0) {
      Alert.alert('Tutar geçersiz', 'Bağış tutarı geçerli değil.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      if (bowlId) {
        const result = await createBowlDonation(bowlId, {
          amount,
          payment_method_id: selectedCard.id,
        });

        showPaymentSuccess({
          donationAmount: result.donation.amount,
          totalAmount: result.donation_summary.user_total_amount,
        });
      } else {
        const result: CreateDonationResult = await createDonation({
          amount,
          payment_method_id: selectedCard.id,
        });

        showPaymentSuccess({
          donationAmount: result.donation.amount,
          totalAmount: result.user_summary.total_amount,
        });
      }
    } catch {
      Alert.alert('Ödeme alınamadı', 'Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCloseSuccess = () => {
    navigation.goBack();
  };

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
        <Text style={styles.headerTitle}>Ödeme</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Kayıtlı Kartlarım Section */}
        <Text style={styles.sectionTitle}>Kayıtlı Kartlarım</Text>

        {/* Cards List */}
        <View style={styles.cardsContainer}>
          {isLoadingCards ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={COLORS.primary} />
              <Text style={styles.loadingText}>Kartlar yükleniyor</Text>
            </View>
          ) : savedCards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>Kayıtlı kart yok</Text>
              <Text style={styles.emptyStateText}>Bağış yapmak için yeni kart ekleyin.</Text>
            </View>
          ) : savedCards.map((card) => {
            const isSelected = selectedCard?.id === card.id;
            return (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                { backgroundColor: getCardBackground(card.brand, isSelected) },
                isSelected && styles.cardSelected,
              ]}
              onPress={() => setSelectedCard(card)}
              activeOpacity={0.9}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                {card.brand === 'mastercard' ? (
                  <View style={styles.mastercardLogo}>
                    <View style={[styles.mastercardCircle, styles.mastercardCircleRed]} />
                    <View style={[styles.mastercardCircle, styles.mastercardCircleOrange]} />
                  </View>
                ) : card.brand === 'visa' ? (
                  <Text style={styles.visaLogo}>VISA</Text>
                ) : (
                  <Text style={styles.brandLogo}>{card.brand.toUpperCase()}</Text>
                )}
                <Text
                  style={styles.cardExpiry}
                >
                  {card.expiry_date}
                </Text>
              </View>

              {/* Card Number */}
              <View style={styles.cardNumberContainer}>
                <Text
                  style={styles.cardNumber}
                >
                  {card.masked_number}
                </Text>
              </View>

              {/* Card Footer */}
              <View style={styles.cardFooter}>
                <Text
                  style={styles.cardholderName}
                >
                  {card.cardholder_name}
                </Text>
                <Text
                  style={styles.cardType}
                >
                  {card.card_type ?? 'Kart'}
                </Text>
              </View>

            </TouchableOpacity>
            );
          })}
        </View>

        {/* Add New Card Button */}
        <TouchableOpacity
          style={styles.addCardButton}
          onPress={handleAddNewCard}
          activeOpacity={0.7}
        >
          <Text style={styles.addCardIcon}>+</Text>
          <Text style={styles.addCardText}>Yeni Kart Ekle</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, SPACING.md) }]}>
        <TouchableOpacity
          style={[
            styles.paymentButton,
            (!selectedCard || isLoadingCards || isProcessingPayment) && styles.paymentButtonDisabled,
          ]}
          onPress={handleMakePayment}
          disabled={!selectedCard || isLoadingCards || isProcessingPayment}
          activeOpacity={0.8}
        >
          {isProcessingPayment ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.paymentButtonText}>Bağış Yap</Text>
          )}
        </TouchableOpacity>
      </View>

      {successResult && (
        <Animated.View style={[styles.successOverlay, { opacity: successOpacity }]}>
          <Animated.View
            style={[
              styles.successCard,
              {
                transform: [{ scale: successScale }],
              },
            ]}
          >
            <View style={styles.successIconWrap}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Ödemeniz alındı</Text>
            <Text style={styles.successMessage}>Bağışınız için teşekkür ederiz.</Text>
            <Text style={styles.successAmount}>
              {formatCurrency(successResult.donationAmount)}
            </Text>
            <Text style={styles.successSummary}>
              Toplam bağışınız {formatCurrency(successResult.totalAmount)}
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleCloseSuccess}
              activeOpacity={0.85}
            >
              <Text style={styles.successButtonText}>Tamam</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
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
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  cardsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  loadingContainer: {
    minHeight: 120,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  emptyState: {
    minHeight: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    padding: SPACING.lg,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  mastercardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mastercardCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: -10,
  },
  mastercardCircleRed: {
    backgroundColor: '#EB001B',
    zIndex: 2,
  },
  mastercardCircleOrange: {
    backgroundColor: '#F79E1B',
    zIndex: 1,
  },
  visaLogo: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 2,
  },
  brandLogo: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
  },
  cardExpiry: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    fontWeight: '500',
  },
  cardNumberContainer: {
    marginBottom: SPACING.lg,
  },
  cardNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardholderName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  cardType: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: '500',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    paddingVertical: SPACING.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FFE0B2',
    marginTop: SPACING.sm,
  },
  addCardIcon: {
    fontSize: FONT_SIZES.xxl,
    color: '#795548',
    marginRight: SPACING.sm,
    fontWeight: '300',
  },
  addCardText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: '#795548',
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  paymentButton: {
    height: 62,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    width: '100%',
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  paymentButtonDisabled: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  paymentButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.white,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  successCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 12,
  },
  successIconWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  successIcon: {
    fontSize: 42,
    color: COLORS.success,
    fontWeight: '900',
  },
  successTitle: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
    fontWeight: '900',
    marginBottom: SPACING.xs,
  },
  successMessage: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  successAmount: {
    fontSize: FONT_SIZES.xxxl,
    color: COLORS.primary,
    fontWeight: '900',
    marginBottom: SPACING.sm,
  },
  successSummary: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  successButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  successButtonText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    fontWeight: '900',
  },
});

export default PaymentScreen;
