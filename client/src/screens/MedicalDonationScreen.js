import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const { width } = Dimensions.get('window');

const MedicalDonationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  
  // Temporary filter states (until user applies)
  const [tempCity, setTempCity] = useState('');
  const [tempDistrict, setTempDistrict] = useState('');
  const [tempNeighborhood, setTempNeighborhood] = useState('');

  // Dropdown open states
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [neighborhoodDropdownOpen, setNeighborhoodDropdownOpen] = useState(false);

  // Location data
  const cities = ['İstanbul', 'Ankara', 'İzmir'];
  
  const districts = {
    'İstanbul': ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Şişli'],
    'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle'],
    'İzmir': ['Bornova', 'Karşıyaka', 'Konak'],
  };

  const neighborhoods = {
    'Kadıköy': ['Caferağa Mahallesi', 'Moda Mahallesi', 'Feneryolu Mahallesi', 'Koşuyolu Mahallesi'],
    'Beşiktaş': ['Ortaköy Mahallesi', 'Bebek Mahallesi', 'Etiler Mahallesi'],
    'Üsküdar': ['Altunizade Mahallesi', 'Kısıklı Mahallesi', 'Çengelköy Mahallesi'],
    'Şişli': ['Mecidiyeköy Mahallesi', 'Nişantaşı Mahallesi', 'Osmanbey Mahallesi'],
    'Çankaya': ['Kavaklıdere Mahallesi', 'Çukurambar Mahallesi'],
    'Keçiören': ['Merkez Mahallesi'],
    'Yenimahalle': ['Demetevler Mahallesi'],
    'Bornova': ['Erzene Mahallesi', 'Kazımdirik Mahallesi'],
    'Karşıyaka': ['Bostanlı Mahallesi', 'Çarşı Mahallesi'],
    'Konak': ['Alsancak Mahallesi', 'Göztepe Mahallesi'],
  };

  // Mock data - Veteriner klinikleri
  const allClinics = [
    {
      id: 1,
      name: 'Patiler Veteriner Kliniği',
      description: 'Sokak hayvanlarına ücretsiz bakım hizmeti veren klinik',
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&h=600&fit=crop',
      address: 'Caferağa Mahallesi, Kadıköy, İstanbul',
      city: 'İstanbul',
      district: 'Kadıköy',
      neighborhood: 'Caferağa Mahallesi',
    },
    {
      id: 2,
      name: 'Umut Veteriner Hastanesi',
      description: 'Acil müdahale ve ameliyat hizmetleri',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&h=600&fit=crop',
      address: 'Moda Mahallesi, Kadıköy, İstanbul',
      city: 'İstanbul',
      district: 'Kadıköy',
      neighborhood: 'Moda Mahallesi',
    },
    {
      id: 3,
      name: 'Sevgi Veteriner Kliniği',
      description: 'Aşılama ve kısırlaştırma hizmetleri',
      image: 'https://images.unsplash.com/photo-1530041539828-114de669390e?w=800&h=600&fit=crop',
      address: 'Feneryolu Mahallesi, Kadıköy, İstanbul',
      city: 'İstanbul',
      district: 'Kadıköy',
      neighborhood: 'Feneryolu Mahallesi',
    },
    {
      id: 4,
      name: 'Sağlık Veteriner Merkezi',
      description: 'Genel sağlık kontrolü ve tedavi',
      image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&h=600&fit=crop',
      address: 'Koşuyolu Mahallesi, Kadıköy, İstanbul',
      city: 'İstanbul',
      district: 'Kadıköy',
      neighborhood: 'Koşuyolu Mahallesi',
    },
    {
      id: 5,
      name: 'Hayat Veteriner Polikliniği',
      description: 'Sokak kedileri ve köpekleri için özel bakım',
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&h=600&fit=crop',
      address: 'Ortaköy Mahallesi, Beşiktaş, İstanbul',
      city: 'İstanbul',
      district: 'Beşiktaş',
      neighborhood: 'Ortaköy Mahallesi',
    },
    {
      id: 6,
      name: 'Pati Dostları Veteriner',
      description: 'Acil servis ve yoğun bakım hizmeti',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=600&fit=crop',
      address: 'Bebek Mahallesi, Beşiktaş, İstanbul',
      city: 'İstanbul',
      district: 'Beşiktaş',
      neighborhood: 'Bebek Mahallesi',
    },
    {
      id: 7,
      name: 'Dostlar Veteriner Kliniği',
      description: 'Kısırlaştırma ve rehabilitasyon merkezi',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=600&fit=crop',
      address: 'Altunizade Mahallesi, Üsküdar, İstanbul',
      city: 'İstanbul',
      district: 'Üsküdar',
      neighborhood: 'Altunizade Mahallesi',
    },
    {
      id: 8,
      name: 'Can Dostu Veteriner',
      description: 'Yaralı hayvan kurtarma ve tedavi merkezi',
      image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=800&h=600&fit=crop',
      address: 'Mecidiyeköy Mahallesi, Şişli, İstanbul',
      city: 'İstanbul',
      district: 'Şişli',
      neighborhood: 'Mecidiyeköy Mahallesi',
    },
  ];

  // Filter clinics based on selected location
  const filteredClinics = allClinics.filter(clinic => {
    // If no filters selected, show all clinics
    if (!selectedCity && !selectedDistrict && !selectedNeighborhood) {
      return true;
    }
    
    // Check each filter level
    let matches = true;
    if (selectedCity) matches = matches && clinic.city === selectedCity;
    if (selectedDistrict) matches = matches && clinic.district === selectedDistrict;
    if (selectedNeighborhood) matches = matches && clinic.neighborhood === selectedNeighborhood;
    
    return matches;
  });

  const displayClinics = filteredClinics;

  const handleOpenFilter = () => {
    setTempCity(selectedCity);
    setTempDistrict(selectedDistrict);
    setTempNeighborhood(selectedNeighborhood);
    setCityDropdownOpen(false);
    setDistrictDropdownOpen(false);
    setNeighborhoodDropdownOpen(false);
    setFilterModalVisible(true);
  };

  const handleApplyFilter = () => {
    setSelectedCity(tempCity);
    setSelectedDistrict(tempDistrict);
    setSelectedNeighborhood(tempNeighborhood);
    setFilterModalVisible(false);
  };

  const handleClearFilter = () => {
    setTempCity('');
    setTempDistrict('');
    setTempNeighborhood('');
    setCityDropdownOpen(false);
    setDistrictDropdownOpen(false);
    setNeighborhoodDropdownOpen(false);
  };

  const handleCitySelect = (city) => {
    setTempCity(city);
    setTempDistrict('');
    setTempNeighborhood('');
    setCityDropdownOpen(false);
  };

  const handleDistrictSelect = (district) => {
    setTempDistrict(district);
    setTempNeighborhood('');
    setDistrictDropdownOpen(false);
  };

  const handleNeighborhoodSelect = (neighborhood) => {
    setTempNeighborhood(neighborhood);
    setNeighborhoodDropdownOpen(false);
  };

  const handleCityDropdownToggle = () => {
    setCityDropdownOpen(!cityDropdownOpen);
    if (!cityDropdownOpen) {
      setDistrictDropdownOpen(false);
      setNeighborhoodDropdownOpen(false);
    }
  };

  const handleDistrictDropdownToggle = () => {
    if (tempCity) {
      setDistrictDropdownOpen(!districtDropdownOpen);
      if (!districtDropdownOpen) {
        setCityDropdownOpen(false);
        setNeighborhoodDropdownOpen(false);
      }
    }
  };

  const handleNeighborhoodDropdownToggle = () => {
    if (tempDistrict) {
      setNeighborhoodDropdownOpen(!neighborhoodDropdownOpen);
      if (!neighborhoodDropdownOpen) {
        setCityDropdownOpen(false);
        setDistrictDropdownOpen(false);
      }
    }
  };

  const getAvailableDistricts = () => {
    return tempCity ? (districts[tempCity] || []) : [];
  };

  const getAvailableNeighborhoods = () => {
    return tempDistrict ? (neighborhoods[tempDistrict] || []) : [];
  };

  const handleClinicPress = (clinic) => {
    // Navigate to clinic detail screen
    navigation.navigate('ClinicDetail', { clinic });
  };

  const renderClinicCard = (clinic) => (
    <TouchableOpacity 
      key={clinic.id}
      style={styles.clinicCard}
      activeOpacity={0.7}
      onPress={() => handleClinicPress(clinic)}
    >
      <Image
        source={{ uri: clinic.image }}
        style={styles.clinicImage}
        resizeMode="cover"
      />
      
      <View style={styles.clinicInfo}>
        <Text style={styles.clinicName}>{clinic.name}</Text>
        <Text style={styles.clinicDescription}>{clinic.description}</Text>
        
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {clinic.address}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.donateButton}
          activeOpacity={0.7}
          onPress={() => handleClinicPress(clinic)}
        >
          <Text style={styles.donateButtonText}>Bağış Yap</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.xs }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tedavi Bağışı</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Location Filter */}
      <TouchableOpacity
        style={styles.filterContainer}
        onPress={handleOpenFilter}
        activeOpacity={0.7}
      >
        <Text style={styles.filterIcon}>📍</Text>
        <Text style={styles.filterText}>Konuma Göre Filtrele</Text>
        <Text style={styles.filterArrow}>▼</Text>
      </TouchableOpacity>

      {/* Gradient Transition */}
      <LinearGradient
        colors={[COLORS.white, COLORS.background]}
        style={styles.gradient}
      />

      {/* Clinics List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {displayClinics.map((clinic) => renderClinicCard(clinic))}
        
        <View style={{ height: SPACING.xl }} />
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        >
          <TouchableOpacity 
            style={[styles.modalContent, { paddingBottom: insets.bottom + SPACING.lg }]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Konum Filtresi</Text>
              <TouchableOpacity
                onPress={handleClearFilter}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButton}>Temizle</Text>
              </TouchableOpacity>
            </View>

            {/* İl ve İlçe - Yan Yana */}
            <View style={styles.rowContainer}>
              {/* İl */}
              <View style={styles.halfWidth}>
                <Text style={styles.filterLabel}>İl</Text>
                <View style={styles.dropdownWrapper}>
                  <TouchableOpacity
                    style={[styles.dropdown, tempCity && styles.dropdownSelected]}
                    onPress={handleCityDropdownToggle}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dropdownText, !tempCity && styles.dropdownPlaceholder]}>
                      {tempCity || 'İstanbul'}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </TouchableOpacity>
                  
                  {cityDropdownOpen && (
                    <View style={styles.dropdownMenuExpanded}>
                      <ScrollView 
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                      >
                        {cities.map((city) => (
                          <TouchableOpacity
                            key={city}
                            style={[
                              styles.dropdownItem,
                              tempCity === city && styles.dropdownItemSelected,
                            ]}
                            onPress={() => handleCitySelect(city)}
                            activeOpacity={0.7}
                          >
                            {tempCity === city && <Text style={styles.checkmark}>✓</Text>}
                            <Text style={[
                              styles.dropdownItemText,
                              tempCity === city && styles.dropdownItemTextSelected,
                            ]}>
                              {city}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>

              {/* İlçe */}
              <View style={styles.halfWidth}>
                <Text style={styles.filterLabel}>İlçe</Text>
                <View style={styles.dropdownWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.dropdown, 
                      tempDistrict && styles.dropdownSelected,
                      !tempCity && styles.dropdownDisabled
                    ]}
                    onPress={handleDistrictDropdownToggle}
                    activeOpacity={tempCity ? 0.7 : 1}
                  >
                    <Text style={[styles.dropdownText, !tempDistrict && styles.dropdownPlaceholder]}>
                      {tempDistrict || 'İlçe Seçin'}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </TouchableOpacity>
                  
                  {districtDropdownOpen && tempCity && (
                    <View style={styles.dropdownMenuExpanded}>
                      <ScrollView 
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                      >
                        {getAvailableDistricts().map((district) => (
                          <TouchableOpacity
                            key={district}
                            style={[
                              styles.dropdownItem,
                              tempDistrict === district && styles.dropdownItemSelected,
                            ]}
                            onPress={() => handleDistrictSelect(district)}
                            activeOpacity={0.7}
                          >
                            {tempDistrict === district && <Text style={styles.checkmark}>✓</Text>}
                            <Text style={[
                              styles.dropdownItemText,
                              tempDistrict === district && styles.dropdownItemTextSelected,
                            ]}>
                              {district}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Mahalle - Tam Genişlik */}
            <View style={styles.filterSectionFull}>
              <Text style={styles.filterLabel}>Mahalle</Text>
              <View style={styles.dropdownWrapper}>
                <TouchableOpacity
                  style={[
                    styles.dropdown, 
                    tempNeighborhood && styles.dropdownSelected,
                    !tempDistrict && styles.dropdownDisabled
                  ]}
                  onPress={handleNeighborhoodDropdownToggle}
                  activeOpacity={tempDistrict ? 0.7 : 1}
                >
                  <Text style={[styles.dropdownText, !tempNeighborhood && styles.dropdownPlaceholder]}>
                    {tempNeighborhood || 'Mahalle Seçin'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
                
                {neighborhoodDropdownOpen && tempDistrict && (
                  <View style={styles.dropdownMenuExpanded}>
                    <ScrollView 
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={false}
                    >
                      {getAvailableNeighborhoods().map((neighborhood) => (
                        <TouchableOpacity
                          key={neighborhood}
                          style={[
                            styles.dropdownItem,
                            tempNeighborhood === neighborhood && styles.dropdownItemSelected,
                          ]}
                          onPress={() => handleNeighborhoodSelect(neighborhood)}
                          activeOpacity={0.7}
                        >
                          {tempNeighborhood === neighborhood && <Text style={styles.checkmark}>✓</Text>}
                          <Text style={[
                            styles.dropdownItemText,
                            tempNeighborhood === neighborhood && styles.dropdownItemTextSelected,
                          ]}>
                            {neighborhood}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilter}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Uygula</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  placeholder: {
    width: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  filterIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  filterText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  filterArrow: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  gradient: {
    height: 20,
    marginTop: SPACING.md,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingTop: 0,
  },
  clinicCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clinicImage: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.lightGray,
  },
  clinicInfo: {
    padding: SPACING.lg,
  },
  clinicName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  clinicDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  donateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  donateButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
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
    paddingTop: SPACING.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  clearButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  halfWidth: {
    width: '48%',
  },
  filterSection: {
    marginBottom: SPACING.lg,
  },
  filterSectionFull: {
    marginBottom: SPACING.lg,
  },
  dropdownWrapper: {
    position: 'relative',
  },
  filterLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF5E6',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  dropdownSelected: {
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  dropdownDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  dropdownLarge: {
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  dropdownText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  dropdownPlaceholder: {
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  dropdownArrow: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dropdownMenu: {
    backgroundColor: '#4A4A4A',
    borderRadius: 12,
    padding: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownMenuExpanded: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#3A3A3A',
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    maxHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 9999,
  },
  dropdownMenuAbsolute: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    marginTop: SPACING.sm,
    zIndex: 1000,
  },
  dropdownMenuScrollable: {
    maxHeight: 200,
    marginTop: SPACING.sm,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginBottom: 4,
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dropdownItemText: {
    fontSize: FONT_SIZES.md,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  checkmark: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: SPACING.sm,
    fontWeight: '700',
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  applyButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default MedicalDonationScreen;

