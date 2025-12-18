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

// Typography
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Screen names
export const SCREENS = {
  HOME: 'Home',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  LOGIN: 'Login',
  REGISTER: 'Register',
};
