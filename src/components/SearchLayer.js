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
          <SearchIcon size={20} color="#FF7474" />
        </View>
        <TextInput
          style={styles.input}
          placeholder=" "
          placeholderTextColor="#CB9D6C"
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
              <CloseIcon size={12} color="#FFFFFF" strokeWidth="3" />
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
    borderRadius: 30,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.sm,
    height: 56,
  },
  searchIconWrap: {
    paddingRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: "100%",
    ...FONTS.body,
    fontSize: 16,
    color: COLORS.text,
  },
  clearBtn: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  clearIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF7474", // 포인트 플랫 컬러
    alignItems: "center",
    justifyContent: "center",
  },
});
