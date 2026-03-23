import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
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
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import MoodOrb from '../components/MoodOrb';
import { useApp } from '../context/AppContext';
import { colors, moods, radius, spacing, textStyles, typography } from '../theme';

const ONBOARDING_MOODS = ['dreamy', 'calm', 'ethereal', 'nostalgic', 'energized', 'happy'];

const AuthScreen = () => {
  const insets = useSafeAreaInsets();
  const { login, signup, authLoading, authError } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [primaryMood, setPrimaryMood] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  const passwordRef = useRef(null);
  const handleRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchMode = (next) => {
    setMode(next);
    setLocalError(null);
    Animated.spring(slideAnim, {
      toValue: next === 'login' ? 0 : 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  };

  const validate = () => {
    if (!email.trim()) return 'Email is required';
    if (!email.includes('@')) return 'Enter a valid email';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (mode === 'signup') {
      if (!handle.trim()) return 'Handle is required';
      if (!/^[a-z0-9._]+$/i.test(handle)) return 'Handle can only use letters, numbers, . and _';
    }
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setLocalError(err); return; }
    setLocalError(null);

    try {
      if (mode === 'login') {
        await login(email.trim().toLowerCase(), password);
      } else {
        await signup(handle.trim().toLowerCase(), email.trim().toLowerCase(), password, primaryMood);
      }
    } catch (e) {
      setLocalError(e.message);
    }
  };

  const displayError = localError || authError;
  const activeMood = primaryMood ? moods[primaryMood] : null;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Mood-tinted background */}
      <LinearGradient
        colors={activeMood
          ? [`${activeMood.dark}CC`, colors.bg.base, colors.bg.base]
          : ['#1A1040', colors.bg.base, colors.bg.base]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing[8], paddingBottom: insets.bottom + spacing[8] },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo mark */}
        <View style={styles.logoBlock}>
          <View style={[styles.logo, activeMood && { borderColor: activeMood.color, shadowColor: activeMood.color }]}>
            <Text style={[styles.logoMark, activeMood && { color: activeMood.color }]}>〜</Text>
          </View>
          <Text style={[textStyles.displayMedium, styles.appName]}>mood</Text>
          <Text style={[textStyles.body, styles.tagline]}>feel everything</Text>
        </View>

        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          {['login', 'signup'].map((m) => (
            <Pressable
              key={m}
              onPress={() => switchMode(m)}
              style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === m }}
            >
              <Text style={[styles.modeBtnLabel, mode === m && { color: activeMood?.color ?? colors.brand.primary }]}>
                {m === 'login' ? 'Sign In' : 'Join'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ─── Form ─── */}
        <GlassCard intensity="medium" style={styles.formCard}>

          {/* Handle — signup only */}
          {mode === 'signup' && (
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Handle</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.atSign}>@</Text>
                <TextInput
                  ref={handleRef}
                  style={styles.input}
                  placeholder="your.handle"
                  placeholderTextColor={colors.text.disabled}
                  value={handle}
                  onChangeText={setHandle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
            </View>
          )}

          {/* Email */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.text.disabled}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputWrap}>
              <TextInput
                ref={passwordRef}
                style={[styles.input, styles.inputFlex]}
                placeholder="6+ characters"
                placeholderTextColor={colors.text.disabled}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8} accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </Pressable>
            </View>
          </View>

          {/* Error */}
          {displayError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          )}
        </GlassCard>

        {/* ─── Primary mood (signup) ─── */}
        {mode === 'signup' && (
          <View style={styles.moodSection}>
            <Text style={textStyles.heading2}>Your Primary Vibe</Text>
            <Text style={[textStyles.body, { marginTop: -spacing[1] }]}>
              Sets the tone of your profile
            </Text>
            <View style={styles.moodRow}>
              {ONBOARDING_MOODS.map((m) => (
                <MoodOrb
                  key={m}
                  mood={m}
                  size={64}
                  selected={primaryMood === m}
                  onPress={() => setPrimaryMood((prev) => (prev === m ? null : m))}
                />
              ))}
            </View>
          </View>
        )}

        {/* ─── Submit ─── */}
        {authLoading ? (
          <ActivityIndicator size="large" color={activeMood?.color ?? colors.brand.primary} />
        ) : (
          <Button
            label={mode === 'login' ? 'Sign In' : 'Create Account ✦'}
            onPress={handleSubmit}
            variant={activeMood ? 'mood' : 'primary'}
            moodColor={activeMood?.color}
            moodGradient={activeMood?.gradient}
            size="lg"
            fullWidth
          />
        )}

        {/* Switch mode link */}
        <Pressable onPress={() => switchMode(mode === 'login' ? 'signup' : 'login')} style={styles.switchLink}>
          <Text style={styles.switchText}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <Text style={[styles.switchAction, { color: activeMood?.color ?? colors.brand.primary }]}>
              {mode === 'login' ? 'Join' : 'Sign in'}
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
  logoBlock: {
    alignItems: 'center',
    gap: spacing[2],
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.brand.primary,
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  logoMark: {
    fontSize: 32,
    color: colors.brand.primary,
  },
  appName: {
    letterSpacing: 4,
    textTransform: 'lowercase',
  },
  tagline: {
    color: colors.text.secondary,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.bg.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: 3,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius: radius.full,
  },
  modeBtnActive: {
    backgroundColor: colors.bg.elevated,
  },
  modeBtnLabel: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.disabled,
  },
  formCard: {
    padding: spacing[5],
    gap: spacing[4],
  },
  fieldWrap: {
    gap: spacing[1.5],
  },
  fieldLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.base,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing[4],
    height: 50,
  },
  atSign: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    marginRight: spacing[1],
  },
  input: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.text.primary,
    height: '100%',
  },
  inputFlex: {
    flex: 1,
  },
  eyeIcon: {
    fontSize: 18,
    paddingLeft: spacing[2],
  },
  errorBanner: {
    backgroundColor: `${colors.status.error}18`,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: `${colors.status.error}40`,
    padding: spacing[3],
  },
  errorText: {
    fontSize: typography.size.sm,
    color: colors.status.error,
  },
  moodSection: {
    gap: spacing[4],
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing[4],
  },
  switchLink: {
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  switchText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  switchAction: {
    fontWeight: typography.weight.semibold,
  },
});

export default AuthScreen;
