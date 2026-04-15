import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { AxiosError } from 'axios';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { createUserPost } from '../hooks/useUserPosts';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DiscoverStackParamList } from '../types/navigation';

type CreatePostScreenProps = StackScreenProps<DiscoverStackParamList, 'CreatePost'>;

const CreatePostScreen = ({ navigation }: CreatePostScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const contentInputRef = useRef<TextInput | null>(null);
  
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);

  // Form validation - resim zorunlu, metin opsiyonel
  const isFormValid = useMemo(() => {
    return image !== null;
  }, [image]);

  const handleCreate = async () => {
    if (!image) {
      Alert.alert('Eksik Alan', 'Post oluşturmak için bir resim seçmelisiniz.');
      return;
    }

    try {
      await createUserPost({ content, image });
      navigation.navigate('DiscoverMain');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        Alert.alert('Oturum Süresi Doldu', 'Devam etmek için tekrar giriş yapmanız gerekiyor.');
        return;
      }

      console.error('Post create error:', error);
      Alert.alert('Hata', 'Post oluşturulurken bir hata oluştu.');
    }
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Fotoğraf çekmek için kamera erişim izni gereklidir.', [
          { text: 'Tamam' },
        ]);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert(
        'Kamera Kullanılamıyor',
        'Bu cihazda veya simülatörde kamera kullanılamıyor. Dosya seçerek devam edebilirsiniz.',
      );
    }
  };

  const openImageLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'İzin Gerekli',
          'Resim seçmek için galeri erişim izni gereklidir.',
          [{ text: 'Tamam' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image library error:', error);
      Alert.alert('Hata', 'Resim seçilirken bir hata oluştu.');
    }
  };

  const pickImage = () => {
    Alert.alert('Resim Ekle', 'Post için bir resim seçin.', [
      {
        text: 'Fotoğraf Çek',
        onPress: () => {
          void openCamera();
        },
      },
      {
        text: 'Dosya Seç',
        onPress: () => {
          void openImageLibrary();
        },
      },
      {
        text: 'Vazgeç',
        style: 'cancel',
      },
    ]);
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.xs }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Oluştur</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Form Content */}
        <View style={styles.formContent}>
          {/* Resim Yükleme */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Resim <Text style={styles.required}>*</Text>
            </Text>
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={removeImage}
                >
                  <Text style={styles.removeImageIcon}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={pickImage}
                >
                  <Text style={styles.changeImageText}>Resmi Değiştir</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imageUploadArea}
                onPress={pickImage}
              >
                <View style={styles.imageIconContainer}>
                  <Text style={styles.imageIcon}>🖼️</Text>
                </View>
                <Text style={styles.imageUploadText}>Resim Yükle</Text>
                <Text style={styles.imageUploadSubtext}>Zorunlu</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* İçerik */}
          <View style={[styles.section, styles.contentSection]}>
            <Text style={styles.label}>
              Metin <Text style={styles.optional}>(opsiyonel)</Text>
            </Text>
            <TextInput
              ref={contentInputRef}
              style={[styles.input, styles.textArea]}
              placeholder="Bir şeyler yazın..."
              placeholderTextColor={COLORS.gray}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Oluştur Button - Fixed Bottom */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom - SPACING.md, SPACING.xs) }]}>
          <TouchableOpacity
            style={[
              styles.createButton,
              isFormValid && styles.createButtonActive,
            ]}
            onPress={handleCreate}
            disabled={!isFormValid}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.createButtonText,
                isFormValid && styles.createButtonTextActive,
              ]}
            >
              Oluştur
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
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
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  keyboardAvoid: {
    flex: 1,
  },
  formContent: {
    flex: 1,
    paddingBottom: 0,
  },
  section: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  contentSection: {
    flex: 1,
    paddingBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  required: {
    color: COLORS.danger,
  },
  optional: {
    color: COLORS.gray,
    fontWeight: '400',
  },
  imageUploadArea: {
    height: 180,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  imageIcon: {
    fontSize: 32,
  },
  imageUploadText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    fontWeight: '500',
  },
  imageUploadSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.danger,
    fontWeight: '500',
    marginTop: SPACING.xs,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
  },
  removeImageButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  removeImageIcon: {
    fontSize: 18,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeImageText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.accentLight,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  textArea: {
    flex: 1,
    minHeight: 0,
    paddingTop: SPACING.md,
  },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingTop: 0,
    backgroundColor: COLORS.background,
  },
  createButton: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonActive: {
    backgroundColor: COLORS.primary,
  },
  createButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.gray,
  },
  createButtonTextActive: {
    color: COLORS.white,
  },
});

export default CreatePostScreen;
