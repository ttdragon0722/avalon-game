import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, fonts } from '../constants/colors';
import { useGame, getKnownInfo } from '../context/GameContext';
import { ROLES } from '../constants/gameData';

export default function ReviewCard() {
  const { state, dispatch } = useGame();
  const { reviewCardOpen, reviewCardPlayer, players } = state;

  const selectedPlayer = reviewCardPlayer ? players.find(p => p.id === reviewCardPlayer) : null;
  const selectedRole = selectedPlayer ? ROLES[selectedPlayer.role] : null;
  const knownPlayers = selectedPlayer ? getKnownInfo(selectedPlayer, players) : [];

  const isGood = selectedRole?.faction === 'good';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.toggleRow, reviewCardOpen && styles.toggleRowOpen]}
        onPress={() => dispatch({ type: 'TOGGLE_REVIEW_CARD' })}
      >
        <Text style={styles.toggleLabel}>🔍 忘記資訊？重新看牌</Text>
        <Text style={[styles.arrow, { transform: [{ rotate: reviewCardOpen ? '180deg' : '0deg' }] }]}>▾</Text>
      </TouchableOpacity>

      {reviewCardOpen && (
        <View style={styles.content}>
          {/* Player chips */}
          <View style={styles.chipRow}>
            {players.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[styles.chip, reviewCardPlayer === p.id && styles.chipSelected]}
                onPress={() => dispatch({ type: 'SET_REVIEW_PLAYER', playerId: p.id })}
              >
                <Text style={[styles.chipText, reviewCardPlayer === p.id && styles.chipTextSelected]}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {!selectedPlayer ? (
            <Text style={styles.placeholder}>選擇玩家查看角色</Text>
          ) : (
            <View>
              {/* Role card */}
              <View style={[styles.roleCard, isGood ? styles.roleCardGood : styles.roleCardEvil]}>
                <Text style={styles.roleIcon}>{selectedRole.icon}</Text>
                <Text style={[styles.roleName, isGood ? styles.roleNameGood : styles.roleNameEvil]}>
                  {selectedRole.name}
                </Text>
                <Text style={[styles.roleFaction, isGood ? styles.factionGood : styles.factionEvil]}>
                  {isGood ? '◇ 光明陣營' : '◆ 黑暗陣營'}
                </Text>
                <Text style={styles.roleAbility}>
                  「{selectedRole.ability}」— {selectedRole.desc}
                </Text>
              </View>

              {/* Known info */}
              {knownPlayers.length > 0 && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>你看見的情報</Text>
                  {knownPlayers.map((k, i) => (
                    <View key={i} style={styles.knownRow}>
                      <View style={[styles.dot, k.dotType === 'evil' ? styles.dotEvil : k.dotType === 'mystery' ? styles.dotMystery : styles.dotGood]} />
                      <Text style={styles.knownText}>{k.player.name} — {k.hint}</Text>
                    </View>
                  ))}
                </View>
              )}

              {selectedPlayer.role === 'oberon' && (
                <View style={[styles.infoBox, styles.infoBoxEvil]}>
                  <Text style={[styles.infoTitle, { color: colors.evilRed }]}>孤狼警示</Text>
                  <Text style={styles.oberonText}>你不認識邪惡同伴，他們也不認識你。</Text>
                </View>
              )}

              {knownPlayers.length === 0 && isGood && selectedPlayer.role !== 'oberon' && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>情報</Text>
                  <Text style={styles.mutedText}>沒有特殊情報，信任你的隊友</Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(42,53,80,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toggleRowOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  toggleLabel: {
    fontFamily: fonts.accent,
    fontSize: 11,
    letterSpacing: 2,
    color: 'rgba(232,223,192,0.7)',
  },
  arrow: { fontSize: 14, color: colors.gold },
  content: {
    backgroundColor: 'rgba(10,14,26,0.8)',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(201,168,76,0.2)',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    padding: 12,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(42,53,80,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
  },
  chipSelected: {
    backgroundColor: 'rgba(201,168,76,0.25)',
    borderColor: colors.gold,
  },
  chipText: { fontFamily: fonts.accent, fontSize: 11, color: colors.textMuted },
  chipTextSelected: { color: colors.goldLight },
  placeholder: {
    textAlign: 'center',
    color: 'rgba(232,223,192,0.4)',
    fontStyle: 'italic',
    fontFamily: fonts.body,
    fontSize: 13,
    paddingVertical: 8,
  },
  roleCard: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  roleCardGood: {
    backgroundColor: '#0f2a0f',
    borderColor: 'rgba(100,180,100,0.4)',
  },
  roleCardEvil: {
    backgroundColor: '#2a0a0a',
    borderColor: 'rgba(200,60,60,0.4)',
  },
  roleIcon: { fontSize: 36, marginBottom: 6 },
  roleName: { fontFamily: fonts.accent, fontSize: 18, marginBottom: 4 },
  roleNameGood: { color: colors.goodGreenLight },
  roleNameEvil: { color: colors.evilRedLight },
  roleFaction: { fontFamily: fonts.accent, fontSize: 10, letterSpacing: 4, marginBottom: 8 },
  factionGood: { color: colors.goodGreen },
  factionEvil: { color: colors.evilRed },
  roleAbility: {
    fontFamily: fonts.bodyItalic,
    fontSize: 13,
    color: 'rgba(232,223,192,0.8)',
    textAlign: 'center',
  },
  infoBox: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    marginTop: 6,
  },
  infoBoxEvil: { borderColor: 'rgba(200,60,60,0.3)' },
  infoTitle: {
    fontFamily: fonts.accent,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 3,
    marginBottom: 8,
  },
  knownRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotEvil: { backgroundColor: colors.evilRed },
  dotGood: { backgroundColor: colors.goodGreen },
  dotMystery: { backgroundColor: colors.gold },
  knownText: { fontFamily: fonts.body, fontSize: 13, color: colors.textLight },
  oberonText: { fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,180,180,0.85)' },
  mutedText: { fontFamily: fonts.bodyItalic, fontSize: 13, color: colors.textMuted },
});
