import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../constants/colors';
import { useGame } from '../context/GameContext';
import { DEFAULT_ROLES_BY_COUNT, FACTION_COUNTS, ROLES } from '../constants/gameData';
import Header from '../components/Header';

function SectionLabel({ children }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.sectionLine} />
      <Text style={styles.sectionLabelText}>{children}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

export default function SetupScreen() {
  const { state, dispatch } = useGame();
  const { playerCount, playerNames, maxRejectCount, useLake } = state;
  const [gc, ec] = FACTION_COUNTS[playerCount];
  const preset = DEFAULT_ROLES_BY_COUNT[playerCount];
  const canUseLake = playerCount >= 7;

  function updateName(i, value) {
    const names = [...playerNames];
    names[i] = value;
    dispatch({ type: 'SET_PLAYER_NAMES', names });
  }

  return (
    <LinearGradient colors={[colors.deepBlue, colors.navy]} style={styles.screen}>
      <Header title="阿瓦隆之王" subtitle="THE RESISTANCE: AVALON" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Title hero */}
        <Text style={styles.heroIcon}>⚔️</Text>
        <Text style={styles.heroSub}>騎士圓桌 · 榮耀之戰</Text>

        {/* Player count */}
        <SectionLabel>人數設定</SectionLabel>
        <View style={styles.countRow}>
          {[5, 6, 7, 8, 9, 10].map(n => (
            <TouchableOpacity
              key={n}
              style={[styles.countBtn, playerCount === n && styles.countBtnActive]}
              onPress={() => dispatch({ type: 'SET_PLAYER_COUNT', count: n })}
            >
              <Text style={[styles.countBtnText, playerCount === n && styles.countBtnTextActive]}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Player names */}
        <SectionLabel>玩家名稱</SectionLabel>
        <View style={styles.nameInputs}>
          {Array.from({ length: playerCount }, (_, i) => (
            <View key={i} style={styles.nameRow}>
              <View style={styles.playerNum}>
                <Text style={styles.playerNumText}>{i + 1}</Text>
              </View>
              <TextInput
                style={styles.nameInput}
                value={playerNames[i] || ''}
                onChangeText={v => updateName(i, v)}
                placeholder={`玩家 ${i + 1} 的名字`}
                placeholderTextColor="rgba(232,223,192,0.3)"
                returnKeyType="done"
              />
            </View>
          ))}
        </View>

        {/* Role preview */}
        <SectionLabel>本局角色</SectionLabel>
        <View style={styles.card}>
          <View style={styles.chipWrap}>
            {preset.good.map((id, i) => {
              const r = ROLES[id];
              return (
                <View key={`g${i}`} style={styles.chipGood}>
                  <Text style={styles.chipGoodText}>{r.icon} {r.name}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.divider} />
          <View style={styles.chipWrap}>
            {preset.evil.map((id, i) => {
              const r = ROLES[id];
              return (
                <View key={`e${i}`} style={styles.chipEvil}>
                  <Text style={styles.chipEvilText}>{r.icon} {r.name}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Lake lady */}
        {canUseLake && (
          <>
            <SectionLabel>湖女擴充</SectionLabel>
            <TouchableOpacity
              style={[styles.roleToggle, useLake && styles.roleToggleActive]}
              onPress={() => dispatch({ type: 'TOGGLE_LAKE' })}
            >
              <Text style={styles.roleToggleIcon}>🌊</Text>
              <View style={styles.roleToggleInfo}>
                <Text style={styles.roleToggleName}>湖女 Lady of the Lake</Text>
                <Text style={styles.roleToggleDesc}>每輪任務後，湖女可私下查驗一人陣營，查驗後傳給被查者成為新湖女</Text>
                <Text style={styles.roleToggleFaction}>◆ 第一位國王的上一位玩家為湖女</Text>
              </View>
              <View style={[styles.indicator, useLake && styles.indicatorActive]}>
                {useLake && <Text style={styles.indicatorCheck}>✓</Text>}
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* Reject limit */}
        <SectionLabel>否決上限</SectionLabel>
        <View style={[styles.card, { marginBottom: 20 }]}>
          <View style={styles.rejectTopRow}>
            <View>
              <Text style={styles.rejectTitle}>連續否決幾次後邪惡獲勝</Text>
              <Text style={styles.rejectSub}>標準規則為 5 次</Text>
            </View>
            <View style={styles.rejectCounter}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => maxRejectCount > 2 && dispatch({ type: 'SET_MAX_REJECT', count: maxRejectCount - 1 })}
              >
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{maxRejectCount}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => maxRejectCount < 10 && dispatch({ type: 'SET_MAX_REJECT', count: maxRejectCount + 1 })}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.quickBtns}>
            {[3, 4, 5, 6].map(n => (
              <TouchableOpacity
                key={n}
                style={[styles.quickBtn, maxRejectCount === n && styles.quickBtnActive]}
                onPress={() => dispatch({ type: 'SET_MAX_REJECT', count: n })}
              >
                <Text style={[styles.quickBtnText, maxRejectCount === n && styles.quickBtnTextActive]}>
                  {n}次
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start button */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => dispatch({ type: 'START_GAME' })}
        >
          <LinearGradient
            colors={['#8b6914', colors.gold, '#8b6914']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.startBtnGrad}
          >
            <Text style={styles.startBtnText}>開始遊戲 — 發牌</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16 },
  heroIcon: { fontSize: 48, textAlign: 'center', marginVertical: 16 },
  heroSub: {
    fontFamily: fonts.accent,
    fontSize: 10,
    color: colors.goldDark,
    letterSpacing: 6,
    textAlign: 'center',
    marginBottom: 28,
  },

  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.3)' },
  sectionLabelText: {
    fontFamily: fonts.accent,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 4,
  },

  countRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  countBtn: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    borderRadius: 4,
    backgroundColor: colors.slate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBtnActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  countBtnText: {
    fontFamily: fonts.accent,
    fontSize: 16,
    color: colors.textLight,
  },
  countBtnTextActive: { color: colors.deepBlue, fontWeight: '700' },

  nameInputs: { flexDirection: 'column', gap: 8, marginBottom: 20 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playerNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.stone,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  playerNumText: { fontFamily: fonts.accent, fontSize: 11, color: colors.gold },
  nameInput: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.stone,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    borderRadius: 4,
    color: colors.textLight,
    fontFamily: fonts.body,
    fontSize: 15,
  },

  card: {
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  divider: { height: 1, backgroundColor: 'rgba(201,168,76,0.15)', marginVertical: 8 },
  chipGood: {
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12,
    backgroundColor: 'rgba(30,80,30,0.4)',
    borderWidth: 1, borderColor: 'rgba(100,180,100,0.3)',
  },
  chipGoodText: { fontFamily: fonts.accent, fontSize: 11, color: colors.goodGreenLight },
  chipEvil: {
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12,
    backgroundColor: 'rgba(80,20,20,0.4)',
    borderWidth: 1, borderColor: 'rgba(200,60,60,0.3)',
  },
  chipEvilText: { fontFamily: fonts.accent, fontSize: 11, color: colors.evilRedLight },

  roleToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.15)',
    backgroundColor: colors.slate,
    marginBottom: 16,
  },
  roleToggleActive: {
    borderColor: 'rgba(100,160,255,0.5)',
    backgroundColor: 'rgba(30,60,100,0.3)',
  },
  roleToggleIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  roleToggleInfo: { flex: 1 },
  roleToggleName: { fontFamily: fonts.accent, fontSize: 12, color: colors.goldLight },
  roleToggleDesc: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  roleToggleFaction: { fontSize: 10, color: colors.lakeBlue, marginTop: 2, letterSpacing: 1 },
  indicator: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: 'rgba(201,168,76,0.4)',
    backgroundColor: colors.stone,
    alignItems: 'center', justifyContent: 'center',
  },
  indicatorActive: { backgroundColor: '#1a5080', borderColor: colors.lakeBlue },
  indicatorCheck: { color: '#fff', fontSize: 12, fontWeight: '700' },

  rejectTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rejectTitle: { fontFamily: fonts.accent, fontSize: 12, color: colors.goldLight },
  rejectSub: { fontSize: 11, color: 'rgba(232,223,192,0.5)', marginTop: 2 },
  rejectCounter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterBtn: {
    width: 34, height: 34, borderRadius: 4,
    backgroundColor: colors.stone,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  counterBtnText: { color: colors.textLight, fontSize: 18, lineHeight: 20 },
  counterValue: {
    fontFamily: fonts.decorative,
    fontSize: 22,
    color: colors.goldLight,
    minWidth: 32,
    textAlign: 'center',
  },
  quickBtns: { flexDirection: 'row', gap: 6 },
  quickBtn: {
    flex: 1, paddingVertical: 8,
    backgroundColor: colors.stone,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)',
    borderRadius: 4, alignItems: 'center',
  },
  quickBtnActive: {
    backgroundColor: 'rgba(201,168,76,0.3)',
    borderColor: colors.gold,
  },
  quickBtnText: { fontFamily: fonts.accent, fontSize: 12, color: 'rgba(232,223,192,0.6)' },
  quickBtnTextActive: { color: colors.goldLight },

  startBtn: { borderRadius: 4, overflow: 'hidden' },
  startBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  startBtnText: {
    fontFamily: fonts.accent,
    fontSize: 13,
    letterSpacing: 2,
    color: colors.deepBlue,
    fontWeight: '700',
  },
});
