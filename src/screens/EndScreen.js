import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../constants/colors';
import { useGame } from '../context/GameContext';
import { ROLES } from '../constants/gameData';
import Header from '../components/Header';

export default function EndScreen() {
  const { state, dispatch } = useGame();
  const { winner, gameEndReason, players, selectedAssassinTarget } = state;
  const isGoodWin = winner === 'good';
  const assassinTarget = selectedAssassinTarget ? players.find(p => p.id === selectedAssassinTarget) : null;

  let endMsg = '';
  if (gameEndReason === 'quests') {
    endMsg = isGoodWin
      ? '亞瑟王的騎士完成三項任務，光明普照卡美洛！'
      : '黑暗勢力破壞三項任務，邪惡征服了不列顛！';
  } else if (gameEndReason === 'assassin') {
    endMsg = isGoodWin
      ? `刺客誤判目標（${assassinTarget?.name} 並非梅林），光明守住了！`
      : `梅林（${assassinTarget?.name}）被刺殺，黑暗勝利！`;
  } else {
    endMsg = '隊伍五次遭到否決，邪惡陣營坐收漁翁之利！';
  }

  return (
    <LinearGradient
      colors={isGoodWin ? [colors.deepBlue, '#0a1a0a'] : [colors.deepBlue, '#1a0505']}
      style={styles.screen}
    >
      <Header title="遊戲結束" subtitle={isGoodWin ? '光明的勝利' : '黑暗的征服'} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>{isGoodWin ? '🏆' : '☠️'}</Text>
          <Text style={[styles.resultTitle, isGoodWin ? styles.titleGood : styles.titleEvil]}>
            {isGoodWin ? '光明陣營勝利' : '邪惡陣營勝利'}
          </Text>
          <Text style={[styles.resultSubtitle, isGoodWin ? styles.subtitleGood : styles.subtitleEvil]}>
            {isGoodWin ? '◇ GOOD WINS ◇' : '◆ EVIL WINS ◆'}
          </Text>
        </View>

        {/* End message */}
        <View style={styles.msgCard}>
          <Text style={styles.msgText}>{endMsg}</Text>
        </View>

        {/* Role reveal */}
        <View style={styles.sectionLabelRow}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionLabelText}>角色大揭露</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.revealList}>
          {players.map(p => {
            const r = ROLES[p.role];
            const isGood = r.faction === 'good';
            return (
              <View key={p.id} style={styles.revealItem}>
                <Text style={styles.revealRoleIcon}>{r.icon}</Text>
                <Text style={styles.revealName}>{p.name}</Text>
                <View style={[styles.revealRoleBadge, isGood ? styles.badgeGood : styles.badgeEvil]}>
                  <Text style={[styles.revealRoleText, isGood ? styles.roleTextGood : styles.roleTextEvil]}>
                    {r.name}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Play again */}
        <TouchableOpacity
          style={styles.playAgainBtn}
          onPress={() => dispatch({ type: 'RESET_TO_SETUP' })}
        >
          <LinearGradient
            colors={['#8b6914', colors.gold, '#8b6914']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.playAgainBtnGrad}
          >
            <Text style={styles.playAgainBtnText}>⚔️ 再戰一局</Text>
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

  hero: { alignItems: 'center', paddingVertical: 28 },
  heroIcon: { fontSize: 64, marginBottom: 12 },
  resultTitle: { fontFamily: fonts.decorative, fontSize: 24, marginBottom: 6, textAlign: 'center' },
  titleGood: { color: colors.goodGreenLight },
  titleEvil: { color: colors.evilRedLight },
  resultSubtitle: { fontFamily: fonts.accent, fontSize: 10, letterSpacing: 4, opacity: 0.7 },
  subtitleGood: { color: colors.goodGreenLight },
  subtitleEvil: { color: colors.evilRedLight },

  msgCard: {
    backgroundColor: colors.slate,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)',
    borderRadius: 8, padding: 16, marginBottom: 24,
  },
  msgText: {
    fontFamily: fonts.bodyItalic, fontSize: 15,
    color: 'rgba(232,223,192,0.8)', textAlign: 'center', lineHeight: 24,
  },

  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.3)' },
  sectionLabelText: { fontFamily: fonts.accent, fontSize: 10, color: colors.gold, letterSpacing: 4 },

  revealList: { gap: 6, marginBottom: 24 },
  revealItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 10, borderRadius: 6, backgroundColor: colors.slate,
  },
  revealRoleIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  revealName: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.textLight },
  revealRoleBadge: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 1,
  },
  badgeGood: {
    backgroundColor: 'rgba(30,80,30,0.5)',
    borderColor: 'rgba(100,180,100,0.3)',
  },
  badgeEvil: {
    backgroundColor: 'rgba(80,20,20,0.5)',
    borderColor: 'rgba(200,60,60,0.3)',
  },
  revealRoleText: { fontFamily: fonts.accent, fontSize: 11 },
  roleTextGood: { color: colors.goodGreenLight },
  roleTextEvil: { color: colors.evilRedLight },

  playAgainBtn: { borderRadius: 4, overflow: 'hidden' },
  playAgainBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  playAgainBtnText: {
    fontFamily: fonts.accent, fontSize: 13, letterSpacing: 2,
    color: colors.deepBlue, fontWeight: '700',
  },
});
