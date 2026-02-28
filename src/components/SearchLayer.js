import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { SearchIcon, CloseIcon } from "../constants/icons";

export function SearchBar({ value, onChangeText, onClear, onCancel }) {
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.inputWrapper}>
        <View style={styles.searchIconWrap}>
          <SearchIcon size={20} color="#666666" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="검색어를 입력하세요..."
          placeholderTextColor="#999999"
          value={value}
          onChangeText={onChangeText}
          autoFocus={false}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={onClear}
            style={styles.clearBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.clearIconCircle}>
              <CloseIcon size={12} color="#666666" strokeWidth="2.5" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: SPACING.md,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12, // 노션 스타일 컨테이너 라운딩
    borderWidth: 1,
    borderColor: "#E9E9E7", // 노션 얇은 실선
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
    height: 50, // 살짝 슬림하게
  },
  searchIconWrap: {
    paddingRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: "100%",
    ...FONTS.body,
    fontSize: 16,
    color: "#37352F", // 노션 텍스트
  },
  clearBtn: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  clearIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F1F1F0", // 노션 연한 회색 버튼 (Hover/Active 느낌)
    alignItems: "center",
    justifyContent: "center",
  },
});
