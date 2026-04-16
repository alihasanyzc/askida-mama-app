import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING } from '../constants';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AnnouncementStackParamList } from '../types/navigation';

type CreateAnnouncementScreenProps = StackScreenProps<
  AnnouncementStackParamList,
  'CreateAnnouncement'
>;

type Option = {
  id?: number;
  label: string;
  value: string;
};

const CATEGORIES: Required<Option>[] = [
  { id: 1, label: 'Yaralı Hayvan', value: 'injured' },
  { id: 2, label: 'İhbar', value: 'report' },
  { id: 3, label: 'Sahiplendirme', value: 'adoption' },
  { id: 4, label: 'Kayıp', value: 'lost' },
];

// İhbar Türleri (İhbar kategorisi için)
const REPORT_TYPES: Required<Option>[] = [
  { id: 1, label: 'Ölü Hayvan', value: 'dead' },
  { id: 2, label: 'Çipsiz Hayvan', value: 'unchipped' },
  { id: 3, label: 'Saldırgan Hayvan', value: 'aggressive' },
  { id: 4, label: 'İstismar / Kötü Muamele', value: 'abuse' },
  { id: 5, label: 'Başıboş / Tehlikeli Konumda', value: 'stray' },
  { id: 6, label: 'Diğer', value: 'other' },
];

// Hayvan Türü Seçenekleri
const ANIMAL_TYPE_OPTIONS: Option[] = [
  { label: 'Köpek', value: 'dog' },
  { label: 'Kedi', value: 'cat' },
];

// Yaş Seçenekleri
const AGE_OPTIONS: Option[] = [
  { label: '0-6 ay', value: '0-6months' },
  { label: '6-12 ay', value: '6-12months' },
  { label: '1-3 yaş', value: '1-3years' },
  { label: '3-7 yaş', value: '3-7years' },
  { label: '7+ yaş', value: '7+years' },
];

// Cinsiyet Seçenekleri
const GENDER_OPTIONS: Option[] = [
  { label: 'Dişi', value: 'female' },
  { label: 'Erkek', value: 'male' },
];

// Kısırlaştırılmış Seçenekleri
const NEUTERED_OPTIONS: Option[] = [
  { label: 'Evet', value: 'yes' },
  { label: 'Hayır', value: 'no' },
];

// Aşı Durumu Seçenekleri
const VACCINATION_OPTIONS: Option[] = [
  { label: 'Aşılı', value: 'vaccinated' },
  { label: 'Aşısız', value: 'not_vaccinated' },
];

// Sağlık Durumu Seçenekleri
const HEALTH_OPTIONS: Option[] = [
  { label: 'Sağlıklı', value: 'healthy' },
  { label: 'Yaralı', value: 'injured' },
];

// Bulunduğu Ortam Seçenekleri
const ENVIRONMENT_OPTIONS: Option[] = [
  { label: 'Ev', value: 'home' },
  { label: 'Sokak', value: 'street' },
  { label: 'Barınak', value: 'shelter' },
];

