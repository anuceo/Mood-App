import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../components/GlassCard';
import MoodOrb from '../components/MoodOrb';
import { colors, moods, moodList, radius, spacing, textStyles, typography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Mock trending data ───────────────────────────────────────────────────────
const TRENDING_TAGS = [
  { mood: 'dreamy', count: '42.1K' },
  { mood: 'ethereal', count: '28.7K' },
  { mood: 'cozy', count: '19.3K' },
  { mood: 'nostalgic', count: '35.5K' },
  { mood: 'calm', count: '12.8K' },
  { mood: 'energized', count: '9.2K' },
];

const FEATURED_CREATORS = [
  { handle: 'aurora.bits', primaryMood: 'ethereal', followers: '12.4K' },
  { handle: 'solstice.vibe', primaryMood: 'dreamy', followers: '8.9K' },
  { handle: 'rainy.window', primaryMood: 'melancholy', followers: '22.1K' },
  { handle: 'neonpulse', primaryMood: 'energized', followers: '5.6K' },
  { handle: 'cassette_ghost', primaryMood: 'nostalgic', followers: '31.0K' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const DiscoverScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={[colors.bg.base, '#100E24', colors.bg.base]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing[5], paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={textStyles.displayMedium}>Discover</Text>
          <Text style={styles.sparkle}>✦</Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={styles.searchIcon}>
            <Text style={styles.searchIconText}>⌕</Text>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search moods, creators, vibes…"
            placeholderTextColor={colors.text.disabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* ─── Mood Universe ─── */}
        <SectionHeader label="Mood Universe" />
        <View style={styles.orbGrid}>
          {moodList.map((m) => (
            <MoodOrb
              key={m}
              mood={m}
              size={76}
              selected={selectedMood === m}
              onPress={() => setSelectedMood((prev) => (prev === m ? null : m))}
            />
          ))}
        </View>

        {/* ─── Trending Moods ─── */}
        <SectionHeader label="Trending" emoji="🔥" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingRow}
        >
          {TRENDING_TAGS.map(({ mood, count }) => {
            const moodData = moods[mood];
            return (
              <GlassCard key={mood} glowColor={moodData.color} style={styles.trendCard}>
                <LinearGradient
                  colors={[moodData.dark + '80', 'transparent']}
                  style={styles.trendGradient}
                >
                  <Text style={styles.trendEmoji}>{moodData.emoji}</Text>
                  <Text style={[styles.trendLabel, { color: moodData.color }]}>
                    {moodData.label}
                  </Text>
                  <Text style={textStyles.caption}>{count} vibes</Text>
                </LinearGradient>
              </GlassCard>
            );
          })}
        </ScrollView>

        {/* ─── Featured Creators ─── */}
        <SectionHeader label="Rising Creators" emoji="✨" />
        {FEATURED_CREATORS.map((creator) => {
          const moodData = moods[creator.primaryMood];
          return (
            <CreatorRow key={creator.handle} creator={creator} moodData={moodData} />
          );
        })}
      </ScrollView>
    </View>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeader = ({ label, emoji }) => (
  <View style={sectionStyles.row}>
    <Text style={sectionStyles.label}>{label}</Text>
    {emoji && <Text style={sectionStyles.emoji}>{emoji}</Text>}
  </View>
);

const CreatorRow = ({ creator, moodData }) => (
  <GlassCard style={creatorStyles.card} glowColor={moodData.color} intensity="medium">
    <View style={creatorStyles.inner}>
      {/* Avatar */}
      <LinearGradient
        colors={moodData.gradient}
        style={[creatorStyles.avatar]}
      >
        <Text style={creatorStyles.avatarText}>
          {creator.handle[0].toUpperCase()}
        </Text>
      </LinearGradient>

      {/* Info */}
      <View style={creatorStyles.info}>
        <Text style={[textStyles.heading3, { color: colors.text.primary }]}>
          @{creator.handle}
        </Text>
        <View style={creatorStyles.moodBadge}>
          <Text style={creatorStyles.moodEmoji}>{moodData.emoji}</Text>
          <Text style={[textStyles.caption, { color: moodData.color }]}>
            {moodData.label}
          </Text>
        </View>
      </View>

      {/* Followers */}
      <View style={creatorStyles.followersBlock}>
        <Text style={[textStyles.heading3, { color: moodData.color }]}>
          {creator.followers}
        </Text>
        <Text style={textStyles.caption}>resonators</Text>
      </View>
    </View>
  </GlassCard>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  content: {
    paddingHorizontal: spacing[5],
    gap: spacing[5],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  sparkle: {
    fontSize: 28,
    color: colors.brand.primary,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing[4],
    height: 48,
    gap: spacing[2],
  },
  searchIcon: {
    width: 24,
    alignItems: 'center',
  },
  searchIconText: {
    fontSize: 20,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.text.primary,
    height: '100%',
  },
  orbGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing[5],
  },
  trendingRow: {
    gap: spacing[3],
    paddingRight: spacing[5],
    marginHorizontal: -spacing[5],
    paddingLeft: spacing[5],
  },
  trendCard: {
    width: 110,
    overflow: 'hidden',
  },
  trendGradient: {
    padding: spacing[3],
    gap: spacing[1],
    alignItems: 'flex-start',
  },
  trendEmoji: {
    fontSize: 28,
    marginBottom: spacing[1],
  },
  trendLabel: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});

const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: -spacing[2],
  },
  label: {
    ...textStyles.heading2,
  },
  emoji: {
    fontSize: 20,
  },
});

const creatorStyles = StyleSheet.create({
  card: {
    marginBottom: spacing[3],
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[3],
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.white,
  },
  info: {
    flex: 1,
    gap: spacing[1],
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  moodEmoji: {
    fontSize: 13,
  },
  followersBlock: {
    alignItems: 'flex-end',
    gap: 2,
  },
});

export default DiscoverScreen;
