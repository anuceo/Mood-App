import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

/**
 * ResonanceButton — the core engagement action.
 *
 * Animates a ripple-burst effect on press, glows the brand secondary color,
 * and shows the running resonance count.
 *
 * Props:
 *   count        number
 *   resonated    bool     — already resonated by current user
 *   onToggle     fn(bool) — called with next resonated state
 *   size         'sm'|'md'|'lg'
 */
const ResonanceButton = ({
  count = 0,
  resonated = false,
  onToggle,
  size = 'md',
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(resonated ? 1 : 0)).current;
  const burstScale = useRef(new Animated.Value(0)).current;
  const burstOpacity = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    const next = !resonated;
    onToggle?.(next);

    // Scale press
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.82,
        useNativeDriver: true,
        damping: 12,
        stiffness: 400,
      }),
      Animated.spring(scaleAnim, {
        toValue: next ? 1.12 : 1,
        useNativeDriver: true,
        damping: 10,
        stiffness: 200,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 18,
        stiffness: 300,
      }),
    ]).start();

    // Glow transition
    Animated.timing(glowOpacity, {
      toValue: next ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Burst ring
    if (next) {
      burstScale.setValue(0.4);
      burstOpacity.setValue(0.8);
      Animated.parallel([
        Animated.timing(burstScale, {
          toValue: 2.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(burstOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const sz = sizeConfig[size];

  const iconColor = glowOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.text.secondary, colors.brand.secondary],
  });

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={`${count} resonances. ${resonated ? 'Remove' : 'Add'} resonance`}
      style={[styles.wrapper, style]}
    >
      {/* Burst ring */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.burst,
          {
            width: sz.iconSize * 3,
            height: sz.iconSize * 3,
            borderRadius: sz.iconSize * 1.5,
            borderColor: colors.brand.secondary,
            opacity: burstOpacity,
            transform: [{ scale: burstScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.iconWrap,
          {
            width: sz.iconSize,
            height: sz.iconSize,
            borderRadius: sz.iconSize / 2,
            transform: [{ scale: scaleAnim }],
          },
          resonated && {
            shadowColor: colors.brand.secondary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.7,
            shadowRadius: 12,
            elevation: 8,
          },
        ]}
      >
        {/* Wave/ripple icon using Unicode — swap for an SVG in production */}
        <Animated.Text style={[styles.icon, { fontSize: sz.iconFontSize, color: iconColor }]}>
          {resonated ? '〜' : '〜'}
        </Animated.Text>
      </Animated.View>

      <Text style={[styles.count, { fontSize: sz.countFontSize, color: resonated ? colors.brand.secondary : colors.text.secondary }]}>
        {formatCount(count)}
      </Text>
    </Pressable>
  );
};

const formatCount = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
};

const sizeConfig = {
  sm: { iconSize: 28, iconFontSize: 14, countFontSize: typography.size.xs },
  md: { iconSize: 36, iconFontSize: 18, countFontSize: typography.size.sm },
  lg: { iconSize: 44, iconFontSize: 22, countFontSize: typography.size.md },
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: spacing[1],
  },
  burst: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,107,157,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,157,0.2)',
  },
  icon: {
    fontWeight: typography.weight.bold,
  },
  count: {
    fontWeight: typography.weight.semibold,
  },
});

export default ResonanceButton;
