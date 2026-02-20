/**
 * ============================================================================
 * BOWL BOTTOM SHEET COMPONENT
 * ============================================================================
 * Mama kabı detaylarını gösteren modern bottom sheet bileşeni.
 * 
 * ÖZELLİKLER:
 * - Yuvarlatılmış köşeler (24px)
 * - Renkli durum göstergesi (kırmızı/yeşil)
 * - Durum rozeti (Boş/Dolu)
 * - Çok satırlı adres bilgisi
 * - Kapatma butonu
 * - Ana aksiyon butonu
 * - Spring animasyonu ile açılır/kapanır
 * 
 * @component
 */

import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, FONTS } from '../../constants';

// ============================================================================
// CONSTANTS
// ============================================================================

const { height } = Dimensions.get('window');

/**
 * Animasyon konfigürasyonu
 */
const ANIMATION_CONFIG = {
  SPRING_TENSION: 50,
  SPRING_FRICTION: 8,
  TIMING_DURATION: 250,
};

/**
 * Bottom sheet boyutları
 */
const SHEET_CONFIG = {
  BORDER_RADIUS: 24,
  ICON_SIZE: 80,              // 48 → 80 (daha büyük)
  ICON_BORDER_RADIUS: 20,     // 12 → 20 (daha yuvarlatılmış)
  BADGE_BORDER_RADIUS: 12,
};

/**
 * Durum tipleri ve renkleri
 */
