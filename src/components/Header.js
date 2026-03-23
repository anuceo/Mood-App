import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, textStyles, typography } from '../theme';

/**
 * Header — top navigation bar.
 *
 * Props:
 *   title       string
 *   subtitle    string   — optional small subtitle under title
 *   left        ReactNode — left slot (back button, avatar, etc.)
 *   right       ReactNode — right slot (action buttons)
 *   transparent bool     — removes background for use over content
 *   centered    bool     — centers title text
 */
const Header = ({
  title,
  subtitle,
  left,
  right,
  transparent = false,
  centered = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing[3] },
        transparent && styles.transparent,
      ]}
    >
      <View style={styles.row}>
        {/* Left slot */}
        <View style={styles.slot}>{left ?? <View />}</View>

        {/* Title block */}
        <View style={[styles.titleBlock, centered && styles.titleCentered]}>
          {title ? (
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
          ) : null}
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
          ) : null}
        </View>

        {/* Right slot */}
        <View style={[styles.slot, styles.slotRight]}>{right ?? <View />}</View>
      </View>
    </View>
  );
};

// Reusable back-button helper
export const BackButton = ({ onPress }) => (
  <Pressable onPress={onPress} hitSlop={10} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
    <Text style={styles.backIcon}>‹</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
    backgroundColor: colors.bg.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  slot: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  slotRight: {
    alignItems: 'flex-end',
  },
  titleBlock: {
    flex: 1,
    paddingHorizontal: spacing[2],
  },
  titleCentered: {
    alignItems: 'center',
  },
  title: {
    ...textStyles.heading2,
    letterSpacing: -0.3,
  },
  subtitle: {
    ...textStyles.caption,
    marginTop: 2,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,233,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  backIcon: {
    fontSize: 26,
    color: colors.text.primary,
    lineHeight: 30,
    marginTop: -2,
  },
});

export default Header;
