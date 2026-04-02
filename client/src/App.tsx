import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import AuthScreen from './screens/AuthScreen';
import { COLORS } from './constants';
import { clearAuthSession, verifyStoredSession } from './services/auth';

export default function App(): React.JSX.Element {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        const session = await verifyStoredSession();

        if (isMounted) {
          setIsAuthenticated(Boolean(session));
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
        }
        await clearAuthSession();
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await clearAuthSession();
    setIsAuthenticated(false);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isBootstrapping ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : isAuthenticated ? (
          <BottomTabNavigator onLogout={handleLogout} />
        ) : (
          <AuthScreen onLogin={() => setIsAuthenticated(true)} />
        )}
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
});