const STATUS_TYPES = {
  EMPTY: {
    color: '#F44336',
    label: 'Boş',
    icon: 'alert-circle',
  },
  FULL: {
    color: '#4CAF50',
    label: 'Dolu',
    icon: 'checkmark-circle',
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Mama kabı detaylarını gösteren bottom sheet
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Bottom sheet görünürlüğü
 * @param {Function} props.onClose - Kapatma callback'i
 * @param {Object} props.bowlData - Mama kabı verisi
 * @param {string} props.bowlData.id - Kap ID'si
 * @param {string} props.bowlData.title - Kap başlığı
 * @param {string} props.bowlData.status - Kap durumu ('empty' | 'full')
 * @param {string} props.bowlData.address - Kap adresi
 * @param {number} props.bowlData.latitude - Kap enlem koordinatı
 * @param {number} props.bowlData.longitude - Kap boylam koordinatı
 * @param {Function} props.onAction - Ana aksiyon butonu callback'i (opsiyonel)
 */
const BowlBottomSheet = ({ visible, onClose, bowlData, onAction }) => {
  const insets = useSafeAreaInsets();
  const [slideAnim] = useState(new Animated.Value(0));

  // Animasyonları tetikle
  React.useEffect(() => {
    if (visible && bowlData) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: ANIMATION_CONFIG.SPRING_TENSION,
        friction: ANIMATION_CONFIG.SPRING_FRICTION,
      }).start();
    } else if (!visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_CONFIG.TIMING_DURATION,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, bowlData, slideAnim]);

  /**
   * Kapatma handler'ı
   */
  const handleClose = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: ANIMATION_CONFIG.TIMING_DURATION,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [slideAnim, onClose]);

  /**
   * Ana aksiyon handler'ı - Yol tarifi al
   * iOS'ta Apple Maps, Android'de Google Maps açar
   * NOT: Sadece harita uygulamasını açar, başka ekrana yönlendirmez
   */
  const handleAction = useCallback(() => {
    if (!bowlData || !bowlData.latitude || !bowlData.longitude) {
      Alert.alert('Hata', 'Konum bilgisi bulunamadı.');
      return;
    }

    const { latitude, longitude, title, address } = bowlData;
    const label = encodeURIComponent(title || 'Mama Kabı');
    
    // Platform'a göre harita URL'i oluştur
    let url;
    
    if (Platform.OS === 'ios') {
      // Apple Maps URL (iOS için)
      url = `maps://app?daddr=${latitude},${longitude}&q=${label}`;
      
      // Alternatif: Apple Maps ile direkt navigasyon başlat
      // url = `maps://?daddr=${latitude},${longitude}&dirflg=d`;
    } else {
      // Google Maps URL (Android için)
      url = `google.navigation:q=${latitude},${longitude}`;
      
      // Alternatif: Google Maps web URL (her platformda çalışır)
      // url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }

    // URL'i aç
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Harita uygulaması yüklü değilse, web versiyonunu aç
          const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
          return Linking.openURL(webUrl);
        }
      })
      .then(() => {
        // Başarılı şekilde açıldıysa bottom sheet'i kapat
        handleClose();
        
        // NOT: onAction callback'i KALDIRILDI
        // Artık sadece harita açılır, başka ekrana yönlendirilmez
      })
      .catch((err) => {
        console.error('Harita açılırken hata oluştu:', err);
        Alert.alert(
          'Hata',
          'Harita uygulaması açılamadı. Lütfen cihazınızda harita uygulamasının yüklü olduğundan emin olun.',
          [{ text: 'Tamam' }]
        );
      });
  }, [bowlData, handleClose]);

  // Modal translateY animasyonu
  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  // Erken return - bowlData yoksa veya modal kapalıysa render yapma
  if (!bowlData || !visible) return null;

  // Durum bilgisi - bowlData kontrolünden sonra
  const statusInfo = STATUS_TYPES[bowlData.status === 'full' ? 'FULL' : 'EMPTY'];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.sheetContainer,
                {
                  transform: [{ translateY: modalTranslateY }],
                  paddingBottom: insets.bottom + SPACING.lg,
                },
              ]}
            >
              {/* ==================== HEADER ==================== */}
              {/* Kapatma Butonu - Sağ Üst Köşe */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>

              {/* ==================== CONTENT ==================== */}
              <View style={styles.content}>
                {/* Renkli İkon Kutusu - Ortalı ve Üstte */}
                <View style={styles.iconSection}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: statusInfo.color },
                    ]}
                  >
                    <Text style={styles.bowlIcon}>🥣</Text>
                  </View>
                </View>

                {/* Başlık ve Durum Rozeti */}
                <View style={styles.headerSection}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>
                      {bowlData.title}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${statusInfo.color}15` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusInfo.color },
                        ]}
                      >
                        {statusInfo.label}
                      </Text>
                    </View>
                  </View>

                  {/* ID Metni */}
                  <Text style={styles.idText}>ID: {bowlData.id}</Text>
                </View>

                {/* Adres Bölümü */}
                <View style={styles.addressSection}>
                  <View style={styles.addressHeader}>
                    <Text style={styles.addressLabel}>Adres:</Text>
                  </View>
                  <Text style={styles.addressText}>{bowlData.address}</Text>
                </View>
              </View>

              {/* ==================== ACTION BUTTON ==================== */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleAction}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>Yol Tarifi Al</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  // Sheet Container
  sheetContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SHEET_CONFIG.BORDER_RADIUS,
    borderTopRightRadius: SHEET_CONFIG.BORDER_RADIUS,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },

  // Close Button
  closeButton: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  // Content
  content: {
    marginBottom: SPACING.xl,
  },

  // Icon Section - Ortalı İkon Bölümü
  iconSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,  // lg → xl (daha fazla boşluk)
  },

  // Icon Box - Daha büyük ve belirgin
  iconBox: {
    width: SHEET_CONFIG.ICON_SIZE,
    height: SHEET_CONFIG.ICON_SIZE,
    borderRadius: SHEET_CONFIG.ICON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },  // 2 → 4 (daha belirgin gölge)
    shadowOpacity: 0.2,                      // 0.15 → 0.2
    shadowRadius: 12,                        // 8 → 12
    elevation: 8,                            // 5 → 8
  },

  // Bowl Icon
  bowlIcon: {
    fontSize: 40,  // 32 → 40 (daha büyük emoji)
  },

  // Header Section - Merkezlenmiş
  headerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,  // lg → xl (daha fazla boşluk)
  },

  // Title Row - Başlık ve Durum Rozeti
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,  // xs → sm (daha fazla boşluk)
    paddingHorizontal: SPACING.md,
  },

  // Title
  title: {
    fontSize: FONT_SIZES.xl,      // lg (16) → xl (20)
    fontWeight: FONT_WEIGHTS.bold, // semibold → bold
    color: COLORS.text,
    fontFamily: FONTS.text,
    marginRight: SPACING.sm,
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: SPACING.md,     // sm → md (daha geniş)
    paddingVertical: SPACING.xs,       // xs/2 → xs
    borderRadius: SHEET_CONFIG.BADGE_BORDER_RADIUS,
  },

  // Status Text
  statusText: {
    fontSize: FONT_SIZES.sm,  // xs (11) → sm (13)
    fontWeight: FONT_WEIGHTS.bold,  // semibold → bold
    fontFamily: FONTS.text,
  },

  // ID Text
  idText: {
    fontSize: FONT_SIZES.sm,   // xs (11) → sm (13)
    color: COLORS.textSecondary,
    fontFamily: FONTS.text,
    fontWeight: FONT_WEIGHTS.medium,  // regular → medium
  },

  // Address Section
  addressSection: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,  // Ekstra margin eklendi
  },

  // Address Header
  addressHeader: {
    marginBottom: SPACING.sm,  // xs → sm (daha fazla boşluk)
  },

  // Address Label
  addressLabel: {
    fontSize: FONT_SIZES.md,  // sm (13) → md (14)
    color: COLORS.text,
    fontFamily: FONTS.text,
    fontWeight: FONT_WEIGHTS.bold,  // semibold → bold
  },

  // Address Text
  addressText: {
    fontSize: FONT_SIZES.md,  // sm (13) → md (14)
    color: COLORS.textSecondary,  // text → textSecondary (daha yumuşak)
    fontFamily: FONTS.text,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 22,  // 20 → 22 (daha rahat okunur)
  },

  // Action Button
  actionButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg + SPACING.xs,  // lg → lg + xs (daha yüksek)
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Action Button Text
  actionButtonText: {
    fontSize: FONT_SIZES.lg,  // md (14) → lg (16)
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    fontFamily: FONTS.text,
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default memo(BowlBottomSheet);

