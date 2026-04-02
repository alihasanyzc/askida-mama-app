import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import type { StackScreenProps } from '@react-navigation/stack';
import type { MapStackParamList } from '../types/navigation';

const { width, height } = Dimensions.get('window');

type QRScannerScreenProps = StackScreenProps<MapStackParamList, 'QRScanner'>;

const QRScannerScreen = ({ navigation }: QRScannerScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scanning animation
    const scanAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    scanAnimation.start();

    // QR kod okutma simülasyonu - 3 saniye sonra detay sayfasına git
    const timer = setTimeout(() => {
      const mockBowlData = {
        id: '1',
        status: 'full',
        location_note: 'Yunus Emre Mahallesi, Kale Sokak No:12',
        location_description: 'Pamukkale, Denizli',
      };
      navigation.replace('BowlDetail', { bowl: mockBowlData });
    }, 3000);

    return () => {
      scanAnimation.stop();
      clearTimeout(timer);
    };
  }, [navigation, scanLineAnim]);

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QR Kod Okut</Text>
      </View>

      {/* Scanner Area */}
      <View style={styles.scannerContainer}>
        <Text style={styles.instructionText}>
          QR kodu kare içine yerleştirin
        </Text>

        {/* Scanner Frame */}
        <View style={styles.scannerFrame}>
          {/* Corner decorations */}
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />

          {/* Animated scan line */}
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [{ translateY: scanLineTranslateY }],
              },
            ]}
          />

          {/* QR Icon in center */}
          <View style={styles.qrIconContainer}>
            <Text style={styles.qrIconText}>📱</Text>
          </View>
        </View>

        <Text style={styles.scanningText}>Taranıyor...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  instructionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
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
  scanLine: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    height: 3,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  qrIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrIconText: {
    fontSize: 48,
  },
  scanningText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: SPACING.xl,
  },
});

export default QRScannerScreen;
