import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ImageBackground,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const { width, height } = Dimensions.get('window');

// Modern gradyan progress bar componenti
const GradientProgress = ({ current, goal, label, colors }) => {
  const progress = (current / goal) * 100;
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressAmount}>₺{current.toLocaleString()}</Text>
      </View>
      
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, { width: widthInterpolate }]}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressGradient}
          />
        </Animated.View>
      </View>
      
      <Text style={styles.progressGoal}>Hedef: ₺{goal.toLocaleString()}</Text>
    </View>
  );
};

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('blogs');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnim = useRef(new Animated.Value(width)).current;
  
  // Kendi profil bilgilerimiz (mock data)
  const user = {
    name: 'Ahmet Yılmaz',
    username: 'ahmetyilmaz',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Hayvan sever 🐾 | Doğa fotoğrafçısı 📸 | Sokak hayvanlarına yardım ediyorum 💚',
    stats: {
      blogs: 24,
      followers: 1250,
      following: 432,
      rank: 3,
    },
    donations: {
      food: {
        current: 2450,
        goal: 5000,
      },
      medical: {
        current: 1820,
        goal: 3000,
      },
    },
  };

  // Mock blog resimleri
  const userBlogs = [
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400',
    'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400',
  ];

  // Cover photo - rastgele hayvan temalı
  const coverPhoto = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800';

  // Drawer açma/kapama fonksiyonları
  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.spring(drawerAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: width,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setDrawerVisible(false);
    });
  };

  // Menü seçenekleri
  const menuItems = [
    { 
      id: 1, 
      icon: '✏️', 
      title: 'Profili Düzenle', 
      action: () => navigation.navigate('EditProfile', { user })
    },
    { 
      id: 2, 
      icon: '🔒', 
      title: 'Gizlilik', 
      action: () => navigation.navigate('Privacy')
    },
    { 
      id: 3, 
      icon: '📄', 
      title: 'Hakkında', 
      action: () => navigation.navigate('About')
    },
    { 
      id: 4, 
      icon: '❓', 
      title: 'Yardım', 
      action: () => navigation.navigate('Help')
    },
    { 
      id: 5, 
      icon: '🚪', 
      title: 'Çıkış Yap', 
      action: () => console.log('Çıkış'), 
      isDanger: true 
    },
  ];

  // PanResponder - Sağdan sola kaydırma hareketi
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Sağ kenardan başlayan ve sola doğru kaydırma
        const { dx, moveX } = gestureState;
        return moveX > width - 50 && dx < -10;
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        if (dx < 0) {
          // Sola kaydırma - drawer açılıyor
          const newValue = Math.max(0, width + dx);
          drawerAnim.setValue(newValue);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, vx } = gestureState;
        
        // Hızlı kaydırma veya yarıdan fazla kaydırma
        if (vx < -0.5 || dx < -width * 0.3) {
          // Drawer'ı aç
          setDrawerVisible(true);
          Animated.spring(drawerAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        } else {
          // Drawer'ı kapat
          Animated.timing(drawerAnim, {
            toValue: width,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Photo Section */}
        <View style={styles.coverSection}>
          <ImageBackground
            source={{ uri: coverPhoto }}
            style={styles.coverPhoto}
            imageStyle={styles.coverPhotoImage}
          >
            {/* Gradient Overlay */}
            <View style={styles.coverOverlay} />
          </ImageBackground>

          {/* Avatar positioned over cover photo */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          
          {/* Rank Badge */}
          <View style={styles.rankBadge}>
            <Text style={styles.rankEmoji}>🏆</Text>
            <Text style={styles.rankText}>
              Hayvanseverler arasında {user.stats.rank}.
            </Text>
          </View>

          <Text style={styles.bio}>{user.bio}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem} onPress={() => setActiveTab('blogs')}>
              <Text style={styles.statValue}>{user.stats.blogs}</Text>
              <Text style={styles.statLabel}>Post</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => navigation.navigate('Followers', { 
                username: user.username, 
                activeTab: 'followers' 
              })}
            >
              <Text style={styles.statValue}>{user.stats.followers}</Text>
              <Text style={styles.statLabel}>Takipçi</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => navigation.navigate('Followers', { 
                username: user.username, 
                activeTab: 'following' 
              })}
            >
              <Text style={styles.statValue}>{user.stats.following}</Text>
              <Text style={styles.statLabel}>Takip</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Etkinlikler Section */}
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>Etkinlikler</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsScrollContent}
          >
            <TouchableOpacity style={styles.eventCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400' }}
                style={styles.eventImage}
              />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Mama Dağıtalım</Text>
                <View style={styles.eventDetail}>
                  <Text style={styles.eventIcon}>📍</Text>
                  <Text style={styles.eventText}>Denizli Hayvan Barınağı</Text>
                </View>
                <View style={styles.eventDetail}>
                  <Text style={styles.eventIcon}>📅</Text>
                  <Text style={styles.eventText}>27 Kasım</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.eventCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' }}
                style={styles.eventImage}
              />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Sokak Temizliği</Text>
                <View style={styles.eventDetail}>
                  <Text style={styles.eventIcon}>📍</Text>
                  <Text style={styles.eventText}>Merkez Park</Text>
                </View>
                <View style={styles.eventDetail}>
                  <Text style={styles.eventIcon}>📅</Text>
                  <Text style={styles.eventText}>5 Aralık</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.eventCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400' }}
                style={styles.eventImage}
              />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Aşı Kampanyası</Text>
                <View style={styles.eventDetail}>
                  <Text style={styles.eventIcon}>📍</Text>
                  <Text style={styles.eventText}>Atatürk Mahallesi</Text>
                </View>
                <View style={styles.eventDetail}>
                  <Text style={styles.eventIcon}>📅</Text>
                  <Text style={styles.eventText}>12 Aralık</Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Donation Stats */}
        <View style={styles.donationSection}>
          <View style={styles.donationHeader}>
            <Text style={styles.donationIcon}>💰</Text>
            <Text style={styles.donationTitle}>Bağış İstatistikleri</Text>
          </View>
          
          <GradientProgress
            current={user.donations.food.current}
            goal={user.donations.food.goal}
            label="🍖 Mama Bağışı"
            colors={['#FF6B6B', '#FF8E53', '#FFA94D']}
          />
          
          <GradientProgress
            current={user.donations.medical.current}
            goal={user.donations.medical.goal}
            label="💊 Tedavi Bağışı"
            colors={['#4ECDC4', '#44A08D', '#096B72']}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'blogs' && styles.tabActive]}
            onPress={() => setActiveTab('blogs')}
          >
            <Text style={[styles.tabIcon, activeTab === 'blogs' && styles.tabIconActive]}>📝</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'announcements' && styles.tabActive]}
            onPress={() => setActiveTab('announcements')}
          >
            <Text style={[styles.tabIcon, activeTab === 'announcements' && styles.tabIconActive]}>📢</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
            onPress={() => setActiveTab('saved')}
          >
            <Text style={[styles.tabIcon, activeTab === 'saved' && styles.tabIconActive]}>🔖</Text>
          </TouchableOpacity>
        </View>

        {/* Blog Grid */}
        {activeTab === 'blogs' && (
          <View style={styles.blogGrid}>
            {userBlogs.map((image, index) => (
              <TouchableOpacity key={index} style={styles.blogGridItem}>
                <Image
                  source={{ uri: image }}
                  style={styles.blogGridImage}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Announcements Placeholder */}
        {activeTab === 'announcements' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📢</Text>
            <Text style={styles.emptyStateText}>Henüz ilan yok</Text>
          </View>
        )}

        {/* Saved Placeholder */}
        {activeTab === 'saved' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔖</Text>
            <Text style={styles.emptyStateText}>Henüz kaydedilen içerik yok</Text>
          </View>
        )}
      </ScrollView>

      {/* Drawer Menu Modal */}
      <Modal
        visible={drawerVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeDrawer}
      >
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={styles.drawerOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.drawerContent,
                  {
                    transform: [{ translateX: drawerAnim }],
                  },
                ]}
              >
                {/* Drawer Header */}
                <View style={[styles.drawerHeader, { paddingTop: insets.top + SPACING.md }]}>
                  <View style={styles.drawerUserInfo}>
                    <Image
                      source={{ uri: user.avatar }}
                      style={styles.drawerAvatar}
                    />
                    <View style={styles.drawerUserText}>
                      <Text style={styles.drawerUserName}>{user.name}</Text>
                      <Text style={styles.drawerUserEmail}>@{user.username}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.closeDrawerButton}
                    onPress={closeDrawer}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.closeDrawerIcon}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Drawer Menu Items */}
                <ScrollView
                  style={styles.drawerMenu}
                  showsVerticalScrollIndicator={false}
                >
                  {menuItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.drawerMenuItem,
                        item.isDanger && styles.drawerMenuItemDanger,
                      ]}
                      onPress={() => {
                        closeDrawer();
                        setTimeout(() => item.action(), 300);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.drawerMenuIcon}>{item.icon}</Text>
                      <Text
                        style={[
                          styles.drawerMenuText,
                          item.isDanger && styles.drawerMenuTextDanger,
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.drawerMenuArrow}>›</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Drawer Footer */}
                <View style={[styles.drawerFooter, { paddingBottom: insets.bottom + SPACING.md }]}>
                  <Text style={styles.drawerFooterText}>Askıda Mama v1.0.0</Text>
                </View>
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
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  coverSection: {
    position: 'relative',
    height: 240,
    backgroundColor: COLORS.background,
  },
  coverPhoto: {
    width: '100%',
    height: 240,
  },
  coverPhotoImage: {
    resizeMode: 'cover',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -60,
    left: '50%',
    marginLeft: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    padding: 4,
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
  },
  profileSection: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    marginTop: 0,
    paddingTop: SPACING.xl + SPACING.xl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  name: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  username: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    marginBottom: SPACING.md,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginBottom: SPACING.md,
  },
  rankEmoji: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  rankText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#E67E22',
  },
  bio: {
    fontSize: FONT_SIZES.md,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: SPACING.ms,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginTop: SPACING.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.lightGray,
  },
  eventsSection: {
    backgroundColor: COLORS.white,
    paddingTop: 0,
    paddingBottom: SPACING.md,
    marginTop: 0,
    marginBottom: SPACING.xs,
    
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.secondary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  eventsScrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  eventCard: {
    width: 280,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: SPACING.md,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
  },
  eventImage: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.lightGray,
  },
  eventInfo: {
    padding: SPACING.sm,
  },
  eventTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventIcon: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  eventText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  donationSection: {
    backgroundColor: COLORS.white,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  donationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  donationIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  donationTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  progressContainer: {
    marginBottom: SPACING.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  progressAmount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: COLORS.accentLight,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressGradient: {
    flex: 1,
    borderRadius: 6,
  },
  progressGoal: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
    marginTop: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabIcon: {
    fontSize: 28,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  blogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.white,
  },
  blogGridItem: {
    width: width / 2,
    height: width / 2,
    padding: 0,
    borderWidth: 0.5,
    borderColor: COLORS.white,
  },
  blogGridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray,
  },
  // Drawer Styles
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContent: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  drawerHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  drawerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  drawerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  drawerUserText: {
    flex: 1,
  },
  drawerUserName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  drawerUserEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
  },
  closeDrawerButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeDrawerIcon: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '600',
  },
  drawerMenu: {
    flex: 1,
    paddingTop: SPACING.md,
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  drawerMenuItemDanger: {
    backgroundColor: '#FFF5F5',
  },
  drawerMenuIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
    width: 32,
  },
  drawerMenuText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  drawerMenuTextDanger: {
    color: '#E53E3E',
  },
  drawerMenuArrow: {
    fontSize: 24,
    color: COLORS.gray,
    fontWeight: '300',
  },
  drawerFooter: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.accentLight,
    alignItems: 'center',
  },
  drawerFooterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
});

export default ProfileScreen;
