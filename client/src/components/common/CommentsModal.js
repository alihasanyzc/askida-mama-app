import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../../constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CommentsModal = ({ visible, onClose, comments = [], postAuthor, category, postTitle }) => {
  const insets = useSafeAreaInsets();
  const [commentText, setCommentText] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [commentLikes, setCommentLikes] = useState({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const inputRef = useRef(null);

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

  useEffect(() => {
    if (!visible) return;

    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
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

  const handleSendComment = () => {
    if (commentText.trim()) {
      // Yorum gönderme işlemi burada yapılacak
      console.log('Yorum:', commentText);
      const textToSend = commentText.trim();
      setCommentText('');
      setInputHeight(40); // Reset input height
      
      // Klavye açık kalması için input'a tekrar focus yap
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleContentSizeChange = (event) => {
    const height = event.nativeEvent.contentSize.height;
    const newHeight = Math.min(Math.max(40, height), 100); // Min 40, Max 100
    setInputHeight(newHeight);
  };

  const handleLikeComment = (commentId, currentLikes, isLiked) => {
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: {
        likes: isLiked ? currentLikes - 1 : currentLikes + 1,
        isLiked: !isLiked,
      }
    }));
  };

  // Kategoriye göre dinamik yorumlar
  const getCategoryComments = () => {
    const commentsByCategory = {
      'Sağlık': [
        {
          id: '1',
          user: { name: 'Dr. Mehmet Yılmaz', avatar: 'https://i.pravatar.cc/150?img=11' },
          text: 'Çok önemli bilgiler paylaşmışsınız, teşekkürler! 🐾',
          timestamp: '5dk',
          likes: 24,
          isLiked: false,
        },
        {
          id: '2',
          user: { name: 'Ayşe Kaya', avatar: 'https://i.pravatar.cc/150?img=5' },
          text: 'Bu konuda veterinere danışmak en doğrusu',
          timestamp: '12dk',
          likes: 12,
          isLiked: false,
        },
        {
          id: '3',
          user: { name: 'Can Arslan', avatar: 'https://i.pravatar.cc/150?img=12' },
          text: 'Sokak hayvanları için çok faydalı bir paylaşım 🙏',
          timestamp: '1s',
          likes: 89,
          isLiked: true,
        },
        {
          id: '4',
          user: { name: 'Elif Şahin', avatar: 'https://i.pravatar.cc/150?img=16' },
          text: 'Veteriner arkadaşlara sordum, çok doğru bilgiler 👍',
          timestamp: '25dk',
          likes: 34,
          isLiked: false,
        },
      ],
      'Mama & Barınma': [
        {
          id: '1',
          user: { name: 'Zeynep Demir', avatar: 'https://i.pravatar.cc/150?img=9' },
          text: 'Kış aylarında mama desteği çok önemli! 🥘',
          timestamp: '3dk',
          likes: 45,
          isLiked: false,
        },
        {
          id: '2',
          user: { name: 'Murat Öztürk', avatar: 'https://i.pravatar.cc/150?img=15' },
          text: 'Biz de mahallemizde düzenli mama bırakıyoruz',
          timestamp: '8dk',
          likes: 67,
          isLiked: true,
        },
        {
          id: '3',
          user: { name: 'Elif Yıldız', avatar: 'https://i.pravatar.cc/150?img=20' },
          text: 'Harika bir inisiyatif! Nasıl yardımcı olabilirim?',
          timestamp: '15dk',
          likes: 23,
          isLiked: false,
        },
        {
          id: '4',
          user: { name: 'Ali Kılıç', avatar: 'https://i.pravatar.cc/150?img=14' },
          text: 'Bizim mahallede de başlatalım bunu 🐕',
          timestamp: '30dk',
          likes: 56,
          isLiked: false,
        },
      ],
      'Yardım Hikayeleri': [
        {
          id: '1',
          user: { name: 'Ahmet Kara', avatar: 'https://i.pravatar.cc/150?img=13' },
          text: 'Çok duygulandım, harika bir iş yapmışsınız! ❤️',
          timestamp: '2dk',
          likes: 156,
          isLiked: true,
        },
        {
          id: '2',
          user: { name: 'Selin Çelik', avatar: 'https://i.pravatar.cc/150?img=8' },
          text: 'Bu tür hikayeleri okumak çok güzel 🥺',
          timestamp: '7dk',
          likes: 92,
          isLiked: false,
        },
        {
          id: '3',
          user: { name: 'Burak Aksoy', avatar: 'https://i.pravatar.cc/150?img=18' },
          text: 'Siz de meleksiniz! 🙏✨',
          timestamp: '20dk',
          likes: 203,
          isLiked: true,
        },
        {
          id: '4',
          user: { name: 'Fatma Yılmaz', avatar: 'https://i.pravatar.cc/150?img=19' },
          text: 'Ne güzel insanlarsınız, Allah razı olsun 🤲',
          timestamp: '45dk',
          likes: 178,
          isLiked: false,
        },
      ],
    };

    // Kategori bulunamazsa veya tanımsızsa Sağlık kategorisini kullan
    return commentsByCategory[category] || commentsByCategory['Sağlık'];
  };

  const mockComments = getCategoryComments();

  const renderComment = ({ item }) => {
    const commentLikeState = commentLikes[item.id] || { likes: item.likes, isLiked: item.isLiked };
    
    return (
      <View style={styles.commentItem}>
        <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
        <View style={styles.commentContent}>
          <View style={styles.commentTextContainer}>
            <Text style={styles.commentUsername}>{item.user.name}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
          <View style={styles.commentFooter}>
            <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
            {commentLikeState.likes > 0 && (
              <>
                <Text style={styles.commentDot}>•</Text>
                <Text style={styles.commentLikes}>{commentLikeState.likes} beğeni</Text>
              </>
            )}
          </View>
        </View>
        <TouchableOpacity 
          style={styles.commentLikeButton}
          onPress={() => handleLikeComment(item.id, commentLikeState.likes, commentLikeState.isLiked)}
          activeOpacity={0.7}
        >
          <Text style={styles.commentLikeIcon}>{commentLikeState.isLiked ? '❤️' : '🤍'}</Text>
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
              height: SCREEN_HEIGHT - insets.top - 40, // Safe area için alan bırak
              maxHeight: SCREEN_HEIGHT - insets.top - 40,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerHandle} />
            <Text style={styles.headerTitle}>Yorumlar</Text>
          </View>

          {/* Comments List */}
          <FlatList
            data={mockComments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            style={styles.commentsList}
            contentContainerStyle={styles.commentsListContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />

          {/* Input Area */}
          <View 
            style={[
              styles.inputContainer, 
              { 
                bottom: keyboardHeight > 0 ? keyboardHeight : 0,
                paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 8) : 8 
              }
            ]}
          >
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=10' }}
              style={styles.inputAvatar}
            />
            <View style={[styles.inputWrapper, { height: inputHeight }]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={`${postAuthor?.name || 'Gönderi'} için yorum ekle...`}
                placeholderTextColor={COLORS.gray}
                value={commentText}
                onChangeText={setCommentText}
                onContentSizeChange={handleContentSizeChange}
                multiline
                maxLength={500}
                textAlignVertical="center"
                returnKeyType="default"
              />
              {commentText.trim().length > 0 && (
                <TouchableOpacity
                  style={styles.sendButton}
                  activeOpacity={0.7}
                  onPress={handleSendComment}
                >
                  <Text style={styles.sendIcon}>⬆</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
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
    overflow: 'hidden',
    position: 'relative',
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
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    paddingVertical: SPACING.sm,
    paddingBottom: 80, // Input container için alan
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
  },
  commentContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  commentTextContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  commentUsername: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  commentText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondary,
    lineHeight: 18,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingLeft: SPACING.md,
  },
  commentTimestamp: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
  },
  commentDot: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    marginHorizontal: SPACING.xs,
  },
  commentLikes: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    fontWeight: '600',
  },
  commentLikeButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  commentLikeIcon: {
    fontSize: 16,
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.accentLight,
    backgroundColor: COLORS.white,
    zIndex: 10,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    marginLeft: SPACING.sm,
    paddingRight: 40,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondary,
    textAlignVertical: 'center',
    minHeight: 40,
  },
  sendButton: {
    position: 'absolute',
    right: SPACING.xs,
    bottom: SPACING.xs,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 18,
    color: COLORS.white,
  },
});

export default CommentsModal;
