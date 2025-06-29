import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  type: 'star' | 'constellation' | 'nebula';
}

interface Constellation {
  id: number;
  stars: { x: number; y: number }[];
  connections: { from: number; to: number }[];
}

export function StarField() {
  const { colors } = useTheme();

  // Generate random stars with different types
  const stars: Star[] = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 5000,
    type: Math.random() > 0.9 ? 'nebula' : Math.random() > 0.7 ? 'constellation' : 'star',
  }));

  // Generate constellation patterns
  const constellations: Constellation[] = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    stars: Array.from({ length: 5 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
    })),
    connections: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
    ],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Cosmic background gradient */}
      <LinearGradient
        colors={[
          colors.background,
          colors.primary + '40',
          colors.secondary + '20',
          colors.background,
        ]}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.cosmicBackground}
        pointerEvents="none"
      />
      
      {/* Nebula effects */}
      <View style={styles.nebulaContainer} pointerEvents="none">
        <NebulaEffect colors={colors} />
        <NebulaEffect colors={colors} delay={2000} />
      </View>
      
      {/* Constellation lines */}
      {constellations.map((constellation) => (
        <ConstellationComponent key={constellation.id} constellation={constellation} colors={colors} />
      ))}
      
      {/* Individual stars */}
      {stars.map((star) => (
        <StarComponent key={star.id} star={star} colors={colors} />
      ))}
      
      {/* Shooting stars */}
      <ShootingStarEffect colors={colors} />
    </View>
  );
}

interface StarComponentProps {
  star: Star;
  colors: any;
}

function StarComponent({ star, colors }: StarComponentProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const rotation = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      star.delay,
      withRepeat(
        withTiming(1, { duration: 2000 + Math.random() * 2000 }),
        -1,
        true
      )
    );
    
    scale.value = withDelay(
      star.delay,
      withRepeat(
        withTiming(1.2, { duration: 3000 + Math.random() * 2000 }),
        -1,
        true
      )
    );
    
    if (star.type === 'star') {
      rotation.value = withRepeat(
        withTiming(360, { duration: 10000 + Math.random() * 10000 }),
        -1,
        false
      );
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const getStarColor = () => {
    switch (star.type) {
      case 'nebula':
        return colors.accentSecondary;
      case 'constellation':
        return colors.accent;
      default:
        return colors.text;
    }
  };

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          backgroundColor: getStarColor(),
        },
        animatedStyle,
      ]}
      pointerEvents="none"
    />
  );
}

interface NebulaEffectProps {
  colors: any;
  delay?: number;
}

function NebulaEffect({ colors, delay = 0 }: NebulaEffectProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.3, { duration: 8000 }),
        -1,
        true
      )
    );
    
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1.5, { duration: 12000 }),
        -1,
        true
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.nebula,
        {
          left: Math.random() * width * 0.5,
          top: Math.random() * height * 0.5,
        },
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={[
          colors.accentSecondary + '40',
          colors.accent + '20',
          'transparent',
        ]}
        style={styles.nebulaGradient}
        pointerEvents="none"
      />
    </Animated.View>
  );
}

interface ConstellationComponentProps {
  constellation: Constellation;
  colors: any;
}

function ConstellationComponent({ constellation, colors }: ConstellationComponentProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      3000,
      withRepeat(
        withTiming(0.6, { duration: 5000 }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.constellation, animatedStyle]} pointerEvents="none">
      {constellation.connections.map((connection, index) => {
        const fromStar = constellation.stars[connection.from];
        const toStar = constellation.stars[connection.to];
        
        if (!fromStar || !toStar) return null;
        
        const distance = Math.sqrt(
          Math.pow(toStar.x - fromStar.x, 2) + Math.pow(toStar.y - fromStar.y, 2)
        );
        const angle = Math.atan2(toStar.y - fromStar.y, toStar.x - fromStar.x) * 180 / Math.PI;
        
        return (
          <View
            key={index}
            style={[
              styles.constellationLine,
              {
                left: fromStar.x,
                top: fromStar.y,
                width: distance,
                transform: [{ rotate: `${angle}deg` }],
                backgroundColor: colors.accent + '60',
              },
            ]}
            pointerEvents="none"
          />
        );
      })}
    </Animated.View>
  );
}

function ShootingStarEffect({ colors }: { colors: any }) {
  const translateX = useSharedValue(-100);
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const createShootingStar = () => {
      translateX.value = -100;
      translateY.value = Math.random() * height * 0.5;
      opacity.value = 0;
      
      opacity.value = withTiming(1, { duration: 200 });
      translateX.value = withTiming(width + 100, { duration: 1500 });
      
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 200 });
      }, 1300);
    };

    const interval = setInterval(createShootingStar, 8000 + Math.random() * 12000);
    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[styles.shootingStar, animatedStyle]} pointerEvents="none">
      <LinearGradient
        colors={[colors.accent, colors.accent + '80', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.shootingStarGradient}
        pointerEvents="none"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Ensure StarField is behind all interactive elements
  },
  cosmicBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  nebulaContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  nebula: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  nebulaGradient: {
    flex: 1,
    borderRadius: 100,
  },
  star: {
    position: 'absolute',
    borderRadius: 50,
  },
  constellation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  constellationLine: {
    position: 'absolute',
    height: 1,
    transformOrigin: 'left center',
  },
  shootingStar: {
    position: 'absolute',
    width: 60,
    height: 2,
  },
  shootingStarGradient: {
    flex: 1,
  },
});