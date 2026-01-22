import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const { width, height } = Dimensions.get('window');

const BowlDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { bowl } = route.params;
  const [selectedStatus, setSelectedStatus] = useState(bowl.status);
  const [donationModalVisible, setDonationModalVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

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

  const isDonationValid = selectedAmount !== null || (customAmount && parseFloat(customAmount) > 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
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

      {/* Top Section - Icon, Title, Status */}
      <View style={styles.topSection}>
        <View style={styles.iconContainer}>
          <View style={[
            styles.iconCircle,
            selectedStatus === 'full' ? styles.iconCircleGreen : styles.iconCircleRed
          ]}>
            <Text style={styles.iconText}>
              {bowl.type === 'cat' ? '🐱' : '🐶'}
            </Text>
          </View>
        </View>

        <Text style={styles.bowlType}>
          {bowl.type === 'cat' ? 'Kedi Mama Kabı' : 'Köpek Mama Kabı'}
        </Text>

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
            <Text style={styles.locationAddress}>{bowl.location}</Text>
            <Text style={styles.locationNeighborhood}>{bowl.neighborhood}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Durumu Güncelle</Text>
        <View style={styles.statusButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              selectedStatus === 'empty' && styles.statusButtonActive,
            ]}
            onPress={() => setSelectedStatus('empty')}
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
              selectedStatus === 'full' && styles.statusButtonActive,
            ]}
            onPress={() => setSelectedStatus('full')}
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
                    {isDonationValid 
                      ? `Bağış Yap (${selectedAmount || customAmount} TL)` 
                      : 'Bağış Yap'}
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
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
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
  headerSpacer: {
    width: 40,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  iconCircleGreen: {
    backgroundColor: '#66BB6A',
  },
  iconCircleRed: {
    backgroundColor: '#EF5350',
  },
  iconText: {
    fontSize: 60,
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
  statusButton: {
    flex: 1,
    paddingVertical: SPACING.md - 2,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#FFF3E0',
    alignItems: 'center',
  },
  statusButtonActive: {
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

