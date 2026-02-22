import React, { useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const { width } = Dimensions.get('window');

const UserProfileScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('blogs');
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Route'dan gelen user bilgisi (zorunlu)
  const userParam = route.params?.user || {};
  
  // Güvenli default değerler
  const user = {
    name: userParam.name || 'Kullanıcı',
    username: userParam.username || 'kullanici',
    avatar: userParam.avatar || 'https://i.pravatar.cc/150',
    bio: userParam.bio || '',
    stats: {
      blogs: userParam.stats?.blogs || 0,
      followers: userParam.stats?.followers || 0,
      following: userParam.stats?.following || 0,
      rank: userParam.stats?.rank || 1,
    },
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  // Mock blog resimleri
  const userBlogs = [
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400',
    'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400',
  ];

  // Cover photo - rastgele hayvan temalı
  const coverPhoto = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800';

  return (
    <View style={styles.container}>
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
          {/* Back Button - En üstte */}
          <View style={[styles.backButtonContainer, { paddingTop: insets.top + SPACING.sm }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          </View>

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

          {/* Follow Button */}
          <TouchableOpacity 
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={handleFollowToggle}
            activeOpacity={0.8}
          >
            <Text style={styles.followButtonIcon}>{isFollowing ? '✓' : '👥'}</Text>
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'blogs' && styles.tabActive]}
            onPress={() => setActiveTab('blogs')}
          >
            <Text style={styles.tabIcon}>📝</Text>
            <Text style={[styles.tabText, activeTab === 'blogs' && styles.tabTextActive]}>
              Postlar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'announcements' && styles.tabActive]}
            onPress={() => setActiveTab('announcements')}
          >
            <Text style={styles.tabIcon}>🏷️</Text>
            <Text style={[styles.tabText, activeTab === 'announcements' && styles.tabTextActive]}>
              İlanlar
            </Text>
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
      </ScrollView>
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
  backButtonContainer: {
    position: 'absolute',
    top: 0,
    left: SPACING.md,
    zIndex: 10,
  },
  backButton: {
    padding: SPACING.sm,
  },
  backIcon: {
    fontSize: 32,
    color: COLORS.white,
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
  headerButtons: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  headerButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.secondary,
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
    marginBottom: SPACING.lg,
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
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    width: 220,
    height: 50,
  },
  followingButton: {
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  followButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  followButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  followingButtonText: {
    color: COLORS.secondary,
  },
  circularProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  circularProgressContainer: {
    alignItems: 'center',
  },
  circleContainer: {
    marginBottom: SPACING.md,
  },
  circleBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circleProgress: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 12,
    borderLeftColor: 'transparent',
  },
  circleInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  progressValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  progressUnit: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray,
    marginLeft: 2,
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
    flexDirection: 'row',
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
    fontSize: 18,
    marginRight: SPACING.xs,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.gray,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
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
});

export default UserProfileScreen;
