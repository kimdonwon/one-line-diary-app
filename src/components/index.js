import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../constants/theme';
import { MoodCharacter } from '../constants/MoodCharacters';
import { GRAPHIC_STICKERS } from '../constants/stickers';
import Modal from "react-native-modal";

// ─── Custom Soft Alert Modal ───
export function SoftAlertModal({ isVisible, title, message, onConfirm, confirmText = "확인" }) {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.4}
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
        <View style={styles.alertIconWrap}>
          <Text style={{ fontSize: 32 }}>✨</Text>
        </View>
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
      const GraphicComponent = GRAPHIC_STICKERS.find(g => g.key === sticker.type)?.Component;
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

// ─── Mood Bar for Summary (캐릭터 이미지 사용) ───
export function MoodBar({ mood, count, maxCount, color }) {
  const ratio = maxCount > 0 ? count / maxCount : 0;

  return (
    <View style={styles.moodBarContainer}>
      <View style={styles.moodBarCharWrap}>
        <MoodCharacter character={mood.character} size={28} />
      </View>
      <View style={styles.moodBarTrack}>
        <View
          style={[
            styles.moodBarFill,
            {
              width: `${Math.max(ratio * 100, 5)}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <Text style={styles.moodBarCount}>{count}</Text>
    </View>
  );
}

// ─── Screen Header ───
export function Header({ title, leftButton, rightButton, style }) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerSide}>
        {leftButton || <View style={{ width: 40 }} />}
      </View>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSide}>
        {rightButton || <View style={{ width: 40 }} />}
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

// ─── Mood Selector Card (소프트 파스텔) ───
export function MoodCard({ mood, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.moodCard,
        selected && {
          transform: [{ scale: 1.15 }, { translateY: -4 }],
        },
      ]}
    >
      <View
        style={[
          styles.moodCardCircle,
          selected && { backgroundColor: mood.bgColor },
        ]}
      >
        <MoodCharacter character={mood.character} size={selected ? 40 : 30} />
      </View>
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
  const [cardBounds, setCardBounds] = React.useState(null);
  const dateStr = diary?.date ? diary.date.slice(5).replace("-", "/") : "";
  const previewText = diary?.content || "";
  const preview =
    previewText.length > 20
      ? previewText.slice(0, 20) + "..."
      : previewText;

  let parsedStickers = [];
  try {
    if (diary.stickers) parsedStickers = JSON.parse(diary.stickers);
  } catch (e) {
    console.log('Failed to parse stickers in list', e);
  }

  return (
    <TouchableOpacity
      style={[styles.diaryItem, SOFT_SHADOW.card, { overflow: 'hidden', position: 'relative' }]}
      onPress={onPress}
      activeOpacity={0.7}
      onLayout={(e) => {
        setCardBounds(e.nativeEvent.layout);
      }}
    >
      {/* 백그라운드 스티커 렌더링 */}
      {cardBounds && parsedStickers.map(sticker => (
        <StaticSticker key={sticker.id} sticker={sticker} bounds={cardBounds} />
      ))}

      <Text style={[styles.diaryItemDate, { zIndex: 10 }]}>{dateStr}</Text>
      <View style={[styles.diaryItemCharWrap, { zIndex: 10 }]}>
        <MoodCharacter character={mood.character} size={26} />
      </View>
      <Text style={[styles.diaryItemContent, { zIndex: 10 }]} numberOfLines={1}>
        {preview}
      </Text>
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
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
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

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  headerSide: {
    width: 60,
    alignItems: "center",
  },
  headerTitle: {
    ...FONTS.subtitle,
    flex: 1,
    textAlign: "center",
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

  // DiaryListItem
  diaryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm + 2,
  },
  diaryItemDate: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
    width: 45,
  },
  diaryItemCharWrap: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: SPACING.sm,
  },
  diaryItemContent: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
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

  // Alert Modal
  alertModalContainer: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
  },
  alertIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  alertTitle: {
    ...FONTS.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  alertMessage: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  alertButton: {
    backgroundColor: COLORS.happy,
    paddingVertical: 12,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    alignSelf: "stretch",
    alignItems: "center",
  },
  alertButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
