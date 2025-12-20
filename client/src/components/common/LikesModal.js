import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZES } from '../../constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LikesModal = ({ visible, onClose, likes = [] }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [followingUsers, setFollowingUsers] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleToggleFollow = (userId) => {
    setFollowingUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleUserPress = (user) => {
    onClose();
    navigation.navigate('UserProfile', {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: 'Hayvan sever 🐾 Sokak dostlarımız için gönüllü',
        stats: {
          blogs: Math.floor(Math.random() * 50) + 5,
          followers: Math.floor(Math.random() * 5000) + 100,
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

  // Mock beğenenler - bazıları takip ediliyor
  const mockLikes = [
    {
      id: '1',
      name: 'Rebecca Jones',
      username: 'rebecca_jones',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isFollowing: true, // Zaten takip ediliyor
    },
    {
      id: '2',
      name: 'Yiğit Arslan',
      username: 'iamyigit__',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isFollowing: false,
    },
    {
      id: '3',
      name: 'Merve Naztatlı',
      username: 'mervenaztatli10',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isFollowing: true,
    },
    {
      id: '4',
      name: 'Dr. Khen Sick',
      username: 'drkhensick_hh',
      avatar: 'https://i.pravatar.cc/150?img=4',
      isFollowing: false,
    },
    {
      id: '5',
      name: 'Ahmet Yılmaz',
      username: 'ahmet_yilmaz',
      avatar: 'https://i.pravatar.cc/150?img=5',
      isFollowing: false,
    },
    {
      id: '6',
      name: 'Zeynep Kaya',
      username: 'zeynep_k',
      avatar: 'https://i.pravatar.cc/150?img=6',
      isFollowing: true,
    },
    {
      id: '7',
      name: 'Can Demir',
      username: 'can_demir',
      avatar: 'https://i.pravatar.cc/150?img=7',
      isFollowing: false,
    },
  ];

  const renderLike = ({ item }) => {
    const isFollowing = followingUsers[item.id] !== undefined 
      ? followingUsers[item.id] 
      : item.isFollowing;

    return (
      <View style={styles.likeItem}>
        <TouchableOpacity 
          style={styles.likeUserInfo}
          onPress={() => handleUserPress(item)}
          activeOpacity={0.7}
        >
          <Image source={{ uri: item.avatar }} style={styles.likeAvatar} />
          <View style={styles.likeInfo}>
            <Text style={styles.likeName}>{item.name}</Text>
            <Text style={styles.likeUsername}>@{item.username}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.followButton,
            isFollowing && styles.followingButton
          ]}
          onPress={() => handleToggleFollow(item.id)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.followButtonText,
            isFollowing && styles.followingButtonText
          ]}>
            {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
          </Text>
        </TouchableOpacity>
      </View>
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerHandle} />
            <Text style={styles.headerTitle}>Beğenenler</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Likes List */}
          <FlatList
            data={mockLikes}
            renderItem={renderLike}
            keyExtractor={(item) => item.id}
            style={styles.likesList}
            contentContainerStyle={styles.likesListContent}
            showsVerticalScrollIndicator={false}
          />
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  likeUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  followButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    width: 140,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
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

export default LikesModal;
