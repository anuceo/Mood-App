import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, moods, radius, spacing, typography } from '../theme';

/**
 * MoodTag — a glowing, pressable pill representing a single mood.
 *
 * Props:
 *   mood       string  — key from moods object (e.g. 'dreamy')
 *   selected   bool    — highlights with full glow when active
 *   onPress    fn      — tap handler
 *   size       'sm'|'md'|'lg'  — defaults to 'md'
 *   showEmoji  bool    — prepend emoji, defaults true
 */
const MoodTag = ({
  mood,
  selected = false,
  onPress,
  size = 'md',
  showEmoji = true,
  style,
}) => {
  const moodData = moods[mood] || moods.dreamy;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(glowAnim, {
      toValue: selected ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [selected, glowAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      ...{ damping: 18, stiffness: 300 },
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      ...{ damping: 18, stiffness: 300 },
    }).start();
  };

  const sizeStyles = sizes[size];

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.08)', moodData.color],
  });

  const bgColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.05)', moodData.dark + 'CC'],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`${moodData.label} mood`}
      accessibilityState={{ selected }}
    >
      <Animated.View
        style={[
          styles.base,
          sizeStyles.container,
          { borderColor, backgroundColor: bgColor, transform: [{ scale: scaleAnim }] },
          selected && {
            shadowColor: moodData.color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 10,
            elevation: 8,
          },
          style,
        ]}
      >
        {showEmoji && (
          <Text style={[styles.emoji, sizeStyles.emoji]}>
            {moodData.emoji}
          </Text>
        )}
        <Text style={[styles.label, sizeStyles.label, { color: selected ? moodData.color : colors.text.secondary }]}>
          {moodData.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const sizes = {
  sm: {
    container: { paddingHorizontal: spacing[2], paddingVertical: spacing[1] },
    label: { fontSize: typography.size.xs },
    emoji: { fontSize: 11, marginRight: 3 },
  },
  md: {
    container: { paddingHorizontal: spacing[3], paddingVertical: spacing[1.5] },
    label: { fontSize: typography.size.sm },
    emoji: { fontSize: 13, marginRight: 4 },
  },
  lg: {
    container: { paddingHorizontal: spacing[4], paddingVertical: spacing[2] },
    label: { fontSize: typography.size.md },
    emoji: { fontSize: 16, marginRight: 6 },
  },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
  },
  label: {
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.2,
  },
  emoji: {
    // emoji sizing handled per-size
  },
});

export default MoodTag;
