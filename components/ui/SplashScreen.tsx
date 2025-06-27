import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { StarField } from './StarField';
import { LoadingSpinner } from './LoadingSpinner';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const { colors, fonts } = useTheme();
  
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const textOpacity = useSharedValue(0);
  
  useEffect(() => {
    // Animate the crystal ball
    scale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) });
    opacity.value = withTiming(1, { duration: 800 });
    
    // Animate the text with a delay
    textOpacity.value = withDelay(
      600,
      withTiming(1, { duration: 1200 })
    );
    
    // Call onFinish after animations
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const imageStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  const titleStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      { translateY: withTiming(0, { duration: 1000 }) },
    ],
  }));
  
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      { translateY: withTiming(0, { duration: 1000 }) },
    ],
  }));
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField />
      
      <Animated.View style={[styles.imageContainer, imageStyle]}>
        <Image 
          source={require('@/assets/images/Mysterious Glow of the Oracle.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
      
      <Animated.Text style={[
        styles.title, 
        { color: colors.text, fontFamily: fonts.title },
        titleStyle
      ]}>
        THE{'\n'}Whimsical{'\n'}Oracle
      </Animated.Text>
      
      <Animated.Text style={[
        styles.subtitle, 
        { color: colors.textSecondary, fontFamily: fonts.body },
        subtitleStyle
      ]}>
        WHERE WHIMSY MEETS WISDOM
      </Animated.Text>
      
      <View style={styles.spinnerContainer}>
        <LoadingSpinner color={colors.accent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    maxWidth: 300,
    maxHeight: 300,
  },
  title: {
    fontSize: 42,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  spinnerContainer: {
    position: 'absolute',
    bottom: 60,
  },
});