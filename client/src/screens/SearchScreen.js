import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const SearchScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock kullanıcılar
  const allUsers = [
    {
      id: '1',
      name: 'Dr. Zeynep Kaya',
      username: 'dr_zeynep_kaya',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Veteriner hekim 🩺 Sokak hayvanları için gönüllü',
      followers: 1250,
    },
    {
      id: '2',
      name: 'Mehmet Arslan',
      username: 'mehmet_arslan',
      avatar: 'https://i.pravatar.cc/150?img=33',
      bio: 'Hayvan sever 🐾 Kedi mama desteği',
      followers: 892,
    },
    {
      id: '3',
      name: 'Ayşe Demir',
      username: 'ayse_demir',
      avatar: 'https://i.pravatar.cc/150?img=5',
      bio: 'Sokak kedileri gönüllüsü 🐱',
      followers: 2340,
    },
    {
      id: '4',
      name: 'Can Yılmaz',
      username: 'can_yilmaz',
      avatar: 'https://i.pravatar.cc/150?img=12',
      bio: 'Veteriner 🩺 Ücretsiz muayene',
      followers: 4567,
    },
    {
      id: '5',
      name: 'Elif Kara',
      username: 'elif_kara',
      avatar: 'https://i.pravatar.cc/150?img=9',
      bio: 'Hayvan barınağı kurucusu 🏠',
      followers: 3120,
    },
    {
      id: '6',
      name: 'Murat Öztürk',
      username: 'murat_ozturk',
      avatar: 'https://i.pravatar.cc/150?img=15',
      bio: 'Sokak hayvanları derneği başkanı',
      followers: 5890,
    },
    {
      id: '7',
      name: 'Selin Yıldız',
      username: 'selin_yildiz',
      avatar: 'https://i.pravatar.cc/150?img=20',
      bio: 'Hayvan hakları aktivisti ✊',
      followers: 7654,
    },
    {
      id: '8',
      name: 'Ahmet Kaya',
      username: 'ahmet_kaya',
      avatar: 'https://i.pravatar.cc/150?img=13',
      bio: 'Veteriner teknisyeni 🐕',
      followers: 1876,
    },
  ];

  // Filtreleme
  const filteredUsers = searchQuery.trim() === '' 
    ? allUsers 
    : allUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleUserPress = (user) => {
    navigation.navigate('UserProfile', {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        stats: {
          blogs: Math.floor(Math.random() * 50) + 5,
          followers: user.followers,
          following: Math.floor(Math.random() * 1000) + 50,
          rank: Math.floor(Math.random() * 100) + 1,
        },
        donations: {
          food: { current: Math.floor(Math.random() * 1500) + 500, goal: 2000 },
          medical: { current: Math.floor(Math.random() * 3000) + 1000, goal: 5000 },
        },
      }
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderUser = useCallback(({ item }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => handleUserPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.username}>@{item.username}</Text>
        {item.bio && <Text style={styles.bio} numberOfLines={1}>{item.bio}</Text>}
      </View>
    </TouchableOpacity>
  ), [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true}
      />

      {/* Header with Search */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Ara"
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {searchQuery.trim() === '' ? (
        // Boş durum - hiçbir şey gösterme
        <View style={styles.container} />
      ) : filteredUsers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>😔</Text>
          <Text style={styles.emptyTitle}>Kullanıcı Bulunamadı</Text>
          <Text style={styles.emptyText}>
            "{searchQuery}" için sonuç bulunamadı
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.secondary,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 40,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.secondary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  clearIcon: {
    fontSize: 18,
    color: COLORS.gray,
  },
  listContent: {
    paddingTop: SPACING.sm,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.lightGray,
  },
  userInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  username: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginTop: 2,
  },
  bio: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.secondary,
    marginTop: SPACING.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SearchScreen;
