import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { AxiosError } from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { searchProfiles, type ProfileSearchRecord } from '../services/profiles';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../types/navigation';
import type { UserProfilePreview } from '../types/domain';

type SearchScreenProps = StackScreenProps<DiscoverStackParamList, 'Search'>;

const DEFAULT_AVATAR_URL =
  'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png';

const SearchScreen = ({ navigation }: SearchScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<ProfileSearchRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const normalizedQuery = searchQuery.trim();

  useEffect(() => {
    let isActive = true;

    if (!normalizedQuery) {
      setUsers([]);
      setIsSearching(false);
      setSearchError(null);
      return () => {
        isActive = false;
      };
    }

    setIsSearching(true);
    setSearchError(null);

    const timeoutId = setTimeout(() => {
      searchProfiles(normalizedQuery)
        .then((results) => {
          if (!isActive) return;
          setUsers(results);
        })
        .catch((error) => {
          if (!isActive) return;

          setUsers([]);

          if (error instanceof AxiosError && error.response?.status === 503) {
            setSearchError('Arama servisine şu anda ulaşılamıyor.');
            return;
          }

          setSearchError('Arama yapılırken bir hata oluştu.');
        })
        .finally(() => {
          if (isActive) {
            setIsSearching(false);
          }
        });
    }, 250);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [normalizedQuery]);

  const handleUserPress = useCallback((user: ProfileSearchRecord) => {
    const profilePreview: UserProfilePreview = {
      id: user.id,
      name: user.name || user.full_name,
      username: user.username,
      avatar: user.avatar ?? DEFAULT_AVATAR_URL,
      bio: user.bio ?? undefined,
      stats: {
        blogs: user.stats.posts,
        followers: user.stats.followers,
        following: user.stats.following,
      },
      is_following: user.is_following,
    };

    navigation.navigate('UserProfile', {
      user: profilePreview,
    });
  }, [navigation]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderUser = useCallback(({ item }: { item: ProfileSearchRecord }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => handleUserPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.avatar ?? DEFAULT_AVATAR_URL }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name || item.full_name}</Text>
        <Text style={styles.username}>@{item.username}</Text>
        {item.bio ? <Text style={styles.bio} numberOfLines={1}>{item.bio}</Text> : null}
      </View>
    </TouchableOpacity>
  ), [handleUserPress]);

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true}
      />

      {/* Header with Search */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.xs }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Entypo 
            name="magnifying-glass" 
            size={16} 
            color={COLORS.gray} 
            style={styles.searchIcon}
          />
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
      {normalizedQuery === '' ? (
        // Boş durum - hiçbir şey gösterme
        <View style={styles.container} />
      ) : isSearching ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : searchError ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Arama Yapılamadı</Text>
          <Text style={styles.emptyText}>{searchError}</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Kullanıcı Bulunamadı</Text>
          <Text style={styles.emptyText}>
            "{searchQuery}" için sonuç bulunamadı
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
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
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
