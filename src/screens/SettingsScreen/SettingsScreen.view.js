import { View, Text, Switch, TouchableOpacity, ScrollView, Animated, Modal, Pressable, StyleSheet } from 'react-native';
import { Header, Card, SoftAlertModal } from '../../components';
import { CATEGORIZED_STICKERS, STICKER_CATEGORIES } from '../../constants/stickers';
import { MoodCharacter } from '../../constants/MoodCharacters';
import { COLORS } from '../../constants/theme';
import { PinSetupModal } from '../../components/PinSetupModal';

import { useSettingsLogic } from './SettingsScreen.logic';
import { styles } from './SettingsScreen.styles';

export function SettingsScreenView({ navigation }) {
    const {
        defaultMood, isLockEnabled, isPremium,
        showPinModal, setShowPinModal,
        showAlert, alertConfig, setShowAlert, confirmPremium,
        toggleLock, changePassword, handlePinComplete, handlePremiumPress,
        showPreview, setShowPreview, selectedPack, setSelectedPack,
        isShopExpanded, setIsShopExpanded,
        purchasedPacks, handleBuyStickerPack
    } = useSettingsLogic();

    const STICKER_PACK_DATA = [
        { id: 'pack1', title: '기본 다꾸 이모지 팩', desc: '다양한 감정 표현', icon: '🐾', isFree: true, isDefault: true, catId: 'emoji' },
        { id: 'pack2', title: '기본 캐릭터 팩', desc: '오늘조각 시그니처', icon: '✨', isFree: true, isDefault: true, catId: 'legacy' },
        { id: 'pack3', title: '몽글몽글 파스텔 팩', desc: '프리미엄 전용 컬러', icon: '🎨', isFree: false, isDefault: true, catId: 'pastel' },
        { id: 'pack4', title: 'MZ 냠냠 먹방 팩', desc: '커피, 마라탕, 탕후루까지!', icon: '🍡', isFree: true, isDefault: false, catId: 'food', tagLabel: '푸드' },
    ];

    const handlePackPress = (pack) => {
        setSelectedPack(pack);
        setShowPreview(true);
    };

    return (
        <View style={styles.container}>
            <Header title="설정" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 잠금 설정 섹션 */}
                <Text style={styles.sectionHeader}>보안</Text>
                <Card style={styles.settingCard}>
                    <View style={styles.settingItem}>
                        <View>
                            <Text style={styles.settingLabel}>암호 잠금</Text>
                            <Text style={styles.settingDesc}>앱을 켤 때 암호를 입력합니다.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#D1D1D1', true: COLORS.happy }}
                            thumbColor={isLockEnabled ? '#FFF' : '#f4f3f4'}
                            onValueChange={toggleLock}
                            value={isLockEnabled}
                        />
                    </View>

                    {isLockEnabled && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={changePassword}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.actionButtonText}>비밀번호 변경</Text>
                        </TouchableOpacity>
                    )}
                </Card>

                {/* 스티커 상점 (Skill-based Collapsible Card Grid) */}
                <TouchableOpacity
                    style={styles.sectionHeaderRow}
                    onPress={() => setIsShopExpanded(!isShopExpanded)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.sectionHeader}>스티커 상점</Text>
                </TouchableOpacity>

                {isShopExpanded && (
                    <View style={styles.shopContainer}>
                        <View style={styles.shopGridWrapper}>
                            <View style={styles.shopGrid}>
                                {STICKER_PACK_DATA.map((pack) => {
                                    const previewStickers = CATEGORIZED_STICKERS[pack.catId]?.slice(0, 3) || [];
                                    const categoryLabel = pack.tagLabel || STICKER_CATEGORIES.find(c => c.id === pack.catId)?.label || pack.catId;

                                    let statusText = '';
                                    let statusStyle = styles.shopCardOwned;

                                    if (pack.isDefault) {
                                        if (pack.isFree || isPremium) {
                                            statusText = '보유 중';
                                            statusStyle = styles.shopCardOwned;
                                        } else {
                                            statusText = 'PREMIUM';
                                            statusStyle = styles.shopCardPrice;
                                        }
                                    } else {
                                        const isPurchased = purchasedPacks.includes(pack.catId);
                                        if (isPurchased) {
                                            statusText = '보유 중';
                                            statusStyle = styles.shopCardOwned;
                                        } else {
                                            if (pack.isFree) {
                                                statusText = '무료';
                                                statusStyle = styles.shopCardPrice;
                                            } else {
                                                statusText = isPremium ? '다운로드' : 'PREMIUM';
                                                statusStyle = styles.shopCardPrice;
                                            }
                                        }
                                    }

                                    return (
                                        <TouchableOpacity
                                            key={pack.id}
                                            style={styles.shopCard}
                                            onPress={() => handlePackPress(pack)}
                                            activeOpacity={0.8}
                                        >
                                            {/* 상단 이름 태그 */}
                                            <View style={styles.shopCardTag}>
                                                <Text style={styles.shopCardLabel}>{categoryLabel}</Text>
                                            </View>

                                            {/* 중간 실선 */}
                                            <View style={styles.shopCardDivider} />

                                            {/* 하단 스티커 3개 미리보기 */}
                                            <View style={styles.shopCardPreviewRow}>
                                                {previewStickers.map((sticker, idx) => {
                                                    if (typeof sticker === 'string') {
                                                        return (
                                                            <View key={idx} style={styles.shopPreviewWrap}>
                                                                <Text style={styles.shopPreviewEmoji}>{sticker}</Text>
                                                            </View>
                                                        );
                                                    } else if (sticker.Component) {
                                                        const PreviewComp = sticker.Component;
                                                        return (
                                                            <View key={idx} style={styles.shopPreviewWrap}>
                                                                <PreviewComp size={14} />
                                                            </View>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </View>

                                            {/* 최하단 상태 바 */}
                                            <View style={styles.shopCardStatus}>
                                                <Text style={statusStyle}>
                                                    {statusText}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                )}

                {/* 다이어리 프리미엄 (인앱 결제 더미) */}
                <Text style={styles.sectionHeader}>구독 및 요금제</Text>
                <View style={styles.premiumContainer}>
                    <View style={styles.premiumHeaderRow}>
                        <Text style={styles.premiumTitle}>오늘조각 프리미엄 ✨</Text>
                        <View style={styles.premiumBadge}>
                            <Text style={styles.premiumBadgeText}>PRO</Text>
                        </View>
                    </View>
                    <Text style={styles.premiumPrice}>₩2,900 <Text style={styles.premiumPriceUnit}>/ 월</Text></Text>

                    <View style={styles.premiumBenefits}>
                        <Text style={styles.premiumBenefitItem}>✓ 모든 테마 및 파스텔 스티커 잠금 해제</Text>
                        <Text style={styles.premiumBenefitItem}>✓ 광고 없는 쾌적한 다이어리 작성</Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.premiumSubscribeButton,
                            isPremium && styles.premiumSubscribeButtonActive
                        ]}
                        onPress={handlePremiumPress}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.premiumSubscribeText}>
                            {isPremium ? '프리미엄 혜택 이용 중 ✨' : '7일 무료 체험 시작하기'}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.premiumSubText}>구글 플레이를 통해 정기 결제됩니다. 언제든 취소 가능해요.</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.versionText}>오늘조각 v1.0.0</Text>
                </View>
            </ScrollView>

            {/* PIN 설정 모달 */}
            <PinSetupModal
                isVisible={showPinModal}
                onClose={() => setShowPinModal(false)}
                onComplete={handlePinComplete}
            />

            {/* 스티커 미리보기 모달 */}
            <Modal
                visible={showPreview}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowPreview(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowPreview(false)}
                >
                    <Pressable style={styles.previewContainer} onPress={e => e.stopPropagation()}>
                        <View style={styles.previewHeader}>
                            <Text style={styles.previewTitle}>{selectedPack?.title}</Text>
                            <TouchableOpacity onPress={() => setShowPreview(false)}>
                                <Text style={styles.previewClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.previewGrid}>
                            {selectedPack && CATEGORIZED_STICKERS[selectedPack.catId]?.slice(0, 18).map((sticker, i) => (
                                <View key={i} style={styles.previewItem}>
                                    {typeof sticker === 'string' ? (
                                        <Text style={styles.previewEmoji}>{sticker}</Text>
                                    ) : (
                                        <sticker.Component size={32} />
                                    )}
                                </View>
                            ))}
                        </View>

                        {selectedPack && (() => {
                            if (selectedPack.isDefault) {
                                if (selectedPack.isFree || isPremium) {
                                    return (
                                        <View style={styles.previewOwnedBadge}>
                                            <Text style={styles.previewOwnedText}>사용 가능한 팩입니다 ✨</Text>
                                        </View>
                                    );
                                } else {
                                    return (
                                        <TouchableOpacity
                                            style={styles.previewUnlockButton}
                                            onPress={() => {
                                                setShowPreview(false);
                                                handlePremiumPress();
                                            }}
                                        >
                                            <Text style={styles.previewUnlockText}>프리미엄으로 전체 잠금 해제</Text>
                                        </TouchableOpacity>
                                    );
                                }
                            } else {
                                const isPurchased = purchasedPacks.includes(selectedPack.catId);
                                if (isPurchased) {
                                    return (
                                        <View style={styles.previewOwnedBadge}>
                                            <Text style={styles.previewOwnedText}>사용 가능한 팩입니다 ✨</Text>
                                        </View>
                                    );
                                } else {
                                    return (
                                        <TouchableOpacity
                                            style={styles.previewUnlockButton}
                                            onPress={() => handleBuyStickerPack(selectedPack)}
                                        >
                                            <Text style={styles.previewUnlockText}>
                                                {selectedPack.isFree ? '서랍에 추가하기 (무료) 🎁' : '결제하고 서랍에 넣기 💳'}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }
                            }
                        })()}
                    </Pressable>
                </Pressable>
            </Modal>

            {/* 프리미엄 구매 더미 알림 */}
            <SoftAlertModal
                isVisible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                onConfirm={confirmPremium}
                confirmText={isPremium ? "확인" : "체험 시작하기"}
            />
        </View>
    );
}
