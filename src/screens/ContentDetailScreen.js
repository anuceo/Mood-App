import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { BackButton } from '../components/Header';
import MoodTag from '../components/MoodTag';
import ResonanceButton from '../components/ResonanceButton';
import { colors, moods, radius, spacing, textStyles, typography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_WIDTH * (16 / 9);

/**
 * ContentDetailScreen — full detail view for a single content piece.
 *
 * Shows:
 *   - Full video player (placeholder)
 *   - Mood tags with glow
 *   - Creator info
 *   - Resonance action
 *   - "Add to board" CTA
 *   - Attribution if not original
 */
const ContentDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const item = route?.params?.item ?? MOCK_ITEM;

  const [resonated, setResonated] = useState(false);
  const [resonanceCount, setResonanceCount] = useState(item.resonanceCount);

  const primaryMood = item.moodTags?.[0];
  const moodData = primaryMood ? moods[primaryMood] : null;

  const handleResonate = (next) => {
    setResonated(next);
    setResonanceCount((c) => c + (next ? 1 : -1));
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background glow */}
      {moodData && (
        <LinearGradient
          colors={[moodData.dark + '90', colors.bg.base, colors.bg.base]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}

      {/* Back button — floats over video */}
      <View style={[styles.backRow, { top: insets.top + spacing[4] }]}>
        <BackButton onPress={() => navigation?.goBack()} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Video Player ─── */}
        <View style={styles.videoWrap}>
          {/* Placeholder — replace with <Video> component */}
          <LinearGradient
            colors={moodData ? moodData.gradient : [colors.bg.surface, colors.bg.elevated]}
            style={styles.videoPlaceholder}
          >
            <View style={styles.playCircle}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </LinearGradient>

          {/* Mood glow strip */}
          {moodData && (
            <View
              style={[
                styles.moodStrip,
                { backgroundColor: moodData.color, shadowColor: moodData.color },
              ]}
            />
          )}
        </View>

        {/* ─── Content Info ─── */}
        <View style={styles.infoSection}>
          {/* Mood tags */}
          <View style={styles.tagsRow}>
            {item.moodTags.map((m) => (
              <MoodTag key={m} mood={m} selected size="lg" />
            ))}
          </View>

          {/* Creator + resonance */}
          <View style={styles.creatorRow}>
            <View style={styles.creatorLeft}>
              <LinearGradient
                colors={moodData ? moodData.gradient : [colors.brand.primary, '#A855F7']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {item.creatorHandle?.[0]?.toUpperCase()}
                </Text>
              </LinearGradient>
              <View>
                <Text style={[textStyles.heading3]}>@{item.creatorHandle}</Text>
                {!item.isOriginal && item.attributionUrl && (
                  <Text style={textStyles.caption}>via {item.attributionUrl}</Text>
                )}
              </View>
            </View>
            <ResonanceButton
              count={resonanceCount}
              resonated={resonated}
              onToggle={handleResonate}
              size="lg"
            />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Attribution notice */}
          {!item.isOriginal && (
            <GlassCard intensity="subtle" style={styles.attributionCard}>
              <Text style={[textStyles.caption, styles.attributionText]}>
                ✦ Curated content — original creator credited via{' '}
                <Text style={{ color: colors.brand.accent }}>{item.attributionUrl}</Text>
              </Text>
            </GlassCard>
          )}

          {/* Action buttons */}
          <View style={styles.actions}>
            <Button
              label="Add to Board"
              variant="primary"
              size="lg"
              fullWidth
            />
            <Button
              label="Share Vibe"
              variant="secondary"
              size="lg"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ─── Fallback mock ────────────────────────────────────────────────────────────
const MOCK_ITEM = {
  _id: 'mock',
  videoUrl: '',
  moodTags: ['dreamy', 'calm'],
  creatorHandle: 'solstice.vibe',
  attributionUrl: null,
  isOriginal: true,
  resonanceCount: 2847,
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  backRow: {
    position: 'absolute',
    left: spacing[5],
    zIndex: 20,
  },
  videoWrap: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: colors.bg.surface,
    position: 'relative',
  },
  videoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  playIcon: {
    fontSize: 28,
    color: colors.white,
    marginLeft: 4,
  },
  moodStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  infoSection: {
    padding: spacing[5],
    gap: spacing[5],
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creatorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
  },
  attributionCard: {
    padding: spacing[3],
  },
  attributionText: {
    color: colors.text.secondary,
    lineHeight: 18,
  },
  actions: {
    gap: spacing[3],
  },
});

export default ContentDetailScreen;
