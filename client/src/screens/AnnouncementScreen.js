import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Modal,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Entypo, Ionicons } from '@expo/vector-icons';

// Mock İlan Verileri
const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    category: 'injured',
    title: 'Yaralı Sokak Köpeği',
    description: 'Arka bacağında derin bir yara var ve yürümekte ciddi zorlanıyor. Hayvan acı içinde görünüyor ve kendi başına hareket edemiyor. Acil veteriner müdahalesi gerekiyor. Yara enfekte olmuş gibi görünüyor ve şişlik var.',
    location: 'Caferağa Mahallesi, Kadıköy, İstanbul',
    time: '2 saat önce',
    phone: '0555 123 4567',
    tag: 'Yaralı',
    tagColor: '#FF4444',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
    isOwner: true, // Bu ilan kullanıcının kendisine ait
  },
  {
    id: 2,
    category: 'lost',
    title: 'Kayıp Kedi - Tekir',
    description: 'Boynunda mavi tasma var ve adı Minnoş. Yaklaşık 2 yaşında tekir bir kedi. Çok uysal ve insanlara alışkın. Son olarak park yakınlarında görüldü. Eğer görürseniz lütfen iletişime geçin, çok özledik.',
    location: 'Yıldız Mahallesi, Beşiktaş, İstanbul',
    time: '5 saat önce',
    phone: '0532 987 6543',
    tag: 'Kayıp',
    tagColor: '#FF8C42',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80',
    isOwner: false, // Başkasının ilanı
  },
  {
    id: 3,
    category: 'adoption',
    title: 'Sahiplendirme - Golden Retriever',
    description: 'Çok sevimli ve uysal 3 yaşında golden retriever. Aşıları tam, çipli ve kısır. Bahçeli bir eve veya köpek sevgisi olan bir aileye sahiplendirmek istiyoruz. Çocuklarla çok iyi anlaşıyor.',
    location: 'Etiler, Beşiktaş, İstanbul',
    time: '1 gün önce',
    phone: '0545 111 2233',
    tag: 'Sahiplen',
    tagColor: '#4CAF50',
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&q=80',
    isOwner: true, // Bu ilan kullanıcının kendisine ait
    animalInfo: {
      type: 'köpek',
      age: '3 ay',
      gender: 'Erkek',
      neutered: 'Hayır',
      vaccination: 'Tam Aşı',
      environment: 'Ev',
      healthStatus: 'sağ',
    },
  },
  {
    id: 4,
    category: 'report',
    title: 'İhbar - Başıboş Köpek',
    description: 'Sokakta tehlikeli bir şekilde dolaşan başıboş bir köpek var. Arabalara doğru koşuyor ve hem kendisi hem de sürücüler için tehlike oluşturuyor. Belediye ekiplerinin müdahale etmesi gerekiyor.',
    location: 'Nişantaşı, Şişli, İstanbul',
    time: '3 saat önce',
    phone: '0533 444 5566',
    tag: 'İhbar',
    tagColor: '#FF8C42',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    isOwner: false, // Başkasının ilanı
  },
  {
    id: 5,
    category: 'adoption',
    title: 'Sahiplendirilecek Sevimli Kedi',
    description: 'Çok uysal ve sevecen bir kedi. Evde diğer hayvanlarla ve çocuklarla uyumlu. Kum kabını kullanıyor ve çok temiz bir kedi. Sorumlu bir aileye sahiplendirmek istiyoruz.',
    location: 'Caddebostan, Kadıköy, İstanbul',
    time: '2 gün önce',
    phone: '0542 777 8899',
    tag: 'Sahiplen',
    tagColor: '#4CAF50',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
    isOwner: false, // Başkasının ilanı
    animalInfo: {
      type: 'Kedi',
      age: '6-12 ay',
      gender: 'Dişi',
      neutered: 'Evet',
      vaccination: 'Aşılı',
      environment: 'Sokak',
      healthStatus: 'Sağlıklı',
    },
  },
];

