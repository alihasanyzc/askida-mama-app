import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

// Screens
import DiscoverScreen from '../screens/DiscoverScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import FollowersScreen from '../screens/FollowersScreen';
import MapScreen from '../screens/MapScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import AnnouncementScreen from '../screens/AnnouncementScreen';
import CreateAnnouncementScreen from '../screens/CreateAnnouncementScreen';
import AnnouncementDetailScreen from '../screens/AnnouncementDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DonationScreen from '../screens/DonationScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import MedicalDonationScreen from '../screens/MedicalDonationScreen';
import BowlDetailScreen from '../screens/BowlDetailScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import EditAddressScreen from '../screens/EditAddressScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import AboutScreen from '../screens/AboutScreen';
import HelpScreen from '../screens/HelpScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ClinicDetailScreen from '../screens/ClinicDetailScreen';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

/**
 * Icon size constants for bottom tab bar
 * UI optimized sizes for better visual hierarchy
 */
const ICON_SIZES = {
  ACTIVE: 26,    // Aktif tab icon boyutu (daha büyük, dikkat çekici)
  INACTIVE: 24,  // Pasif tab icon boyutu (standart boyut)
};

/**
 * Custom Tab Bar Icon Component
 * 
 * Senior developer standards: Clean, performant, and maintainable icon component.
 * 
 * @param {string} iconName - Ionicons icon name (e.g., "compass-outline")
 * @param {boolean} focused - Whether the tab is focused/active
 */
const TabBarIcon = ({ iconName, focused }) => {
  return (
    <View style={styles.iconWrapper}>
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
        <Ionicons
          name={iconName}
          size={focused ? ICON_SIZES.ACTIVE : ICON_SIZES.INACTIVE}
          color={focused ? COLORS.primary : COLORS.darkGray}
        />
      </View>
    </View>
  );
};

// Keşfet Stack Navigator
const DiscoverStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false}}>
      <Stack.Screen name="DiscoverMain" component={DiscoverScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="Followers" component={FollowersScreen} />
    </Stack.Navigator>
  );
};

// Harita Stack Navigator
const MapStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapMain" component={MapScreen} />
      <Stack.Screen name="Donation" component={DonationScreen} />
      <Stack.Screen name="MedicalDonation" component={MedicalDonationScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="BowlDetail" component={BowlDetailScreen} />
      <Stack.Screen name="EditAddress" component={EditAddressScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="ClinicDetail" component={ClinicDetailScreen} />
    </Stack.Navigator>
  );
};

// İlan Stack Navigator
const AnnouncementStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnnouncementMain" component={AnnouncementScreen} />
      <Stack.Screen name="CreateAnnouncement" component={CreateAnnouncementScreen} />
      <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} />
    </Stack.Navigator>
  );
};

// Profil Stack Navigator (kendi profilimiz)
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Followers" component={FollowersScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
    </Stack.Navigator>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.darkGray, // Daha koyu gri (UX iyileştirmesi)
        tabBarShowLabel: false, // Tüm tab label'larını gizle (sadece iconlar görünsün)
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Keşfet"
        component={DiscoverStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              iconName="compass-outline" 
              focused={focused} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Harita"
        component={MapStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              iconName="map-outline" 
              focused={focused} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              iconName="chatbox-outline" 
              focused={focused} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="İlan"
        component={AnnouncementStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              iconName="megaphone-outline" 
              focused={focused} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              iconName="person-outline" 
              focused={focused} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  /**
   * Tab Bar Container
   * Modern, clean design with proper spacing and shadows
   */
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.accentLight,
    height: 60, // Label olmadığı için daha kompakt yükseklik
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  /**
   * Icon Wrapper
   * Container for icon
   */
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  /**
   * Icon Container
   * Background container for icon (optional background when focused)
   */
  iconContainer: {
    width: 40, // UI optimized: Daha geniş touch area
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  /**
   * Focused Icon Container
   * Subtle background highlight when tab is active
   */
  iconContainerFocused: {
    backgroundColor: COLORS.primaryLight + '15', // 15% opacity (daha subtle)
  },
});

export default BottomTabNavigator;
