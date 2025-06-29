import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/contexts/ThemeContext';

interface OrnateFrameProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'simple' | 'elaborate' | 'cosmic';
  size?: 'small' | 'medium' | 'large';
}

export function OrnateFrame({ 
  children, 
  style, 
  variant = 'simple',
  size = 'medium' 
}: OrnateFrameProps) {
  const { colors } = useTheme();

  const getFrameSize = () => {
    switch (size) {
      case 'small':
        return { width: 200, height: 150 };
      case 'large':
        return { width: 400, height: 300 };
      default:
        return { width: 300, height: 200 };
    }
  };

  const frameSize = getFrameSize();

  const renderSimpleFrame = () => (
    <Svg width={frameSize.width} height={frameSize.height} style={styles.frame}>
      <Defs>
        <LinearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.8" />
          <Stop offset="50%" stopColor={colors.accentSecondary} stopOpacity="0.6" />
          <Stop offset="100%" stopColor={colors.accent} stopOpacity="0.8" />
        </LinearGradient>
      </Defs>
      
      {/* Corner decorations */}
      <Path
        d="M10,10 L30,10 M10,10 L10,30"
        stroke="url(#frameGradient)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d={`M${frameSize.width-10},10 L${frameSize.width-30},10 M${frameSize.width-10},10 L${frameSize.width-10},30`}
        stroke="url(#frameGradient)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d={`M10,${frameSize.height-10} L30,${frameSize.height-10} M10,${frameSize.height-10} L10,${frameSize.height-30}`}
        stroke="url(#frameGradient)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d={`M${frameSize.width-10},${frameSize.height-10} L${frameSize.width-30},${frameSize.height-10} M${frameSize.width-10},${frameSize.height-10} L${frameSize.width-10},${frameSize.height-30}`}
        stroke="url(#frameGradient)"
        strokeWidth="2"
        fill="none"
      />
    </Svg>
  );

  const renderElaborateFrame = () => (
    <Svg width={frameSize.width} height={frameSize.height} style={styles.frame}>
      <Defs>
        <LinearGradient id="elaborateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.accent} stopOpacity="1" />
          <Stop offset="25%" stopColor={colors.accentSecondary} stopOpacity="0.8" />
          <Stop offset="75%" stopColor={colors.accent} stopOpacity="0.8" />
          <Stop offset="100%" stopColor={colors.accentSecondary} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      
      {/* Elaborate corner decorations */}
      <Path
        d="M5,5 Q15,5 25,15 Q25,25 15,35 Q5,35 5,25 Q5,15 15,5 Q25,5 35,15"
        stroke="url(#elaborateGradient)"
        strokeWidth="1.5"
        fill="none"
      />
      <Path
        d={`M${frameSize.width-5},5 Q${frameSize.width-15},5 ${frameSize.width-25},15 Q${frameSize.width-25},25 ${frameSize.width-15},35 Q${frameSize.width-5},35 ${frameSize.width-5},25 Q${frameSize.width-5},15 ${frameSize.width-15},5 Q${frameSize.width-25},5 ${frameSize.width-35},15`}
        stroke="url(#elaborateGradient)"
        strokeWidth="1.5"
        fill="none"
      />
      <Path
        d={`M5,${frameSize.height-5} Q15,${frameSize.height-5} 25,${frameSize.height-15} Q25,${frameSize.height-25} 15,${frameSize.height-35} Q5,${frameSize.height-35} 5,${frameSize.height-25} Q5,${frameSize.height-15} 15,${frameSize.height-5} Q25,${frameSize.height-5} 35,${frameSize.height-15}`}
        stroke="url(#elaborateGradient)"
        strokeWidth="1.5"
        fill="none"
      />
      <Path
        d={`M${frameSize.width-5},${frameSize.height-5} Q${frameSize.width-15},${frameSize.height-5} ${frameSize.width-25},${frameSize.height-15} Q${frameSize.width-25},${frameSize.height-25} ${frameSize.width-15},${frameSize.height-35} Q${frameSize.width-5},${frameSize.height-35} ${frameSize.width-5},${frameSize.height-25} Q${frameSize.width-5},${frameSize.height-15} ${frameSize.width-15},${frameSize.height-5} Q${frameSize.width-25},${frameSize.height-5} ${frameSize.width-35},${frameSize.height-15}`}
        stroke="url(#elaborateGradient)"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Center decorative elements */}
      <Path
        d={`M${frameSize.width/2-10},5 Q${frameSize.width/2},0 ${frameSize.width/2+10},5`}
        stroke="url(#elaborateGradient)"
        strokeWidth="1"
        fill="none"
      />
      <Path
        d={`M${frameSize.width/2-10},${frameSize.height-5} Q${frameSize.width/2},${frameSize.height} ${frameSize.width/2+10},${frameSize.height-5}`}
        stroke="url(#elaborateGradient)"
        strokeWidth="1"
        fill="none"
      />
    </Svg>
  );

  const renderCosmicFrame = () => (
    <Svg width={frameSize.width} height={frameSize.height} style={styles.frame}>
      <Defs>
        <LinearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.accent} stopOpacity="1" />
          <Stop offset="33%" stopColor={colors.accentSecondary} stopOpacity="0.9" />
          <Stop offset="66%" stopColor={colors.primary} stopOpacity="0.7" />
          <Stop offset="100%" stopColor={colors.accent} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      
      {/* Cosmic patterns */}
      <Path
        d="M10,10 Q20,5 30,10 Q35,20 30,30 Q20,35 10,30 Q5,20 10,10 Z"
        stroke="url(#cosmicGradient)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d={`M${frameSize.width-10},10 Q${frameSize.width-20},5 ${frameSize.width-30},10 Q${frameSize.width-35},20 ${frameSize.width-30},30 Q${frameSize.width-20},35 ${frameSize.width-10},30 Q${frameSize.width-5},20 ${frameSize.width-10},10 Z`}
        stroke="url(#cosmicGradient)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d={`M10,${frameSize.height-10} Q20,${frameSize.height-5} 30,${frameSize.height-10} Q35,${frameSize.height-20} 30,${frameSize.height-30} Q20,${frameSize.height-35} 10,${frameSize.height-30} Q5,${frameSize.height-20} 10,${frameSize.height-10} Z`}
        stroke="url(#cosmicGradient)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d={`M${frameSize.width-10},${frameSize.height-10} Q${frameSize.width-20},${frameSize.height-5} ${frameSize.width-30},${frameSize.height-10} Q${frameSize.width-35},${frameSize.height-20} ${frameSize.width-30},${frameSize.height-30} Q${frameSize.width-20},${frameSize.height-35} ${frameSize.width-10},${frameSize.height-30} Q${frameSize.width-5},${frameSize.height-20} ${frameSize.width-10},${frameSize.height-10} Z`}
        stroke="url(#cosmicGradient)"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Cosmic symbols */}
      <Path
        d={`M${frameSize.width/2},10 L${frameSize.width/2-5},20 L${frameSize.width/2+5},20 Z`}
        stroke="url(#cosmicGradient)"
        strokeWidth="1.5"
        fill="none"
      />
      <Path
        d={`M${frameSize.width/2},${frameSize.height-10} L${frameSize.width/2-5},${frameSize.height-20} L${frameSize.width/2+5},${frameSize.height-20} Z`}
        stroke="url(#cosmicGradient)"
        strokeWidth="1.5"
        fill="none"
      />
    </Svg>
  );

  const renderFrame = () => {
    switch (variant) {
      case 'elaborate':
        return renderElaborateFrame();
      case 'cosmic':
        return renderCosmicFrame();
      default:
        return renderSimpleFrame();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {renderFrame()}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  content: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});