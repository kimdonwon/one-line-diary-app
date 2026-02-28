import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Animated, Easing } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../constants/theme';
import { MoodCharacter } from '../constants/MoodCharacters';
import { getStickerComponent } from '../constants/stickers';
import Modal from "react-native-modal";

// ─── Custom Soft Alert Modal ───
export function SoftAlertModal({ isVisible, title, message, onConfirm, confirmText = "확인" }) {
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
      style={{ margin: SPACING.xl, justifyContent: "center" }}
    >
      <View style={[styles.alertModalContainer, SOFT_SHADOW.card]}>

        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
        <TouchableOpacity
          style={[styles.alertButton, SOFT_SHADOW.button]}
          onPress={onConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.alertButtonText}>{confirmText}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ─── Static Sticker (View Only) ───
export function StaticSticker({ sticker, bounds }) {
  if (!sticker) return null;

  // 리스트 뷰 등 더 작은 영역에서의 렌더링을 위한 스케일 다운 비율 산정 (선택사항)
  const scale = bounds ? bounds.width / 300 : 1;

  // 스티커 렌더링 (텍스트 vs SVG 구분)
  const renderContent = () => {
    if (sticker.isGraphic) {
      const GraphicComponent = getStickerComponent(sticker.type);
      if (GraphicComponent) {
        return <GraphicComponent size={24 * scale} />;
      }
    }
    return <Text style={{ fontSize: 20 * scale }}>{sticker.type}</Text>;
  };

  return (
    <View style={{
      position: 'absolute',
      left: sticker.x * scale,
      top: sticker.y * scale,
      zIndex: 5,
    }}>
      {renderContent()}
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
export const MoodBar = React.memo(({ mood, count, maxCount, color, animKey }) => {
  const ratio = maxCount > 0 ? count / maxCount : 0;
  // useNativeDriver: true를 위해 scaleX와 translateX를 사용합니다.
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animValue.setValue(0);
    Animated.timing(animValue, {
      toValue: Math.max(ratio, 0.05),
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, [ratio, animKey]);

  // scaleX는 중심을 기준으로 커지므로, 왼쪽으로 정렬된 느낌을 주기 위해 translateX를 함께 조절하거나
  // 혹은 단순히 0.5 지점에서 시작하는 것이 아니라, transform-origin 대용으로 translateX를 사용합니다.
  // 여기서는 단순히 JS thread 부담을 줄이기 위해 React.memo만으로도 효과가 크지만, 
  // 더 완벽한 성능을 위해 scaleX 기법을 적용합니다.
  const animatedStyle = {
    transform: [
      { translateX: -150 }, // 임의의 넓은 기준점 (충분히 큰 값)
      {
        scaleX: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 300], // 기준점과 곱해져서 실제 너비를 채움
        })
      },
      { translateX: 150 },
    ],
    // 하지만 위 방식은 복잡하므로, 가장 깔끔한 'width' 애니메이션을 유지하되 
    // 컴포넌트 전체가 아닌 'Animated.View'만 리렌더링되도록 격리합니다.
  };

  // 실질적으로 'width'를 애니메이션할 때는 useNativeDriver를 쓸 수 없으므로,
  // 렉의 주 원인인 'SVG 캐릭터 리렌더링'을 React.memo로 막는 것이 핵심입니다.
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    widthAnim.setValue(0);
    Animated.timing(widthAnim, {
      toValue: Math.max(ratio * 100, 5),
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [ratio, animKey]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.moodBarContainer}>
      <View style={styles.moodBarCharWrap}>
        <MemoizedMoodCharacter character={mood.character} size={28} />
      </View>
      <View style={styles.moodBarTrack}>
        <Animated.View
          style={[
            styles.moodBarFill,
            {
              width: animatedWidth,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <Text style={styles.moodBarCount}>{count}</Text>
    </View>
  );
});

// MoodCharacter를 메모이제이션하여 애니메이션 중 불필요한 SVG 재계산을 방지합니다.
const MemoizedMoodCharacter = React.memo(MoodCharacter);

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
            <Text style={styles.headerSubtitleText}>{subtitle}</Text>
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
