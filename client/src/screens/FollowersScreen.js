import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const FollowersScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { username, activeTab: initialTab } = route.params;
  const [activeTab, setActiveTab] = useState(initialTab || 'followers');
  const [followingUsers, setFollowingUsers] = useState([]);

  // Mock takipçiler
  const mockFollowers = [
    { id: 1, name: 'Ali Hasan', username: 'alihasanyzc', avatar: 'https://i.pravatar.cc/150?img=1', isFollowing: false },
    { id: 2, name: 'Gizem', username: 'gizemisilx', avatar: 'https://i.pravatar.cc/150?img=2', isFollowing: true },
    { id: 3, name: 'Dnzblg', username: 'dnizblge', avatar: 'https://i.pravatar.cc/150?img=3', isFollowing: false },
    { id: 4, name: 'TOTEM YAPI', username: 'totemyapi', avatar: 'https://i.pravatar.cc/150?img=4', isFollowing: false },
    { id: 5, name: 'SALİM MÜRTEZAOĞLU', username: 'sm.giyim', avatar: 'https://i.pravatar.cc/150?img=5', isFollowing: false },
    { id: 6, name: 'Şule', username: 'ssuleyzc', avatar: 'https://i.pravatar.cc/150?img=6', isFollowing: true },
    { id: 7, name: 'Şükran Işıl Sinan Yzc', username: 'isil7649', avatar: 'https://i.pravatar.cc/150?img=7', isFollowing: true },
    { id: 8, name: 'Hason', username: 'hasonunprivii', avatar: 'https://i.pravatar.cc/150?img=8', isFollowing: true },
    { id: 9, name: 'Sedanur IŞIL', username: 'sedanurisil', avatar: 'https://i.pravatar.cc/150?img=9', isFollowing: true },
  ];

  // Mock takip edilenler
  const mockFollowing = [
    { id: 10, name: 'Zeynep Kaya', username: 'zeynep_k', avatar: 'https://i.pravatar.cc/150?img=10', isFollowing: true },
    { id: 11, name: 'Ahmet Yılmaz', username: 'ahmet_y', avatar: 'https://i.pravatar.cc/150?img=11', isFollowing: true },
    { id: 12, name: 'Mehmet Demir', username: 'mehmet_d', avatar: 'https://i.pravatar.cc/150?img=12', isFollowing: true },
  ];

  const handleToggleFollow = (userId) => {
    setFollowingUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleUserPress = (user) => {
    navigation.push('UserProfile', { 
      user: {
        ...user,
        bio: user.bio || 'Hayvansever 🐾',
        stats: {
          blogs: Math.floor(Math.random() * 50) + 5,
          followers: Math.floor(Math.random() * 1000) + 50,
          following: Math.floor(Math.random() * 500) + 20,
          rank: Math.floor(Math.random() * 100) + 1,
        },
        donations: {
          food: { 
            current: Math.floor(Math.random() * 2000) + 100, 
            goal: 2000 
          },
          medical: { 
            current: Math.floor(Math.random() * 5000) + 200, 
            goal: 5000 
          },
        },
      }
    });
  };

  const renderUser = ({ item }) => {
    const isFollowing = item.isFollowing || followingUsers.includes(item.id);
    
    return (
      <View style={styles.userItem}>
        <TouchableOpacity 
          style={styles.userContent}
          onPress={() => handleUserPress(item)}
          activeOpacity={0.7}
        >
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{item.username}</Text>
            <Text style={styles.fullName}>{item.name}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={() => handleToggleFollow(item.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
            {isFollowing ? 'Takiptesin' : 'Takip Et'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const data = activeTab === 'followers' ? mockFollowers : mockFollowing;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{username}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'followers' && styles.activeTab]}
          onPress={() => setActiveTab('followers')}
        >
          <Text style={[styles.tabText, activeTab === 'followers' && styles.activeTabText]}>
            554 Takipçi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'following' && styles.activeTab]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>
            760 Takip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Ara</Text>
      </View>

      {/* User List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUser}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
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
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  backButton: {
    padding: SPACING.xs,
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.secondary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  headerSpacer: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.secondary,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  searchPlaceholder: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.lightGray,
    marginRight: SPACING.md,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  fullName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  followButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  followingButton: {
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    width: 140,
    height: 36,
  },
  followButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  followingButtonText: {
    color: COLORS.secondary,
  },
});

export default FollowersScreen;
