import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const ORGANIZER_NAME = 'Büyükşehir Belediyesi';

const EventDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { event } = route.params || {};
  const [emailSheetVisible, setEmailSheetVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleJoinPress = () => {
    setEmailSent(false);
    setEmail('');
    setEmailSheetVisible(true);
  };

  const handleSubmitEmail = () => {
    const trimmed = (email || '').trim();
    if (!trimmed) return;
    setEmailSent(true);
  };

  const closeSheet = () => {
    setEmailSheetVisible(false);
    setEmail('');
    setEmailSent(false);
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={[styles.backButton, { top: insets.top + 12 }]} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.errorText}>Etkinlik bulunamadı.</Text>
      </View>
    );
  }

  const {
    title = 'Etkinlik',
    image = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
    description = '',
    place = '',
    date = '',
  } = event;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 56,
          paddingBottom: insets.bottom + SPACING.xl,
        }}
      >
        <View style={styles.contentWrap}>
          {/* Resim kartı: hafif kavisli kenarlar */}
          <View style={styles.imageCard}>
            <Image source={{ uri: image }} style={styles.heroImage} resizeMode="cover" />
          </View>

          {/* Kart 1: Başlık + Tarih, Yer, Düzenleyen */}
          <View style={styles.detailCard}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{date || '—'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{place || '—'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="business-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{ORGANIZER_NAME}</Text>
            </View>
          </View>

          {/* Kart 2: Açıklama */}
          {description ? (
            <View style={styles.descCard}>
              <Text style={styles.description}>{description}</Text>
            </View>
          ) : null}

          {/* Etkinliğe Katıl - sayfa içinde */}
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinPress} activeOpacity={0.8}>
            <Text style={styles.joinButtonText}>Etkinliğe Katıl</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Back button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 12 }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>

      {/* Email Bottom Sheet */}
      <Modal visible={emailSheetVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={closeSheet}>
          <View style={styles.sheetOverlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.sheet, { paddingBottom: insets.bottom + SPACING.lg }]}
              >
                <View style={styles.sheetHandle} />
                {!emailSent ? (
                  <>
                    <Text style={styles.sheetTitle}>Etkinliğe Katıl</Text>
                    <Text style={styles.sheetHint}>Lütfen mail adresinizi giriniz. Biletiniz bu adrese gönderilecektir.</Text>
                    <TextInput
                      style={styles.emailInput}
                      placeholder="ornek@email.com"
                      placeholderTextColor={COLORS.textSecondary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      style={[styles.sheetButton, !(email || '').trim() && styles.sheetButtonDisabled]}
                      onPress={handleSubmitEmail}
                      disabled={!(email || '').trim()}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.sheetButtonText}>Gönder</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.successIconWrap}>
                      <Text style={styles.successIcon}>✓</Text>
                    </View>
                    <Text style={styles.successTitle}>Biletiniz gönderildi</Text>
                    <Text style={styles.successMessage}>
                      Biletiniz mail adresinize gelmiştir. Lütfen gelen kutunuzu kontrol edin.
                    </Text>
                    <TouchableOpacity style={styles.sheetButton} onPress={closeSheet} activeOpacity={0.8}>
                      <Text style={styles.sheetButtonText}>Tamam</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity style={styles.sheetClose} onPress={closeSheet}>
                  <Text style={styles.sheetCloseText}>✕</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentWrap: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  imageCard: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  detailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  metaText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  descCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  backButton: {
    position: 'absolute',
    left: SPACING.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  joinButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  errorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 48,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    minHeight: 280,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.lightGray,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  sheetTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sheetHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  emailInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  sheetButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sheetButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  sheetButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  sheetClose: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetCloseText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
  },
  successIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  successIcon: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '700',
  },
  successTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  successMessage: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
});

export default EventDetailScreen;
