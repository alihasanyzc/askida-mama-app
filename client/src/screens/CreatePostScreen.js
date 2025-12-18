import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const CreatePostScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const categories = ['Sağlık', 'Mama&Barınma', 'Yardım Hikayeleri'];

  // Form validation - tüm alanlar dolu mu?
  const isFormValid = useMemo(() => {
    return selectedCategory !== '' && title.trim() !== '' && content.trim() !== '';
  }, [selectedCategory, title, content]);

  const handleCreate = () => {
    if (isFormValid) {
      console.log('Post oluşturuldu:', { selectedCategory, title, content, image });
      // API call yapılacak
      navigation.goBack();
    }
  };

  const pickImage = async () => {
    // İzin iste
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'İzin Gerekli',
        'Resim seçmek için galeri erişim izni gereklidir.',
        [{ text: 'Tamam' }]
      );
      return;
    }

    // Resim seç
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Gönderi</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Form Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Kategori Seçimi */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Kategori <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resim Yükleme */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Resim <Text style={styles.optional}>*</Text>
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
            </TouchableOpacity>
          )}
        </View>

        {/* Başlık */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Başlık <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Gönderi başlığı"
            placeholderTextColor={COLORS.gray}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* İçerik */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Metin <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Gönderi içeriği"
            placeholderTextColor={COLORS.gray}
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Oluştur Button - Fixed Bottom */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
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
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: 8,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.white,
    fontWeight: '600',
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
    height: 180,
    paddingTop: SPACING.md,
  },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.accentLight,
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
