import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../constants/colors';
import { useGame, needsDoubleFail } from '../context/GameContext';
import { ROLES } from '../constants/gameData';
import Header from '../components/Header';
import ReviewCard from '../components/ReviewCard';

export default function QuestVoteScreen() {
  const { state, dispatch } = useGame();
  const { questPhase, questVoteUnlocked, players, playerCount, round } = state;
  const { teamMembers, currentIndex } = questPhase;

  const currentMemberId = teamMembers[currentIndex];
  const currentMember = players.find(p => p.id === currentMemberId);
  const memberRole = ROLES[currentMember.role];
  const isEvil = memberRole.faction === 'evil';
  const isUnlocked = questVoteUnlocked === currentMemberId;
  const doubleFail = needsDoubleFail(playerCount, round);

  // Progress bar
  const progressDots = teamMembers.map((id, i) => {
    let bgColor = colors.stone;
    let borderColor = 'rgba(201,168,76,0.2)';
    if (i < currentIndex) { bgColor = 'rgba(100,180,100,0.4)'; borderColor = colors.goodGreen; }
    else if (i === currentIndex) { bgColor = 'rgba(201,168,76,0.3)'; borderColor = colors.gold; }
    return { bgColor, borderColor };
  });

  if (!isUnlocked) {
    return (
      <LinearGradient colors={['#08090f', colors.navy]} style={styles.screen}>
        <Header title="任務出征" subtitle={`成員 ${currentIndex + 1} / ${teamMembers.length}`} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {/* Progress */}
          <View style={styles.progressRow}>
            {progressDots.map((d, i) => (
              <View key={i} style={[styles.progressDot, { backgroundColor: d.bgColor, borderColor: d.borderColor }]} />
            ))}
          </View>

          {/* Pass phone card */}
          <View style={styles.lockCard}>
            <Text style={styles.lockIcon}>📱</Text>
            <Text style={styles.lockLabel}>請將手機傳給</Text>
            <Text style={styles.lockName}>{currentMember.name}</Text>
            <Text style={styles.lockSub}>其他人請勿偷看</Text>
            <TouchableOpacity
              style={styles.unlockBtnWrap}
              onPress={() => dispatch({ type: 'UNLOCK_QUEST_VOTE', playerId: currentMemberId })}
            >
              <LinearGradient
                colors={['#8b6914', colors.gold, '#8b6914']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.unlockBtnGrad}
              >
                <Text style={styles.unlockBtnText}>我是 {currentMember.name}，確認查看</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ReviewCard />
        </ScrollView>
      </LinearGradient>
    );
  }

  // Unlocked: show vote buttons
  return (
    <LinearGradient colors={['#08090f', colors.navy]} style={styles.screen}>
      <Header title="任務出征" subtitle={`成員 ${currentIndex + 1} / ${teamMembers.length}`} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Progress */}
        <View style={styles.progressRow}>
          {progressDots.map((d, i) => (
            <View key={i} style={[styles.progressDot, { backgroundColor: d.bgColor, borderColor: d.borderColor }]} />
          ))}
        </View>

        {/* Vote card */}
        <View style={styles.voteCard}>
          <Text style={styles.ornament}>✦  密封信物  ✦</Text>
          <Text style={styles.voteName}>{currentMember.name}</Text>
          <Text style={styles.votePrompt}>私下選擇你的信物，不讓其他人知道</Text>

          {/* Success button */}
          <TouchableOpacity
            style={styles.successBtn}
            onPress={() => dispatch({ type: 'SUBMIT_QUEST_VOTE', vote: 'success' })}
          >
            <Text style={styles.successBtnIcon}>🗡️</Text>
            <Text style={styles.successBtnText}>任務成功</Text>
          </TouchableOpacity>

          {/* Fail button (evil only) */}
          {isEvil && (
            <TouchableOpacity
              style={styles.failBtn}
              onPress={() => dispatch({ type: 'SUBMIT_QUEST_VOTE', vote: 'fail' })}
            >
              <Text style={styles.failBtnIcon}>🩸</Text>
              <Text style={styles.failBtnText}>任務失敗</Text>
            </TouchableOpacity>
          )}

          {isEvil && (
            <Text style={styles.evilNote}>* 邪惡陣營可選擇破壞任務</Text>
          )}
          {doubleFail && (
            <Text style={styles.evilNote}>⚠ 此任務需 2 票失敗才算失敗</Text>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16 },

  progressRow: { flexDirection: 'row', gap: 4, marginBottom: 16 },
  progressDot: {
    flex: 1, height: 4, borderRadius: 2,
    borderWidth: 1,
  },

  lockCard: {
    backgroundColor: '#0a0a18',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)',
    borderRadius: 12, padding: 32, alignItems: 'center', marginBottom: 16,
  },
  lockIcon: { fontSize: 40, marginBottom: 12 },
  lockLabel: {
    fontFamily: fonts.accent, fontSize: 10, color: colors.gold,
    letterSpacing: 5, marginBottom: 8,
  },
  lockName: {
    fontFamily: fonts.decorative, fontSize: 28, color: colors.goldLight,
    marginBottom: 8, textAlign: 'center',
  },
  lockSub: {
    fontFamily: fonts.bodyItalic, fontSize: 13, color: 'rgba(232,223,192,0.5)', marginBottom: 24,
  },
  unlockBtnWrap: { borderRadius: 4, overflow: 'hidden', width: '100%' },
  unlockBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  unlockBtnText: {
    fontFamily: fonts.accent, fontSize: 12, letterSpacing: 1,
    color: colors.deepBlue, fontWeight: '700',
  },

  voteCard: {
    backgroundColor: '#0d0820',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
    borderRadius: 12, padding: 24, alignItems: 'center',
  },
  ornament: {
    fontFamily: fonts.accent, color: colors.gold, fontSize: 11,
    letterSpacing: 3, marginBottom: 12, opacity: 0.8,
  },
  voteName: {
    fontFamily: fonts.decorative, fontSize: 24, color: colors.goldLight,
    marginBottom: 8, textAlign: 'center',
  },
  votePrompt: {
    fontFamily: fonts.bodyItalic, fontSize: 13, color: 'rgba(232,223,192,0.7)',
    textAlign: 'center', marginBottom: 24,
  },

  successBtn: {
    width: '100%', borderRadius: 10, marginBottom: 10,
    backgroundColor: '#1a4a1a',
    borderWidth: 1, borderColor: 'rgba(100,180,100,0.5)',
    paddingVertical: 22, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  successBtnIcon: { fontSize: 22 },
  successBtnText: {
    fontFamily: fonts.accent, fontSize: 16, letterSpacing: 2, color: '#ccffcc',
  },

  failBtn: {
    width: '100%', borderRadius: 10,
    backgroundColor: '#4a1010',
    borderWidth: 1, borderColor: 'rgba(200,60,60,0.5)',
    paddingVertical: 22, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  failBtnIcon: { fontSize: 22 },
  failBtnText: {
    fontFamily: fonts.accent, fontSize: 16, letterSpacing: 2, color: '#ffcccc',
  },

  evilNote: {
    fontFamily: fonts.bodyItalic, fontSize: 12,
    color: 'rgba(255,128,128,0.7)', textAlign: 'center', marginTop: 10,
  },
});
