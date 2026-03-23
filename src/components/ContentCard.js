import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, moods, radius, shadows, spacing, textStyles, typography } from '../theme';
import MoodTag from './MoodTag';
import ResonanceButton from './ResonanceButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing[5] * 2;
const CARD_HEIGHT = CARD_WIDTH * (16 / 9);

/**
 * ContentCard — full vertical-video card for the feed.
 *
 * Shows a video thumbnail with an overlay containing:
 *   - Creator handle
 *   - Mood tags
 *   - Resonance button
 *   - Gradient vignette
 *
 * Props:
 *   item         { videoUrl, thumbnailUrl, moodTags[], creatorHandle, attributionUrl, resonanceCount }
 *   onPress      fn
 *   onResonate   fn(contentId, bool)
 *   style
 */
const ContentCard = ({ item, onPress, onResonate, style }) => {
  const [resonated, setResonated] = useState(false);
  const [resonanceCount, setResonanceCount] = useState(item?.resonanceCount ?? 0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const primaryMood = item?.moodTags?.[0];
  const moodData = primaryMood ? moods[primaryMood] : null;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.975,
      useNativeDriver: true,
      damping: 20,
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

  const handleResonate = (next) => {
    setResonated(next);
    setResonanceCount((c) => c + (next ? 1 : -1));
    onResonate?.(item?._id, next);
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Content by ${item?.creatorHandle}`}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale: scaleAnim }] },
          moodData && {
            shadowColor: moodData.color,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 12,
          },
          !moodData && shadows.lg,
          style,
        ]}
      >
        {/* Thumbnail / Video Placeholder */}
        <View style={styles.media}>
          {item?.thumbnailUrl ? (
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          ) : (
            // Placeholder gradient when no thumbnail
            <LinearGradient
              colors={moodData ? moodData.gradient : [colors.bg.surface, colors.bg.elevated]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Play indicator */}
          <View style={styles.playBadge}>
            <Text style={styles.playIcon}>▶</Text>
          </View>

          {/* Bottom overlay gradient */}
          <LinearGradient
            colors={['transparent', 'rgba(10,10,20,0.5)', 'rgba(10,10,20,0.95)']}
            style={styles.overlay}
            pointerEvents="none"
          />

          {/* Content info */}
          <View style={styles.info}>
            {/* Mood tags row */}
            {item?.moodTags?.length > 0 && (
              <View style={styles.tagsRow}>
                {item.moodTags.slice(0, 3).map((tag) => (
                  <MoodTag key={tag} mood={tag} size="sm" selected={false} />
                ))}
              </View>
            )}

            {/* Creator row */}
            <View style={styles.creatorRow}>
              <View style={styles.creatorInfo}>
                <View style={[styles.avatar, moodData && { borderColor: moodData.color }]}>
                  <Text style={styles.avatarText}>
                    {item?.creatorHandle?.[0]?.toUpperCase() ?? '?'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.handle} numberOfLines={1}>
                    @{item?.creatorHandle ?? 'unknown'}
                  </Text>
                  {!item?.isOriginal && item?.attributionUrl && (
                    <Text style={styles.attribution} numberOfLines={1}>
                      via {item.attributionUrl}
                    </Text>
                  )}
                </View>
              </View>

              {/* Resonance button */}
              <ResonanceButton
                count={resonanceCount}
                resonated={resonated}
                onToggle={handleResonate}
                size="md"
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.bg.surface,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  media: {
    width: '100%',
    height: CARD_HEIGHT,
    backgroundColor: colors.bg.surface,
  },
  playBadge: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  playIcon: {
    fontSize: 12,
    color: colors.white,
    marginLeft: 2,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: CARD_HEIGHT * 0.55,
  },
  info: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing[4],
    gap: spacing[2],
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1.5],
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.brand.primary,
  },
  avatarText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  handle: {
    ...textStyles.bodySmall,
    color: colors.text.primary,
    fontWeight: typography.weight.semibold,
  },
  attribution: {
    fontSize: typography.size.xs,
    color: colors.text.disabled,
  },
});

export default ContentCard;
