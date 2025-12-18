import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import Button from '../components/common/Button';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Askıda Mama</Text>
      <Text style={styles.subtitle}>Yardımlaşma Platformu</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Bağış Yap" 
          onPress={() => console.log('Bağış yap')}
          variant="primary"
        />
        
        <Button 
          title="Yardım Al" 
          onPress={() => console.log('Yardım al')}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray,
    marginBottom: SPACING.xl,
  },
  buttonContainer: {
    width: '100%',
    marginTop: SPACING.xl,
  },
  button: {
    marginTop: SPACING.md,
  },
});

export default HomeScreen;
