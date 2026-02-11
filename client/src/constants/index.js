import { Platform } from 'react-native';

// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://api.askidamama.com/api';

// Colors - 60-30-10 Rule
export const COLORS = {
  // Primary (60%) - Ana turuncu renk
  primary: '#F48400',
  primaryLight: '#FF9E33',
  primaryDark: '#C76A00',
  
  // Secondary (30%) - Nötr renkler
  secondary: '#2C2C2C',
  secondaryLight: '#4A4A4A',
  secondaryDark: '#1A1A1A',
  
  // Accent (10%) - Vurgu renkleri
  accent: '#FFFFFF',
  accentLight: '#F5F5F5',
  
  // Functional colors
  success: '#4CAF50',
  danger: '#F44336',
  warning: '#FFC107',
  info: '#00BCD4',
  
  // Grayscale
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
  darkGray: '#757575',
  background: '#F8F8F8',
  
  // Text colors
  text: '#2C2C2C',
  textSecondary: '#757575',
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography - SF Pro (San Francisco) Fonts
// Apple's official system font
// SF Pro Text → küçük metinler (bio, caption, yorum) - 19px ve altı
// SF Pro Display → başlıklar ve büyük metinler - 20px ve üzeri

export const FONTS = {
  // SF Pro Text - küçük metinler için (caption, bio, yorum)
  // iOS'ta sistem fontu otomatik olarak SF Pro Text kullanır (19px ve altı)
  // Android'de Roboto kullanılır
  text: Platform.select({
    ios: undefined, // iOS'ta undefined = sistem fontu (SF Pro Text)
    android: 'Roboto',
    default: undefined,
  }),
  // SF Pro Display - başlıklar ve büyük metinler için
  // iOS'ta sistem fontu otomatik olarak SF Pro Display kullanır (20px ve üzeri)
  display: Platform.select({
    ios: undefined, // iOS'ta undefined = sistem fontu (SF Pro Display)
    android: 'Roboto',
    default: undefined,
  }),
  // Fallback to system default
  regular: Platform.select({
    ios: undefined,
    android: 'Roboto',
    default: undefined,
  }),
};

/**
 * Instagram-style font weights
 * These match Instagram's typography system
 */
export const FONT_WEIGHTS = {
  regular: '400',
  medium: Platform.select({
    ios: '600', // SF Pro Text Semibold (Instagram's medium)
    android: '500', // Roboto Medium
    default: '600',
  }),
  semibold: '600', // Instagram's standard semibold
  bold: '700',
  light: '300',
};

// Font sizes - Instagram style (slightly larger for better readability)
export const FONT_SIZES = {
  xs: 11,      // Very small text (timestamps, metadata)
  sm: 13,      // Small text (captions, comments)
  md: 14,      // Medium text (body text, usernames)
  lg: 16,      // Large text (subheadings)
  xl: 20,      // Extra large (headings - switches to SF Pro Display)
  xxl: 24,     // XXL (large headings)
  xxxl: 32,    // XXXL (hero text)
};

// Font size threshold for SF Pro Display (20px and above)
export const DISPLAY_FONT_THRESHOLD = 20;

// Screen names
export const SCREENS = {
  HOME: 'Home',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  LOGIN: 'Login',
  REGISTER: 'Register',
};
