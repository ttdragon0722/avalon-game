import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../constants/colors';
import { useGame } from '../context/GameContext';

export default function Header({ title, subtitle }) {
  const { state, dispatch } = useGame();
  const showReset = !['setup', 'end'].includes(state.phase);

  return (
    <View style={styles.header}>
      <Text style={styles.ornament}>⚜ ✦ ⚜</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {showReset && (
        state.confirmReset ? (
          <View style={styles.resetRow}>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => dispatch({ type: 'RESET_TO_SETUP' })}
            >
              <Text style={styles.confirmBtnText}>確定重設</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => dispatch({ type: 'SET_CONFIRM_RESET', value: false })}
            >
              <Text style={styles.cancelBtnText}>取消</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => dispatch({ type: 'SET_CONFIRM_RESET', value: true })}
          >
            <Text style={styles.resetBtnText}>↺ 重設</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201,168,76,0.2)',
  },
  ornament: {
    color: colors.gold,
    fontSize: 14,
    letterSpacing: 8,
    marginBottom: 4,
    opacity: 0.6,
  },
  title: {
    fontFamily: fonts.decorative,
    fontSize: 18,
    color: colors.goldLight,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.accent,
    fontSize: 10,
    color: colors.goldDark,
    letterSpacing: 4,
    marginTop: 4,
  },
  resetRow: {
    position: 'absolute',
    top: 40,
    right: 10,
    flexDirection: 'row',
    gap: 6,
  },
  confirmBtn: {
    backgroundColor: 'rgba(139,26,26,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(200,60,60,0.6)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  confirmBtnText: {
    color: '#ffcccc',
    fontFamily: fonts.accent,
    fontSize: 11,
  },
  cancelBtn: {
    backgroundColor: 'rgba(42,53,80,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cancelBtnText: {
    color: colors.textMuted,
    fontFamily: fonts.accent,
    fontSize: 11,
  },
  resetBtn: {
    position: 'absolute',
    top: 40,
    right: 14,
    backgroundColor: 'rgba(42,53,80,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetBtnText: {
    color: 'rgba(232,223,192,0.7)',
    fontFamily: fonts.accent,
    fontSize: 11,
    letterSpacing: 1,
  },
});
