import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';

import { COLORS, FONT_SIZES, SPACING } from '../constants';
import { createPaymentMethod, type CreatePaymentMethodInput } from '../services/paymentMethods';
import type { MapStackParamList } from '../types/navigation';

type AddPaymentMethodScreenProps = StackScreenProps<MapStackParamList, 'AddPaymentMethod'>;

type CardBrand = CreatePaymentMethodInput['brand'];
type FocusedField = 'cardNumber' | 'expiryDate' | 'cvv' | 'cardholderName' | null;

type CardForm = {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

type ValidationResult =
  | {
      isValid: true;
      payload: CreatePaymentMethodInput;
    }
  | {
      isValid: false;
      title: string;
      message: string;
    };

const INITIAL_FORM: CardForm = {
  cardholderName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
};

function normalizeCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 19);
}

function formatCardNumber(value: string) {
  return normalizeCardNumber(value).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiryDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function normalizeCvv(value: string) {
  return value.replace(/\D/g, '').slice(0, 4);
}

function formatPreviewNumber(value: string) {
  const digits = normalizeCardNumber(value);
  const paddedDigits = digits.padEnd(16, '•').slice(0, 16);
  const groups = paddedDigits.match(/.{1,4}/g) ?? ['••••', '••••', '••••', '••••'];

  return groups.join(' - ');
}

function detectCardBrand(cardNumber: string): CardBrand | null {
  const normalizedCardNumber = normalizeCardNumber(cardNumber);

  if (/^9792/.test(normalizedCardNumber)) {
    return 'troy';
  }

  if (/^4/.test(normalizedCardNumber)) {
    return 'visa';
  }

  if (/^(5[1-5]|2[2-7])/.test(normalizedCardNumber)) {
    return 'mastercard';
  }

  if (/^3[47]/.test(normalizedCardNumber)) {
    return 'amex';
  }

  return null;
}

function parseExpiryDate(value: string) {
  const [monthValue, yearValue] = value.split('/');
  const expiryMonth = Number(monthValue);
  const shortYear = Number(yearValue);

  if (!expiryMonth || !shortYear || expiryMonth < 1 || expiryMonth > 12) {
    return null;
  }

  const expiryYear = 2000 + shortYear;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
    return null;
  }

  return {
    expiryMonth,
    expiryYear,
  };
}

function getBrandLabel(brand: CardBrand | null) {
  if (!brand) {
    return 'KART';
  }

  return brand.toUpperCase();
}

function validateCardForm(form: CardForm): ValidationResult {
  const cardholderName = form.cardholderName.trim();
  const cardNumber = normalizeCardNumber(form.cardNumber);
  const cvv = normalizeCvv(form.cvv);
  const expiryDate = parseExpiryDate(form.expiryDate);
  const brand = detectCardBrand(cardNumber);

  if (cardNumber.length < 12 || cardNumber.length > 19) {
    return {
      isValid: false,
      title: 'Kart numarası eksik',
      message: 'Kart numarasını 12-19 hane olacak şekilde tamamlayın.',
    };
  }

  if (!brand) {
    return {
      isValid: false,
      title: 'Kart desteklenmiyor',
      message: 'Visa, Mastercard, Troy veya Amex kart ekleyebilirsiniz.',
    };
  }

  if (!expiryDate) {
    return {
      isValid: false,
      title: 'Tarih geçersiz',
      message: 'Son kullanma tarihini AA/YY formatında ve ileri tarihli girin.',
    };
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    return {
      isValid: false,
      title: 'CVV eksik',
      message: 'Kartın arkasındaki 3 haneli güvenlik kodunu girin. Amex kartlarda 4 hane olabilir.',
    };
  }

  if (cardholderName.length < 2) {
    return {
      isValid: false,
      title: 'İsim eksik',
      message: 'Kart üzerindeki adı ve soyadı girin.',
    };
  }

  return {
    isValid: true,
    payload: {
      cardholder_name: cardholderName,
      card_number: cardNumber,
      expiry_month: expiryDate.expiryMonth,
      expiry_year: expiryDate.expiryYear,
      brand,
    },
  };
}