const CreateAnnouncementScreen = ({ navigation }: CreateAnnouncementScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('injured'); // Varsayılan: Yaralı Hayvan
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null); // İhbar türü
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const MAX_IMAGES = 10;
  
  // Sahiplendirme için özel alanlar
  const [animalType, setAnimalType] = useState<string | null>(null); // Hayvan Türü (Köpek, Kedi)
  const [age, setAge] = useState<string | null>(null); // Yaş
  const [gender, setGender] = useState<string | null>(null); // Cinsiyet
  const [neutered, setNeutered] = useState<string | null>(null); // Kısırlaştırılmış
  const [vaccination, setVaccination] = useState<string | null>(null); // Aşı Durumu
  const [healthStatus, setHealthStatus] = useState<string | null>(null); // Sağlık Durumu
  const [environment, setEnvironment] = useState<string | null>(null); // Bulunduğu Ortam
  
  // Dropdown açık/kapalı durumları
  const [isAnimalTypeDropdownOpen, setIsAnimalTypeDropdownOpen] = useState(false);
  const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isNeuteredDropdownOpen, setIsNeuteredDropdownOpen] = useState(false);
  const [isVaccinationDropdownOpen, setIsVaccinationDropdownOpen] = useState(false);
  const [isHealthDropdownOpen, setIsHealthDropdownOpen] = useState(false);
  const [isEnvironmentDropdownOpen, setIsEnvironmentDropdownOpen] = useState(false);

  const fetchGPSLocation = async () => {
    try {
      setIsLoadingLocation(true);
      // TODO: Gerçek GPS implementasyonu (expo-location)
      // Şimdilik mock data
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // GPS'den alınan konum
      setLocation('Caferağa Mahallesi, Kadıköy, İstanbul');
    } catch (error) {
      console.error('GPS Error:', error);
      setLocation('Konum alınamadı');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationRefresh = () => {
    fetchGPSLocation();
  };

  const pickImage = async () => {
    try {
      // Kamera rolü izni iste
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri erişim izni gereklidir.');
        return;
      }

      // Fotoğraf seç
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImages((prev) => {
          if (prev.length >= MAX_IMAGES) return prev;
          return [...prev, result.assets[0].uri];
        });
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu.');
    }
  };

  const removeImageAt = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLocationFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handlePhoneFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleSubmit = () => {
    if (!selectedImages || selectedImages.length === 0) {
      Alert.alert('Eksik Alan', 'En az bir fotoğraf eklemeniz gerekiyor.');
      return;
    }
    console.log('Create announcement:', {
      category: selectedCategory,
      title,
      description,
      location,
      phone,
      images: selectedImages,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header: safe area, başlık yok; geri butonu solda */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.xs }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Kategori Seçin */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Kategori Seçin <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.value && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.value && styles.categoryButtonTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* İhbar Türü (Sadece İhbar kategorisi için) */}
        {selectedCategory === 'report' && (
          <View style={styles.section}>
            <Text style={styles.label}>
              İhbar Türü <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.categoryGrid}>
              {REPORT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.categoryButton,
                    selectedReportType === type.value && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedReportType(type.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedReportType === type.value && styles.categoryButtonTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Sahiplendirme için özel alanlar */}
        {selectedCategory === 'adoption' && (
          <>
            {/* Hayvan Türü */}
            <View style={styles.section}>
              <Text style={styles.label}>
                Hayvan Türü <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setIsAnimalTypeDropdownOpen(!isAnimalTypeDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownText, !animalType && styles.dropdownPlaceholder]}>
                  {animalType ? ANIMAL_TYPE_OPTIONS.find(opt => opt.value === animalType)?.label : 'Seçin'}
                </Text>
                <Text style={styles.dropdownIcon}>{isAnimalTypeDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {isAnimalTypeDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {ANIMAL_TYPE_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        animalType === option.value && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setAnimalType(option.value);
                        setIsAnimalTypeDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      {animalType === option.value && (
                        <Text style={styles.checkIcon}>✓</Text>
                      )}
                      <Text
                        style={[
                          styles.dropdownItemText,
                          animalType === option.value && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Yaş */}
            <View style={styles.section}>
              <Text style={styles.label}>
                Yaş <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setIsAgeDropdownOpen(!isAgeDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownText, !age && styles.dropdownPlaceholder]}>
                  {age ? AGE_OPTIONS.find(opt => opt.value === age)?.label : 'Seçin'}
                </Text>
                <Text style={styles.dropdownIcon}>{isAgeDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {isAgeDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {AGE_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        age === option.value && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setAge(option.value);
                        setIsAgeDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      {age === option.value && (
                        <Text style={styles.checkIcon}>✓</Text>
                      )}
                      <Text
                        style={[
                          styles.dropdownItemText,
                          age === option.value && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Cinsiyet */}
            <View style={styles.section}>
              <Text style={styles.label}>Cinsiyet</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownText, !gender && styles.dropdownPlaceholder]}>
                  {gender ? GENDER_OPTIONS.find(opt => opt.value === gender)?.label : 'Seçin'}
                </Text>
                <Text style={styles.dropdownIcon}>{isGenderDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {isGenderDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {GENDER_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        gender === option.value && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setGender(option.value);
                        setIsGenderDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      {gender === option.value && (
                        <Text style={styles.checkIcon}>✓</Text>
                      )}
                      <Text
                        style={[
                          styles.dropdownItemText,
                          gender === option.value && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Kısırlaştırılmış */}
            <View style={styles.section}>
              <Text style={styles.label}>Kısırlaştırılmış</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setIsNeuteredDropdownOpen(!isNeuteredDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownText, !neutered && styles.dropdownPlaceholder]}>
                  {neutered ? NEUTERED_OPTIONS.find(opt => opt.value === neutered)?.label : 'Seçin'}
                </Text>
                <Text style={styles.dropdownIcon}>{isNeuteredDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {isNeuteredDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {NEUTERED_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        neutered === option.value && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setNeutered(option.value);
                        setIsNeuteredDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      {neutered === option.value && (
                        <Text style={styles.checkIcon}>✓</Text>
                      )}
                      <Text
                        style={[
                          styles.dropdownItemText,
                          neutered === option.value && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Aşı Durumu */}
            <View style={styles.section}>
              <Text style={styles.label}>Aşı Durumu</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setIsVaccinationDropdownOpen(!isVaccinationDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownText, !vaccination && styles.dropdownPlaceholder]}>
                  {vaccination ? VACCINATION_OPTIONS.find(opt => opt.value === vaccination)?.label : 'Seçin'}
                </Text>
                <Text style={styles.dropdownIcon}>{isVaccinationDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {isVaccinationDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {VACCINATION_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        vaccination === option.value && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setVaccination(option.value);
                        setIsVaccinationDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      {vaccination === option.value && (
                        <Text style={styles.checkIcon}>✓</Text>
                      )}
                      <Text
                        style={[
                          styles.dropdownItemText,
                          vaccination === option.value && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Sağlık Durumu */}
            <View style={styles.section}>
              <Text style={styles.label}>Sağlık Durumu</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setIsHealthDropdownOpen(!isHealthDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownText, !healthStatus && styles.dropdownPlaceholder]}>
                  {healthStatus ? HEALTH_OPTIONS.find(opt => opt.value === healthStatus)?.label : 'Seçin'}
                </Text>
                <Text style={styles.dropdownIcon}>{isHealthDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {isHealthDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {HEALTH_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        healthStatus === option.value && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setHealthStatus(option.value);
                        setIsHealthDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      {healthStatus === option.value && (
                        <Text style={styles.checkIcon}>✓</Text>
                      )}
                      <Text
                        style={[
                          styles.dropdownItemText,
                          healthStatus === option.value && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Bulunduğu Ortam */}
            <View style={styles.section}>
              <Text style={styles.label}>Bulunduğu Ortam</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setIsEnvironmentDropdownOpen(!isEnvironmentDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownText, !environment && styles.dropdownPlaceholder]}>
                  {environment ? ENVIRONMENT_OPTIONS.find(opt => opt.value === environment)?.label : 'Seçin'}
                </Text>
                <Text style={styles.dropdownIcon}>{isEnvironmentDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {isEnvironmentDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {ENVIRONMENT_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        environment === option.value && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setEnvironment(option.value);
                        setIsEnvironmentDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      {environment === option.value && (
                        <Text style={styles.checkIcon}>✓</Text>
                      )}
                      <Text
                        style={[
                          styles.dropdownItemText,
                          environment === option.value && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        {/* Fotoğraf Ekle - birden fazla resim */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Fotoğraf Ekle <Text style={styles.required}>*</Text>
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photoListContent}
          >
            {selectedImages.map((uri, index) => (
              <View key={index} style={styles.photoItemWrap}>
                <Image source={{ uri }} style={styles.photoThumb} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.photoRemoveBtn}
                  onPress={() => removeImageAt(index)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.photoRemoveIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.photoUpload}
              activeOpacity={0.7}
              onPress={pickImage}
              disabled={selectedImages.length >= MAX_IMAGES}
            >
              <Text style={styles.uploadIcon}>⬆️</Text>
              <Text style={styles.uploadText}>
                {selectedImages.length >= MAX_IMAGES ? 'Max' : 'Ekle'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
          {selectedImages.length > 0 && (
            <Text style={styles.photoHint}>
              {selectedImages.length}/{MAX_IMAGES} fotoğraf. Yeni eklemek için "Ekle"ye dokunun.
            </Text>
          )}
        </View>

        {/* Başlık */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Başlık <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="İlan başlığı"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Açıklama */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Açıklama <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detaylı açıklama yazın..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Konum */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Konum <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputWithIcon}>
            <TouchableOpacity
              style={styles.locationRefreshButton}
              onPress={handleLocationRefresh}
              disabled={isLoadingLocation}
            >
              <Text style={[styles.inputIcon, isLoadingLocation && styles.iconLoading]}>
                📍
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.inputWithIconField}
              placeholder="Konum bilgisi (GPS için ikona tıklayın)"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
              editable={!isLoadingLocation}
              onFocus={handleLocationFocus}
            />
          </View>
          {isLoadingLocation && (
            <Text style={styles.loadingText}>Konum alınıyor...</Text>
          )}
        </View>

        {/* İletişim */}
        <View style={styles.section}>
          <Text style={styles.label}>
            İletişim <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputWithIcon}>
            <View style={styles.locationRefreshButton}>
              <Text style={styles.inputIcon}>📞</Text>
            </View>
            <TextInput
              style={styles.inputWithIconField}
              placeholder="0555 123 4567"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              onFocus={handlePhoneFocus}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>İlan Yayınla</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  required: {
    color: '#FF4444',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryButton: {
    width: '48%',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#FF8C42',
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  photoListContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 4,
  },
  photoItemWrap: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  photoRemoveBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoRemoveIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  photoUpload: {
    width: 100,
    height: 100,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FFCC80',
  },
  uploadIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  uploadText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  photoHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#FF8C42',
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  optionButtonTextActive: {
    color: '#FFFFFF',
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.lightGray,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  dropdownPlaceholder: {
    color: COLORS.textSecondary,
  },
  dropdownIcon: {
    fontSize: 14,
    color: COLORS.primary,
  },
  dropdownMenu: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.lightGray,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
  },
  dropdownItemSelected: {
    backgroundColor: COLORS.primary,
  },
  checkIcon: {
    fontSize: 18,
    color: COLORS.primary,
    marginRight: 12,
    fontWeight: 'bold',
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '400',
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: COLORS.white,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1.5,
    borderColor: COLORS.lightGray,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingRight: 16,
    borderWidth: 1.5,
    borderColor: COLORS.lightGray,
  },
  locationRefreshButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    fontSize: 20,
  },
  iconLoading: {
    opacity: 0.5,
  },
  inputWithIconField: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 14,
  },
  loadingText: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default CreateAnnouncementScreen;
