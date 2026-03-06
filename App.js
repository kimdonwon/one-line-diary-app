import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { GowunDodum_400Regular } from '@expo-google-fonts/gowun-dodum';
import { NanumMyeongjo_400Regular } from '@expo-google-fonts/nanum-myeongjo';
import { SingleDay_400Regular } from '@expo-google-fonts/single-day';
import { NanumPenScript_400Regular } from '@expo-google-fonts/nanum-pen-script';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { initDB } from './src/database/db';
import MainScreen from './src/screens/MainScreen';
import WriteScreen from './src/screens/WriteScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import ActivityListScreen from './src/screens/ActivityListScreen';
import MoodListScreen from './src/screens/MoodListScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import SearchScreen from './src/screens/SearchScreen';
import DiaryFeedScreen from './src/screens/DiaryFeedScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LockScreen from './src/screens/LockScreen';
import { COLORS, SOFT_SHADOW } from './src/constants/theme';
import { MoodCharacter } from './src/constants/MoodCharacters';
import {
    HomeTabIcon, SelectedHomeTabIcon,
    DiaryTabIcon, SelectedDiaryTabIcon,
    SummaryTabIcon, SelectedSummaryTabIcon,
    PlusButtonIcon,
    SettingsTabIcon, SelectedSettingsTabIcon
} from './src/constants/icons';
import { MoodProvider, useGlobalWeeklyMood } from './src/context/MoodContext';
import { LockProvider, useLock } from './src/context/LockContext';

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
function LoadingScreen({ title = '오늘조각' }) {
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
                <Text style={styles.loadingTitle}>{title}</Text>
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
    const activeColor = weeklyMood ? weeklyMood.color : COLORS.happy;
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: activeColor, // 이번주 기분 색상
                tabBarInactiveTintColor: '#999999', // 노션 비활성 컬러
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 16 + insets.bottom,
                    left: 20,
                    right: 20,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 16,   // 노션 컨테이너 라운딩
                    borderWidth: 1,
                    borderColor: '#E9E9E7', // 노션 테두리 실선
                    borderTopWidth: 1,
                    height: 64, // 약간 더 슬림하게
                    paddingBottom: 0,
                    elevation: 4,
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={MainScreen}
                options={{
                    tabBarIcon: ({ color, focused }) =>
                        focused ? <SelectedHomeTabIcon size={24} color={color} /> : <HomeTabIcon size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="DiaryTab"
                component={DiaryFeedScreen}
                options={{
                    tabBarIcon: ({ color, focused }) =>
                        focused ? <SelectedDiaryTabIcon size={24} color={color} /> : <DiaryTabIcon size={24} color={color} />
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
                    tabBarIcon: () => (
                        <View style={{
                            width: 56,
                            height: 56,
                            borderRadius: 16, // 노션의 스쿼클(Squircle) 스타일
                            backgroundColor: activeColor, // 이번주 기분 색상으로 복원
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: -20, // 살짝 떠있도록
                            borderWidth: 3,
                            borderColor: '#FFFFFF', // 흰색 테두리
                            shadowColor: '#000000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 5,
                        }}>
                            <PlusButtonIcon size={24} color="#FFFFFF" />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="SummaryTab"
                component={SummaryScreen}
                options={{
                    tabBarIcon: ({ color, focused }) =>
                        focused ? <SelectedSummaryTabIcon size={24} color={color} /> : <SummaryTabIcon size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="SettingsTab"
                component={SettingsScreen}
                options={{
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

    let [fontsLoaded] = useFonts({
        GowunDodum_400Regular,
        NanumMyeongjo_400Regular,
        SingleDay_400Regular,
        NanumPenScript_400Regular,
        BebasNeue_400Regular,
        DMSans_400Regular,
    });

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

    if (!dbReady || !fontsLoaded) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaProvider>
            <LockProvider>
                <MoodProvider>
                    <AppContent />
                </MoodProvider>
            </LockProvider>
        </SafeAreaProvider>
    );
}

/**
 * 🔐 잠금 상태에 따라 실제 앱이나 잠금 화면을 보여주는 중간 컴포넌트
 */
function AppContent() {
    const { isLocked, isLoading: isLockLoading } = useLock();

    if (isLockLoading) {
        return <LoadingScreen title="보안 확인 중..." />;
    }

    if (isLocked) {
        return <LockScreen />;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                    <Stack.Screen
                        name="Write"
                        component={WriteScreen}
                        options={{ animation: 'fade' }}
                    />
                    <Stack.Screen name="Summary" component={SummaryScreen} />
                    <Stack.Screen name="Search" component={SearchScreen} />
                    <Stack.Screen name="ActivityList" component={ActivityListScreen} />
                    <Stack.Screen name="MoodList" component={MoodListScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
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
