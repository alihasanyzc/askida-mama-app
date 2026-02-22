import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_GALLERY_HEIGHT = 320;

const AnnouncementDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { announcement } = route.params;
  const imageScrollRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = announcement.images && announcement.images.length > 0
    ? announcement.images
    : [announcement.image];

  const tagLabel = announcement.tag || 'İlan';
  const tagColor = announcement.tagColor || '#FF8C42';

  const onImageScroll = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Resim galerisi: yatay scroll, sayfa sayfa */}
        <View style={[styles.imageContainer, { height: IMAGE_GALLERY_HEIGHT }]}>
          {/* Back Button */}
          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + 12 }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <ScrollView
            ref={imageScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onImageScroll}
            style={styles.imageGalleryScroll}
            contentContainerStyle={styles.imageGalleryContent}
          >
            {images.map((uri, index) => (
              <View key={index} style={styles.imageSlide}>
                <Image
                  source={{ uri }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>

          {/* Etiket: kartlarla aynı, resmin sol alt köşesinde */}
          <View style={[styles.detailTag, { backgroundColor: tagColor }]}>
            <Text style={styles.detailTagText} numberOfLines={1} ellipsizeMode="tail">
              {tagLabel}
            </Text>
          </View>

          {/* Sayfa göstergesi (birden fazla resim varsa) */}
          {images.length > 1 && (
            <View style={styles.pageIndicator}>
              <Text style={styles.pageIndicatorText}>
                {currentImageIndex + 1} / {images.length}
              </Text>
            </View>
          )}
        </View>

        {/* Başlık ve Zaman */}
        <View style={styles.content}>
          <Text style={styles.title}>{announcement.title}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>🕐</Text>
            <Text style={styles.timeText}>{announcement.time}</Text>
          </View>

          {/* Açıklama */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.description}>{announcement.description}</Text>
          </View>

          {/* Sahiplendirme için özel alanlar */}
          {announcement.category === 'adoption' && announcement.animalInfo && (
            <View style={styles.animalInfoContainer}>
              <Text style={styles.animalInfoTitle}>🐾 Hayvan Bilgileri</Text>
              <View style={styles.animalInfoGrid}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Tür</Text>
                  <Text style={styles.infoValue}>{announcement.animalInfo.type}</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Yaş</Text>
                  <Text style={styles.infoValue}>{announcement.animalInfo.age}</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Cinsiyet</Text>
                  <Text style={styles.infoValue}>{announcement.animalInfo.gender}</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Kısırlaştırma</Text>
                  <Text style={styles.infoValue}>{announcement.animalInfo.neutered}</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Aşı Durumu</Text>
                  <Text style={styles.infoValue}>{announcement.animalInfo.vaccination}</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>Bulunduğu Ortam</Text>
                  <Text style={styles.infoValue}>{announcement.animalInfo.environment}</Text>
                </View>
                <View style={[styles.infoBox, styles.infoBoxFull]}>
                  <Text style={styles.infoLabel}>Sağlık Durumu</Text>
                  <Text style={styles.infoValue}>{announcement.animalInfo.healthStatus}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Konum */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Konum</Text>
              <Text style={styles.locationText}>{announcement.location}</Text>
            </View>
          </View>

          {/* İletişim Bilgileri */}
          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>İletişim Bilgileri</Text>
            <View style={styles.contactBox}>
              <View style={styles.phoneIconContainer}>
                <Text style={styles.phoneIcon}>📞</Text>
              </View>
              <View>
                <Text style={styles.contactLabel}>Telefon</Text>
                <Text style={styles.contactText}>{announcement.phone}</Text>
              </View>
            </View>
          </View>

          {/* Sorun Çözüldü / İlanı Kapat Butonu - Sadece ilan sahibi için */}
          {announcement.isOwner && (
            <TouchableOpacity
              style={styles.solveButton}
              activeOpacity={0.8}
            >
              <Text style={styles.solveIcon}>✓</Text>
              <Text style={styles.solveText}>Sorun Çözüldü / İlanı Kapat</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 500,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  detailTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 80,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    zIndex: 1,
  },
  detailTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  imageGalleryScroll: {
    flex: 1,
  },
  imageGalleryContent: {
    flexGrow: 0,
  },
  imageSlide: {
    width: SCREEN_WIDTH,
    height: IMAGE_GALLERY_HEIGHT,
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: IMAGE_GALLERY_HEIGHT,
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  pageIndicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  timeIcon: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
  },
  animalInfoContainer: {
    backgroundColor: '#FFF9F0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  animalInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  animalInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  infoBoxFull: {
    width: '100%',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  locationContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  locationIcon: {
    fontSize: 24,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  contactContainer: {
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  contactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  phoneIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneIcon: {
    fontSize: 24,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  solveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8C42',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    marginBottom: 20,
  },
  solveIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  solveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AnnouncementDetailScreen;

