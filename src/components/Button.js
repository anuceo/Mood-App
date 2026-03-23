import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, radius, spacing, typography } from '../theme';

/**
 * Button — the primary CTA component.
 *
 * Variants:
 *   'primary'  — gradient fill, glowing shadow
 *   'secondary'— bordered, no fill
 *   'ghost'    — text-only
 *   'mood'     — uses mood color (requires moodColor + moodGradient props)
 *
 * Props:
 *   label        string
 *   onPress      fn
 *   variant      'primary'|'secondary'|'ghost'|'mood'
 *   size         'sm'|'md'|'lg'
 *   loading      bool
 *   disabled     bool
 *   icon         ReactNode — optional left icon
 *   moodColor    string    — base color for mood variant
 *   moodGradient string[]  — gradient for mood variant
 *   fullWidth    bool
 */
const Button = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  moodColor,
  moodGradient,
  fullWidth = false,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      damping: 18,
      stiffness: 300,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 18,
      stiffness: 250,
    }).start();
  };

  const sz = sizeConfig[size];
  const isDisabled = disabled || loading;

  const innerContent = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'ghost' ? colors.brand.primary : colors.white}
        />
      ) : (
        <>
          {icon && <Animated.View style={styles.iconWrap}>{icon}</Animated.View>}
          <Text style={[styles.label, sz.label, variantStyles[variant]?.label, isDisabled && styles.disabledLabel]}>
            {label}
          </Text>
        </>
      )}
    </>
  );

  const gradientColors = variant === 'mood' && moodGradient
    ? moodGradient
    : [colors.brand.primary, '#A855F7']; // default violet gradient

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={isDisabled ? undefined : handlePressIn}
      onPressOut={isDisabled ? undefined : handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      style={[fullWidth && styles.fullWidth, style]}
    >
      <Animated.View
        style={[
          styles.base,
          sz.container,
          fullWidth && styles.fullWidth,
          { transform: [{ scale: scaleAnim }] },
          variant !== 'primary' && variant !== 'mood' && variantStyles[variant]?.container,
          (variant === 'primary' || variant === 'mood') && {
            shadowColor: variant === 'mood' ? moodColor : colors.brand.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDisabled ? 0 : 0.45,
            shadowRadius: 14,
            elevation: isDisabled ? 0 : 8,
          },
          isDisabled && styles.disabled,
        ]}
      >
        {(variant === 'primary' || variant === 'mood') ? (
          <LinearGradient
            colors={isDisabled ? [colors.bg.elevated, colors.bg.elevated] : gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, sz.container, fullWidth && styles.fullWidth]}
          >
            {innerContent}
          </LinearGradient>
        ) : (
          innerContent
        )}
      </Animated.View>
    </Pressable>
  );
};

const sizeConfig = {
  sm: {
    container: { paddingHorizontal: spacing[3], paddingVertical: spacing[1.5], borderRadius: radius.full },
    label: { fontSize: typography.size.sm },
  },
  md: {
    container: { paddingHorizontal: spacing[6], paddingVertical: spacing[3], borderRadius: radius.full },
    label: { fontSize: typography.size.md },
  },
  lg: {
    container: { paddingHorizontal: spacing[8], paddingVertical: spacing[4], borderRadius: radius.full },
    label: { fontSize: typography.size.lg },
  },
};

const variantStyles = {
  secondary: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.brand.primary,
    },
    label: { color: colors.brand.primary },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: { color: colors.brand.primary },
  },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    color: colors.white,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.2,
  },
  disabledLabel: {
    color: colors.text.disabled,
  },
  iconWrap: {
    marginRight: spacing[2],
  },
  disabled: {
    opacity: 0.45,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
