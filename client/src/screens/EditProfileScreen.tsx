import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { AxiosError } from 'axios';
import { Entypo } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { loadOwnProfile } from '../hooks/useOwnProfile';
import {
  updateOwnProfile,
  uploadProfileAvatar,
  uploadProfileCoverPhoto,
} from '../services/profiles';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../types/navigation';
import type { ProfileRecord } from '../types/domain';

type EditProfileScreenProps = StackScreenProps<ProfileStackParamList, 'EditProfile'>;

type EditableProfileUser = Partial<ProfileRecord> & {
  name?: string;
  avatar?: string | null;
  cover_photo?: string | null;
};

const DEFAULT_AVATAR_URL =
  'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png';

const EditProfileScreen = ({ route, navigation }: EditProfileScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const user = (route.params?.user as EditableProfileUser | undefined) ?? {};

  // Form state
  const [name, setName] = useState(user.name ?? user.full_name ?? '');
  const [username, setUsername] = useState(user.username ?? '');
  const [bio, setBio] = useState(user.bio ?? '');
  const [phone, setPhone] = useState(user.phone ?? '');
  const [avatar, setAvatar] = useState<string | null>(user.avatar ?? user.avatar_url ?? null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(
    user.cover_photo ?? user.cover_photo_url ?? null,
  );

  const isLocalImageUri = (uri: string | null) => Boolean(uri && !/^https?:\/\//i.test(uri));

  // Profil fotoğrafı seçme
  const pickAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri erişim izni gerekiyor.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Avatar picker error:', error);
      Alert.alert('Hata', 'Profil fotoğrafı seçilirken bir hata oluştu.');
    }
  };

  // Kapak fotoğrafı seçme
  const pickCoverPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri erişim izni gerekiyor.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setCoverPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Cover picker error:', error);
      Alert.alert('Hata', 'Kapak fotoğrafı seçilirken bir hata oluştu.');
    }
  };

  // Profili kaydet
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'İsim alanı boş bırakılamaz.');
      return;
    }

    if (!username.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı boş bırakılamaz.');
      return;
    }

    try {
      const avatarUpload = isLocalImageUri(avatar) ? await uploadProfileAvatar(avatar as string) : null;
      const coverUpload = isLocalImageUri(coverPhoto)
        ? await uploadProfileCoverPhoto(coverPhoto as string)
        : null;

      await updateOwnProfile({
        full_name: name.trim(),
        username: username.trim(),
        bio: bio.trim() || null,
        phone: phone.trim() || null,
        avatar_url: avatarUpload?.image_url ?? avatar ?? null,
        cover_photo_url: coverUpload?.image_url ?? coverPhoto ?? null,
      });

      await loadOwnProfile();

      Alert.alert('Başarılı', 'Profiliniz güncellendi!', [
        {
          text: 'Tamam',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 503) {
        Alert.alert(
          'Bağlantı Sorunu',
          'Profil servisine şu anda ulaşılamıyor. Birkaç saniye sonra tekrar deneyin.',
        );
        return;
      }

      console.error('Profile update error:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.xs }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profili Düzenle</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Cover Photo Section */}
        <View style={styles.coverSection}>
          <ImageBackground
            source={coverPhoto ? { uri: coverPhoto } : undefined}
            style={[styles.coverPhoto, !coverPhoto && styles.defaultCoverPhoto]}
            imageStyle={styles.coverPhotoImage}
          >
            {coverPhoto ? <View style={styles.coverOverlay} /> : null}
            <TouchableOpacity
              style={styles.changeCoverButton}
              onPress={pickCoverPhoto}
              activeOpacity={0.8}
            >
              <Entypo name="camera" size={18} color={COLORS.secondary} style={styles.changeCoverIcon} />
              <Text style={styles.changeCoverText}>Kapak Fotoğrafını Değiştir</Text>
            </TouchableOpacity>
          </ImageBackground>

          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar ?? DEFAULT_AVATAR_URL }} style={styles.avatar} />
            <TouchableOpacity
              style={styles.changeAvatarButton}
              onPress={pickAvatar}
              activeOpacity={0.8}
            >
              <Entypo name="camera" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>İsim</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="İsminizi girin"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          {/* Username Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kullanıcı Adı</Text>
            <View style={styles.usernameInputContainer}>
              <Text style={styles.usernamePrefix}>@</Text>
              <TextInput
                style={styles.usernameInput}
                value={username}
                onChangeText={setUsername}
                placeholder="kullaniciadi"
                placeholderTextColor={COLORS.gray}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Telefon</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="0555 123 4567"
              placeholderTextColor={COLORS.gray}
              keyboardType="phone-pad"
              maxLength={20}
            />
          </View>

          {/* Bio Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Hakkında</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Kendinizden bahsedin..."
              placeholderTextColor={COLORS.gray}
              multiline
              numberOfLines={3}
              maxLength={150}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{bio.length}/150</Text>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Kaydet</Text>
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
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  coverSection: {
    position: 'relative',
    height: 160,
    backgroundColor: COLORS.background,
  },
  coverPhoto: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPhotoImage: {
    resizeMode: 'cover',
  },
  defaultCoverPhoto: {
    backgroundColor: '#CFD3D7',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  changeCoverButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  changeCoverIcon: {
    marginRight: SPACING.xs,
  },
  changeCoverText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -44,
    left: SPACING.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  changeAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  formSection: {
    flex: 1,
    marginTop: 52,
    paddingHorizontal: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  usernameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
  },
  usernamePrefix: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray,
    marginRight: SPACING.xs,
  },
  usernameInput: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  bioInput: {
    height: 56,
    paddingTop: SPACING.sm + 2,
  },
  charCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.accentLight,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default EditProfileScreen;
