import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const insets = useSafeAreaInsets();
  const [region, setRegion] = useState({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

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
      <View style={[styles.bottomContainer, { bottom: insets.bottom + SPACING.md }]}>
        <TouchableOpacity
          style={styles.donateButton}
          activeOpacity={0.8}
        >
          <Text style={styles.heartIcon}>❤️</Text>
          <Text style={styles.donateButtonText}>Bağış Yap</Text>
          <Text style={styles.arrowIcon}>⬆</Text>
        </TouchableOpacity>
      </View>
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
  },
  donateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heartIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  donateButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginRight: SPACING.sm,
  },
  arrowIcon: {
    fontSize: 16,
    color: COLORS.white,
  },
});

export default MapScreen;