// Kategori seçenekleri
const CATEGORY_OPTIONS = [
  { id: 'all', label: 'Hepsi' },
  { id: 'injured', label: 'Yaralı Hayvan' },
  { id: 'report', label: 'İhbar' },
  { id: 'adoption', label: 'Sahiplendirme' },
  { id: 'lost', label: 'Kayıp' },
];

// Türkiye illeri
const CITIES = [
  'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana', 'Gaziantep', 
  'Konya', 'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir'
];

const SWIPE_CLOSE_THRESHOLD = 100;
const SWIPE_VELOCITY_THRESHOLD = 0.4;

const AnnouncementScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const modalTranslateY = useRef(new Animated.Value(0)).current;

  // Filtre state'leri
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('İstanbul');
  const [selectedDistrict, setSelectedDistrict] = useState('Kadıköy');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Caferağa Mahallesi');

  // Dropdown açık/kapalı durumları
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [isNeighborhoodDropdownOpen, setIsNeighborhoodDropdownOpen] = useState(false);

  useEffect(() => {
    if (isFilterModalVisible) {
      modalTranslateY.setValue(0);
    }
  }, [isFilterModalVisible, modalTranslateY]);

  const closeFilterModal = () => setIsFilterModalVisible(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          modalTranslateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        if (dy > SWIPE_CLOSE_THRESHOLD || vy > SWIPE_VELOCITY_THRESHOLD) {
          Animated.timing(modalTranslateY, {
            toValue: 400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            modalTranslateY.setValue(0);
            closeFilterModal();
          });
        } else {
          Animated.spring(modalTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  const handleAnnouncementPress = (announcement) => {
    navigation.navigate('AnnouncementDetail', { announcement });
  };
  
  const handleApplyFilter = () => {
    // Filtre uygulama işlemi
    setIsFilterModalVisible(false);
  };
  
  const handleClearFilter = () => {
    setSelectedCategory('all');
    setSelectedCity('İstanbul');
    setSelectedDistrict('Kadıköy');
    setSelectedNeighborhood('Caferağa Mahallesi');
  };

  return (
    <View style={styles.container}>
      {/* Search Bar - safe area ile üstte, başlık kaldırıldı */}
      <View style={[styles.searchContainer, { paddingTop: insets.top + 12 }]}>
        <View style={styles.searchBar}>
          <View style={styles.searchIconWrap}>
            <Entypo name="magnifying-glass" size={20} color="#757575" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="İlan ara..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Ionicons name="filter-outline" size={22} color="#757575" />
        </TouchableOpacity>
      </View>

      {/* Announcements List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_ANNOUNCEMENTS.map((announcement) => (
          <TouchableOpacity
            key={announcement.id}
            style={styles.card}
            onPress={() => handleAnnouncementPress(announcement)}
            activeOpacity={0.9}
          >
            {/* Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: announcement.image }}
                style={styles.image}
                resizeMode="cover"
              />
              {/* Tag */}
              <View style={[styles.tag, { backgroundColor: announcement.tagColor }]}>
                <Text style={styles.tagText} numberOfLines={1} ellipsizeMode="tail">
                  {announcement.tag}
                </Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{announcement.title}</Text>
              <Text style={styles.cardDescription} numberOfLines={4}>
                {announcement.description}
              </Text>

              {/* Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.locationContainer}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.locationText} numberOfLines={1}>
                    {announcement.location}
                  </Text>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeIcon}>🕐</Text>
                  <Text style={styles.timeText}>{announcement.time}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: 20 + insets.bottom }]}
        onPress={() => navigation.navigate('CreateAnnouncement')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeFilterModal}
      >
        <TouchableWithoutFeedback onPress={closeFilterModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View
                style={[
                  styles.modalContent,
                  { transform: [{ translateY: modalTranslateY }] },
                ]}
              >
                {/* Swipe-down alanı: header + drag handle */}
                <View style={styles.modalSwipeArea} {...panResponder.panHandlers}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Filtrele</Text>
                    <TouchableOpacity onPress={handleClearFilter}>
                      <Text style={styles.clearButton}>Temizle</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dragHandle} />
                </View>

            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Kategori */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Kategori</Text>
                <View style={styles.categoryGrid}>
                  {CATEGORY_OPTIONS.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryFilterButton,
                        selectedCategory === category.id && styles.categoryFilterButtonActive,
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryFilterText,
                          selectedCategory === category.id && styles.categoryFilterTextActive,
                        ]}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Konum */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Konum</Text>
                
                {/* İl ve İlçe */}
                <View style={styles.locationRow}>
                  {/* İl Dropdown */}
                  <View style={styles.locationItem}>
                    <Text style={styles.locationSubLabel}>İl</Text>
                    <TouchableOpacity
                      style={styles.locationDropdown}
                      onPress={() => {
                        setIsCityDropdownOpen(!isCityDropdownOpen);
                        setIsDistrictDropdownOpen(false);
                        setIsNeighborhoodDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.locationDropdownText}>{selectedCity}</Text>
                      <Text style={styles.dropdownArrow}>▼</Text>
                    </TouchableOpacity>
                    {isCityDropdownOpen && (
                      <View style={styles.dropdownMenu}>
                        <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                          {CITIES.map((city, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.dropdownItem}
                              onPress={() => {
                                setSelectedCity(city);
                                setIsCityDropdownOpen(false);
                              }}
                            >
                              <Text style={styles.dropdownItemText}>{city}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  {/* İlçe Dropdown */}
                  <View style={styles.locationItem}>
                    <Text style={styles.locationSubLabel}>İlçe</Text>
                    <TouchableOpacity
                      style={styles.locationDropdown}
                      onPress={() => {
                        setIsDistrictDropdownOpen(!isDistrictDropdownOpen);
                        setIsCityDropdownOpen(false);
                        setIsNeighborhoodDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.locationDropdownText}>{selectedDistrict}</Text>
                      <Text style={styles.dropdownArrow}>▼</Text>
                    </TouchableOpacity>
                    {isDistrictDropdownOpen && (
                      <View style={styles.dropdownMenu}>
                        <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                          {['Kadıköy', 'Beşiktaş', 'Şişli', 'Üsküdar'].map((district, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.dropdownItem}
                              onPress={() => {
                                setSelectedDistrict(district);
                                setIsDistrictDropdownOpen(false);
                              }}
                            >
                              <Text style={styles.dropdownItemText}>{district}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>

                {/* Mahalle */}
                <View style={styles.mahalleContainer}>
                  <Text style={styles.locationSubLabel}>Mahalle</Text>
                  <TouchableOpacity
                    style={styles.locationDropdownFull}
                    onPress={() => {
                      setIsNeighborhoodDropdownOpen(!isNeighborhoodDropdownOpen);
                      setIsCityDropdownOpen(false);
                      setIsDistrictDropdownOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.locationDropdownText}>{selectedNeighborhood}</Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </TouchableOpacity>
                  {isNeighborhoodDropdownOpen && (
                    <View style={styles.dropdownMenuFull}>
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                        {['Caferağa Mahallesi', 'Moda Mahallesi', 'Fenerbahçe Mahallesi'].map((neighborhood, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setSelectedNeighborhood(neighborhood);
                              setIsNeighborhoodDropdownOpen(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>{neighborhood}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>

            {/* Apply Button */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilter}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Uygula</Text>
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
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIconWrap: {
    marginRight: 8,
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tag: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 80,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
    height: 80,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#999',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  timeText: {
    fontSize: 13,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    height: '90%',
  },
  modalSwipeArea: {
    paddingBottom: 0,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  clearButton: {
    fontSize: 16,
    color: '#FF8C42',
    fontWeight: '600',
  },
  modalScrollView: {
    paddingHorizontal: 20,
    flex: 1,
    marginBottom: 80,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryFilterButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
  },
  categoryFilterButtonActive: {
    backgroundColor: '#FF8C42',
  },
  categoryFilterText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  categoryFilterTextActive: {
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  locationItem: {
    flex: 1,
    position: 'relative',
  },
  locationSubLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  locationDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  locationDropdownFull: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  locationDropdownText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  mahalleContainer: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: 200,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 1000,
  },
  dropdownMenuFull: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: 200,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 1000,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#000',
  },
  applyButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF8C42',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AnnouncementScreen;
