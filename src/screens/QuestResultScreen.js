import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../constants/colors';
import { useGame, countQuestResults, needsDoubleFail } from '../context/GameContext';
import Header from '../components/Header';
import ScoreTrack from '../components/ScoreTrack';

export default function QuestResultScreen() {
  const { state, dispatch } = useGame();
  const { questPhase, questResults, round, playerCount, players } = state;
  const passed = questPhase.result === 'pass';
  const { pass, fail } = countQuestResults(questResults);
  const successCount = questPhase.votes.filter(v => v === 'success').length;
  const failCount = questPhase.failCount;
  const total = questPhase.teamMembers.length;
  const doubleFail = needsDoubleFail(playerCount, round);

  // Determine button label
  const hasAssassin = players.some(p => p.role === 'assassin');
  let btnLabel = `第 ${round + 1} 輪 →`;
  if (pass >= 3) btnLabel = hasAssassin ? '⚔️ 刺客出動' : '🏆 計算勝負';
  if (fail >= 3) btnLabel = '☠ 計算結果';

  return (
    <LinearGradient colors={[colors.deepBlue, colors.navy]} style={styles.screen}>
      <Header title={`第 ${round} 任務結果`} subtitle="任務回報" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Outcome banner */}
        <View style={[styles.banner, passed ? styles.bannerPass : styles.bannerFail]}>
          <Text style={[styles.bannerText, passed ? styles.bannerTextPass : styles.bannerTextFail]}>
            {passed ? '✦ 任務成功 — 亞瑟王的光輝延續' : '✗ 任務失敗 — 黑暗勢力潛伏'}
          </Text>
        </View>

        {/* Vote counts */}
        <View style={styles.voteGrid}>
          <View style={[styles.voteCard, styles.voteCardPass]}>
            <Text style={styles.voteCount}>{successCount}</Text>
            <Text style={styles.voteLabel}>🗡️ 成功</Text>
            <Text style={styles.voteNote}>共 {total} 票</Text>
          </View>
          <View style={[styles.voteCard, styles.voteCardFail]}>
            <Text style={[styles.voteCount, styles.voteCountFail]}>{failCount}</Text>
            <Text style={[styles.voteLabel, styles.voteLabelFail]}>🩸 失敗</Text>
            <Text style={[styles.voteNote, doubleFail && styles.voteNoteDanger]}>
              {doubleFail ? '需 2 票才算輸' : '1 票即失敗'}
            </Text>
          </View>
        </View>

        {/* Score track */}
        <View style={styles.sectionLabelRow}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionLabelText}>目前戰況</Text>
          <View style={styles.sectionLine} />
        </View>
        <ScoreTrack />

        <View style={styles.scoreRow}>
          <Text style={styles.goodScore}>好人 {pass} 勝</Text>
          <Text style={styles.evilScore}>邪惡 {fail} 勝</Text>
        </View>

        {/* Next button */}
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => dispatch({ type: 'CONFIRM_QUEST_RESULT' })}
        >
          <LinearGradient
            colors={['#8b6914', colors.gold, '#8b6914']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.nextBtnGrad}
          >
            <Text style={styles.nextBtnText}>{btnLabel}</Text>
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

  banner: {
    padding: 14, borderRadius: 8, marginBottom: 16,
    borderWidth: 1, alignItems: 'center',
  },
  bannerPass: { backgroundColor: 'rgba(30,80,30,0.4)', borderColor: colors.goodGreen },
  bannerFail: { backgroundColor: 'rgba(80,20,20,0.4)', borderColor: colors.evilRed },
  bannerText: { fontFamily: fonts.accent, fontSize: 14, letterSpacing: 1 },
  bannerTextPass: { color: colors.goodGreenLight },
  bannerTextFail: { color: colors.evilRedLight },

  voteGrid: {
    flexDirection: 'row', gap: 10, marginBottom: 20,
  },
  voteCard: {
    flex: 1, padding: 14, borderRadius: 8,
    borderWidth: 1, alignItems: 'center',
  },
  voteCardPass: {
    backgroundColor: 'rgba(30,80,30,0.4)',
    borderColor: 'rgba(100,180,100,0.4)',
  },
  voteCardFail: {
    backgroundColor: 'rgba(80,20,20,0.4)',
    borderColor: 'rgba(200,60,60,0.4)',
  },
  voteCount: {
    fontFamily: fonts.decorative, fontSize: 32,
    color: colors.goodGreenLight, marginBottom: 4,
  },
  voteCountFail: { color: colors.evilRedLight },
  voteLabel: {
    fontFamily: fonts.accent, fontSize: 10, letterSpacing: 2,
    color: colors.goodGreenLight, marginBottom: 6,
  },
  voteLabelFail: { color: colors.evilRedLight },
  voteNote: { fontFamily: fonts.bodyItalic, fontSize: 12, color: colors.textMuted },
  voteNoteDanger: { color: colors.evilRedLight },

  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.3)' },
  sectionLabelText: { fontFamily: fonts.accent, fontSize: 10, color: colors.gold, letterSpacing: 4 },

  scoreRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 24,
    marginVertical: 10,
  },
  goodScore: { fontFamily: fonts.accent, fontSize: 13, color: colors.goodGreenLight },
  evilScore: { fontFamily: fonts.accent, fontSize: 13, color: colors.evilRedLight },

  nextBtn: { borderRadius: 4, overflow: 'hidden', marginTop: 8 },
  nextBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  nextBtnText: {
    fontFamily: fonts.accent, fontSize: 13, letterSpacing: 2,
    color: colors.deepBlue, fontWeight: '700',
  },
});
