import { View, Text, Switch, TouchableOpacity, ScrollView, Animated, Modal, Pressable, StyleSheet } from 'react-native';
import { Header, Card, SoftAlertModal } from '../../components';
import { CATEGORIZED_STICKERS, STICKER_CATEGORIES, STICKER_PACK_DATA } from '../../constants/stickers';
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
        isShopMore, setIsShopMore,
        purchasedPacks, handleBuyStickerPack, resetPurchases, resetDiaryData,
        handleExportBackup, handleImportBackup, handleRestorePurchases
    } = useSettingsLogic();



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
                                {(isShopMore ? STICKER_PACK_DATA : STICKER_PACK_DATA.slice(0, 3)).map((pack) => {
                                    const previewStickers = CATEGORIZED_STICKERS[pack.catId]?.slice(0, 3) || [];
                                    const categoryLabel = pack.tagLabel || STICKER_CATEGORIES.find(c => c.id === pack.catId)?.label || pack.catId;

                                    let statusText = '';
                                    let statusStyle = styles.shopCardOwned;

                                    if (pack.isDefault) {
                                        statusText = pack.isFree ? '보유 중' : '₩1,100';
                                        statusStyle = pack.isFree ? styles.shopCardOwned : styles.shopCardPrice;
                                        // 단, 구매 여부 체크 로직 통합 필요 시 else와 합침
                                        if (!pack.isFree && purchasedPacks.includes(pack.catId)) {
                                            statusText = '보유 중';
                                            statusStyle = styles.shopCardOwned;
                                        }
                                    } else {
                                        if (purchasedPacks.includes(pack.catId)) {
                                            statusText = '보유 중';
                                            statusStyle = styles.shopCardOwned;
                                        } else {
                                            statusText = pack.isFree ? '무료' : '₩' + (pack.price || '1,100');
                                            statusStyle = styles.shopCardPrice;
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

                            {STICKER_PACK_DATA.length > 3 && (
                                <TouchableOpacity
                                    style={styles.viewMoreButton}
                                    onPress={() => setIsShopMore(!isShopMore)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.viewMoreText}>
                                        {isShopMore ? '접기' : '더 보기'}
                                    </Text>
                                </TouchableOpacity>
                            )}
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
                    <Text style={styles.premiumPrice}>₩5,000 <Text style={styles.premiumPriceUnit}>(한번 결제로 평생 소장)</Text></Text>

                    <View style={styles.premiumBenefits}>
                        <Text style={styles.premiumBenefitItem}>✓ 스티커 최대 15개 부착 가능 </Text>
                        <Text style={styles.premiumBenefitItem}>✓ 스티커 서랍장 카테고리 6개 </Text>
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
                            {isPremium ? '프리미엄 혜택 이용 중 ✨' : '프리미엄 평생 소장하기'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.restorePurchaseButton}
                        onPress={handleRestorePurchases}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.restorePurchaseText}>기존 구매 내역 복원하기</Text>
                    </TouchableOpacity>
                    <Text style={styles.premiumSubText}>한 번 결제하면 추가 청구 없이 영구적으로 이용 가능합니다.</Text>
                </View>

                {/* 데이터 관리 섹션 */}
                <Text style={[styles.sectionHeader, { marginTop: 40 }]}>데이터 관리</Text>
                <Card style={styles.settingCard}>
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={handleExportBackup}
                        activeOpacity={0.7}
                    >
                        <View>
                            <Text style={styles.settingLabel}>데이터 내보내기 (공유/저장)</Text>
                            <Text style={styles.settingDesc}>구글 드라이브, 카카오톡, 메일 등에 백업 파일을 보냅니다.</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={handleImportBackup}
                        activeOpacity={0.7}
                    >
                        <View>
                            <Text style={styles.settingLabel}>데이터 불러오기 (복원)</Text>
                            <Text style={styles.settingDesc}>백업된 JSON 파일을 불러와 데이터를 복구합니다.</Text>
                        </View>
                    </TouchableOpacity>
                </Card>

                {/* 개발자 도구 (테스트용) */}
                <View style={styles.devSection}>
                    <Text style={styles.sectionHeader}>개발자 도구 (테스트)</Text>
                    <TouchableOpacity
                        style={styles.dangerButton}
                        onPress={resetPurchases}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.dangerButtonText}>결제 및 프리미엄 내역 초기화 ♻️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.dangerButton, { marginTop: 10 }]}
                        onPress={resetDiaryData}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.dangerButtonText}>모든 일기 기록 삭제 🗑️</Text>
                    </TouchableOpacity>
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
                confirmText={isPremium ? "확인" : "완료"}
            />
        </View>
    );
}
