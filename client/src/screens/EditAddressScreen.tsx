import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import type { MapStackParamList } from '../types/navigation';
import type { BowlRecord } from '../types/domain';

// 81 İl listesi
const ILLER = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
  'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
  'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

// İlçe verileri (Mock - gerçek uygulamada API'den gelecek)
const ILCELER = {
  'Denizli': ['Pamukkale', 'Merkezefendi', 'Honaz', 'Acıpayam', 'Çivril', 'Tavas', 'Sarayköy'],
  'İstanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Üsküdar', 'Beyoğlu', 'Fatih', 'Bakırköy', 'Maltepe'],
  'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ'],
  'İzmir': ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Çiğli', 'Bayraklı', 'Gaziemir'],
};

type EditAddressScreenProps = StackScreenProps<MapStackParamList, 'EditAddress'>;

const EditAddressScreen = ({ route, navigation }: EditAddressScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const bowl = (route.params?.bowl as Partial<BowlRecord> | undefined) ?? undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [mahalle, setMahalle] = useState('');
  const [sokak, setSokak] = useState('');
  const [kapiNo, setKapiNo] = useState('');
  const [ilce, setIlce] = useState('');
  const [il, setIl] = useState('');
  const [aciklama, setAciklama] = useState('');
  
  const [showIlModal, setShowIlModal] = useState(false);
  const [showIlceModal, setShowIlceModal] = useState(false);
  
  const scrollViewRef = useRef<ScrollView | null>(null);
  const aciklamaInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    // GPS'den konum verilerini al
    fetchGPSLocation();
  }, []);

  const fetchGPSLocation = async () => {
    try {
      setIsLoading(true);
      // TODO: Gerçek GPS implementasyonu (expo-location)
      // Şimdilik mock data
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // GPS'den alınan veriler otomatik olarak input'lara yazılıyor
      setIl('Denizli');
      setIlce('Pamukkale');
      setMahalle('Yunus Emre Mahallesi');
      setSokak('Kale Sokak');
      setKapiNo('12');
      setAciklama('Park girişinin yanında');
    } catch (error) {
      console.error('GPS Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIlSelect = (selectedIl: string) => {
    setIl(selectedIl);
    setIlce(''); // İl değişince ilçe sıfırlanır
    setShowIlModal(false);
  };

  const handleIlceSelect = (selectedIlce: string) => {
    setIlce(selectedIlce);
    setShowIlceModal(false);
  };

  const handleRefreshGPS = () => {
    fetchGPSLocation();
  };

  const handleAciklamaFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleSave = () => {
    console.log('Address saved');
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Adres Düzenle</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefreshGPS}
            disabled={isLoading}
          >
            <Text style={[styles.refreshIcon, isLoading && styles.refreshIconLoading]}>
              📍
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8C42" />
          <Text style={styles.loadingText}>Konum bilgileri alınıyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adres Düzenle</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefreshGPS}
          disabled={isLoading}
        >
          <Text style={[styles.refreshIcon, isLoading && styles.refreshIconLoading]}>
            📍
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* İl ve İlçe */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.flex1]}>
            <Text style={styles.label}>İl</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowIlModal(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.inputText, !il && styles.placeholder]}>
                {il || 'İl Seçin'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.inputGroup, styles.flex1]}>
            <Text style={styles.label}>İlçe</Text>
            <TouchableOpacity
              style={[styles.input, !il && styles.inputDisabled]}
              onPress={() => il && setShowIlceModal(true)}
              activeOpacity={0.7}
              disabled={!il}
            >
              <Text style={[styles.inputText, !ilce && styles.placeholder]}>
                {ilce || 'İlçe Seçin'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mahalle */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mahalle</Text>
          <TextInput
            style={styles.input}
            value={mahalle}
            onChangeText={setMahalle}
            placeholder="Mahalle"
            placeholderTextColor="#999"
          />
        </View>

        {/* Sokak */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sokak</Text>
          <TextInput
            style={styles.input}
            value={sokak}
            onChangeText={setSokak}
            placeholder="Sokak"
            placeholderTextColor="#999"
          />
        </View>

        {/* Kapı No */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kapı No</Text>
          <TextInput
            style={styles.input}
            value={kapiNo}
            onChangeText={setKapiNo}
            placeholder="Kapı No"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {/* Açıklama / Tarif */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Açıklama / Tarif</Text>
          <TextInput
            ref={aciklamaInputRef}
            style={[styles.input, styles.textArea]}
            value={aciklama}
            onChangeText={setAciklama}
            placeholder="Açıklama / Tarif"
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
            onFocus={handleAciklamaFocus}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Adresi Kaydet</Text>
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* İl Seçim Modal */}
      <Modal
        visible={showIlModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIlModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>İl Seçin</Text>
              <TouchableOpacity onPress={() => setShowIlModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {ILLER.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalItem}
                  onPress={() => handleIlSelect(item)}
                >
                  <Text style={[styles.modalItemText, il === item && styles.modalItemSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* İlçe Seçim Modal */}
      <Modal
        visible={showIlceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIlceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>İlçe Seçin</Text>
              <TouchableOpacity onPress={() => setShowIlceModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {il && ILCELER[il] ? (
                ILCELER[il].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.modalItem}
                    onPress={() => handleIlceSelect(item)}
                  >
                    <Text style={[styles.modalItemText, ilce === item && styles.modalItemSelected]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noDataText}>Bu il için ilçe verisi bulunamadı</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 24,
  },
  refreshIconLoading: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
    borderWidth: 0,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    color: '#999',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  textArea: {
    minHeight: 160,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
  },
  modalScroll: {
    paddingHorizontal: 20,
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000',
  },
  modalItemSelected: {
    color: '#FF8C42',
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EditAddressScreen;
