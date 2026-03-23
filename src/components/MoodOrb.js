import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { moods, typography } from '../theme';

/**
 * MoodOrb — a large, glowing circular button for the mood picker.
 *
 * Each orb slowly pulses its glow, giving the screen an ethereal, living feel.
 *
 * Props:
 *   mood       string  — mood key
 *   selected   bool
 *   onPress    fn
 *   size       number  — diameter in px, defaults 90
 */
const MoodOrb = ({ mood, selected = false, onPress, size = 90 }) => {
  const moodData = moods[mood] || moods.dreamy;
  const glowAnim = useRef(new Animated.Value(selected ? 1 : 0.3)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Idle pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1800 + Math.random() * 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800 + Math.random() * 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Selection glow
  useEffect(() => {
    Animated.timing(glowAnim, {
      toValue: selected ? 1 : 0.3,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selected, glowAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      damping: 12,
      stiffness: 400,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 10,
      stiffness: 200,
    }).start();
  };

  const shadowRadius = glowAnim.interpolate({
    inputRange: [0.3, 1],
    outputRange: [6, 24],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0.3, 1],
    outputRange: [0.2, 0.75],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`${moodData.label} mood`}
      accessibilityState={{ selected }}
    >
      <Animated.View
        style={[
          styles.orbWrapper,
          {
            width: size + 16,
            height: size + 16,
            transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
          },
        ]}
      >
        {/* Outer glow ring */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glowRing,
            {
              width: size + 16,
              height: size + 16,
              borderRadius: (size + 16) / 2,
              borderColor: moodData.color,
              shadowColor: moodData.color,
              shadowRadius,
              shadowOpacity,
              shadowOffset: { width: 0, height: 0 },
              elevation: 10,
              opacity: glowAnim,
            },
          ]}
        />

        {/* Inner orb */}
        <LinearGradient
          colors={moodData.gradient}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[
            styles.orb,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.emoji, { fontSize: size * 0.38 }]}>
            {moodData.emoji}
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Label */}
      <Text
        style={[
          styles.label,
          { color: selected ? moodData.color : 'rgba(237,233,255,0.5)' },
        ]}
      >
        {moodData.label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  orbWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  orb: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default MoodOrb;
