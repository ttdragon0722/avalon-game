import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../constants/colors';
import { useGame, questSizeFor, needsDoubleFail } from '../context/GameContext';
import Header from '../components/Header';
import ScoreTrack from '../components/ScoreTrack';
import RejectTrack from '../components/RejectTrack';
import ReviewCard from '../components/ReviewCard';

function SectionLabel({ children }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.sectionLine} />
      <Text style={styles.sectionLabelText}>{children}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

export default function ProposeScreen() {
  const { state, dispatch } = useGame();
  const { players, round, leaderIndex, proposedTeam, rejectCount, maxRejectCount, useLake, lakePlayerIndex, playerCount } = state;
  const leader = players[leaderIndex];
  const size = questSizeFor(playerCount, round);
  const selected = proposedTeam.length;
  const canConfirm = selected === size;
  const doubleFail = needsDoubleFail(playerCount, round);

  return (
    <LinearGradient colors={[colors.deepBlue, colors.navy]} style={styles.screen}>
      <Header title={`第 ${round} 輪任務`} subtitle="組建遠征隊" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Score + Reject row */}
        <View style={styles.topRow}>
          <View style={styles.scoreWrap}>
            <ScoreTrack />
          </View>
          <View style={styles.rejectWrap}>
            <Text style={styles.rejectLabel}>否決次數</Text>
            <View style={styles.rejectRow}>
              <TouchableOpacity
                style={styles.rejectAdjBtn}
                onPress={() => rejectCount > 0 && dispatch({ type: 'SET_REJECT_COUNT', count: rejectCount - 1 })}
              >
                <Text style={styles.rejectAdjText}>−</Text>
              </TouchableOpacity>
              <RejectTrack rejectCount={rejectCount} maxRejectCount={maxRejectCount} />
              <TouchableOpacity
                style={styles.rejectAdjBtn}
                onPress={() => rejectCount < maxRejectCount - 1 && dispatch({ type: 'SET_REJECT_COUNT', count: rejectCount + 1 })}
              >
                <Text style={styles.rejectAdjText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.rejectCount}>{rejectCount} / {maxRejectCount}</Text>
          </View>
        </View>

        {/* Leader banner */}
        <View style={styles.leaderBanner}>
          <Text style={styles.crown}>👑</Text>
          <View style={styles.leaderInfo}>
            <Text style={styles.leaderLabel}>當前隊長</Text>
            <Text style={styles.leaderName}>{leader.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.passBtn}
            onPress={() => dispatch({ type: 'PASS_LEADER' })}
          >
            <Text style={styles.passBtnText}>Pass →</Text>
          </TouchableOpacity>
        </View>

        {/* Quest info */}
        <View style={styles.questInfo}>
          <View style={styles.questStat}>
            <Text style={styles.statLabel}>任務需要人數</Text>
            <Text style={styles.statVal}>{size} 人</Text>
          </View>
          {doubleFail && (
            <View style={styles.questStat}>
              <Text style={styles.statLabel}>⚠ 此任務需 2 票失敗</Text>
              <Text style={[styles.statVal, { color: colors.evilRedLight }]}>特殊規則</Text>
            </View>
          )}
        </View>

        {/* Player list */}
        <SectionLabel>選擇隊員</SectionLabel>
        <View style={styles.playerList}>
          {players.map((p, idx) => {
            const isSel = proposedTeam.includes(p.id);
            const isLeader = p.id === leader.id;
            const isLake = useLake && lakePlayerIndex === idx;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.playerItem, isSel && styles.playerItemSelected]}
                onPress={() => dispatch({ type: 'TOGGLE_TEAM_MEMBER', playerId: p.id })}
              >
                <View style={[styles.avatar, isSel && styles.avatarSelected]}>
                  <Text style={styles.avatarText}>{p.name[0] || '?'}</Text>
                </View>
                <Text style={styles.playerName}>
                  {p.name}
                  {isLeader ? '  👑' : ''}
                  {isLake ? '  🌊' : ''}
                </Text>
                <Text style={[styles.checkMark, isSel && styles.checkMarkVisible]}>✦</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ReviewCard />

        {/* Confirm button */}
        <TouchableOpacity
          style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
          onPress={() => canConfirm && dispatch({ type: 'CONFIRM_TEAM' })}
          disabled={!canConfirm}
        >
          <LinearGradient
            colors={canConfirm ? ['#8b6914', colors.gold, '#8b6914'] : [colors.stone, colors.stone]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.confirmBtnGrad}
          >
            <Text style={[styles.confirmBtnText, !canConfirm && styles.confirmBtnTextDisabled]}>
              {canConfirm ? `⚔️ 出發任務（${selected} 人）` : `請選 ${size} 人（已選 ${selected}）`}
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

  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.3)' },
  sectionLabelText: { fontFamily: fonts.accent, fontSize: 10, color: colors.gold, letterSpacing: 4 },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 8,
  },
  scoreWrap: { flex: 1 },
  rejectWrap: { alignItems: 'flex-end', gap: 3 },
  rejectLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.textMuted, fontStyle: 'italic' },
  rejectRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  rejectAdjBtn: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1, borderColor: 'rgba(200,60,60,0.5)',
    backgroundColor: 'rgba(80,20,20,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  rejectAdjText: { color: colors.evilRed, fontSize: 14, lineHeight: 16 },
  rejectCount: { fontFamily: fonts.accent, fontSize: 9, color: 'rgba(232,223,192,0.4)' },

  leaderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(139,105,20,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.4)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  crown: { fontSize: 24 },
  leaderInfo: { flex: 1 },
  leaderLabel: { fontFamily: fonts.accent, fontSize: 10, color: colors.gold, letterSpacing: 3 },
  leaderName: { fontFamily: fonts.body, fontSize: 18, color: colors.goldLight },
  passBtn: {
    backgroundColor: 'rgba(42,53,80,0.8)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
    borderRadius: 6, paddingHorizontal: 12, paddingVertical: 7,
  },
  passBtnText: { fontFamily: fonts.accent, fontSize: 11, color: 'rgba(232,223,192,0.7)' },

  questInfo: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.15)',
    borderRadius: 6, padding: 10, marginBottom: 16,
  },
  questStat: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4,
  },
  statLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted, fontStyle: 'italic' },
  statVal: { fontFamily: fonts.accent, fontSize: 13, color: colors.goldLight },

  playerList: { gap: 8, marginBottom: 16 },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.15)',
    backgroundColor: colors.slate,
  },
  playerItemSelected: {
    borderColor: 'rgba(201,168,76,0.6)',
    backgroundColor: 'rgba(201,168,76,0.1)',
  },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.stone,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarSelected: { backgroundColor: colors.goldDark, borderColor: colors.gold },
  avatarText: { fontFamily: fonts.accent, fontSize: 14, color: colors.gold },
  playerName: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.textLight },
  checkMark: { fontSize: 16, color: colors.gold, opacity: 0 },
  checkMarkVisible: { opacity: 1 },

  confirmBtn: { borderRadius: 4, overflow: 'hidden' },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  confirmBtnText: {
    fontFamily: fonts.accent, fontSize: 13, letterSpacing: 2,
    color: colors.deepBlue, fontWeight: '700',
  },
  confirmBtnTextDisabled: { color: colors.textMuted },
});
