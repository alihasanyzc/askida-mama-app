import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const EVENTS = [
  {
    id: '1',
    title: 'Mama Dağıtalım',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400',
    description: 'Denizli Hayvan Barınağı\'nda düzenlenecek mama dağıtım etkinliğine tüm hayvan severleri bekliyoruz. Gönüllü olarak katılabilir, sokak dostlarımıza mama ve su desteği sağlayabilirsiniz.',
    place: 'Denizli Hayvan Barınağı',
    date: '27 Kasım 2025',
    shortDate: '27 Kasım',
  },
  {
    id: '2',
    title: 'Sokak Temizliği',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    description: 'Merkez Park ve çevresinde sokak hayvanları için temiz ve güvenli bir ortam oluşturmak amacıyla düzenlenen temizlik etkinliği. Katılım ücretsizdir.',
    place: 'Merkez Park',
    date: '5 Aralık 2025',
    shortDate: '5 Aralık',
  },
  {
    id: '3',
    title: 'Aşı Kampanyası',
    image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400',
    description: 'Atatürk Mahallesi\'nde ücretsiz kuduz ve karma aşı uygulaması. Sahipli ve sahipsiz hayvanlar için veteriner hekimlerimiz görev alacaktır.',
    place: 'Atatürk Mahallesi',
    date: '12 Aralık 2025',
    shortDate: '12 Aralık',
  },
];

const EventsListScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Etkinlikler</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + SPACING.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {EVENTS.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => navigation.navigate('EventDetail', { event })}
            activeOpacity={0.9}
          >
            <Image source={{ uri: event.image }} style={styles.eventImage} resizeMode="cover" />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventRow}>
                <Text style={styles.eventIcon}>📍</Text>
                <Text style={styles.eventText} numberOfLines={1}>{event.place}</Text>
              </View>
              <View style={styles.eventRow}>
                <Text style={styles.eventIcon}>📅</Text>
                <Text style={styles.eventText}>{event.shortDate || event.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  eventCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.lightGray,
  },
  eventInfo: {
    padding: SPACING.md,
  },
  eventTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventIcon: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  eventText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
});

export default EventsListScreen;
