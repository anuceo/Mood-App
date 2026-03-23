import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

import { colors, radius, spacing, typography } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Tab Icons ────────────────────────────────────────────────────────────────

const TAB_ICONS = {
  Home: { default: '⌂', active: '⌂' },
  Discover: { default: '✦', active: '✦' },
  Profile: { default: '◎', active: '◎' },
};

const TabIcon = ({ route, focused, color }) => {
  const icon = TAB_ICONS[route.name];
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
      {focused && (
        <View
          style={[
            tabStyles.iconGlow,
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
      <Text style={[tabStyles.iconText, { color }]}>
        {focused ? icon.active : icon.default}
      </Text>
    </View>
  );
};

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[tabStyles.container, { paddingBottom: insets.bottom + spacing[2] }]}>
      {/* Frosted glass background */}
      <LinearGradient
        colors={[`${colors.bg.base}00`, colors.bg.base]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={tabStyles.bar}>
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
            <View
              key={route.key}
              style={tabStyles.tab}
              onStartShouldSetResponder={() => true}
              onResponderGrant={onPress}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: isFocused }}
            >
              <TabIcon
                route={route}
                focused={isFocused}
                color={isFocused ? colors.brand.primary : colors.text.disabled}
              />
              <Text
                style={[
                  tabStyles.label,
                  { color: isFocused ? colors.brand.primary : colors.text.disabled },
                ]}
              >
                {label}
              </Text>
            </View>
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
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
  </Tab.Navigator>
);

// ─── Root Navigator ───────────────────────────────────────────────────────────

const AppNavigator = () => (
  <NavigationContainer>
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
  </NavigationContainer>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const tabStyles = StyleSheet.create({
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapActive: {
    backgroundColor: `${colors.brand.primary}18`,
  },
  iconGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  iconText: {
    fontSize: 20,
    lineHeight: 24,
  },
  label: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.3,
  },
});

export default AppNavigator;
