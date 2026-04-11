import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AxiosError } from 'axios';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';
import { getStoredAuthSession } from '../../services/auth';
import { listPostLikes, type PostLikeUserRecord } from '../../services/posts';
import type { UserProfilePreview } from '../../types/domain';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DEFAULT_AVATAR_URL =
  'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png';

type LikesModalProps = {
  visible: boolean;
  onClose: () => void;
  postId?: string;
};

const LikesModal = ({ visible, onClose, postId }: LikesModalProps): React.JSX.Element => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const navigation = useNavigation<any>();
  const [likes, setLikes] = useState<PostLikeUserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadLikes = useCallback(async () => {
    if (!postId) {
      setLikes([]);
      setErrorMessage(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const postLikes = await listPostLikes(postId);
      setLikes(postLikes);
    } catch (error) {
      setLikes([]);

      if (error instanceof AxiosError && error.response?.status === 503) {
        setErrorMessage('Beğenenler şu anda yüklenemiyor.');
      } else {
        setErrorMessage('Beğenenler yüklenirken bir hata oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (!visible) {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
      return;
    }

    void loadLikes();
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [loadLikes, slideAnim, visible]);

  const handleClose = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [onClose, slideAnim]);

  const handleUserPress = useCallback(async (user: PostLikeUserRecord) => {
    handleClose();

    const session = await getStoredAuthSession();
    const ownProfileId = session?.profile?.id ?? session?.user?.id;

    if (ownProfileId && user.id === ownProfileId) {
      navigation.navigate('Profil', {
        screen: 'ProfileMain',
      });
      return;
    }

    const profilePreview: UserProfilePreview = {
      id: user.id,
      name: user.full_name,
      username: user.username,
      avatar: user.avatar_url ?? DEFAULT_AVATAR_URL,
    };

    navigation.navigate('Kesfet', {
      screen: 'UserProfile',
      params: {
        user: profilePreview,
      },
    });
  }, [handleClose, navigation]);

  const renderLike = useCallback(({ item }: { item: PostLikeUserRecord }) => (
    <TouchableOpacity
      style={styles.likeItem}
      onPress={() => handleUserPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.avatar_url ?? DEFAULT_AVATAR_URL }}
        style={styles.likeAvatar}
      />
      <View style={styles.likeInfo}>
        <Text style={styles.likeName}>{item.full_name}</Text>
        <Text style={styles.likeUsername}>@{item.username}</Text>
      </View>
    </TouchableOpacity>
  ), [handleUserPress]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      );
    }

    if (errorMessage) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>{errorMessage}</Text>
        </View>
      );
    }

    if (!likes.length) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Henüz beğeni yok</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={likes}
        renderItem={renderLike}
        keyExtractor={(item) => item.id}
        style={styles.likesList}
        contentContainerStyle={styles.likesListContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerHandle} />
            <Text style={styles.headerTitle}>Beğenenler</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {renderContent()}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: SCREEN_HEIGHT * 0.6,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
    position: 'relative',
  },
  headerHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  closeButton: {
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.md,
    padding: SPACING.xs,
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.gray,
  },
  likesList: {
    flex: 1,
  },
  likesListContent: {
    paddingVertical: SPACING.sm,
  },
  likeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  likeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGray,
  },
  likeInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  likeName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  likeUsername: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginTop: 2,
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  stateText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default LikesModal;
