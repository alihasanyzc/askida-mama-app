import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import type {
  AnnouncementStackParamList,
  DiscoverStackParamList,
  MapStackParamList,
  ProfileStackParamList,
  RootTabParamList,
} from '../types/navigation';

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
import EventDetailScreen from '../screens/EventDetailScreen';
import EventsListScreen from '../screens/EventsListScreen';
import BlogDetailScreen from '../screens/BlogDetailScreen';

const DiscoverStackNavigator = createStackNavigator<DiscoverStackParamList>();
const MapStackNavigator = createStackNavigator<MapStackParamList>();
const AnnouncementStackNavigator = createStackNavigator<AnnouncementStackParamList>();
const ProfileStackNavigator = createStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

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
type TabBarIconProps = {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  focused: boolean;
};

const TabBarIcon = ({ iconName, focused }: TabBarIconProps): React.JSX.Element => {
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
const DiscoverStack = (): React.JSX.Element => {
  return (
    <DiscoverStackNavigator.Navigator id="discover-stack" screenOptions={{ headerShown: false }}>
      <DiscoverStackNavigator.Screen name="DiscoverMain" component={DiscoverScreen} />
      <DiscoverStackNavigator.Screen name="CreatePost" component={CreatePostScreen} />
      <DiscoverStackNavigator.Screen name="Search" component={SearchScreen} />
      <DiscoverStackNavigator.Screen name="UserProfile" component={UserProfileScreen} />
      <DiscoverStackNavigator.Screen name="Followers" component={FollowersScreen} />
    </DiscoverStackNavigator.Navigator>
  );
};

// Harita Stack Navigator
const MapStack = (): React.JSX.Element => {
  return (
    <MapStackNavigator.Navigator id="map-stack" screenOptions={{ headerShown: false }}>
      <MapStackNavigator.Screen name="MapMain" component={MapScreen} />
      <MapStackNavigator.Screen name="Donation" component={DonationScreen} />
      <MapStackNavigator.Screen name="MedicalDonation" component={MedicalDonationScreen} />
      <MapStackNavigator.Screen name="ProductDetail" component={ProductDetailScreen} />
      <MapStackNavigator.Screen name="QRScanner" component={QRScannerScreen} />
      <MapStackNavigator.Screen name="BowlDetail" component={BowlDetailScreen} />
      <MapStackNavigator.Screen name="EditAddress" component={EditAddressScreen} />
      <MapStackNavigator.Screen name="Payment" component={PaymentScreen} />
      <MapStackNavigator.Screen name="ClinicDetail" component={ClinicDetailScreen} />
    </MapStackNavigator.Navigator>
  );
};

// İlan Stack Navigator
const AnnouncementStack = (): React.JSX.Element => {
  return (
    <AnnouncementStackNavigator.Navigator
      id="announcement-stack"
      screenOptions={{ headerShown: false }}
    >
      <AnnouncementStackNavigator.Screen name="AnnouncementMain" component={AnnouncementScreen} />
      <AnnouncementStackNavigator.Screen
        name="CreateAnnouncement"
        component={CreateAnnouncementScreen}
      />
      <AnnouncementStackNavigator.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetailScreen}
      />
    </AnnouncementStackNavigator.Navigator>
  );
};

// Profil Stack Navigator (kendi profilimiz)
const ProfileStack = (): React.JSX.Element => {
  return (
    <ProfileStackNavigator.Navigator id="profile-stack" screenOptions={{ headerShown: false }}>
      <ProfileStackNavigator.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStackNavigator.Screen name="Followers" component={FollowersScreen} />
      <ProfileStackNavigator.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStackNavigator.Screen name="Privacy" component={PrivacyScreen} />
      <ProfileStackNavigator.Screen name="About" component={AboutScreen} />
      <ProfileStackNavigator.Screen name="Help" component={HelpScreen} />
      <ProfileStackNavigator.Screen name="EventsList" component={EventsListScreen} />
      <ProfileStackNavigator.Screen name="EventDetail" component={EventDetailScreen} />
      <ProfileStackNavigator.Screen name="BlogDetail" component={BlogDetailScreen} />
    </ProfileStackNavigator.Navigator>
  );
};

const BottomTabNavigator = (): React.JSX.Element => {
  return (
    <Tab.Navigator
      id="root-tabs"
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
        name="Kesfet"
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
        name="Ilan"
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
