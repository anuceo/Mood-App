import React, { useMemo, useState } from 'react';
import {
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

// ─── Mock data ────────────────────────────────────────────────────────────────
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

  const q = searchQuery.toLowerCase().trim();

  // Filter trending tags: match mood label or key against search query and selectedMood
  const filteredTrending = useMemo(() => {
    return TRENDING_TAGS.filter(({ mood }) => {
      const moodData = moods[mood];
      const matchesSearch = !q || moodData.label.toLowerCase().includes(q) || mood.includes(q);
      const matchesMood = !selectedMood || mood === selectedMood;
      return matchesSearch && matchesMood;
    });
  }, [q, selectedMood]);

  // Filter creators: match handle or primary mood against search query and selectedMood
  const filteredCreators = useMemo(() => {
    return FEATURED_CREATORS.filter((creator) => {
      const matchesSearch = !q || creator.handle.toLowerCase().includes(q) || creator.primaryMood.includes(q);
      const matchesMood = !selectedMood || creator.primaryMood === selectedMood;
      return matchesSearch && matchesMood;
    });
  }, [q, selectedMood]);

  const handleMoodOrbPress = (m) => {
    setSelectedMood((prev) => (prev === m ? null : m));
    // Clear search when selecting a mood orb so results update cleanly
    setSearchQuery('');
  };

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
        keyboardShouldPersistTaps="handled"
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
            onChangeText={(text) => {
              setSearchQuery(text);
              // Clear mood filter when typing so text search takes over
              if (text.length > 0) setSelectedMood(null);
            }}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Text
              style={styles.clearBtn}
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              ✕
            </Text>
          )}
        </View>

        {/* Active filter pill */}
        {(selectedMood || q) && (
          <View style={styles.activeFilterRow}>
            <Text style={styles.activeFilterLabel}>
              {selectedMood ? `${moods[selectedMood].emoji} ${moods[selectedMood].label}` : `"${q}"`}
            </Text>
            <Text
              style={styles.clearFilter}
              onPress={() => { setSelectedMood(null); setSearchQuery(''); }}
              accessibilityRole="button"
              accessibilityLabel="Clear filter"
            >
              Clear
            </Text>
          </View>
        )}

        {/* ─── Mood Universe ─── */}
        <SectionHeader label="Mood Universe" />
        <View style={styles.orbGrid}>
          {moodList.map((m) => (
            <MoodOrb
              key={m}
              mood={m}
              size={76}
              selected={selectedMood === m}
              onPress={() => handleMoodOrbPress(m)}
            />
          ))}
        </View>

        {/* ─── Trending Moods ─── */}
        <SectionHeader label="Trending" emoji="🔥" />
        {filteredTrending.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingRow}
          >
            {filteredTrending.map(({ mood, count }) => {
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
        ) : (
          <EmptyState label="No trending moods match" />
        )}

        {/* ─── Rising Creators ─── */}
        <SectionHeader label="Rising Creators" emoji="✨" />
        {filteredCreators.length > 0 ? (
          filteredCreators.map((creator) => {
            const moodData = moods[creator.primaryMood];
            return (
              <CreatorRow
                key={creator.handle}
                creator={creator}
                moodData={moodData}
                onPress={() => navigation?.navigate('Profile')}
              />
            );
          })
        ) : (
          <EmptyState label="No creators match" />
        )}
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

const EmptyState = ({ label }) => (
  <View style={emptyStyles.wrap}>
    <Text style={emptyStyles.text}>{label}</Text>
  </View>
);

const CreatorRow = ({ creator, moodData, onPress }) => (
  <GlassCard style={creatorStyles.card} glowColor={moodData.color} intensity="medium">
    <View style={creatorStyles.inner}>
      <LinearGradient colors={moodData.gradient} style={creatorStyles.avatar}>
        <Text style={creatorStyles.avatarText}>
          {creator.handle[0].toUpperCase()}
        </Text>
      </LinearGradient>

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
  clearBtn: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    paddingHorizontal: spacing[1],
  },
  activeFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
    marginTop: -spacing[2],
  },
  activeFilterLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  clearFilter: {
    fontSize: typography.size.sm,
    color: colors.brand.primary,
    fontWeight: typography.weight.semibold,
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

const emptyStyles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  text: {
    ...textStyles.bodySmall,
    fontStyle: 'italic',
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
