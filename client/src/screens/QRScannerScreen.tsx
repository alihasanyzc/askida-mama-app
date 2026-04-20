import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AxiosError } from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';

import { COLORS, FONT_SIZES, SPACING } from '../constants';
import { getBowlDetailByQrCode, normalizeQrCode } from '../services/bowls';
import type { MapStackParamList } from '../types/navigation';

type QRScannerScreenProps = StackScreenProps<MapStackParamList, 'QRScanner'>;

const QRScannerScreen = ({ navigation }: QRScannerScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const [qrCode, setQrCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isSubmitDisabled = useMemo(
    () => isSubmitting || normalizeQrCode(qrCode).length === 0,
    [isSubmitting, qrCode],
  );

  const handleSubmit = async () => {
    const normalizedQrCode = normalizeQrCode(qrCode);

    if (!normalizedQrCode) {
      setErrorMessage('QR kod bilgisini girin.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const bowl = await getBowlDetailByQrCode(normalizedQrCode);

      navigation.replace('BowlDetail', { bowl });
    } catch (error) {
      const status =
        error instanceof AxiosError ? error.response?.status : undefined;

      if (status === 404) {
        setErrorMessage('Bu QR koda ait mama kabi bulunamadi.');
      } else {
        setErrorMessage('QR kod verisi alinamadi. Lutfen tekrar deneyin.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QR Kod Okut</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>
          <View style={styles.scannerCard}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />

              <View style={styles.qrIconContainer}>
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={56}
                  color={COLORS.primary}
                />
              </View>
            </View>

            <Text style={styles.instructionText}>
              QR kod verisini girin. Ornek format: BOWL-9F80C8CE
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>QR Kod</Text>
            <TextInput
              style={styles.input}
              placeholder="Orn: BOWL-9F80C8CE"
              placeholderTextColor="#8C8C8C"
              value={qrCode}
              onChangeText={(value) => {
                setQrCode(value);
                if (errorMessage) {
                  setErrorMessage('');
                }
              }}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TouchableOpacity
              style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Devam Et</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'center',
  },
  scannerCard: {
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  scannerFrame: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 280,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: COLORS.primary,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  qrIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    marginTop: SPACING.lg,
    fontSize: FONT_SIZES.md,
    lineHeight: 21,
    color: 'rgba(255, 255, 255, 0.72)',
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 20,
    backgroundColor: '#FFF8F1',
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#F0E1CF',
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  input: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E8DCCF',
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.secondary,
  },
  errorText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.danger,
  },
  submitButton: {
    minHeight: 54,
    marginTop: SPACING.md,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default QRScannerScreen;
