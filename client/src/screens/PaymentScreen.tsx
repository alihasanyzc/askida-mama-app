import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import type { StackScreenProps } from '@react-navigation/stack';
import type { MapStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

// Mock kart verileri
type PaymentScreenProps = StackScreenProps<MapStackParamList, 'Payment'>;

type MockCard = {
  id: number;
  type: 'mastercard' | 'visa';
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cardType: string;
};

const MOCK_CARDS: MockCard[] = [
  {
    id: 1,
    type: 'mastercard',
    cardNumber: '7041',
    cardholderName: 'AHMET YILMAZ',
    expiryDate: '09/25',
    cardType: 'Banka Kartı',
  },
  {
    id: 2,
    type: 'visa',
    cardNumber: '4532',
    cardholderName: 'AHMET YILMAZ',
    expiryDate: '12/26',
    cardType: 'Banka Kartı',
  },
];

const PaymentScreen = ({ route, navigation }: PaymentScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const { amount } = route.params || { amount: 50 };
  const [selectedCard, setSelectedCard] = useState<MockCard | null>(null);

  const handleAddNewCard = () => {
    // Yeni kart ekleme ekranına yönlendirme
    console.log('Yeni kart ekle');
  };

  const handleMakePayment = () => {
    if (!selectedCard) {
      alert('Lütfen bir kart seçin');
      return;
    }
    // Ödeme işlemi
    console.log('Ödeme yapılıyor:', { amount, card: selectedCard });
    // Başarılı ödeme sonrası geri dön
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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, SPACING.xs) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Kayıtlı Kartlarım Section */}
        <Text style={styles.sectionTitle}>Kayıtlı Kartlarım</Text>

        {/* Cards List */}
        <View style={styles.cardsContainer}>
          {MOCK_CARDS.map((card) => {
            const isSelected = selectedCard?.id === card.id;
            return (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                { backgroundColor: isSelected ? '#FF8C42' : '#1A1A2E' },
                isSelected && styles.cardSelected,
              ]}
              onPress={() => setSelectedCard(card)}
              activeOpacity={0.9}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                {card.type === 'mastercard' ? (
                  <View style={styles.mastercardLogo}>
                    <View style={[styles.mastercardCircle, styles.mastercardCircleRed]} />
                    <View style={[styles.mastercardCircle, styles.mastercardCircleOrange]} />
                  </View>
                ) : (
                  <Text style={styles.visaLogo}>VISA</Text>
                )}
                <Text
                  style={styles.cardExpiry}
                >
                  {card.expiryDate}
                </Text>
              </View>

              {/* Card Number */}
              <View style={styles.cardNumberContainer}>
                <Text
                  style={styles.cardNumber}
                >
                  .... .... .... {card.cardNumber}
                </Text>
              </View>

              {/* Card Footer */}
              <View style={styles.cardFooter}>
                <Text
                  style={styles.cardholderName}
                >
                  {card.cardholderName}
                </Text>
                <Text
                  style={styles.cardType}
                >
                  {card.cardType}
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

        <TouchableOpacity
          style={[
            styles.paymentButton,
            !selectedCard && styles.paymentButtonDisabled,
          ]}
          onPress={handleMakePayment}
          disabled={!selectedCard}
          activeOpacity={0.8}
        >
          <Text style={styles.paymentButtonText}>Bağış Yap</Text>
        </TouchableOpacity>
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
  paymentButton: {
    height: 62,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    width: '100%',
    marginTop: SPACING.md,
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
});

export default PaymentScreen;
