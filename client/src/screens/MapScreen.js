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
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  
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

  // Mock marker data - Yeşil ve kırmızı marker'lar
  const markers = [
    {
      id: 1,
      latitude: 41.0082,
      longitude: 28.9784,
      type: 'green', // Yeşil marker
      title: 'Mama Noktası 1',
    },
    {
      id: 2,
      latitude: 41.0100,
      longitude: 28.9800,
      type: 'green',
      title: 'Mama Noktası 2',
    },
    {
      id: 3,
      latitude: 41.0060,
      longitude: 28.9760,
      type: 'green',
      title: 'Mama Noktası 3',
    },
    {
      id: 4,
      latitude: 41.0120,
      longitude: 28.9820,
      type: 'green',
      title: 'Mama Noktası 4',
    },
    {
      id: 5,
      latitude: 41.0090,
      longitude: 28.9790,
      type: 'green',
      title: 'Mama Noktası 5',
    },
    {
      id: 6,
      latitude: 41.0070,
      longitude: 28.9770,
      type: 'red', // Kırmızı marker
      title: 'Acil Yardım Noktası 1',
    },
    {
      id: 7,
      latitude: 41.0110,
      longitude: 28.9810,
      type: 'red',
      title: 'Acil Yardım Noktası 2',
    },
    {
      id: 8,
      latitude: 41.0050,
      longitude: 28.9750,
      type: 'red',
      title: 'Acil Yardım Noktası 3',
    },
    {
      id: 9,
      latitude: 41.0130,
      longitude: 28.9830,
      type: 'red',
      title: 'Acil Yardım Noktası 4',
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
          >
            <View
              style={[
                styles.markerContainer,
                marker.type === 'green' ? styles.greenMarker : styles.redMarker,
              ]}
            >
              <Text style={styles.markerIcon}>🐾</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* QR Code Button - Top Right */}
      <TouchableOpacity
        style={[styles.qrButton, { top: insets.top + SPACING.md }]}
        activeOpacity={0.7}
      >
        <Text style={styles.qrIcon}>📱</Text>
      </TouchableOpacity>

      {/* Bağış Yap Button - Bottom */}
      <View style={[styles.bottomContainer, { bottom: insets.bottom + SPACING.lg }]}>
        <TouchableOpacity
          style={styles.donateButton}
          activeOpacity={0.8}
          onPress={handleDonatePress}
        >
          <Text style={styles.heartIcon}>❤️</Text>
          <Text style={styles.donateButtonText}>Bağış Yap</Text>
          <Text style={styles.arrowIcon}>⬆</Text>
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
                  <View style={[styles.optionIcon, { backgroundColor: '#FFA500' }]}>
                    <Text style={styles.optionIconText}>📦</Text>
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
                  <View style={[styles.optionIcon, { backgroundColor: '#90EE90' }]}>
                    <Text style={styles.optionIconText}>💚</Text>
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
    backgroundColor: '#4CAF50',
  },
  redMarker: {
    backgroundColor: '#F44336',
  },
  markerIcon: {
    fontSize: 20,
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
  qrIcon: {
    fontSize: 20,
    color: COLORS.white,
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
    paddingVertical: SPACING.lg,
    borderRadius: 30,
    width: width * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heartIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  donateButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    marginRight: SPACING.sm,
  },
  arrowIcon: {
    fontSize: 18,
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
  optionIconText: {
    fontSize: 28,
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
