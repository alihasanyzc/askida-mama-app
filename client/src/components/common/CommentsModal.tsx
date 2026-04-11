import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AxiosError } from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, FONTS, SPACING } from '../../constants';
import { getStoredAuthSession } from '../../services/auth';
import {
  createPostComment,
  deletePostComment,
  likePostComment,
  listPostComments,
  type PostCommentRecord,
  unlikePostComment,
} from '../../services/posts';
import type {
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ANIMATION_CONFIG = {
  SLIDE_SPRING_TENSION: 50,
  SLIDE_SPRING_FRICTION: 8,
  SLIDE_DURATION: 250,
  SEND_BUTTON_SCALE_MIN: 0.85,
  SEND_BUTTON_SCALE_NORMAL: 1,
  SEND_BUTTON_SPRING_TENSION: 400,
  SEND_BUTTON_SPRING_FRICTION: 7,
};

const INPUT_CONFIG = {
  MIN_HEIGHT: 40,
  MAX_HEIGHT: 100,
  MAX_LENGTH: 500,
  DEFAULT_HEIGHT: 40,
};

const TIMING_CONFIG = {
  MODAL_HEADER_OFFSET: 40,
  INPUT_PADDING_BOTTOM: 8,
  COMMENTS_LIST_BOTTOM_PADDING: 80,
  DELETE_LONG_PRESS_DELAY: 3000,
};

const ICON_SIZES = {
  HEART: 16,
  SEND: 14,
  AVATAR: 36,
  HEADER_HANDLE_WIDTH: 40,
  HEADER_HANDLE_HEIGHT: 4,
};

const COLORS_CONFIG = {
  HEART_LIKED: '#FF3040',
  MODAL_OVERLAY: 'rgba(0, 0, 0, 0.5)',
};

const DEFAULT_AVATAR_URL =
  'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png';

type CommentsModalProps = {
  visible: boolean;
  onClose?: () => void;
  postId?: string;
  postAuthor?: { name?: string };
  postAuthorId?: string;
  category?: string;
  postTitle?: string;
  onCommentCountChange?: (delta: number) => void;
};

function formatCommentTime(createdAt: string | null) {
  if (!createdAt) {
    return 'Şimdi';
  }

  const diffInSeconds = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));

  if (diffInSeconds < 60) return 'Şimdi';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}dk`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}sa`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}g`;

  return new Date(createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
  });
}

const CommentsModal = ({
  visible,
  onClose,
  postId,
  postAuthor,
  postAuthorId,
  onCommentCountChange,
}: CommentsModalProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const [commentText, setCommentText] = useState('');
  const [inputHeight, setInputHeight] = useState(INPUT_CONFIG.DEFAULT_HEIGHT);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [comments, setComments] = useState<PostCommentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ownUserId, setOwnUserId] = useState<string | null>(null);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const inputRef = useRef<TextInput | null>(null);
  const sendButtonScale = useRef(new Animated.Value(ANIMATION_CONFIG.SEND_BUTTON_SCALE_NORMAL)).current;

  const modalHeight = useMemo(
    () => SCREEN_HEIGHT - insets.top - TIMING_CONFIG.MODAL_HEADER_OFFSET,
    [insets.top],
  );
  const inputPaddingBottom = useMemo(
    () =>
      Platform.OS === 'ios'
        ? Math.max(insets.bottom, TIMING_CONFIG.INPUT_PADDING_BOTTOM)
        : TIMING_CONFIG.INPUT_PADDING_BOTTOM,
    [insets.bottom],
  );
  const placeholderText = useMemo(
    () => `${postAuthor?.name || 'Gönderi'} için yorum ekle...`,
    [postAuthor?.name],
  );
  const hasCommentText = useMemo(() => commentText.trim().length > 0, [commentText]);

  const loadComments = useCallback(async () => {
    if (!postId) {
      setComments([]);
      setErrorMessage(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [session, postComments] = await Promise.all([
        getStoredAuthSession(),
        listPostComments(postId),
      ]);

      setOwnUserId(session?.profile?.id ?? session?.user?.id ?? null);
      setComments(postComments);
    } catch (error) {
      setComments([]);

      if (error instanceof AxiosError && error.response?.status === 503) {
        setErrorMessage('Yorumlar şu anda yüklenemiyor.');
      } else {
        setErrorMessage('Yorumlar yüklenirken bir hata oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (!visible) {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: ANIMATION_CONFIG.SLIDE_DURATION,
        useNativeDriver: true,
      }).start();
      return;
    }

    void loadComments();
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: ANIMATION_CONFIG.SLIDE_SPRING_TENSION,
      friction: ANIMATION_CONFIG.SLIDE_SPRING_FRICTION,
    }).start();
  }, [loadComments, slideAnim, visible]);

  useEffect(() => {
    if (!visible) return;

    const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardWillShow = Keyboard.addListener(keyboardShowEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const keyboardWillHide = Keyboard.addListener(keyboardHideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [visible]);

  const handleClose = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: ANIMATION_CONFIG.SLIDE_DURATION,
      useNativeDriver: true,
    }).start(() => {
      onClose?.();
    });
  }, [onClose, slideAnim]);

  const triggerSendButtonAnimation = useCallback(() => {
    Animated.sequence([
      Animated.spring(sendButtonScale, {
        toValue: ANIMATION_CONFIG.SEND_BUTTON_SCALE_MIN,
        useNativeDriver: true,
        tension: ANIMATION_CONFIG.SEND_BUTTON_SPRING_TENSION,
        friction: ANIMATION_CONFIG.SEND_BUTTON_SPRING_FRICTION,
      }),
      Animated.spring(sendButtonScale, {
        toValue: ANIMATION_CONFIG.SEND_BUTTON_SCALE_NORMAL,
        useNativeDriver: true,
        tension: ANIMATION_CONFIG.SEND_BUTTON_SPRING_TENSION,
        friction: ANIMATION_CONFIG.SEND_BUTTON_SPRING_FRICTION,
      }),
    ]).start();
  }, [sendButtonScale]);

  const handleSendComment = useCallback(async () => {
    const trimmedText = commentText.trim();
    if (!postId || !trimmedText || isSending) return;

    triggerSendButtonAnimation();
    setIsSending(true);

    try {
      const createdComment = await createPostComment(postId, trimmedText);
      setComments((currentComments) => [createdComment, ...currentComments]);
      onCommentCountChange?.(1);
      setCommentText('');
      setInputHeight(INPUT_CONFIG.DEFAULT_HEIGHT);
      inputRef.current?.blur();
    } catch {
      Alert.alert('Hata', 'Yorum gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSending(false);
    }
  }, [commentText, isSending, onCommentCountChange, postId, triggerSendButtonAnimation]);

  const handleContentSizeChange = useCallback((
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    const height = event.nativeEvent.contentSize.height;
    const newHeight = Math.min(
      Math.max(INPUT_CONFIG.MIN_HEIGHT, height),
      INPUT_CONFIG.MAX_HEIGHT,
    );
    setInputHeight(newHeight);
  }, []);

  const handleDeleteComment = useCallback((comment: PostCommentRecord) => {
    const canDelete = Boolean(
      ownUserId && (ownUserId === comment.user_id || ownUserId === postAuthorId),
    );

    if (!canDelete) {
      return;
    }

    Alert.alert('Yorumu Sil', 'Bu yorumu silmek istiyor musunuz?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePostComment(comment.id);
            setComments((currentComments) =>
              currentComments.filter((currentComment) => currentComment.id !== comment.id),
            );
            onCommentCountChange?.(-1);
          } catch {
            Alert.alert('Hata', 'Yorum silinemedi. Lütfen tekrar deneyin.');
          }
        },
      },
    ]);
  }, [onCommentCountChange, ownUserId, postAuthorId]);

  const handleToggleCommentLike = useCallback(async (comment: PostCommentRecord) => {
    const nextIsLiked = !comment.is_liked;
    const nextLikesCount = Math.max(0, comment.likes_count + (nextIsLiked ? 1 : -1));

    setComments((currentComments) =>
      currentComments.map((currentComment) =>
        currentComment.id === comment.id
          ? {
              ...currentComment,
              is_liked: nextIsLiked,
              likes_count: nextLikesCount,
            }
          : currentComment,
      ),
    );

    try {
      const updatedComment = nextIsLiked
        ? await likePostComment(comment.id)
        : await unlikePostComment(comment.id);

      setComments((currentComments) =>
        currentComments.map((currentComment) =>
          currentComment.id === updatedComment.id ? updatedComment : currentComment,
        ),
      );
    } catch {
      setComments((currentComments) =>
        currentComments.map((currentComment) =>
          currentComment.id === comment.id ? comment : currentComment,
        ),
      );
      Alert.alert('Hata', 'Yorum beğenisi güncellenemedi. Lütfen tekrar deneyin.');
    }
  }, []);

  const renderComment = useCallback(({ item }: { item: PostCommentRecord }) => {
    const canDelete = Boolean(
      ownUserId && (ownUserId === item.user_id || ownUserId === postAuthorId),
    );

    return (
      <TouchableOpacity
        style={styles.commentItem}
        testID={`comment-item-${item.id}`}
        activeOpacity={0.9}
        delayLongPress={TIMING_CONFIG.DELETE_LONG_PRESS_DELAY}
        onLongPress={canDelete ? () => handleDeleteComment(item) : undefined}
      >
        <Image
          source={{ uri: item.author.avatar_url ?? DEFAULT_AVATAR_URL }}
          style={styles.commentAvatar}
          resizeMode="cover"
          accessibilityLabel={`${item.author.full_name} avatar`}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentTextContainer}>
            <Text style={styles.commentUsername} numberOfLines={1}>
              {item.author.full_name}
            </Text>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
          <View style={styles.commentFooter}>
            <Text style={styles.commentTimestamp}>{formatCommentTime(item.created_at)}</Text>
            {item.likes_count > 0 && (
              <>
                <Text style={styles.commentDot}>•</Text>
                <Text style={styles.commentLikes}>{item.likes_count} beğeni</Text>
              </>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.commentLikeButton}
          onPress={() => {
            void handleToggleCommentLike(item);
          }}
          activeOpacity={0.7}
          accessibilityLabel={item.is_liked ? 'Yorum beğenisini kaldır' : 'Yorumu beğen'}
          accessibilityRole="button"
          accessibilityState={{ selected: item.is_liked }}
        >
          <FontAwesome
            name={item.is_liked ? 'heart' : 'heart-o'}
            size={ICON_SIZES.HEART}
            color={item.is_liked ? COLORS_CONFIG.HEART_LIKED : COLORS.secondary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }, [handleDeleteComment, handleToggleCommentLike, ownUserId, postAuthorId]);

  const keyExtractor = useCallback((item: PostCommentRecord) => item.id, []);

  const renderCommentsContent = () => {
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

    return (
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={keyExtractor}
        style={styles.commentsList}
        contentContainerStyle={styles.commentsListContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        ListEmptyComponent={
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>Henüz yorum yok</Text>
          </View>
        }
        testID="comments-list"
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
      testID="comments-modal"
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
          accessibilityLabel="Close comments modal"
          accessibilityRole="button"
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
              height: modalHeight,
              maxHeight: modalHeight,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerHandle} />
            <Text style={styles.headerTitle}>Yorumlar</Text>
          </View>

          {renderCommentsContent()}

          <View
            style={[
              styles.inputContainer,
              {
                bottom: keyboardHeight > 0 ? keyboardHeight : 0,
                paddingBottom: inputPaddingBottom,
              },
            ]}
          >
            <View style={[styles.inputWrapper, { height: inputHeight }]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={placeholderText}
                placeholderTextColor={COLORS.gray}
                value={commentText}
                onChangeText={setCommentText}
                onContentSizeChange={handleContentSizeChange}
                multiline
                maxLength={INPUT_CONFIG.MAX_LENGTH}
                textAlignVertical="center"
                returnKeyType="send"
                blurOnSubmit={true}
                onSubmitEditing={handleSendComment}
                accessibilityLabel="Comment input"
                accessibilityHint="Type your comment here"
              />
              {hasCommentText && (
                <TouchableOpacity
                  style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
                  activeOpacity={0.7}
                  onPress={handleSendComment}
                  disabled={isSending}
                  accessibilityLabel="Send comment"
                  accessibilityRole="button"
                  testID="send-comment-button"
                >
                  <Animated.View
                    style={[
                      styles.sendButtonIconContainer,
                      {
                        transform: [{ scale: sendButtonScale }],
                      },
                    ]}
                  >
                    <FontAwesome
                      name="send"
                      size={ICON_SIZES.SEND}
                      color={COLORS.white}
                    />
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const MemoizedCommentsModal = memo(CommentsModal);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS_CONFIG.MODAL_OVERLAY,
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
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
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
    width: ICON_SIZES.HEADER_HANDLE_WIDTH,
    height: ICON_SIZES.HEADER_HANDLE_HEIGHT,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.text,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    flexGrow: 1,
    paddingVertical: SPACING.sm,
    paddingBottom: TIMING_CONFIG.COMMENTS_LIST_BOTTOM_PADDING,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  stateText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.text,
    color: COLORS.gray,
    textAlign: 'center',
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: ICON_SIZES.AVATAR,
    height: ICON_SIZES.AVATAR,
    borderRadius: ICON_SIZES.AVATAR / 2,
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
    fontFamily: FONTS.text,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  commentText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.text,
    color: COLORS.secondary,
    lineHeight: FONT_SIZES.sm * 1.5,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingLeft: SPACING.md,
  },
  commentTimestamp: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.text,
    color: COLORS.gray,
  },
  commentDot: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.text,
    color: COLORS.gray,
    marginHorizontal: SPACING.xs,
  },
  commentLikes: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.text,
    color: COLORS.gray,
    fontWeight: '600',
  },
  commentLikeButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
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
  inputWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingRight: 40,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.text,
    color: COLORS.secondary,
    textAlignVertical: 'center',
    minHeight: INPUT_CONFIG.MIN_HEIGHT,
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
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonIconContainer: {
    width: ICON_SIZES.SEND,
    height: ICON_SIZES.SEND,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MemoizedCommentsModal;
