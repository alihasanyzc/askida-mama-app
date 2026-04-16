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
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import BowlBottomSheet from '../components/common/BowlBottomSheet';
import { listBowls } from '../services/bowls';
import type { StackScreenProps } from '@react-navigation/stack';
import type { MapStackParamList } from '../types/navigation';
import type { BowlRecord } from '../types/domain';

const { width, height } = Dimensions.get('window');

type MapScreenProps = StackScreenProps<MapStackParamList, 'MapMain'>;

type MapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  status: 'full' | 'empty';
  address: string;
  qr_code?: string;
  status_label?: string;
  status_color?: string;
  location_description?: string | null;
};

const MapScreen = ({ navigation }: MapScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [bowlBottomSheetVisible, setBowlBottomSheetVisible] = useState(false);
  const [selectedBowl, setSelectedBowl] = useState<(Partial<BowlRecord> & MapMarker) | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isLoadingBowls, setIsLoadingBowls] = useState(true);
  
  const [region, setRegion] = useState({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const loadBowls = React.useCallback(async () => {
    try {
      setIsLoadingBowls(true);
      const bowls = await listBowls();

      const nextMarkers = bowls
        .filter(
          (bowl) =>
            typeof bowl.latitude === 'number' &&
            typeof bowl.longitude === 'number',
        )
        .map<MapMarker>((bowl) => ({
          id: bowl.id,
          latitude: bowl.latitude as number,
          longitude: bowl.longitude as number,
          title: 'Mama Kabı',
          status: bowl.status === 'full' ? 'full' : 'empty',
          address:
            bowl.address_line?.trim() ||
            bowl.location_note?.trim() ||
            'Adres bilgisi mevcut değil',
          qr_code: bowl.qr_code,
          status_color: bowl.status_color,
          status_label: bowl.status_label,
          location_description: bowl.location_description ?? null,
        }));

      setMarkers(nextMarkers);

      if (nextMarkers.length > 0) {
        setRegion((currentRegion) => ({
          ...currentRegion,
          latitude: nextMarkers[0].latitude,
          longitude: nextMarkers[0].longitude,
        }));
      }
    } catch (error) {
      console.error('Bowls fetch error:', error);
    } finally {
      setIsLoadingBowls(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      await loadBowls();
      if (!isMounted) {
        return;
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [loadBowls]);

  useFocusEffect(
    React.useCallback(() => {
      void loadBowls();
    }, [loadBowls]),
  );

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

  const handleMarkerPress = (marker: MapMarker) => {
    setSelectedBowl(marker);
    setBowlBottomSheetVisible(true);
  };

  const handleCloseBowlSheet = () => {
    setBowlBottomSheetVisible(false);
    setTimeout(() => {
      setSelectedBowl(null);
    }, 300);
  };

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

      {isLoadingBowls ? (
        <View style={[styles.loadingOverlay, { top: insets.top + SPACING.xl }]}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Mama kaplari yukleniyor...</Text>
        </View>
      ) : null}

      {/* QR Code Button - Top Right */}
      <TouchableOpacity
        style={[styles.qrButton, { top: insets.top + SPACING.md }]}
        activeOpacity={0.7}
        onPress={handleQRScan}
      >
        <Ionicons name="qr-code-outline" size={20} color={COLORS.white} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.refreshButton, { top: insets.top + SPACING.md }]}
        activeOpacity={0.7}
        onPress={() => void loadBowls()}
      >
        <Ionicons name="refresh" size={20} color={COLORS.white} />
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
                      name="bowl-outline"
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
        onAction={() => {}}
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
  refreshButton: {
    position: 'absolute',
    left: SPACING.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingOverlay: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
  },
  loadingText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.secondary,
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
