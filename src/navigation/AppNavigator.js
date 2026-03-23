import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MoodPickerScreen from '../screens/MoodPickerScreen';
import ContentDetailScreen from '../screens/ContentDetailScreen';
import UploadScreen from '../screens/UploadScreen';
import AuthScreen from '../screens/AuthScreen';

import { useApp } from '../context/AppContext';
import { colors, radius, spacing, typography } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Tab icon map ─────────────────────────────────────────────────────────────

const TAB_ICONS = {
  Home: '⌂',
  Discover: '✦',
  Upload: '＋',
  Profile: '◎',
};

const TabIcon = ({ name, focused, color }) => (
  <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
    {focused && (
      <View
        style={[
          styles.iconGlow,
          {
            shadowColor: colors.brand.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 12,
            elevation: 8,
          },
        ]}
      />
    )}
    {name === 'Upload' ? (
      // Upload button has a distinct pill treatment
      <LinearGradient
        colors={[colors.brand.primary, '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.uploadIcon}
      >
        <Text style={styles.uploadIconText}>＋</Text>
      </LinearGradient>
    ) : (
      <Text style={[styles.iconText, { color }]}>{TAB_ICONS[name]}</Text>
    )}
  </View>
);

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + spacing[2] }]}>
      <LinearGradient
        colors={[`${colors.bg.base}00`, colors.bg.base]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              style={styles.tab}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: isFocused }}
            >
              <TabIcon
                name={route.name}
                focused={isFocused}
                color={isFocused ? colors.brand.primary : colors.text.disabled}
              />
              {route.name !== 'Upload' && (
                <Text
                  style={[
                    styles.label,
                    { color: isFocused ? colors.brand.primary : colors.text.disabled },
                  ]}
                >
                  {label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

// ─── Tab Navigator ────────────────────────────────────────────────────────────

const MainTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
    <Tab.Screen name="Discover" component={DiscoverScreen} options={{ tabBarLabel: 'Discover' }} />
    <Tab.Screen name="Upload" component={UploadScreen} options={{ tabBarLabel: '' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
  </Tab.Navigator>
);

// ─── Root Navigator — auth gate ───────────────────────────────────────────────

const AppNavigator = () => {
  const { user, authLoading } = useApp();

  // Show branded splash while restoring the stored auth token
  if (authLoading) {
    return (
      <View style={styles.splash}>
        <LinearGradient
          colors={[colors.bg.base, '#0D0B1E', colors.bg.base]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.splashLogoWrap}>
          <LinearGradient
            colors={[colors.brand.primary, '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.splashLogoGrad}
          >
            <Text style={styles.splashLogoText}>〜</Text>
          </LinearGradient>
        </View>
        <Text style={styles.splashWordmark}>mood</Text>
        <ActivityIndicator
          size="small"
          color={colors.brand.primary}
          style={styles.splashSpinner}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="ContentDetail"
            component={ContentDetailScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="MoodPicker"
            component={MoodPickerScreen}
            options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: spacing[4],
  },
  bar: {
    flexDirection: 'row',
    marginHorizontal: spacing[5],
    backgroundColor: colors.bg.surface,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.border.subtle,
    paddingVertical: spacing[2],
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: spacing[1],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapActive: {
    backgroundColor: `${colors.brand.primary}18`,
  },
  iconGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
  },
  iconText: {
    fontSize: 20,
    lineHeight: 24,
  },
  uploadIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  uploadIconText: {
    fontSize: 22,
    color: colors.white,
    fontWeight: '300',
    lineHeight: 26,
  },
  label: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.3,
  },
  splash: {
    flex: 1,
    backgroundColor: colors.bg.base,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
  },
  splashLogoWrap: {
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 12,
  },
  splashLogoGrad: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogoText: {
    fontSize: 36,
    color: colors.white,
    fontWeight: typography.weight.bold,
  },
  splashWordmark: {
    fontSize: 28,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: 6,
  },
  splashSpinner: {
    marginTop: spacing[2],
  },
});

export default AppNavigator;
