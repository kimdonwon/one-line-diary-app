import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import { initDB } from './src/database/db';
import MainScreen from './src/screens/MainScreen';
import WriteScreen from './src/screens/WriteScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import ActivityListScreen from './src/screens/ActivityListScreen';
import MoodListScreen from './src/screens/MoodListScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import SearchScreen from './src/screens/SearchScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { COLORS, SOFT_SHADOW } from './src/constants/theme';
import { MoodCharacter } from './src/constants/MoodCharacters';
import {
    HomeTabIcon, SelectedHomeTabIcon,
    StatsTabIcon, SelectedStatsTabIcon,
    PlusButtonIcon,
    SearchIcon,
    SettingsTabIcon, SelectedSettingsTabIcon
} from './src/constants/icons';
import { MoodProvider, useGlobalWeeklyMood } from './src/context/MoodContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#FFF0F5', // 테마 색상 직접 주입 (라벤더 핑크)
        card: '#FFFFFF',
    },
};

// 🍰 귀여운 로딩 화면 컴포넌트
function LoadingScreen() {
    const bounceAnim = new Animated.Value(0);
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        // 페이드인
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();

        // 통통 바운스
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -12,
                    duration: 500,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.bounce,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.loadingContainer}>
            <Animated.View style={[
                styles.loadingCharacter,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: bounceAnim }],
                },
            ]}>
                <MoodCharacter character="frog" size={80} />
            </Animated.View>
            <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={styles.loadingTitle}>한줄일기</Text>
                <View style={styles.dotsRow}>
                    <Text style={styles.loadingDot}>·</Text>
                    <Text style={styles.loadingDot}>·</Text>
                    <Text style={styles.loadingDot}>·</Text>
                </View>
            </Animated.View>
        </View>
    );
}

function MainTabs({ navigation }) {
    const weeklyMood = useGlobalWeeklyMood();
    const activeColor = weeklyMood ? weeklyMood.color : '#8A2BE2';

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                    alignItems: 'center',
                    ...SOFT_SHADOW.card,
                    shadowColor: '#C9A8B2',
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginTop: 2,
                }
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={MainScreen}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) =>
                        focused ? <SelectedHomeTabIcon size={24} color={color} /> : <HomeTabIcon size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="StatsTab"
                component={SummaryScreen}
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color, focused }) =>
                        focused ? <SelectedStatsTabIcon size={24} color={color} /> : <StatsTabIcon size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="WriteTab"
                component={View} // 가짜 컴포넌트, 터치 이벤트 오버라이드
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault(); // 기본 이동 로직 막기
                        navigation.navigate('Write');
                    },
                })}
                options={{
                    title: '',
                    tabBarIcon: () => (
                        <View style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            backgroundColor: activeColor, // 동적 활성 색상 적용
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: -28, // 탭바 위로 튀어나오게
                            shadowColor: activeColor,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 5,
                        }}>
                            <PlusButtonIcon size={28} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="SearchTab"
                component={SearchScreen}
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => <SearchIcon size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="SettingsTab"
                component={SettingsScreen}
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) =>
                        focused ? <SelectedSettingsTabIcon size={24} color={color} /> : <SettingsTabIcon size={24} color={color} />
                }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    const [dbReady, setDbReady] = useState(false);
    const [dbError, setDbError] = useState(null);

    useEffect(() => {
        async function setup() {
            try {
                await initDB();
                setDbReady(true);
            } catch (e) {
                console.error('DB init failed:', e);
                setDbError(e.message || String(e));
            }
        }
        setup();
    }, []);

    if (dbError) {
        return (
            <View style={[styles.loadingContainer, { padding: 20 }]}>
                <Text style={{ fontSize: 18, color: 'red', marginBottom: 10 }}>Database Initialization Failed!</Text>
                <Text style={{ fontSize: 14, color: '#333' }}>{dbError}</Text>
            </View>
        );
    }

    if (!dbReady) {
        return <LoadingScreen />;
    }

    return (
        <MoodProvider>
            <StatusBar style="auto" />
            <NavigationContainer theme={AppTheme}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: COLORS.background },
                        animation: 'slide_from_right',
                    }}
                >
                    <Stack.Screen name="MainTabs" component={MainTabs} />
                    <Stack.Screen name="Main" component={MainScreen} />
                    <Stack.Screen name="Write" component={WriteScreen} />
                    <Stack.Screen name="Summary" component={SummaryScreen} />
                    <Stack.Screen name="ActivityList" component={ActivityListScreen} />
                    <Stack.Screen name="MoodList" component={MoodListScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </MoodProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingCharacter: {
        marginBottom: 20,
    },
    loadingTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#4A3728',
        textAlign: 'center',
        marginBottom: 8,
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loadingDot: {
        fontSize: 28,
        color: COLORS.happy,
        marginHorizontal: 4,
        fontWeight: '700',
    },
});
