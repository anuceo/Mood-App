import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ContentCard from '../components/ContentCard';
import MoodTag from '../components/MoodTag';
import { colors, moodList, spacing, textStyles } from '../theme';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_FEED = [
  {
    _id: '1',
    videoUrl: 'https://example.com/video1.mp4',
    thumbnailUrl: null,
    moodTags: ['dreamy', 'calm'],
    creatorHandle: 'solstice.vibe',
    attributionUrl: null,
    isOriginal: true,
    resonanceCount: 2847,
  },
  {
    _id: '2',
    videoUrl: 'https://example.com/video2.mp4',
    thumbnailUrl: null,
    moodTags: ['energized', 'happy'],
    creatorHandle: 'neonpulse',
    attributionUrl: null,
    isOriginal: true,
    resonanceCount: 1203,
  },
  {
    _id: '3',
    videoUrl: 'https://example.com/video3.mp4',
    thumbnailUrl: null,
    moodTags: ['nostalgic'],
    creatorHandle: 'cassette_ghost',
    attributionUrl: 'tumblr.com',
    isOriginal: false,
    resonanceCount: 8521,
  },
  {
    _id: '4',
    videoUrl: 'https://example.com/video4.mp4',
    thumbnailUrl: null,
    moodTags: ['ethereal', 'dreamy'],
    creatorHandle: 'aurora.bits',
    attributionUrl: null,
    isOriginal: true,
    resonanceCount: 345,
  },
  {
    _id: '5',
    videoUrl: 'https://example.com/video5.mp4',
    thumbnailUrl: null,
    moodTags: ['cozy', 'melancholy'],
    creatorHandle: 'rainy.window',
    attributionUrl: null,
    isOriginal: true,
    resonanceCount: 6700,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedMood, setSelectedMood] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const filteredFeed = selectedMood
    ? MOCK_FEED.filter((item) => item.moodTags.includes(selectedMood))
    : MOCK_FEED;

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const handleMoodFilter = (mood) => {
    setSelectedMood((prev) => (prev === mood ? null : mood));
  };

  // Header fade on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const renderItem = useCallback(
    ({ item }) => (
      <ContentCard
        item={item}
        onPress={() => navigation?.navigate('ContentDetail', { item })}
        style={styles.card}
      />
    ),
    [navigation]
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Ambient background gradient */}
      <LinearGradient
        colors={[colors.bg.base, '#0D0B1E', colors.bg.base]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Floating header (fades in on scroll) */}
      <Animated.View
        pointerEvents="none"
        style={[styles.headerBg, { opacity: headerOpacity, paddingTop: insets.top }]}
      />

      {/* Sticky top area */}
      <View style={[styles.topArea, { paddingTop: insets.top + spacing[3] }]}>
        <View style={styles.titleRow}>
          <View>
            <Text style={textStyles.displayMedium}>For You</Text>
            <Text style={[textStyles.body, styles.subtitle]}>
              tuned to your vibe
            </Text>
          </View>
          <View style={styles.logoMark}>
            <Text style={styles.logoEmoji}>〜</Text>
          </View>
        </View>

        {/* Mood filter bar */}
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodFilterContent}
          style={styles.moodFilter}
        >
          {moodList.map((m) => (
            <MoodTag
              key={m}
              mood={m}
              selected={selectedMood === m}
              onPress={() => handleMoodFilter(m)}
              size="md"
              style={styles.moodFilterTag}
            />
          ))}
        </Animated.ScrollView>
      </View>

      {/* Feed */}
      <Animated.FlatList
        style={styles.feedList}
        data={filteredFeed}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={[styles.feedContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.brand.primary}
            colors={[colors.brand.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌙</Text>
            <Text style={[textStyles.heading3, styles.emptyTitle]}>No vibes here yet</Text>
            <Text style={textStyles.body}>Try a different mood filter</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: `${colors.bg.base}F0`,
    zIndex: 10,
  },
  topArea: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
    zIndex: 11,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  subtitle: {
    marginTop: spacing[0.5],
    color: colors.text.secondary,
  },
  logoMark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 22,
    color: colors.brand.primary,
  },
  moodFilter: {
    marginHorizontal: -spacing[5],
  },
  moodFilterContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[2],
  },
  moodFilterTag: {
    // individual tag style, spacing handled by gap
  },
  feedContent: {
    paddingTop: spacing[4],
    alignItems: 'center',
    gap: spacing[5],
  },
  feedList: {
    flex: 1,
  },
  card: {
    // width handled inside ContentCard
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing[20],
    gap: spacing[3],
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptyTitle: {
    color: colors.text.primary,
  },
});

export default HomeScreen;
