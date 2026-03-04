import React, { useEffect, useRef, useState, useCallback } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Animated, Easing, Pressable, TextInput, Image } from "react-native";
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, useAnimatedProps } from 'react-native-reanimated';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../constants/theme';
import { MoodCharacter } from '../constants/MoodCharacters';
import { getStickerComponent } from '../constants/stickers';
import Modal from "react-native-modal";
import { ComboShakeWrapper } from "./ComboShakeWrapper";
export { ComboShakeWrapper };

// ─── Custom Soft Alert Modal ───
export function SoftAlertModal({ isVisible, title, message, onConfirm, confirmText = "확인", secondaryText, onSecondaryConfirm }) {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.25}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={300}
      animationOutTiming={200}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={200}
      onBackdropPress={onConfirm}
      onBackButtonPress={onConfirm}
      style={{ margin: SPACING.xl, justifyContent: "center" }}
    >
      <View style={[styles.alertModalContainer, SOFT_SHADOW.card]}>

        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>

        <View style={{ gap: 8, width: '100%' }}>
          <TouchableOpacity
            style={[styles.alertButton, SOFT_SHADOW.button]}
            onPress={onConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.alertButtonText}>{confirmText}</Text>
          </TouchableOpacity>

          {secondaryText && (
            <TouchableOpacity
              style={[styles.alertButton, { backgroundColor: '#F3F3F2', borderWidth: 0 }]}
              onPress={onSecondaryConfirm}
              activeOpacity={0.8}
            >
              <Text style={[styles.alertButtonText, { color: '#37352F' }]}>{secondaryText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Static Sticker (View Only) ───
export function StaticSticker({ sticker, bounds }) {
  if (!sticker) return null;

  // 스티커 렌더링 (WriteScreen의 DraggableSticker와 동일한 사이즈 적용)
  const renderContent = () => {
    if (sticker.isGraphic) {
      const GraphicComponent = getStickerComponent(sticker.type);
      if (GraphicComponent) {
        return <GraphicComponent size={29} />;
      }
    }
    return <Text style={{ fontSize: 26, lineHeight: 31 }}>{sticker.type}</Text>;
  };

  return (
    <View style={{
      position: 'absolute',
      left: sticker.x,
      top: sticker.y,
      padding: 4, // DraggableSticker 컨테이너 패딩 보정
      zIndex: 5,
      transform: [{ rotate: `${sticker.rotation || 0}deg` }],
    }}>
      {renderContent()}
    </View>
  );
}

// ─── Static Photo (View Only - Polaroid) ───
export function StaticPhoto({ photo }) {
  if (!photo) return null;

  const isBlackFrame = photo.frameType === 'black';
  const frameColors = {
    pink: '#FFD1DC',
    blue: '#D1E8FF',
    mint: '#D1FFD7',
    white: '#FFFFFF',
    black: '#1A1A1A',
  };
  const bgColor = frameColors[photo.frameType] || frameColors.white;

  return (
    <View style={{
      position: 'absolute',
      left: photo.x,
      top: photo.y,
      padding: 2,
      zIndex: 2, // 스티커보다 아래
      transform: [{ rotate: `${photo.rotation || 0}deg` }],
    }}>
      <View style={{
        width: 126,
        height: 144,
        backgroundColor: bgColor,
        borderRadius: 4,
        paddingTop: 8,
        paddingHorizontal: 8,
        paddingBottom: 20,
        shadowColor: isBlackFrame ? '#000000' : '#8B7E74',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: isBlackFrame ? 0.35 : 0.25,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 0.5,
        borderColor: isBlackFrame ? 'rgba(255, 255, 255, 0.1)' : 'rgba(200, 190, 180, 0.4)',
      }}>
        <Image
          source={{ uri: photo.uri }}
          style={{
            width: 110,
            height: 110,
            borderRadius: 2,
            backgroundColor: isBlackFrame ? '#000000' : '#F0ECE8',
          }}
          resizeMode="cover"
        />
        <View style={{ height: 16 }} />
      </View>
    </View>
  );
}


// ─── Soft Pastel Round Button ───
export function StyledButton({
  title,
  onPress,
  color,
  style,
  textStyle,
  icon,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        SOFT_SHADOW.button,
        { backgroundColor: color || COLORS.happy },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon && <Text style={styles.buttonIcon}>{icon}</Text>}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

// ─── Soft Card with Shadow ───
export function Card({ children, style }) {
  return <View style={[styles.card, SOFT_SHADOW.card, style]}>{children}</View>;
}

// ─── Mood Bar for Summary (게이지 차오름 애니메이션 최적화) ───
const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

export const MoodBar = React.memo(({ mood, count, maxCount, color, animKey }) => {
  const ratio = maxCount > 0 ? count / maxCount : 0;

  const widthSV = useSharedValue(0.05);
  const countSV = useSharedValue(0);

  useEffect(() => {
    widthSV.value = 0.05;
    countSV.value = 0;

    // 자석 같은 탄성 효과 (Spring)
    widthSV.value = withDelay(50, withSpring(Math.max(ratio, 0.05), {
      damping: 14,
      stiffness: 90,
      mass: 0.8,
    }));

    // 숫자 카운팅 동기화
    countSV.value = withDelay(50, withTiming(count, { duration: 700 }));
  }, [ratio, animKey, count]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${widthSV.value * 100}%`,
      backgroundColor: color,
    };
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      text: Math.round(countSV.value).toString(),
      value: Math.round(countSV.value).toString(),
    };
  });

  return (
    <View style={styles.moodBarContainer}>
      <View style={styles.moodBarCharWrap}>
        <MemoizedMoodCharacter character={mood.character} size={28} />
      </View>
      <View style={styles.moodBarTrack}>
        <Reanimated.View
          style={[
            styles.moodBarFill,
            animatedStyle
          ]}
        />
      </View>
      <AnimatedTextInput
        underlineColorAndroid="transparent"
        editable={false}
        animatedProps={animatedProps}
        style={[styles.moodBarCount, { padding: 0 }]}
      />
    </View>
  );
});

// MoodCharacter를 메모이제이션하여 애니메이션 중 불필요한 SVG 재계산을 방지합니다.
const MemoizedMoodCharacter = React.memo(MoodCharacter);

/**
 * 💥 기분 이모지 콤보 연타 쉐이크 효과 컴포넌트 (공통 래퍼 사용)
 */
export function ComboShakeMoodCharacter({ character, size = 32 }) {
  // 콤보로 1.8배까지 커질 때의 영역을 충분히 확보 (layout clipping 방지)
  const paddingSize = size * 0.5;
  return (
    <ComboShakeWrapper style={{ padding: paddingSize, margin: -paddingSize, overflow: 'visible' }}>
      <MemoizedMoodCharacter character={character} size={size} />
    </ComboShakeWrapper>
  );
}

// ─── Screen Header (메인 화면 스타일 정렬) ───
export function Header({ title, subtitle, titleIcon, leftButton, rightButton, style }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 16 }, style]}>
      <View style={styles.headerLeftContainer}>
        <View style={styles.headerMainRow}>
          {leftButton && <View style={styles.headerLeftAction}>{leftButton}</View>}
          <Text style={styles.headerTitle}>{title}</Text>
          {titleIcon && <View style={styles.headerTitleIcon}>{titleIcon}</View>}
        </View>
        {subtitle && (
          <View style={styles.headerSubtitleWrap}>
            {typeof subtitle === 'string' ? (
              <Text style={styles.headerSubtitleText}>{subtitle}</Text>
            ) : (
              subtitle
            )}
          </View>
        )}
      </View>
      <View style={styles.headerRightAction}>
        {rightButton}
      </View>
    </View>
  );
}

export function HeaderButton({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.headerButton}>
      <Text style={styles.headerButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

// ─── Mood Selector Card (Combo Tap & Shake 적용) ───
export function MoodCard({ mood, selected, onPress }) {
  const bounceScale = useRef(new Animated.Value(1)).current;
  const shakeRotate = useRef(new Animated.Value(0)).current;
  const comboScale = useRef(1);
  const comboTimer = useRef(null);

  const handlePressIn = () => {
    if (comboTimer.current) clearTimeout(comboTimer.current);

    // 연타 시 0.1씩 증가, 최대 2배까지
    comboScale.current = Math.min(comboScale.current + 0.1, 2.0);

    bounceScale.stopAnimation();
    shakeRotate.stopAnimation();
    shakeRotate.setValue(0);

    Animated.parallel([
      Animated.spring(bounceScale, {
        toValue: selected ? comboScale.current * 1.15 : comboScale.current,
        friction: 4,
        tension: 400,
        useNativeDriver: true
      }),
      Animated.sequence([
        Animated.timing(shakeRotate, { toValue: 1, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: -1, duration: 90, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: 1, duration: 90, useNativeDriver: true }),
        Animated.timing(shakeRotate, { toValue: 0, duration: 45, useNativeDriver: true }),
      ])
    ]).start();
  };

  const handlePressOut = () => {
    // 손 떼면 크기는 돌아오되, 콤보는 일정 시간 유지
    const targetScale = selected ? 1.15 : 1;
    Animated.parallel([
      Animated.spring(bounceScale, { toValue: targetScale, friction: 6, tension: 200, useNativeDriver: true }),
      Animated.spring(shakeRotate, { toValue: 0, friction: 5, tension: 250, useNativeDriver: true })
    ]).start();

    comboTimer.current = setTimeout(() => {
      comboScale.current = 1;
    }, 600);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9} // 애니메이션이 생명을 넣어주므로 투명도는 낮게
      style={[
        styles.moodCard,
        selected && {
          transform: [{ translateY: -4 }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.moodCardCircle,
          {
            transform: [
              { scale: bounceScale },
              {
                rotate: shakeRotate.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-12deg', '12deg']
                })
              }
            ]
          }
        ]}
      >
        <MoodCharacter character={mood.character} size={selected ? 40 : 30} />
      </Animated.View>
      <Text
        style={[
          styles.moodCardLabel,
          selected && { color: mood.color, fontWeight: "700" },
        ]}
      >
        {mood.label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Diary List Item (소프트 파스텔) ───
export function DiaryListItem({ diary, mood, onPress }) {
  let monthStr = "MON";
  let dayStr = "01";
  if (diary?.date) {
    // "2024-10-05" 형식의 로컬 문자열을 Date로 변환해도, 시간이 00:00:00이라 상관없습니다.
    const d = new Date(diary.date);
    const mNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    monthStr = mNames[d.getMonth()] || monthStr;
    dayStr = String(d.getDate()).padStart(2, '0');
  }

  // Activities는 title과 note를 가지며, 일반 Diary는 content를 갖습니다.
  const titleText = diary?.title || mood?.label || "오늘의 일기";
  const bodyText = diary?.note || diary?.content || "";

  return (
    <TouchableOpacity
      style={[styles.diaryItem, SOFT_SHADOW.card]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.diaryItemDateBadge, { backgroundColor: mood?.bgColor || '#F8F4FA' }]}>
        <Text style={[styles.diaryItemDateMonth, { color: mood?.color || '#9C78E4' }]}>{monthStr}</Text>
        <Text style={[styles.diaryItemDateDay, { color: mood?.color || '#9C78E4' }]}>{dayStr}</Text>
      </View>

      <View style={styles.diaryItemContentWrap}>
        <View style={styles.diaryItemTitleRow}>
          <MoodCharacter character={mood?.character || "happy"} size={18} />
          <Text style={styles.diaryItemTitle} numberOfLines={1}>{titleText}</Text>
        </View>
        <Text style={styles.diaryItemBody} numberOfLines={1}>
          {bodyText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Back Button (공통 뒤로가기 버튼) ───
export function BackButton({ onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.backCircle, SOFT_SHADOW.button, style]}
      activeOpacity={0.7}
    >
      <Text style={styles.backIcon}>‹</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Button
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E9E9E7',
  },

  // MoodBar
  moodBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm + 2,
  },
  moodBarCharWrap: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  moodBarTrack: {
    flex: 1,
    height: 22,
    backgroundColor: "#FFF5F5",
    borderRadius: RADIUS.full,
    marginHorizontal: SPACING.sm,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moodBarFill: {
    height: "100%",
    borderRadius: RADIUS.full,
  },
  moodBarCount: {
    width: 30,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  // Header (메인 화면 규격 통일: 좌측 정렬, 큰 폰트)
  header: {
    flexDirection: "row",
    alignItems: "center", // 메인 화면 규격 (center)
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg, // 24
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  headerLeftContainer: {
    flex: 1,
    flexDirection: "column",
  },
  headerMainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLeftAction: {
    marginRight: 8,
  },
  headerTitle: {
    ...FONTS.subtitle,
    fontSize: 26,
    color: COLORS.text,
  },
  headerTitleIcon: {
    marginLeft: 8,
  },
  headerSubtitleWrap: {
    marginTop: 4,
  },
  headerSubtitleText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  headerRightAction: {
    // Spacer or other actions
  },
  headerButton: {
    padding: SPACING.sm,
  },
  headerButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.happy,
  },

  moodCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: 2,
    marginHorizontal: 2,
  },
  moodCardCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  moodCardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  // DiaryListItem (Notion Style)
  diaryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12, // 노션 스타일 라운딩
    borderWidth: 1,
    borderColor: "#E9E9E7", // 노션 선 색상
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: SPACING.md,
    ...SOFT_SHADOW.card,
  },
  diaryItemDateBadge: {
    width: 46,
    height: 46,
    borderRadius: 10, // 노션의 각진 느낌을 살린 부드러운 사각형
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    zIndex: 10,
  },
  diaryItemDateMonth: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  diaryItemDateDay: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: -2,
  },
  diaryItemContentWrap: {
    flex: 1,
    zIndex: 10,
    justifyContent: "center",
  },
  diaryItemTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  diaryItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#37352F", // 노션 차콜 컬러
    marginLeft: 8,
    flex: 1,
  },
  diaryItemBody: {
    fontSize: 13,
    color: '#666666', // 노션 보조 텍스트 컬러
    marginLeft: 26, // Align with title text (icon width + margin = 18 + 8 = 26)
  },
  // BackButton
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.text,
    marginLeft: -2,
    lineHeight: 24,
  },

  // Alert Modal (Notion Style)
  alertModalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9E9E7",
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#37352F",
    marginBottom: 8,
    textAlign: "center",
  },
  alertMessage: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  alertButton: {
    backgroundColor: "#37352F", // 노션 시그니처 다크 차콜
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignSelf: "stretch",
    alignItems: "center",
  },
  alertButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
