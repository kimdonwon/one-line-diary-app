import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../constants/theme';
import { SearchIcon, CloseIcon } from "./icons";
import { BackButton } from "./components";

export function SearchBar({ value, onChangeText, onClear, onCancel }) {
  return (
    <View style={styles.searchBarContainer}>
      <BackButton onPress={onCancel} style={{ marginRight: SPACING.sm }} />
      <View style={[styles.inputWrapper, SOFT_SHADOW.card]}>
        <View style={styles.searchIconWrap}>
          <SearchIcon size={18} color={COLORS.textSecondary} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="..."
          placeholderTextColor="#A0968F"
          value={value}
          onChangeText={onChangeText}
          autoFocus
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.xs,
    height: 50,
  },
  searchIconWrap: {
    paddingHorizontal: SPACING.sm,
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
    marginRight: SPACING.xs,
  },
  clearIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#D1C6C0",
    alignItems: "center",
    justifyContent: "center",
  },
});
