import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { getBowlDetail, updateBowlStatus } from '../services/bowls';
import type { StackScreenProps } from '@react-navigation/stack';
import type { MapStackParamList } from '../types/navigation';
import type { BowlRecord } from '../types/domain';

const { width, height } = Dimensions.get('window');
const EMPTY_BOWL_IMAGE = require('../../../assets/icons/bowl-empty.png');
const FULL_BOWL_IMAGE = require('../../../assets/icons/bowl-full.png');

type BowlDetailScreenProps = StackScreenProps<MapStackParamList, 'BowlDetail'>;

type BowlDetailView = Partial<BowlRecord> & {
  type?: 'cat' | 'dog';
  location?: string;
  neighborhood?: string;
};

function isUuidLike(value: string | undefined) {
  if (!value) {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

const BowlDetailScreen = ({ route, navigation }: BowlDetailScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const initialBowl = (route.params?.bowl as BowlDetailView | undefined) ?? undefined;
  const [bowl, setBowl] = useState<BowlDetailView | undefined>(initialBowl);
  const [selectedStatus, setSelectedStatus] = useState<'empty' | 'full'>(
    initialBowl?.status === 'full' ? 'full' : 'empty',
  );
  const [donationModalVisible, setDonationModalVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const addressText =
    bowl?.address_line?.trim() ||
    bowl?.location?.trim() ||
    bowl?.location_note?.trim() ||
    'Konum bilgisi mevcut değil';
  const addressHint = bowl?.location_description?.trim() || bowl?.neighborhood?.trim() || '';

  useEffect(() => {
    setBowl(initialBowl);
    setSelectedStatus(initialBowl?.status === 'full' ? 'full' : 'empty');
  }, [initialBowl]);

  useEffect(() => {
    if (!isUuidLike(initialBowl?.id)) {
      return;
    }

    let isMounted = true;

    const loadBowlDetail = async () => {
      try {
        const nextBowl = await getBowlDetail(initialBowl.id);

        if (!isMounted) {
          return;
        }

        setBowl((currentBowl) => ({
          ...(currentBowl ?? {}),
          ...nextBowl,
        }));
        setSelectedStatus(nextBowl.status === 'full' ? 'full' : 'empty');
      } catch (error) {
        const status =
          typeof error === 'object' && error && 'response' in error
            ? (error as { response?: { status?: number } }).response?.status
            : undefined;

        if (status !== 404) {
          console.error('Bowl detail fetch error:', error);
        }
      }
    };

    void loadBowlDetail();

    return () => {
      isMounted = false;
    };
  }, [initialBowl?.id]);

  if (!bowl) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mama Kabı Detayı</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: FONT_SIZES.lg, color: COLORS.textSecondary }}>
            Mama kabı bilgisi bulunamadı.
          </Text>
        </View>
      </View>
    );
  }

  const amounts = [50, 100, 150, 200];

  const handleDonate = () => {
    setDonationModalVisible(true);
  };

  const handleCloseDonationModal = () => {
    setDonationModalVisible(false);
    setSelectedAmount(null);
    setCustomAmount('');
  };

  const handleConfirmDonation = () => {
    const finalAmount = selectedAmount || parseFloat(customAmount) || 0;
    if (finalAmount > 0) {
      handleCloseDonationModal();
      navigation.navigate('Payment', { amount: finalAmount });
    }
  };

  const handleAddressEdit = () => {
    navigation.navigate('EditAddress', { bowl });
  };

  const handleStatusChange = async (nextStatus: 'empty' | 'full') => {
    if (!bowl?.id || !isUuidLike(bowl.id) || nextStatus === selectedStatus || isUpdatingStatus) {
      setSelectedStatus(nextStatus);
      return;
    }

    const previousStatus = selectedStatus;
    setSelectedStatus(nextStatus);
    setIsUpdatingStatus(true);

    try {
      const updatedBowl = await updateBowlStatus(bowl.id, { status: nextStatus });

      setBowl((currentBowl) => ({
        ...(currentBowl ?? {}),
        ...updatedBowl,
      }));
      setSelectedStatus(updatedBowl.status === 'full' ? 'full' : 'empty');
    } catch (error) {
      console.error('Bowl status update error:', error);
      setSelectedStatus(previousStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const isDonationValid = selectedAmount !== null || (customAmount && parseFloat(customAmount) > 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back Button - Floating */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + SPACING.md }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Top Section - Icon, Title, Status */}
      <View style={styles.topSection}>
        <View style={styles.iconContainer}>
          <Image
            source={selectedStatus === 'full' ? FULL_BOWL_IMAGE : EMPTY_BOWL_IMAGE}
            style={styles.bowlImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.bowlType}>Mama Kabı</Text>

        <View style={styles.statusBadgeContainer}>
          <View
            style={[
              styles.statusBadge,
              selectedStatus === 'full'
                ? styles.statusBadgeFull
                : styles.statusBadgeEmpty,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                selectedStatus === 'full' ? styles.dotFull : styles.dotEmpty,
              ]}
            />
            <Text
              style={[
                styles.statusText,
                selectedStatus === 'full'
                  ? styles.statusTextFull
                  : styles.statusTextEmpty,
              ]}
            >
              {selectedStatus === 'full' ? 'Dolu' : 'Boş'}
            </Text>
          </View>
        </View>
      </View>

      {/* Middle Section - Location & Status Update */}
      <View style={styles.middleSection}>
        <View style={styles.locationCard}>
          <View style={styles.locationIconContainer}>
            <Text style={styles.locationIcon}>📍</Text>
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationAddress}>{addressText}</Text>
            <Text style={styles.locationNeighborhood}>{addressHint}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Durumu Güncelle</Text>
        {isUpdatingStatus ? (
          <View style={styles.statusUpdatingRow}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.statusUpdatingText}>Durum guncelleniyor...</Text>
          </View>
        ) : null}
        <View style={styles.statusButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              selectedStatus === 'empty' && styles.statusButtonEmptyActive,
            ]}
            onPress={() => void handleStatusChange('empty')}
            disabled={isUpdatingStatus}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.statusButtonText,
                selectedStatus === 'empty' && styles.statusButtonTextActive,
              ]}
            >
              Boş
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              selectedStatus === 'full' && styles.statusButtonFullActive,
            ]}
            onPress={() => void handleStatusChange('full')}
            disabled={isUpdatingStatus}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.statusButtonText,
                selectedStatus === 'full' && styles.statusButtonTextActive,
              ]}
            >
              Dolu
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Section - Action Buttons */}
      <View style={[styles.bottomSection, { marginBottom: insets.bottom + SPACING.lg }]}>
        <TouchableOpacity
          style={styles.donateButton}
          onPress={handleDonate}
          activeOpacity={0.8}
        >
          <Text style={styles.donateButtonText}>Bu Mama Kabına Bağış Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={handleAddressEdit}
          activeOpacity={0.8}
        >
          <Text style={styles.editButtonText}>Adres Düzenle</Text>
        </TouchableOpacity>
      </View>

      {/* Donation Modal */}
      <Modal
        visible={donationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseDonationModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseDonationModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.donationModalContent, { paddingBottom: insets.bottom + SPACING.lg }]}>
                <View style={styles.modalHandle} />
                
                <Text style={styles.modalTitle}>Bağış Miktarı Seçin</Text>
                
                {/* Amount Selection Grid */}
                <View style={styles.amountGrid}>
                  {amounts.map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={[
                        styles.amountButton,
                        selectedAmount === amount && styles.amountButtonSelected,
                      ]}
                      onPress={() => {
                        setSelectedAmount(amount);
                        setCustomAmount(amount.toString());
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.amountButtonText,
                          selectedAmount === amount && styles.amountButtonTextSelected,
                        ]}
                      >
                        {amount} TL
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Custom Amount Input */}
                <Text style={styles.customAmountLabel}>Özel Tutar</Text>
                <View style={styles.customAmountContainer}>
                  <TouchableOpacity
                    style={styles.amountControlButton}
                    onPress={() => {
                      const currentAmount = parseFloat(customAmount) || 0;
                      if (currentAmount >= 50) {
                        const newAmount = currentAmount - 50;
                        setCustomAmount(newAmount.toString());
                        setSelectedAmount(null);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.amountControlButtonText}>−</Text>
                  </TouchableOpacity>
                  
                  <TextInput
                    style={styles.customAmountInput}
                    placeholder="Tutar girin"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={customAmount}
                    onChangeText={(text) => {
                      const numValue = parseFloat(text) || 0;
                      if (numValue >= 0) {
                        setCustomAmount(text);
                        setSelectedAmount(null);
                      }
                    }}
                    editable={false}
                  />
                  
                  <TouchableOpacity
                    style={styles.amountControlButton}
                    onPress={() => {
                      const currentAmount = parseFloat(customAmount) || 0;
                      const newAmount = currentAmount + 50;
                      setCustomAmount(newAmount.toString());
                      setSelectedAmount(null);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.amountControlButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                  style={[
                    styles.confirmDonationButton,
                    !isDonationValid && styles.confirmDonationButtonDisabled,
                  ]}
                  onPress={handleConfirmDonation}
                  disabled={!isDonationValid}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.confirmDonationButtonText,
                      !isDonationValid && styles.confirmDonationButtonTextDisabled,
                    ]}
                  >
                    Bağış Yap
                  </Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  headerSpacer: {
    width: 40,
  },
  backButton: {
    position: 'absolute',
    left: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: SPACING.xl + SPACING.md, // Geri butonu için boşluk
    paddingBottom: SPACING.sm,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bowlImage: {
    width: 280,
    height: 190,
  },
  bowlType: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  statusBadgeContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  statusBadgeFull: {
    backgroundColor: '#E8F5E9',
  },
  statusBadgeEmpty: {
    backgroundColor: '#FFEBEE',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  dotFull: {
    backgroundColor: '#66BB6A',
  },
  dotEmpty: {
    backgroundColor: '#EF5350',
  },
  statusText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  statusTextFull: {
    color: '#2E7D32',
  },
  statusTextEmpty: {
    color: '#C62828',
  },
  middleSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg + SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  locationIconContainer: {
    marginRight: SPACING.md,
    justifyContent: 'center',
  },
  locationIcon: {
    fontSize: 24,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationAddress: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  locationNeighborhood: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statusUpdatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  statusUpdatingText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  statusButton: {
    flex: 1,
    paddingVertical: SPACING.md - 2,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#FFF3E0',
    alignItems: 'center',
  },
  statusButtonEmptyActive: {
    backgroundColor: '#EF5350',
    borderColor: '#EF5350',
  },
  statusButtonFullActive: {
    backgroundColor: '#66BB6A',
    borderColor: '#66BB6A',
  },
  statusButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#795548',
  },
  statusButtonTextActive: {
    color: COLORS.white,
  },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
  },
  donateButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 16,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  donateButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  editButton: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  editButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: '#795548',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  donationModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    minHeight: height * 0.5,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  amountButton: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF3E0',
  },
  amountButtonSelected: {
    backgroundColor: '#FF8C42',
    borderColor: '#FF8C42',
  },
  amountButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: '#795548',
  },
  amountButtonTextSelected: {
    color: COLORS.white,
  },
  customAmountLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  customAmountInput: {
    flex: 1,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    textAlign: 'center',
  },
  amountControlButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  amountControlButtonText: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.white,
  },
  confirmDonationButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 16,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmDonationButtonDisabled: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmDonationButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  confirmDonationButtonTextDisabled: {
    color: '#999',
  },
});

export default BowlDetailScreen;
