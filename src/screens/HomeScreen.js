import React, { useCallback, useEffect, useRef } from 'react';
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
import { useApp } from '../context/AppContext';
import { colors, moodList, spacing, textStyles } from '../theme';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    feedItems,
    feedMoodFilter,
    feedLoading,
    feedRefreshing,
    feedError,
    loadFeed,
    loadNextPage,
    setMoodFilter,
    toggleResonate,
  } = useApp();

  const scrollY = useRef(new Animated.Value(0)).current;

  // Initial load and reload when mood filter changes
  useEffect(() => {
    loadFeed({ mood: feedMoodFilter, page: 1, refresh: true });
  }, [feedMoodFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = useCallback(() => {
    loadFeed({ mood: feedMoodFilter, page: 1, refresh: true });
  }, [feedMoodFilter, loadFeed]);

  const handleMoodFilter = useCallback((mood) => {
    setMoodFilter(feedMoodFilter === mood ? null : mood);
  }, [feedMoodFilter, setMoodFilter]);

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
        onResonate={(contentId) => toggleResonate(contentId, item.resonated)}
        style={styles.card}
      />
    ),
    [navigation, toggleResonate]
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={[colors.bg.base, '#0D0B1E', colors.bg.base]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Scroll-fading header backdrop */}
      <Animated.View
        pointerEvents="none"
        style={[styles.headerBg, { opacity: headerOpacity, paddingTop: insets.top }]}
      />

      {/* Sticky top area */}
      <View style={[styles.topArea, { paddingTop: insets.top + spacing[3] }]}>
        <View style={styles.titleRow}>
          <View>
            <Text style={textStyles.displayMedium}>For You</Text>
            <Text style={[textStyles.body, styles.subtitle]}>tuned to your vibe</Text>
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
              selected={feedMoodFilter === m}
              onPress={() => handleMoodFilter(m)}
              size="md"
            />
          ))}
        </Animated.ScrollView>
      </View>

      {/* Feed */}
      <Animated.FlatList
        style={styles.feedList}
        data={feedItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={[styles.feedContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={feedRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.brand.primary}
            colors={[colors.brand.primary]}
          />
        }
        ListEmptyComponent={
          feedLoading ? null : (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>
                {feedError ? '⚠️' : '🌙'}
              </Text>
              <Text style={[textStyles.heading3, styles.emptyTitle]}>
                {feedError ? 'Could not load feed' : 'No vibes here yet'}
              </Text>
              <Text style={textStyles.body}>
                {feedError ? feedError : 'Try a different mood filter'}
              </Text>
            </View>
          )
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
  feedList: {
    flex: 1,
  },
  feedContent: {
    paddingTop: spacing[4],
    alignItems: 'center',
    gap: spacing[5],
  },
  card: {},
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
