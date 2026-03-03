import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StaticSticker } from '../../../components';
import { COLORS, SPACING } from '../../../constants/theme';

import { getStickerComponent } from '../../../constants/stickers';

const RankingItem = ({ item, index }) => {
    // 스티커 타입에 따라 그래픽 여부 판별
    const isGraphic = !!getStickerComponent(item.type);
    const stickerObj = {
        type: item.type,
        isGraphic,
        size: 30,
        x: 0,
        y: 0,
        rotate: 0
    };

    return (
        <View style={styles.itemRow}>
            <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}위</Text>
            </View>
            <View style={styles.stickerPreview}>
                {/* StaticSticker가 absolute이므로 부모에서 위치를 잡아줌 */}
                <View style={{ width: 30, height: 30, position: 'relative' }}>
                    <StaticSticker sticker={stickerObj} />
                </View>
            </View>
            <View style={styles.countWrap}>
                <Text style={styles.countText}>{item.count}회 사용</Text>
            </View>
        </View>
    );
};

export const StickerRanking = ({ data }) => {
    // 로직에서 이미 slice(0, 3)을 하지만 한번 더 보장
    const top3 = data?.slice(0, 3) || [];

    if (top3.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>아직 사용한 스티커가 없어요!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.description}>
                내 마음을 꾸며준 가장 고마운 스티커들이에요
            </Text>
            <View style={styles.list}>
                {top3.map((item, index) => (
                    <RankingItem key={`rank-${item.type}-${index}`} item={item} index={index} />
                ))}
            </View>
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
    list: {
        gap: 12,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#FCFCFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F1F1F0',
    },
    rankBadge: {
        width: 36,
        height: 20,
        backgroundColor: '#37352F',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    rankText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    stickerPreview: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    countWrap: {
        flex: 1,
        alignItems: 'flex-end',
    },
    countText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#37352F',
    },
    emptyContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 13,
        color: '#999999',
    }
});
