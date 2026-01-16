import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const PrivacyScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Gizlilik Politikası</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔒</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Gizliliğiniz Bizim İçin Önemli</Text>
        <Text style={styles.subtitle}>Son Güncelleme: 17 Ocak 2026</Text>

        {/* Content Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Toplanan Bilgiler</Text>
          <Text style={styles.sectionText}>
            Askıda Mama uygulamasını kullanırken aşağıdaki bilgiler toplanabilir:
          </Text>
          <Text style={styles.bulletPoint}>• İsim ve kullanıcı adı</Text>
          <Text style={styles.bulletPoint}>• E-posta adresi</Text>
          <Text style={styles.bulletPoint}>• Profil fotoğrafı</Text>
          <Text style={styles.bulletPoint}>• Konum bilgileri (izninizle)</Text>
          <Text style={styles.bulletPoint}>• Bağış ve etkinlik geçmişi</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Bilgilerin Kullanımı</Text>
          <Text style={styles.sectionText}>
            Toplanan bilgiler şu amaçlarla kullanılır:
          </Text>
          <Text style={styles.bulletPoint}>• Uygulama hizmetlerinin sağlanması</Text>
          <Text style={styles.bulletPoint}>• Kullanıcı deneyiminin iyileştirilmesi</Text>
          <Text style={styles.bulletPoint}>• Bağış ve etkinlik takibi</Text>
          <Text style={styles.bulletPoint}>• Güvenlik ve dolandırıcılık önleme</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Bilgi Paylaşımı</Text>
          <Text style={styles.sectionText}>
            Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz. Sadece yasal zorunluluklar 
            durumunda yetkili mercilerle paylaşılabilir.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Veri Güvenliği</Text>
          <Text style={styles.sectionText}>
            Verilerinizin güvenliği için endüstri standardı güvenlik önlemleri alınmaktadır. 
            Tüm hassas veriler şifrelenerek saklanır.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Kullanıcı Hakları</Text>
          <Text style={styles.sectionText}>
            Kullanıcılarımızın aşağıdaki hakları vardır:
          </Text>
          <Text style={styles.bulletPoint}>• Verilerinize erişim hakkı</Text>
          <Text style={styles.bulletPoint}>• Verilerin düzeltilmesi hakkı</Text>
          <Text style={styles.bulletPoint}>• Verilerin silinmesi hakkı</Text>
          <Text style={styles.bulletPoint}>• Veri taşınabilirliği hakkı</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Çerezler</Text>
          <Text style={styles.sectionText}>
            Uygulamamız, kullanıcı deneyimini iyileştirmek için çerezler ve benzeri 
            teknolojiler kullanabilir.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. İletişim</Text>
          <Text style={styles.sectionText}>
            Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
          </Text>
          <Text style={styles.bulletPoint}>📧 privacy@askidamama.com</Text>
          <Text style={styles.bulletPoint}>📱 +90 555 123 4567</Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler 
            durumunda bilgilendirileceksiniz.
          </Text>
        </View>
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
  iconContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
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
    marginBottom: SPACING.sm,
  },
  bulletPoint: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
    paddingLeft: SPACING.sm,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: '#CC7700',
    lineHeight: 20,
  },
});

export default PrivacyScreen;

