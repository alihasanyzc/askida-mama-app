import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../types/navigation';

type AboutScreenProps = StackScreenProps<ProfileStackParamList, 'About'>;

const AboutScreen = ({ navigation }: AboutScreenProps): React.JSX.Element => {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hakkında</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🐾</Text>
          <Text style={styles.appName}>Askıda Mama</Text>
          <Text style={styles.version}>Versiyon 1.0.0</Text>
        </View>

        {/* Mission */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Misyonumuz</Text>
          <Text style={styles.sectionText}>
            Sokak hayvanlarına yardım etmek isteyen insanları bir araya getirerek, 
            onların yaşam kalitesini artırmak ve toplumda hayvan sevgisini yaygınlaştırmak.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Özellikler</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🗺️</Text>
            <Text style={styles.featureText}>Harita üzerinde mama noktalarını görüntüleme</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureText}>Mama ve tedavi bağışı yapma</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📢</Text>
            <Text style={styles.featureText}>Kayıp, yaralı hayvan ilanları</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={styles.featureText}>AI destekli veteriner asistanı</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>👥</Text>
            <Text style={styles.featureText}>Sosyal topluluk ve etkinlikler</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>QR kod ile hızlı bağış</Text>
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Ekibimiz</Text>
          <Text style={styles.sectionText}>
            Askıda Mama, hayvan sevgisi ile bir araya gelmiş gönüllü bir ekip tarafından 
            geliştirilmektedir. Amacımız, teknoloji ile hayvan refahını birleştirerek 
            toplumsal fayda sağlamaktır.
          </Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Kullanıcı</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Mama Noktası</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>₺250K</Text>
            <Text style={styles.statLabel}>Toplam Bağış</Text>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 İletişim</Text>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => openLink('mailto:info@askidamama.com')}
            activeOpacity={0.7}
          >
            <Text style={styles.contactIcon}>📧</Text>
            <Text style={styles.contactText}>info@askidamama.com</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => openLink('tel:+905551234567')}
            activeOpacity={0.7}
          >
            <Text style={styles.contactIcon}>📱</Text>
            <Text style={styles.contactText}>+90 555 123 4567</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => openLink('https://www.askidamama.com')}
            activeOpacity={0.7}
          >
            <Text style={styles.contactIcon}>🌐</Text>
            <Text style={styles.contactText}>www.askidamama.com</Text>
          </TouchableOpacity>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 Sosyal Medya</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openLink('https://instagram.com/askidamama')}
              activeOpacity={0.7}
            >
              <Text style={styles.socialIcon}>📷</Text>
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openLink('https://twitter.com/askidamama')}
              activeOpacity={0.7}
            >
              <Text style={styles.socialIcon}>🐦</Text>
              <Text style={styles.socialText}>Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openLink('https://facebook.com/askidamama')}
              activeOpacity={0.7}
            >
              <Text style={styles.socialIcon}>👍</Text>
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.legalSection}>
          <TouchableOpacity
            style={styles.legalButton}
            onPress={() => navigation.navigate('Privacy')}
            activeOpacity={0.7}
          >
            <Text style={styles.legalText}>Gizlilik Politikası</Text>
          </TouchableOpacity>
          <Text style={styles.legalDivider}>•</Text>
          <TouchableOpacity
            style={styles.legalButton}
            activeOpacity={0.7}
          >
            <Text style={styles.legalText}>Kullanım Koşulları</Text>
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <Text style={styles.copyright}>
          © 2026 Askıda Mama. Tüm hakları saklıdır.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.secondary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  logo: {
    fontSize: 80,
    marginBottom: SPACING.sm,
  },
  appName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  version: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
  section: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  sectionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
    width: 32,
  },
  featureText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
    width: 32,
  },
  contactText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    alignItems: 'center',
    padding: SPACING.sm,
  },
  socialIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  socialText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  legalSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  legalButton: {
    padding: SPACING.xs,
  },
  legalText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
  },
  legalDivider: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginHorizontal: SPACING.sm,
  },
  copyright: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});

export default AboutScreen;
