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
import MoodOrb from '../components/MoodOrb';
import { BackButton } from '../components/Header';
import { colors, moods, moodList, spacing, textStyles } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * MoodPickerScreen — full-screen experience for selecting one or more moods
 * before uploading or tagging content.
 *
 * The background gradient shifts to reflect the currently selected mood,
 * giving users immediate, embodied feedback about their choice.
 */
const MoodPickerScreen = ({ navigation, route, onComplete }) => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState([]);

  const primaryMood = selected[0] ? moods[selected[0]] : null;

  const toggleMood = (mood) => {
    setSelected((prev) =>
      prev.includes(mood)
        ? prev.filter((m) => m !== mood)
        : [...prev, mood].slice(0, 4) // max 4 moods
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    const callback = route?.params?.onComplete ?? onComplete;
    callback?.(selected);
    navigation?.goBack();
  };

  const gradientColors = primaryMood
    ? [`${primaryMood.dark}CC`, colors.bg.base, colors.bg.base]
    : [colors.bg.base, '#0D0B1E', colors.bg.base];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Dynamic background */}
      <LinearGradient
        colors={gradientColors}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Ambient glow orb */}
      {primaryMood && (
        <View
          pointerEvents="none"
          style={[
            styles.ambientOrb,
            {
              backgroundColor: primaryMood.color,
              shadowColor: primaryMood.color,
            },
          ]}
        />
      )}

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing[3] }]}>
        <BackButton onPress={() => navigation?.goBack()} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={[textStyles.displayMedium, styles.title]}>
            What's the{'\n'}vibe?
          </Text>
          <Text style={[textStyles.body, styles.subtitle]}>
            Select up to 4 moods that match your content.
          </Text>
        </View>

        {/* Selected mood summary */}
        {selected.length > 0 && (
          <View style={styles.selectedRow}>
            {selected.map((m) => {
              const md = moods[m];
              return (
                <View
                  key={m}
                  style={[styles.selectedPill, { backgroundColor: md.dark + 'CC', borderColor: md.color + '60' }]}
                >
                  <Text style={styles.selectedEmoji}>{md.emoji}</Text>
                  <Text style={[styles.selectedLabel, { color: md.color }]}>{md.label}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Orb grid */}
        <View style={styles.orbGrid}>
          {moodList.map((m) => (
            <MoodOrb
              key={m}
              mood={m}
              size={84}
              selected={selected.includes(m)}
              onPress={() => toggleMood(m)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA — floats above content */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing[5] }]}>
        <LinearGradient
          colors={['transparent', colors.bg.base]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <Button
          label={selected.length > 0 ? `Set ${selected.length} Mood${selected.length > 1 ? 's' : ''}` : 'Select a Mood'}
          onPress={handleContinue}
          disabled={selected.length === 0}
          variant={primaryMood ? 'mood' : 'primary'}
          moodColor={primaryMood?.color}
          moodGradient={primaryMood?.gradient}
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  ambientOrb: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.15,
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    borderRadius: SCREEN_WIDTH * 0.4,
    opacity: 0.08,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
  },
  header: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[2],
  },
  content: {
    paddingHorizontal: spacing[5],
    gap: spacing[7],
  },
  titleBlock: {
    gap: spacing[2],
  },
  title: {
    letterSpacing: -1,
  },
  subtitle: {
    color: colors.text.secondary,
  },
  selectedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: -spacing[3],
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: 9999,
    borderWidth: 1,
    gap: spacing[1],
  },
  selectedEmoji: {
    fontSize: 14,
  },
  selectedLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  orbGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing[7],
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[8],
  },
});

export default MoodPickerScreen;
