import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { ActivityIcon } from '../../../constants/ActivityIcons';
import { COLORS, FONTS, SPACING } from '../../../constants/theme';

const CorrelationBar = ({ item, index }) => {
    const widthSV = useSharedValue(0);
    const ratio = item.avg / 5; // 5점 만정 기준

    useEffect(() => {
        widthSV.value = 0;
        widthSV.value = withDelay(index * 100, withSpring(ratio, { damping: 15, stiffness: 80 }));
    }, [ratio, index]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${widthSV.value * 100}%`,
        backgroundColor: item.act.color,
    }));

    return (
        <View style={styles.barRow}>
            <View style={styles.iconContainer}>
                <ActivityIcon type={item.key} size={18} />
            </View>
            <View style={styles.track}>
                <Reanimated.View style={[styles.fill, animatedStyle]} />
            </View>
            <Text style={styles.scoreText}>{item.avg.toFixed(1)}점</Text>
        </View>
    );
};

export const MoodActivityCorrelation = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.description}>
                가장 기분이 좋았던 활동들이에요! ✨
            </Text>
            {data.slice(0, 5).map((item, index) => (
                <CorrelationBar key={item.key} item={item} index={index} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    description: {
        fontSize: 13,
        color: '#666666',
        marginBottom: 16,
        fontWeight: '500',
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 32,
        alignItems: 'center',
    },
    track: {
        flex: 1,
        height: 12,
        backgroundColor: '#F7F7F5',
        borderRadius: 6,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 6,
    },
    scoreText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#37352F',
        width: 40,
        textAlign: 'right',
    }
});
