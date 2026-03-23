import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import MoodTag from '../components/MoodTag';
import { colors, moods, radius, spacing, textStyles, typography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Mock profile data ────────────────────────────────────────────────────────
const MOCK_PROFILE = {
  handle: 'solstice.vibe',
  displayName: 'solstice',
  bio: 'collecting moments that feel like 3am in summer ✦ vibes only',
  primaryMood: 'dreamy',
  resonanceCount: 48200,
  boardCount: 7,
  followersCount: 12400,
  contentCount: 94,
  moodStats: [
    { mood: 'dreamy', percent: 42 },
    { mood: 'calm', percent: 28 },
    { mood: 'ethereal', percent: 18 },
    { mood: 'melancholy', percent: 12 },
  ],
};

const MOCK_BOARDS = [
  { id: '1', name: 'late night drive', mood: 'dreamy', count: 23 },
  { id: '2', name: 'green hours', mood: 'calm', count: 11 },
  { id: '3', name: 'blue period', mood: 'melancholy', count: 8 },
  { id: '4', name: 'the beyond', mood: 'ethereal', count: 15 },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const profile = MOCK_PROFILE;
  const primaryMoodData = moods[profile.primaryMood];

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing coming soon ✦',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Follow @${profile.handle} on Mood — their vibe is ${primaryMoodData.emoji} ${primaryMoodData.label} ✦`,
        title: `@${profile.handle} on Mood`,
      });
    } catch {
      // Share dialog dismissed — no action needed
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background */}
      <LinearGradient
        colors={[primaryMoodData.dark + 'AA', colors.bg.base, colors.bg.base]}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing[5], paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Avatar + Identity ─── */}
        <View style={styles.heroSection}>
          {/* Glowing avatar */}
          <View style={styles.avatarWrap}>
            <LinearGradient
              colors={primaryMoodData.gradient}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarEmoji}>{primaryMoodData.emoji}</Text>
            </LinearGradient>
            <View
              style={[
                styles.avatarGlow,
                {
                  shadowColor: primaryMoodData.color,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 24,
                  elevation: 12,
                  borderColor: primaryMoodData.color,
                },
              ]}
            />
          </View>

          <Text style={textStyles.displayMedium}>@{profile.handle}</Text>
          <Text style={[textStyles.body, styles.bio]}>{profile.bio}</Text>

          {/* Primary mood */}
          <MoodTag mood={profile.primaryMood} selected size="md" />
        </View>

        {/* ─── Stats ─── */}
        <View style={styles.statsRow}>
          {[
            { value: formatNumber(profile.resonanceCount), label: 'resonances' },
            { value: String(profile.contentCount), label: 'vibes' },
            { value: String(profile.boardCount), label: 'boards' },
          ].map(({ value, label }) => (
            <GlassCard key={label} style={styles.statCard} intensity="medium">
              <Text style={styles.statValue}>{value}</Text>
              <Text style={textStyles.caption}>{label}</Text>
            </GlassCard>
          ))}
        </View>

        {/* ─── Mood DNA ─── */}
        <View style={styles.section}>
          <Text style={textStyles.heading2}>Mood DNA</Text>
          <View style={styles.moodDna}>
            {profile.moodStats.map(({ mood, percent }) => {
              const md = moods[mood];
              return (
                <View key={mood} style={styles.moodDnaRow}>
                  <MoodTag mood={mood} size="sm" />
                  <View style={styles.dnaBarTrack}>
                    <LinearGradient
                      colors={md.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.dnaBar, { width: `${percent}%` }]}
                    />
                  </View>
                  <Text style={[styles.dnaPercent, { color: md.color }]}>
                    {percent}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ─── Boards ─── */}
        <View style={styles.section}>
          <Text style={textStyles.heading2}>Boards</Text>
          <View style={styles.boardsGrid}>
            {MOCK_BOARDS.map((board) => {
              const md = moods[board.mood];
              return (
                <GlassCard
                  key={board.id}
                  style={styles.boardCard}
                  glowColor={md.color}
                  intensity="medium"
                >
                  <LinearGradient
                    colors={[md.dark + '80', 'transparent']}
                    style={styles.boardGradient}
                  >
                    <Text style={styles.boardEmoji}>{md.emoji}</Text>
                    <Text style={[styles.boardName, { color: colors.text.primary }]}>
                      {board.name}
                    </Text>
                    <Text style={textStyles.caption}>{board.count} vibes</Text>
                  </LinearGradient>
                </GlassCard>
              );
            })}
          </View>
        </View>

        {/* ─── Actions ─── */}
        <View style={styles.actions}>
          <Button
            label="Edit Profile"
            variant="secondary"
            size="md"
            fullWidth
            onPress={handleEditProfile}
          />
          <Button
            label="Share Profile"
            variant="ghost"
            size="md"
            fullWidth
            onPress={handleShareProfile}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNumber = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  content: {
    paddingHorizontal: spacing[5],
    gap: spacing[7],
  },
  heroSection: {
    alignItems: 'center',
    gap: spacing[3],
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: spacing[2],
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 44,
  },
  avatarGlow: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 56,
    borderWidth: 2,
    opacity: 0.7,
  },
  bio: {
    textAlign: 'center',
    maxWidth: SCREEN_WIDTH * 0.75,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[1],
  },
  statValue: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  section: {
    gap: spacing[4],
  },
  moodDna: {
    gap: spacing[3],
  },
  moodDnaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  dnaBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  dnaBar: {
    height: '100%',
    borderRadius: radius.full,
  },
  dnaPercent: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    minWidth: 32,
    textAlign: 'right',
  },
  boardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  boardCard: {
    width: (SCREEN_WIDTH - spacing[5] * 2 - spacing[3]) / 2,
    overflow: 'hidden',
  },
  boardGradient: {
    padding: spacing[4],
    gap: spacing[1.5],
  },
  boardEmoji: {
    fontSize: 28,
    marginBottom: spacing[1],
  },
  boardName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  actions: {
    gap: spacing[3],
  },
});

export default ProfileScreen;
