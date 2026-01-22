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

const { width } = Dimensions.get('window');

const ClinicDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { clinic } = route.params;
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

  const amounts = [1000, 2000, 3000, 4000];

  const handleAmountSelect = (amount) => {
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
        <Text style={styles.headerTitle}>Bağış Tutarı</Text>
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
            source={{ uri: clinic.image }}
            style={styles.clinicImage}
            resizeMode="cover"
          />
        </View>

        {/* Clinic Info */}
        <View style={styles.clinicInfoSection}>
          <Text style={styles.clinicName}>{clinic.name}</Text>
          <Text style={styles.clinicDescription}>{clinic.description}</Text>
        </View>

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

        {/* Donation Usage Area */}
        <View style={styles.usageSection}>
          <View style={styles.usageIcon}>
            <Text style={styles.usageIconText}>❤️</Text>
          </View>
          <View style={styles.usageContent}>
            <Text style={styles.usageTitle}>Bağışınızın Kullanım Alanı</Text>
            <Text style={styles.usageText}>
              Bağışınız sokak hayvanlarının ameliyat, tedavi ve bakım masraflarında kullanılacaktır.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Donate Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <TouchableOpacity
          style={[
            styles.donateButton,
            !isDonationValid && styles.donateButtonDisabled,
          ]}
          onPress={handleDonate}
          disabled={!isDonationValid}
          activeOpacity={0.8}
        >
          <Text style={styles.donateButtonText}>
            {isDonationValid 
              ? `Bağış Yap (${selectedAmount || customAmount} ₺)` 
              : 'Bağış Yap'}
          </Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#FFF5E6',
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
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
  usageSection: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  usageIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  usageIconText: {
    fontSize: 28,
  },
  usageContent: {
    flex: 1,
  },
  usageTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  usageText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    lineHeight: 20,
    opacity: 0.9,
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  donateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  donateButtonDisabled: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  donateButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default ClinicDetailScreen;

