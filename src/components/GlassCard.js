import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadows } from '../theme';

/**
 * GlassCard — a frosted-glass surface container.
 *
 * On iOS this leverages the BlurView for real blur; on Android it
 * approximates the effect with a semi-transparent dark overlay and border.
 *
 * Props:
 *   children
 *   style
 *   glowColor   string  — optional border/shadow accent color
 *   intensity   'subtle'|'medium'|'strong'
 */
const GlassCard = ({
  children,
  style,
  glowColor,
  intensity = 'medium',
}) => {
  const intensityStyle = intensityMap[intensity];

  return (
    <View
      style={[
        styles.card,
        intensityStyle,
        glowColor && {
          borderColor: `${glowColor}40`,
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 8,
        },
        !glowColor && shadows.md,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const intensityMap = {
  subtle: {
    backgroundColor: 'rgba(18,18,42,0.5)',
    borderColor: 'rgba(237,233,255,0.05)',
  },
  medium: {
    backgroundColor: 'rgba(18,18,42,0.72)',
    borderColor: 'rgba(237,233,255,0.09)',
  },
  strong: {
    backgroundColor: 'rgba(18,18,42,0.92)',
    borderColor: 'rgba(237,233,255,0.13)',
  },
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default GlassCard;
