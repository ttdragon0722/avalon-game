import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../constants/colors';
import { useGame, getKnownInfo } from '../context/GameContext';
import { ROLES } from '../constants/gameData';
import Header from '../components/Header';

export default function NightScreen() {
  const { state, dispatch } = useGame();
  const { players, nightIndex, playerCount, showRoleCard } = state;
  const player = players[nightIndex];
  const role = ROLES[player.role];
  const knownPlayers = getKnownInfo(player, players);
  const isLast = nightIndex === playerCount - 1;
  const isGood = role.faction === 'good';

  return (
    <LinearGradient colors={['#08090f', colors.navy]} style={styles.screen}>
      <Header title="夜晚階段" subtitle={`第 ${nightIndex + 1} / ${playerCount} 位玩家`} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Pass card */}
        <View style={styles.nightCard}>
          <Text style={styles.ornament}>✦  夜幕降臨  ✦</Text>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.passPrompt}>請其他人轉開目光，由此玩家查看角色</Text>

          {!showRoleCard && (
            <TouchableOpacity
              style={styles.revealBtnWrap}
              onPress={() => dispatch({ type: 'REVEAL_NIGHT_CARD' })}
            >
              <LinearGradient
                colors={['#8b6914', colors.gold, '#8b6914']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.revealBtnGrad}
              >
                <Text style={styles.revealBtnText}>🃏 翻開我的角色牌</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Role reveal */}
        {showRoleCard && (
          <View style={[styles.roleRevealCard, isGood ? styles.roleRevealGood : styles.roleRevealEvil]}>
            <Text style={styles.roleRevealIcon}>{role.icon}</Text>
            <Text style={[styles.roleRevealName, isGood ? styles.nameGood : styles.nameEvil]}>
              {role.name}
            </Text>
            <Text style={[styles.roleRevealFaction, isGood ? styles.factionGood : styles.factionEvil]}>
              {isGood ? '◇ 光明陣營' : '◆ 黑暗陣營'}
            </Text>
            <Text style={styles.roleRevealAbility}>
              「{role.ability}」— {role.desc}
            </Text>
          </View>
        )}

        {/* Known info */}
        {showRoleCard && knownPlayers.length > 0 && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>你看見的情報</Text>
            {knownPlayers.map((k, i) => (
              <View key={i} style={styles.knownRow}>
                <View style={[styles.dot, k.dotType === 'evil' ? styles.dotEvil : styles.dotMystery]} />
                <Text style={styles.knownText}>{k.player.name} — {k.hint}</Text>
              </View>
            ))}
          </View>
        )}

        {showRoleCard && knownPlayers.length === 0 && isGood && player.role !== 'oberon' && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>情報</Text>
            <Text style={styles.mutedText}>你沒有特殊情報，信任你的隊友</Text>
          </View>
        )}

        {showRoleCard && player.role === 'oberon' && (
          <View style={[styles.infoBox, styles.infoBoxEvil]}>
            <Text style={[styles.infoTitle, { color: colors.evilRed }]}>孤狼警示</Text>
            <Text style={styles.oberonText}>
              你是邪惡陣營，但你不認識其他邪惡同伴，他們也不認識你。{'\n'}獨自行動，製造混亂。
            </Text>
          </View>
        )}

        {/* Next button */}
        {showRoleCard && (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => dispatch({ type: 'NEXT_NIGHT_PLAYER' })}
          >
            <Text style={styles.nextBtnText}>
              {isLast ? '✦ 天亮 — 開始遊戲' : '傳給下一位 →'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16 },

  nightCard: {
    backgroundColor: '#0a0a18',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  ornament: {
    fontFamily: fonts.accent,
    color: colors.gold,
    fontSize: 12,
    letterSpacing: 4,
    marginBottom: 16,
    opacity: 0.8,
  },
  playerName: {
    fontFamily: fonts.decorative,
    fontSize: 26,
    color: colors.goldLight,
    marginBottom: 8,
    textAlign: 'center',
  },
  passPrompt: {
    fontFamily: fonts.bodyItalic,
    fontSize: 14,
    color: 'rgba(232,223,192,0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  revealBtnWrap: { borderRadius: 4, overflow: 'hidden', width: '100%' },
  revealBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  revealBtnText: {
    fontFamily: fonts.accent,
    fontSize: 13,
    letterSpacing: 2,
    color: colors.deepBlue,
    fontWeight: '700',
  },

  roleRevealCard: {
    borderRadius: 10, padding: 20, marginBottom: 14,
    alignItems: 'center', borderWidth: 1,
  },
  roleRevealGood: { backgroundColor: '#0f2a0f', borderColor: 'rgba(100,180,100,0.4)' },
  roleRevealEvil: { backgroundColor: '#2a0a0a', borderColor: 'rgba(200,60,60,0.4)' },
  roleRevealIcon: { fontSize: 48, marginBottom: 8 },
  roleRevealName: { fontFamily: fonts.accent, fontSize: 22, marginBottom: 4 },
  nameGood: { color: colors.goodGreenLight },
  nameEvil: { color: colors.evilRedLight },
  roleRevealFaction: {
    fontFamily: fonts.accent, fontSize: 10,
    letterSpacing: 5, marginBottom: 10,
  },
  factionGood: { color: colors.goodGreen },
  factionEvil: { color: colors.evilRed },
  roleRevealAbility: {
    fontFamily: fonts.bodyItalic, fontSize: 13,
    color: 'rgba(232,223,192,0.8)', textAlign: 'center', lineHeight: 20,
  },

  infoBox: {
    padding: 14,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    marginBottom: 12,
  },
  infoBoxEvil: { borderColor: 'rgba(200,60,60,0.3)' },
  infoTitle: {
    fontFamily: fonts.accent, fontSize: 10,
    color: colors.gold, letterSpacing: 4, marginBottom: 8,
  },
  knownRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotEvil: { backgroundColor: colors.evilRed },
  dotMystery: { backgroundColor: colors.gold },
  knownText: { fontFamily: fonts.body, fontSize: 14, color: colors.textLight },
  mutedText: { fontFamily: fonts.bodyItalic, fontSize: 13, color: colors.textMuted },
  oberonText: { fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,180,180,0.85)', lineHeight: 20 },

  nextBtn: {
    backgroundColor: colors.slate,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextBtnText: {
    fontFamily: fonts.accent, fontSize: 13, letterSpacing: 2, color: colors.textLight,
  },
});
