import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import type { StackScreenProps } from '@react-navigation/stack';
import type { MapStackParamList } from '../types/navigation';
import type { ClinicRecord } from '../types/domain';
import { formatPhone } from '../utils/formatters';

const { width } = Dimensions.get('window');

type ClinicDetailScreenProps = StackScreenProps<MapStackParamList, 'ClinicDetail'>;

type ClinicDetailView = Partial<ClinicRecord> & {
  image?: string;
};

const ClinicDetailScreen = ({ route, navigation }: ClinicDetailScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const clinic = (route.params?.clinic as ClinicDetailView | undefined) ?? {};
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const amounts = [1000, 2000, 3000, 4000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleDecrease = () => {
    const currentAmount = parseFloat(customAmount) || 0;
    if (currentAmount >= 1000) {
      const newAmount = currentAmount - 1000;
      setCustomAmount(newAmount.toString());
      setSelectedAmount(null);
    }
  };

  const handleIncrease = () => {
    const currentAmount = parseFloat(customAmount) || 0;
    const newAmount = currentAmount + 1000;
    setCustomAmount(newAmount.toString());
    setSelectedAmount(null);
  };

  const handleDonate = () => {
    const finalAmount = selectedAmount || parseFloat(customAmount) || 0;
    if (finalAmount > 0) {
      navigation.navigate('Payment', { amount: finalAmount });
    }
  };

  const isDonationValid = selectedAmount !== null || (customAmount && parseFloat(customAmount) > 0);
  const addressText =
    clinic.address_line?.trim() ||
    [clinic.neighborhood, clinic.district, clinic.city].filter(Boolean).join(', ');

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
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Clinic Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: clinic.image ?? clinic.image_url ?? undefined }}
            style={styles.clinicImage}
            resizeMode="cover"
          />
        </View>

        {/* Clinic Info */}
        <View style={styles.clinicInfoSection}>
          <Text style={styles.clinicName}>{clinic.name ?? 'Klinik'}</Text>
          <Text style={styles.clinicDescription}>{clinic.description ?? ''}</Text>
        </View>

        {addressText ? (
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Adres</Text>
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>📍</Text>
              <Text style={styles.contactText}>{addressText}</Text>
            </View>
          </View>
        ) : null}

        {clinic.phone ? (
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>İletişim</Text>
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>📞</Text>
              <Text style={styles.contactText}>{formatPhone(clinic.phone)}</Text>
            </View>
          </View>
        ) : null}

        {/* Donation Amount Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bağış tutarı seçin</Text>
          
          {/* Amount Buttons Grid */}
          <View style={styles.amountGrid}>
            {amounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.amountButton,
                  selectedAmount === amount && styles.amountButtonSelected,
                ]}
                onPress={() => handleAmountSelect(amount)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.amountButtonText,
                    selectedAmount === amount && styles.amountButtonTextSelected,
                  ]}
                >
                  {amount} ₺
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount */}
          <Text style={styles.customAmountLabel}>veya özel tutar girin</Text>
          <View style={styles.customAmountContainer}>
            <TouchableOpacity
              style={styles.amountControlButton}
              onPress={handleDecrease}
              activeOpacity={0.7}
            >
              <Text style={styles.amountControlButtonText}>−</Text>
            </TouchableOpacity>
            
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.customAmountInput}
                placeholder="Tutarı giriniz"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={customAmount}
                onChangeText={(text) => {
                  const numValue = parseFloat(text) || 0;
                  if (numValue >= 0) {
                    setCustomAmount(text);
                    setSelectedAmount(null);
                  }
                }}
                editable={false}
              />
              <Text style={styles.currencySymbol}>₺</Text>
            </View>
            
            <TouchableOpacity
              style={styles.amountControlButton}
              onPress={handleIncrease}
              activeOpacity={0.7}
            >
              <Text style={styles.amountControlButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Donate Button - end of scroll */}
        <View style={[styles.donateButtonWrapper, { paddingBottom: Math.max(insets.bottom, SPACING.xs) }]}>
          <TouchableOpacity
            style={[
              styles.donateButton,
              !isDonationValid && styles.donateButtonDisabled,
            ]}
            onPress={handleDonate}
            disabled={!isDonationValid}
            activeOpacity={0.8}
          >
            <Text style={styles.donateButtonText}>Bağış Yap</Text>
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
    borderRadius: 20,
    backgroundColor: '#FFF5E6',
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
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  clinicImage: {
    width: '100%',
    height: width * 0.6,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  clinicInfoSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  clinicName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  clinicDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  contactSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: '#FFF8F1',
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  contactIcon: {
    fontSize: FONT_SIZES.lg,
  },
  contactText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  amountButton: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    backgroundColor: '#FFF5E6',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF5E6',
  },
  amountButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  amountButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: '#795548',
  },
  amountButtonTextSelected: {
    color: COLORS.white,
  },
  customAmountLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  amountControlButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountControlButtonText: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.white,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingRight: SPACING.md,
  },
  customAmountInput: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  currencySymbol: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  donateButtonWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  donateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  donateButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  donateButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default ClinicDetailScreen;
