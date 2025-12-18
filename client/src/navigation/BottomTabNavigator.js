import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '../constants';

// Screens
import DiscoverScreen from '../screens/DiscoverScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import MapScreen from '../screens/MapScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import AnnouncementScreen from '../screens/AnnouncementScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

// Custom Tab Bar Icons
const TabBarIcon = ({ icon, focused }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {icon}
      </Text>
    </View>
  );
};

// Keşfet Stack Navigator
const DiscoverStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoverMain" component={DiscoverScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
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
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Keşfet"
        component={DiscoverStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="🧭" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Harita"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="🗺️" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="💬" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="İlan"
        component={AnnouncementScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="📢" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon="👤" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.accentLight,
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabBarLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    marginTop: -4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  iconContainerFocused: {
    backgroundColor: COLORS.primaryLight + '20', // 20% opacity
  },
  icon: {
    fontSize: 22,
  },
  iconFocused: {
    fontSize: 24,
  },
});

export default BottomTabNavigator;
