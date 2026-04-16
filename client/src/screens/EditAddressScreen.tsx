import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type MapPressEvent } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';

import { COLORS, FONT_SIZES, SPACING } from '../constants';
import { updateBowlAddress } from '../services/bowls';
import { reverseGeocodeCoordinates } from '../services/geocoding';
import type { BowlRecord } from '../types/domain';
import type { MapStackParamList } from '../types/navigation';

const DEFAULT_COORDINATES = {
  latitude: 41.0082,
  longitude: 28.9784,
};

type EditAddressScreenProps = StackScreenProps<MapStackParamList, 'EditAddress'>;

type CoordinateState = {
  latitude: number;
  longitude: number;
};

function fallbackAddressLine(
  coordinates: CoordinateState,
  fallbackAddress: string | null | undefined,
) {
  if (fallbackAddress?.trim()) {
    return fallbackAddress.trim();
  }

  return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
}

const EditAddressScreen = ({ route, navigation }: EditAddressScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const bowl = (route.params?.bowl as Partial<BowlRecord> | undefined) ?? undefined;

  const initialCoordinates = useMemo<CoordinateState>(
    () => ({
      latitude: bowl?.latitude ?? DEFAULT_COORDINATES.latitude,
      longitude: bowl?.longitude ?? DEFAULT_COORDINATES.longitude,
    }),
    [bowl?.latitude, bowl?.longitude],
  );

  const [coordinates, setCoordinates] = useState<CoordinateState>(initialCoordinates);
  const [mapRegion, setMapRegion] = useState({
    ...initialCoordinates,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  });
  const [addressLine, setAddressLine] = useState(
    fallbackAddressLine(initialCoordinates, bowl?.address_line ?? bowl?.location_note),
  );
  const [locationDescription, setLocationDescription] = useState(
    bowl?.location_description ?? '',
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const latestGeocodeRequestId = useRef(0);

  useEffect(() => {
    setCoordinates(initialCoordinates);
    setMapRegion((currentRegion) => ({
      ...currentRegion,
      latitude: initialCoordinates.latitude,
      longitude: initialCoordinates.longitude,
    }));
    setAddressLine(
      fallbackAddressLine(initialCoordinates, bowl?.address_line ?? bowl?.location_note),
    );
    setLocationDescription(bowl?.location_description ?? '');
  }, [
    bowl?.address_line,
    bowl?.location_description,
    bowl?.location_note,
    initialCoordinates,
  ]);

  useEffect(() => {
    const requestId = latestGeocodeRequestId.current + 1;
    latestGeocodeRequestId.current = requestId;

    const timerId = setTimeout(async () => {
      try {
        setIsResolvingAddress(true);

        const resolvedAddress = await reverseGeocodeCoordinates(
          coordinates.latitude,
          coordinates.longitude,
        );

        if (latestGeocodeRequestId.current !== requestId) {
          return;
        }

        setAddressLine(resolvedAddress);
      } catch (error) {
        if (latestGeocodeRequestId.current !== requestId) {
          return;
        }

        console.error('Reverse geocoding error:', error);
        setAddressLine(
          fallbackAddressLine(coordinates, bowl?.address_line ?? bowl?.location_note),
        );
      } finally {
        if (latestGeocodeRequestId.current === requestId) {
          setIsResolvingAddress(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timerId);
    };
  }, [bowl?.address_line, bowl?.location_note, coordinates]);

  const handleCoordinateChange = (nextCoordinates: CoordinateState) => {
    setCoordinates(nextCoordinates);
    setAddressLine('Adres guncelleniyor...');
    setIsResolvingAddress(true);
    setErrorMessage('');
  };

  const handleMapPress = (event: MapPressEvent) => {
    handleCoordinateChange(event.nativeEvent.coordinate);
  };

  const handleSave = async () => {
    if (!bowl?.id) {
      setErrorMessage('Mama kabi kaydi bulunamadi.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');

      const updatedBowl = await updateBowlAddress(bowl.id, {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        address_line: addressLine,
        locationDescription: locationDescription.trim() || null,
      });

      navigation.replace('BowlDetail', {
        bowl: {
          ...bowl,
          ...updatedBowl,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          address_line: updatedBowl.address_line ?? addressLine,
          location_note: updatedBowl.location_note ?? addressLine,
          location_description:
            updatedBowl.location_description ?? (locationDescription.trim() || null),
        },
      });
    } catch (error) {
      console.error('Bowl address update error:', error);
      setErrorMessage('Adres kaydedilemedi. Lutfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adres Duzenle</Text>
        <View style={styles.headerButtonPlaceholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + SPACING.lg },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mapCard}>
            <MapView
              style={styles.map}
              provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
              initialRegion={mapRegion}
              onRegionChangeComplete={setMapRegion}
              onPress={handleMapPress}
              showsUserLocation={false}
              showsMyLocationButton={false}
              toolbarEnabled={false}
            >
              <Marker
                coordinate={coordinates}
                draggable
                onDragEnd={(event) => handleCoordinateChange(event.nativeEvent.coordinate)}
              >
                <View style={styles.markerPin}>
                  <MaterialCommunityIcons name="map-marker" size={28} color={COLORS.white} />
                </View>
              </Marker>
            </MapView>

            <View style={styles.mapOverlay}>
              <MaterialCommunityIcons name="crosshairs-gps" size={16} color={COLORS.primary} />
              <Text style={styles.mapOverlayText}>Haritaya dokun ya da pini surukle</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrap}>
                <MaterialCommunityIcons name="map-search-outline" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Adres</Text>
              </View>
            </View>
            <View style={styles.addressPreview}>
              {isResolvingAddress ? (
                <View style={styles.addressLoadingRow}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={styles.addressLoadingText}>Adres guncelleniyor...</Text>
                </View>
              ) : (
                <Text style={styles.addressPreviewText}>{addressLine}</Text>
              )}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrap}>
                <MaterialCommunityIcons name="text-box-outline" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Adres Tarifi</Text>
              </View>
            </View>

            <TextInput
              style={styles.descriptionInput}
              placeholder="Orn: Park girisinin saginda, bankin hemen arkasi"
              placeholderTextColor="#8C8C8C"
              value={locationDescription}
              onChangeText={setLocationDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Adresi Kaydet</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonPlaceholder: {
    width: 40,
    height: 40,
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
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  mapCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#F0E2D2',
  },
  map: {
    width: '100%',
    height: 360,
  },
  mapOverlay: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  mapOverlayText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  markerPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionCard: {
    borderRadius: 18,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#EFE4D8',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF3E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  addressPreview: {
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: SPACING.md,
  },
  addressLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  addressLoadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  addressPreviewText: {
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  descriptionInput: {
    minHeight: 128,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.secondary,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.danger,
    marginTop: -SPACING.xs,
  },
  saveButton: {
    minHeight: 54,
    marginTop: SPACING.sm,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default EditAddressScreen;
