import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import BowlBottomSheet from '../components/common/BowlBottomSheet';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [bowlBottomSheetVisible, setBowlBottomSheetVisible] = useState(false);
  const [selectedBowl, setSelectedBowl] = useState(null);
  
  const [region, setRegion] = useState({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const handleDonatePress = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const handleFoodDonation = () => {
    handleCloseModal();
    setTimeout(() => {
      navigation.navigate('Donation', { type: 'food' });
    }, 300);
  };

  const handleMedicalDonation = () => {
    handleCloseModal();
    setTimeout(() => {
      navigation.navigate('MedicalDonation');
    }, 300);
  };

  const handleQRScan = () => {
    navigation.navigate('QRScanner');
  };

  const handleMarkerPress = (marker) => {
    setSelectedBowl(marker);
    setBowlBottomSheetVisible(true);
  };

  const handleCloseBowlSheet = () => {
    setBowlBottomSheetVisible(false);
    setTimeout(() => {
      setSelectedBowl(null);
    }, 300);
  };

  // Mock marker data - Yeşil ve kırmızı marker'lar
  const markers = [
    {
      id: 'K002',
      latitude: 41.0082,
      longitude: 28.9784,
      type: 'green', // Yeşil marker
      title: 'Mama Kabı',
      status: 'full',
      address: 'Yunus Emre Mahallesi, Beyaz Cennet Sokak No:45, Pamukkale, Denizli',
    },
    {
      id: 'K003',
      latitude: 41.0100,
      longitude: 28.9800,
      type: 'green',
      title: 'Mama Kabı',
      status: 'full',
      address: 'Kadıköy, Rasimpaşa Mahallesi, Söğütlüçeşme Caddesi No:42, İstanbul',
    },
    {
      id: 'K004',
      latitude: 41.0060,
      longitude: 28.9760,
      type: 'green',
      title: 'Mama Kabı',
      status: 'full',
      address: 'Kadıköy, Fenerbahçe Mahallesi, Fenerbahçe Parkı İçi, İstanbul',
    },
    {
      id: 'K005',
      latitude: 41.0120,
      longitude: 28.9820,
      type: 'green',
      title: 'Mama Kabı',
      status: 'full',
      address: 'Üsküdar, Selimiye Mahallesi, İskele Meydanı No:8, İstanbul',
    },
    {
      id: 'K006',
      latitude: 41.0090,
      longitude: 28.9790,
      type: 'green',
      title: 'Mama Kabı',
      status: 'full',
      address: 'Kadıköy, Göztepe Mahallesi, Bağdat Caddesi No:125, İstanbul',
    },
    {
      id: 'K007',
      latitude: 41.0070,
      longitude: 28.9770,
      type: 'red', // Kırmızı marker
      title: 'Mama Kabı',
      status: 'empty',
      address: 'Kadıköy, Caddebostan Mahallesi, Bağdat Caddesi No:301, İstanbul',
    },
    {
      id: 'K008',
      latitude: 41.0110,
      longitude: 28.9810,
      type: 'red',
      title: 'Mama Kabı',
      status: 'empty',
      address: 'Kadıköy, Zühtüpaşa Mahallesi, Dr. Esat Işık Caddesi No:18, İstanbul',
    },
    {
      id: 'K009',
      latitude: 41.0050,
      longitude: 28.9750,
      type: 'red',
      title: 'Mama Kabı',
      status: 'empty',
      address: 'Kadıköy, Feneryolu Mahallesi, Bağdat Caddesi No:401, İstanbul',
    },
    {
      id: 'K010',
      latitude: 41.0130,
      longitude: 28.9830,
      type: 'red',
      title: 'Mama Kabı',
      status: 'empty',
      address: 'Üsküdar, Kuzguncuk Mahallesi, İcadiye Caddesi No:25, İstanbul',
    },
  ];

  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        style={styles.map}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        mapType="standard"
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
      >
        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            onPress={() => handleMarkerPress(marker)}
          >
            <View
              style={[
                styles.markerContainer,
                marker.status === 'full' ? styles.greenMarker : styles.redMarker,
              ]}
            >
              <MaterialCommunityIcons
                name="paw-outline"
                size={24}
                color={COLORS.white}
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* QR Code Button - Top Right */}
      <TouchableOpacity
        style={[styles.qrButton, { top: insets.top + SPACING.md }]}
        activeOpacity={0.7}
        onPress={handleQRScan}
      >
        <Ionicons name="qr-code-outline" size={20} color={COLORS.white} />
      </TouchableOpacity>

      {/* Bağış Yap Button - Bottom */}
      <View style={[styles.bottomContainer, { bottom: insets.bottom }]}>
        <TouchableOpacity
          style={styles.donateButton}
          activeOpacity={0.8}
          onPress={handleDonatePress}
        >
          <Text style={styles.donateButtonText}>Bağış Yap</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [{ translateY: modalTranslateY }],
                    paddingBottom: insets.bottom + SPACING.lg,
                  },
                ]}
              >
                {/* Handle Indicator */}
                <View style={styles.handleIndicator} />
                
                <Text style={styles.bottomSheetTitle}>Bağış Yap</Text>
                
                {/* Mama Bağışı */}
                <TouchableOpacity 
                  style={styles.donationOption} 
                  activeOpacity={0.7}
                  onPress={handleFoodDonation}
                >
                  <View style={[styles.optionIcon, { backgroundColor: '#FFF3E0' }]}>
                    <MaterialCommunityIcons
                      name="bowl-food"
                      size={32}
                      color="#FF8C42"
                    />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Mama Bağışı</Text>
                    <Text style={styles.optionSubtitle}>Sokak hayvanlarına mama bağışı yapın</Text>
                  </View>
                </TouchableOpacity>

                {/* Tedavi Bağışı */}
                <TouchableOpacity 
                  style={styles.donationOption} 
                  activeOpacity={0.7}
                  onPress={handleMedicalDonation}
                >
                  <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
                    <MaterialCommunityIcons
                      name="medical-bag"
                      size={32}
                      color="#4CAF50"
                    />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Tedavi Bağışı</Text>
                    <Text style={styles.optionSubtitle}>Veteriner kliniklerine bağış yapın</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Bowl Bottom Sheet */}
      <BowlBottomSheet
        visible={bowlBottomSheetVisible}
        onClose={handleCloseBowlSheet}
        bowlData={selectedBowl}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  greenMarker: {
    backgroundColor: '#4CAF50', // Dolu mama kapları - Yeşil
  },
  redMarker: {
    backgroundColor: '#F44336', // Boş mama kapları - Kırmızı
  },
  qrButton: {
    position: 'absolute',
    right: SPACING.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  donateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl * 2,
    paddingVertical: SPACING.sm,  // lg → md (yükseklik azaltıldı)
    borderRadius: 30,
    width: width * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  donateButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    minHeight: height * 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handleIndicator: {
    backgroundColor: COLORS.gray,
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  bottomSheetTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  donationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default MapScreen;
