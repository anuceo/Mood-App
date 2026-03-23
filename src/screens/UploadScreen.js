import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import MoodOrb from '../components/MoodOrb';
import { BackButton } from '../components/Header';
import { useApp } from '../context/AppContext';
import { contentApi } from '../services/api';
import { colors, moods, moodList, radius, spacing, textStyles, typography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_HEIGHT = SCREEN_WIDTH * (16 / 9);

const UploadScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useApp();

  const [videoUri, setVideoUri] = useState(null);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [caption, setCaption] = useState('');
  const [attributionUrl, setAttributionUrl] = useState('');
  const [isOriginal, setIsOriginal] = useState(true);
  const [uploading, setUploading] = useState(false);

  const primaryMood = selectedMoods[0] ? moods[selectedMoods[0]] : null;

  const handlePickVideo = async () => {
    const result = await launchImageLibrary({
      mediaType: 'video',
      videoQuality: 'high',
      selectionLimit: 1,
    });

    if (result.didCancel) return;

    if (result.errorCode) {
      const messages = {
        camera_unavailable: 'Camera is not available on this device.',
        permission: 'Permission denied — please allow media access in Settings.',
        others: result.errorMessage ?? 'Could not pick a video. Please try again.',
      };
      Alert.alert('Pick Failed', messages[result.errorCode] ?? messages.others);
      return;
    }

    if (!result.assets?.length) return;
    setVideoUri(result.assets[0].uri);
  };

  const toggleMood = (mood) => {
    setSelectedMoods((prev) =>
      prev.includes(mood)
        ? prev.filter((m) => m !== mood)
        : [...prev, mood].slice(0, 4)
    );
  };

  const canPost = videoUri && selectedMoods.length > 0 && !uploading;

  const handlePost = async () => {
    if (!canPost) return;
    setUploading(true);
    try {
      // In production, upload videoUri to cloud storage first and get back a URL.
      // For now we pass the local URI directly as the videoUrl.
      await contentApi.createContent({
        videoUrl: videoUri,
        moodTags: selectedMoods,
        caption: caption.trim(),
        attributionUrl: !isOriginal && attributionUrl.trim() ? attributionUrl.trim() : null,
        isOriginal,
      });

      // Reset form so a return visit doesn't re-post stale state
      setVideoUri(null);
      setSelectedMoods([]);
      setCaption('');
      setAttributionUrl('');
      setIsOriginal(true);

      Alert.alert('Vibe posted ✦', 'Your content is live on the feed.', [
        { text: 'Nice!', onPress: () => navigation?.navigate('Home') },
      ]);
    } catch (err) {
      Alert.alert('Upload failed', err.message ?? 'Something went wrong. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const gradientColors = primaryMood
    ? [`${primaryMood.dark}CC`, colors.bg.base, colors.bg.base]
    : [colors.bg.base, '#0D0B1E', colors.bg.base];

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={gradientColors}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing[3] }]}>
        <BackButton onPress={() => navigation?.goBack()} />
        <Text style={[textStyles.heading2, styles.headerTitle]}>New Vibe</Text>
        <View style={styles.headerRight}>
          {user && (
            <Text style={[styles.handleLabel]}>@{user.handle}</Text>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing[10] },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── Video picker ─── */}
        <Pressable onPress={handlePickVideo} style={styles.videoPicker} accessibilityRole="button" accessibilityLabel="Pick a video">
          {videoUri ? (
            <View style={styles.videoPreviewWrap}>
              {primaryMood ? (
                <LinearGradient
                  colors={primaryMood.gradient}
                  style={styles.videoPreview}
                >
                  <Text style={styles.videoReadyIcon}>🎬</Text>
                  <Text style={styles.videoReadyText}>Video selected</Text>
                  <Text style={styles.videoTapText}>tap to change</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.videoPreview, { backgroundColor: colors.bg.elevated }]}>
                  <Text style={styles.videoReadyIcon}>🎬</Text>
                  <Text style={styles.videoReadyText}>Video selected</Text>
                  <Text style={styles.videoTapText}>tap to change</Text>
                </View>
              )}
            </View>
          ) : (
            <GlassCard style={styles.videoEmpty} intensity="medium">
              <Text style={styles.videoEmptyIcon}>＋</Text>
              <Text style={[textStyles.heading3, { marginTop: spacing[2] }]}>Pick a Video</Text>
              <Text style={[textStyles.body, { marginTop: spacing[1] }]}>from your library</Text>
            </GlassCard>
          )}
        </Pressable>

        {/* ─── Mood selector ─── */}
        <View style={styles.section}>
          <Text style={textStyles.heading2}>Set the Mood</Text>
          <Text style={[textStyles.body, styles.sectionSubtitle]}>
            Choose up to 4 moods
          </Text>

          {/* Selected pill summary */}
          {selectedMoods.length > 0 && (
            <View style={styles.selectedRow}>
              {selectedMoods.map((m) => {
                const md = moods[m];
                return (
                  <Pressable
                    key={m}
                    onPress={() => toggleMood(m)}
                    style={[styles.selectedPill, { backgroundColor: md.dark + 'CC', borderColor: md.color + '60' }]}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${md.label} mood`}
                  >
                    <Text style={styles.selectedEmoji}>{md.emoji}</Text>
                    <Text style={[styles.selectedLabel, { color: md.color }]}>{md.label}</Text>
                    <Text style={[styles.selectedRemove, { color: md.color }]}>✕</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View style={styles.orbGrid}>
            {moodList.map((m) => (
              <MoodOrb
                key={m}
                mood={m}
                size={70}
                selected={selectedMoods.includes(m)}
                onPress={() => toggleMood(m)}
              />
            ))}
          </View>
        </View>

        {/* ─── Caption ─── */}
        <View style={styles.section}>
          <Text style={textStyles.heading2}>Caption</Text>
          <GlassCard intensity="medium" style={styles.inputCard}>
            <TextInput
              style={styles.captionInput}
              placeholder="describe this feeling…"
              placeholderTextColor={colors.text.disabled}
              value={caption}
              onChangeText={setCaption}
              maxLength={300}
              multiline
              returnKeyType="done"
              blurOnSubmit
            />
            <Text style={styles.charCount}>{caption.length}/300</Text>
          </GlassCard>
        </View>

        {/* ─── Originality toggle ─── */}
        <View style={styles.section}>
          <Text style={textStyles.heading2}>Originality</Text>
          <View style={styles.toggleRow}>
            {[
              { label: 'My Original', value: true },
              { label: 'Curated', value: false },
            ].map(({ label, value }) => (
              <Pressable
                key={String(value)}
                onPress={() => setIsOriginal(value)}
                style={[
                  styles.toggleOption,
                  isOriginal === value && styles.toggleOptionActive,
                  isOriginal === value && primaryMood && { borderColor: primaryMood.color + '80' },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isOriginal === value }}
              >
                <Text style={[
                  styles.toggleLabel,
                  isOriginal === value && { color: primaryMood?.color ?? colors.brand.primary },
                ]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {!isOriginal && (
            <GlassCard intensity="medium" style={[styles.inputCard, { marginTop: spacing[3] }]}>
              <TextInput
                style={styles.attributionInput}
                placeholder="original source URL or creator handle…"
                placeholderTextColor={colors.text.disabled}
                value={attributionUrl}
                onChangeText={setAttributionUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                returnKeyType="done"
              />
            </GlassCard>
          )}
        </View>
      </ScrollView>

      {/* ─── Post CTA ─── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing[5] }]}>
        <LinearGradient
          colors={['transparent', colors.bg.base]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {uploading ? (
          <GlassCard style={styles.uploadingCard} intensity="medium">
            <ActivityIndicator size="small" color={primaryMood?.color ?? colors.brand.primary} />
            <Text style={[textStyles.body, { marginLeft: spacing[3] }]}>Posting your vibe…</Text>
          </GlassCard>
        ) : (
          <Button
            label={!videoUri ? 'Pick a Video First' : selectedMoods.length === 0 ? 'Set at Least One Mood' : 'Post Vibe ✦'}
            onPress={handlePost}
            disabled={!canPost}
            variant={primaryMood ? 'mood' : 'primary'}
            moodColor={primaryMood?.color}
            moodGradient={primaryMood?.gradient}
            size="lg"
            fullWidth
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
    gap: spacing[3],
  },
  headerTitle: {
    flex: 1,
  },
  headerRight: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  handleLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  content: {
    paddingHorizontal: spacing[5],
    gap: spacing[7],
    paddingTop: spacing[4],
  },
  videoPicker: {
    // pressable wrapper
  },
  videoPreviewWrap: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    height: PREVIEW_HEIGHT * 0.5,
  },
  videoPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  videoReadyIcon: {
    fontSize: 40,
  },
  videoReadyText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.white,
  },
  videoTapText: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.6)',
  },
  videoEmpty: {
    height: PREVIEW_HEIGHT * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  videoEmptyIcon: {
    fontSize: 48,
    color: colors.brand.primary,
    fontWeight: typography.weight.bold,
  },
  section: {
    gap: spacing[4],
  },
  sectionSubtitle: {
    marginTop: -spacing[2],
  },
  selectedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radius.full,
    borderWidth: 1,
    gap: spacing[1],
  },
  selectedEmoji: { fontSize: 13 },
  selectedLabel: { fontSize: 13, fontWeight: '600' },
  selectedRemove: { fontSize: 10, marginLeft: 2 },
  orbGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing[6],
  },
  inputCard: {
    padding: spacing[4],
  },
  captionInput: {
    fontSize: typography.size.md,
    color: colors.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: typography.size.xs,
    color: colors.text.disabled,
    textAlign: 'right',
    marginTop: spacing[2],
  },
  attributionInput: {
    fontSize: typography.size.md,
    color: colors.text.primary,
    height: 44,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  toggleOption: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.bg.surface,
    alignItems: 'center',
  },
  toggleOptionActive: {
    backgroundColor: colors.bg.elevated,
    borderColor: colors.brand.primary,
  },
  toggleLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[8],
  },
  uploadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
  },
});

export default UploadScreen;
