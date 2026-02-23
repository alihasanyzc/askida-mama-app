import React, { useState, useRef } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Entypo, Ionicons, FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const { width } = Dimensions.get('window');

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

  // Tüm postları BlogCard formatında listele (Instagram galerisi için)
  const profileBlogs = userBlogs.map((image, index) => ({
    author: { name: user.name, avatar: user.avatar },
    date: 'Birkaç gün önce',
    image,
    title: '',
    description: user.bio || 'Hayvan sever 🐾',
    likes: 5 + (index % 30),
    comments: index % 15,
    category: 'Post',
  }));

  const openBlogGallery = (index) => {
    navigation.navigate('BlogDetail', { blogs: profileBlogs, initialIndex: index });
  };

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

  const closeDrawer = (onClosed) => {
    Animated.timing(drawerAnim, {
      toValue: width,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setDrawerVisible(false);
      if (typeof onClosed === 'function') onClosed();
    });
  };

  // Menü seçenekleri (drawer - sağdan açılır)
  const menuItems = [
    { 
      id: 1, 
      iconLib: 'AntDesign', 
      iconName: 'calendar', 
      title: 'Etkinlikler', 
      action: () => closeDrawer(() => navigation.navigate('EventsList'))
    },
    { 
      id: 2, 
      iconLib: 'AntDesign', 
      iconName: 'edit', 
      title: 'Profili Düzenle', 
      action: () => closeDrawer(() => navigation.navigate('EditProfile', { user }))
    },
    { 
      id: 3, 
      iconLib: 'AntDesign', 
      iconName: 'lock', 
      title: 'Gizlilik', 
      action: () => closeDrawer(() => navigation.navigate('Privacy'))
    },
    { 
      id: 4, 
      iconLib: 'FontAwesome', 
      iconName: 'info-circle', 
      title: 'Hakkında', 
      action: () => closeDrawer(() => navigation.navigate('About'))
    },
    { 
      id: 5, 
      iconLib: 'Entypo', 
      iconName: 'help', 
      title: 'Yardım', 
      action: () => closeDrawer(() => navigation.navigate('Help'))
    },
    { 
      id: 6, 
      iconLib: 'MaterialIcons', 
      iconName: 'logout', 
      title: 'Çıkış Yap', 
      action: () => closeDrawer(() => console.log('Çıkış')), 
      isDanger: true 
    },
  ];

  const renderDrawerIcon = (item) => {
    const iconColor = item.isDanger ? '#E53E3E' : COLORS.text;
    const size = 22;
    switch (item.iconLib) {
      case 'AntDesign':
        return <AntDesign name={item.iconName} size={size} color={iconColor} style={styles.drawerMenuIcon} />;
      case 'FontAwesome':
        return <FontAwesome name={item.iconName} size={size} color={iconColor} style={styles.drawerMenuIcon} />;
      case 'Entypo':
        return <Entypo name={item.iconName} size={size} color={iconColor} style={styles.drawerMenuIcon} />;
      case 'MaterialIcons':
        return <MaterialIcons name={item.iconName} size={size} color={iconColor} style={styles.drawerMenuIcon} />;
      default:
        return null;
    }
  };

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

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'blogs' && styles.tabActive]}
            onPress={() => setActiveTab('blogs')}
          >
            <Entypo
              name="grid"
              size={26}
              color={activeTab === 'blogs' ? COLORS.primary : COLORS.gray}
              style={activeTab === 'blogs' ? styles.tabIconActive : styles.tabIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'announcements' && styles.tabActive]}
            onPress={() => setActiveTab('announcements')}
          >
            <Ionicons
              name="megaphone-outline"
              size={26}
              color={activeTab === 'announcements' ? COLORS.primary : COLORS.gray}
              style={activeTab === 'announcements' ? styles.tabIconActive : styles.tabIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
            onPress={() => setActiveTab('saved')}
          >
            <FontAwesome
              name="bookmark-o"
              size={24}
              color={activeTab === 'saved' ? COLORS.primary : COLORS.gray}
              style={activeTab === 'saved' ? styles.tabIconActive : styles.tabIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Blog Grid */}
        {activeTab === 'blogs' && (
          <View style={styles.blogGrid}>
            {userBlogs.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={styles.blogGridItem}
                onPress={() => openBlogGallery(index)}
                activeOpacity={0.9}
              >
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
                      {renderDrawerIcon(item)}
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
    opacity: 0.6,
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
    marginRight: SPACING.md,
    width: 28,
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