const AddPaymentMethodScreen = ({
  navigation,
  route,
}: AddPaymentMethodScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<CardForm>(INITIAL_FORM);
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const [isSaving, setIsSaving] = useState(false);

  const brand = useMemo(() => detectCardBrand(form.cardNumber), [form.cardNumber]);
  const previewNumber = useMemo(() => formatPreviewNumber(form.cardNumber), [form.cardNumber]);

  const updateForm = <Key extends keyof CardForm>(key: Key, value: CardForm[Key]) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    const validation = validateCardForm(form);

    if (validation.isValid === false) {
      Alert.alert(validation.title, validation.message);
      return;
    }

    setIsSaving(true);

    try {
      const createdCard = await createPaymentMethod(validation.payload);

      Alert.alert('Kart kaydedildi', 'Kartınız ödeme yöntemlerinize eklendi.', [
        {
          text: 'Tamam',
          onPress: () => navigation.navigate('Payment', {
            amount: route.params?.amount,
            selectedPaymentMethodId: createdCard.id,
            bowlId: route.params?.bowlId,
          }),
        },
      ]);
    } catch {
      Alert.alert('Kart kaydedilemedi', 'Kart bilgilerini kontrol edip tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.xs }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kart Ekle</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, SPACING.md) },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Kartını ekle</Text>

          <View style={styles.previewCard}>
            <View style={styles.previewTopRow}>
              <Text style={styles.previewType}>Güvenli kart kaydı</Text>
              <Text style={styles.previewBrand}>{getBrandLabel(brand)}</Text>
            </View>
            <View>
              <Text style={styles.previewName}>
                {form.cardholderName.trim() || 'AD SOYAD'}
              </Text>
              <Text style={styles.previewNumber}>{previewNumber}</Text>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.formLabel}>Kart Numarası</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'cardNumber' && styles.inputFocused,
              ]}
              value={form.cardNumber}
              onChangeText={(cardNumber) => updateForm('cardNumber', formatCardNumber(cardNumber))}
              onFocus={() => setFocusedField('cardNumber')}
              onBlur={() => setFocusedField(null)}
              keyboardType="number-pad"
              placeholder="xxxx - xxxx - xxxx - 4289"
              placeholderTextColor={COLORS.gray}
              maxLength={23}
              returnKeyType="next"
            />

            <View style={styles.formRow}>
              <View style={styles.formColumn}>
                <Text style={styles.formLabel}>Son Kullanma</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === 'expiryDate' && styles.inputFocused,
                  ]}
                  value={form.expiryDate}
                  onChangeText={(expiryDate) => updateForm('expiryDate', formatExpiryDate(expiryDate))}
                  onFocus={() => setFocusedField('expiryDate')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="number-pad"
                  placeholder="07/29"
                  placeholderTextColor={COLORS.gray}
                  maxLength={5}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.formColumn}>
                <Text style={styles.formLabel}>CVV</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === 'cvv' && styles.inputFocused,
                  ]}
                  value={form.cvv}
                  onChangeText={(cvv) => updateForm('cvv', normalizeCvv(cvv))}
                  onFocus={() => setFocusedField('cvv')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="number-pad"
                  placeholder="•••"
                  placeholderTextColor={COLORS.gray}
                  maxLength={4}
                  secureTextEntry
                  returnKeyType="next"
                />
              </View>
            </View>

            <Text style={styles.formLabel}>Kart Üzerindeki İsim</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'cardholderName' && styles.inputFocused,
              ]}
              value={form.cardholderName}
              onChangeText={(cardholderName) => updateForm('cardholderName', cardholderName)}
              onFocus={() => setFocusedField('cardholderName')}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="characters"
              placeholder="AD SOYAD"
              placeholderTextColor={COLORS.gray}
              returnKeyType="done"
            />

          </View>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            {isSaving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Kartı Kaydet</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 34,
    lineHeight: 34,
    color: COLORS.text,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSpacer: {
    width: 36,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  previewCard: {
    height: 200,
    borderRadius: 16,
    padding: SPACING.lg,
    backgroundColor: '#1A1A2E',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  previewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewType: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.82)',
    fontWeight: '700',
  },
  previewBrand: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
    fontWeight: '900',
    letterSpacing: 1,
  },
  previewName: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  previewNumber: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  formLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFDF9',
  },
  formRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  formColumn: {
    flex: 1,
  },
  saveButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.gray,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '900',
    color: COLORS.white,
  },
});

export default AddPaymentMethodScreen;
