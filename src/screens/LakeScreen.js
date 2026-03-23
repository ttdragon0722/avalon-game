import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../constants/colors';
import { useGame } from '../context/GameContext';
import Header from '../components/Header';

export default function LakeScreen() {
  const { state, dispatch } = useGame();
  const { players, lakePlayerIndex, lakePhase, lakeTargetId, lakeRevealResult } = state;
  const lakePlayer = players[lakePlayerIndex];
  const isReveal = lakePhase === 'reveal';
  const targetPlayer = lakeTargetId ? players.find(p => p.id === lakeTargetId) : null;
  const candidates = players.filter(p => p.id !== lakePlayer.id);
  const isGood = lakeRevealResult === 'good';

  if (!isReveal) {
    return (
      <LinearGradient colors={[colors.deepBlue, '#060c1a']} style={styles.screen}>
        <Header title="湖女" subtitle={`🌊 ${lakePlayer.name} 的查驗`} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

          {/* Lake hero card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroIcon}>🌊</Text>
            <Text style={styles.heroLabel}>湖女查驗</Text>
            <Text style={styles.heroName}>{lakePlayer.name}</Text>
            <Text style={styles.heroDesc}>選擇一位玩家查驗其陣營，結果只有你知道</Text>
          </View>

          {/* Section label */}
          <View style={styles.sectionLabelRow}>
            <View style={styles.sectionLine} />
            <Text style={styles.sectionLabelText}>選擇查驗對象</Text>
            <View style={styles.sectionLine} />
          </View>

          {/* Candidate list */}
          <View style={styles.playerList}>
            {candidates.map(p => {
              const isSel = lakeTargetId === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.playerItem, isSel && styles.playerItemSelected]}
                  onPress={() => dispatch({ type: 'SET_LAKE_TARGET', playerId: p.id })}
                >
                  <View style={[styles.avatar, isSel && styles.avatarSelected]}>
                    <Text style={styles.avatarText}>{p.name[0] || '?'}</Text>
                  </View>
                  <Text style={styles.playerName}>{p.name}</Text>
                  {isSel && <Text style={styles.checkMark}>✦</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Confirm button */}
          <TouchableOpacity
            style={[styles.confirmBtn, !lakeTargetId && styles.confirmBtnDisabled]}
            disabled={!lakeTargetId}
            onPress={() => lakeTargetId && dispatch({ type: 'CONFIRM_LAKE_CHECK' })}
          >
            <LinearGradient
              colors={lakeTargetId ? ['#1a4a8a', '#2a7adf'] : [colors.stone, colors.stone]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.confirmBtnGrad}
            >
              <Text style={styles.confirmBtnText}>
                {lakeTargetId ? `🌊 查驗 ${targetPlayer?.name}` : '請選擇對象'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </LinearGradient>
    );
  }

  // Reveal phase
  return (
    <LinearGradient colors={[colors.deepBlue, '#060c1a']} style={styles.screen}>
      <Header title="湖女查驗結果" subtitle="私下查看" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <View style={[styles.revealCard, isGood ? styles.revealCardGood : styles.revealCardEvil]}>
          <Text style={styles.heroIcon}>🌊</Text>
          <Text style={styles.heroLabel}>查驗結果</Text>
          <Text style={styles.heroName}>{targetPlayer?.name}</Text>
          <View style={[styles.resultBadge, isGood ? styles.resultBadgeGood : styles.resultBadgeEvil]}>
            <Text style={[styles.resultBadgeText, isGood ? styles.resultTextGood : styles.resultTextEvil]}>
              {isGood ? '◇ 光明陣營' : '◆ 黑暗陣營'}
            </Text>
          </View>
          <Text style={styles.revealSub}>請記住結果後，將手機傳給被查驗者</Text>
        </View>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => dispatch({ type: 'CONFIRM_LAKE_RESULT' })}
        >
          <LinearGradient
            colors={['#8b6914', colors.gold, '#8b6914']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.confirmBtnGrad}
          >
            <Text style={[styles.confirmBtnText, { color: colors.deepBlue }]}>
              傳給 {targetPlayer?.name} → 下一輪
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16 },

  heroCard: {
    backgroundColor: '#060c1a',
    borderWidth: 1, borderColor: 'rgba(100,160,255,0.3)',
    borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 16,
  },
  heroIcon: { fontSize: 40, marginBottom: 8 },
  heroLabel: {
    fontFamily: fonts.accent, fontSize: 10, color: colors.lakeBlue,
    letterSpacing: 5, marginBottom: 6,
  },
  heroName: {
    fontFamily: fonts.decorative, fontSize: 24, color: colors.lakeBluLight,
    marginBottom: 8, textAlign: 'center',
  },
  heroDesc: {
    fontFamily: fonts.bodyItalic, fontSize: 13, color: colors.textMuted,
    textAlign: 'center',
  },

  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.3)' },
  sectionLabelText: { fontFamily: fonts.accent, fontSize: 10, color: colors.gold, letterSpacing: 4 },

  playerList: { gap: 8, marginBottom: 16 },
  playerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: 6,
    borderWidth: 1, borderColor: 'rgba(100,160,255,0.2)',
    backgroundColor: 'rgba(20,40,80,0.2)',
  },
  playerItemSelected: {
    borderColor: 'rgba(100,160,255,0.6)',
    backgroundColor: 'rgba(20,60,120,0.3)',
  },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(20,40,80,0.5)',
    borderWidth: 1, borderColor: 'rgba(100,160,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarSelected: { backgroundColor: 'rgba(30,80,180,0.5)', borderColor: colors.lakeBlue },
  avatarText: { fontFamily: fonts.accent, fontSize: 14, color: colors.lakeBlue },
  playerName: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.textLight },
  checkMark: { fontSize: 16, color: colors.lakeBlue },

  confirmBtn: { borderRadius: 4, overflow: 'hidden' },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  confirmBtnText: {
    fontFamily: fonts.accent, fontSize: 13, letterSpacing: 2,
    color: '#a0d0ff', fontWeight: '700',
  },

  revealCard: {
    borderRadius: 12, padding: 28, alignItems: 'center',
    marginBottom: 20, borderWidth: 1,
  },
  revealCardGood: {
    backgroundColor: '#060c1a',
    borderColor: 'rgba(100,200,100,0.4)',
  },
  revealCardEvil: {
    backgroundColor: '#060c1a',
    borderColor: 'rgba(200,60,60,0.4)',
  },
  resultBadge: {
    padding: 14, borderRadius: 8, marginVertical: 16,
    borderWidth: 1, width: '100%', alignItems: 'center',
  },
  resultBadgeGood: {
    backgroundColor: 'rgba(30,80,30,0.5)',
    borderColor: 'rgba(100,180,100,0.5)',
  },
  resultBadgeEvil: {
    backgroundColor: 'rgba(80,20,20,0.5)',
    borderColor: 'rgba(200,60,60,0.5)',
  },
  resultBadgeText: { fontFamily: fonts.accent, fontSize: 16 },
  resultTextGood: { color: colors.goodGreenLight },
  resultTextEvil: { color: colors.evilRedLight },
  revealSub: {
    fontFamily: fonts.bodyItalic, fontSize: 12, color: 'rgba(232,223,192,0.5)', textAlign: 'center',
  },
});
