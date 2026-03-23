import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../constants/colors';
import { useGame } from '../context/GameContext';
import { ROLES } from '../constants/gameData';
import Header from '../components/Header';

export default function AssassinScreen() {
  const { state, dispatch } = useGame();
  const { players, selectedAssassinTarget } = state;
  const goodPlayers = players.filter(p => ROLES[p.role].faction === 'good');
  const targetPlayer = selectedAssassinTarget ? players.find(p => p.id === selectedAssassinTarget) : null;

  return (
    <LinearGradient colors={['#0a0005', colors.crimson + '22', colors.deepBlue]} style={styles.screen}>
      <Header title="刺客出動" subtitle="最後的機會" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Assassin portrait */}
        <View style={styles.portrait}>
          <Text style={styles.portraitIcon}>🗡️</Text>
          <Text style={styles.portraitTitle}>◆ 黑暗刺客 ◆</Text>
        </View>

        {/* Instruction */}
        <View style={styles.instruction}>
          <Text style={styles.instructionText}>
            好人完成了三項任務，但戰爭尚未結束。{'\n'}刺客，你有最後一次機會——{'\n'}若你能找出梅林，黑暗將重新統治一切。
          </Text>
        </View>

        {/* Section label */}
        <View style={styles.sectionLabelRow}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionLabelText}>指定目標（好人陣營）</Text>
          <View style={styles.sectionLine} />
        </View>

        {/* Player list */}
        <View style={styles.playerList}>
          {goodPlayers.map(p => {
            const isSel = selectedAssassinTarget === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.playerItem, isSel && styles.playerItemSelected]}
                onPress={() => dispatch({ type: 'SET_ASSASSIN_TARGET', playerId: p.id })}
              >
                <View style={[styles.avatar, isSel && styles.avatarSelected]}>
                  <Text style={styles.avatarText}>{p.name[0] || '?'}</Text>
                </View>
                <Text style={styles.playerName}>{p.name}</Text>
                {isSel && <Text style={styles.daggerMark}>🗡️</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Assassinate button */}
        <TouchableOpacity
          style={[styles.assassinBtn, !selectedAssassinTarget && styles.assassinBtnDisabled]}
          disabled={!selectedAssassinTarget}
          onPress={() => selectedAssassinTarget && dispatch({ type: 'CONFIRM_ASSASSINATE' })}
        >
          <LinearGradient
            colors={selectedAssassinTarget ? ['#5a0f0f', colors.crimson] : [colors.stone, colors.stone]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.assassinBtnGrad}
          >
            <Text style={styles.assassinBtnText}>
              {selectedAssassinTarget
                ? `🗡️ 刺殺 ${targetPlayer?.name}`
                : '選擇目標'}
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

  portrait: { alignItems: 'center', marginVertical: 20 },
  portraitIcon: { fontSize: 60, marginBottom: 8 },
  portraitTitle: {
    fontFamily: fonts.accent, fontSize: 10, color: colors.evilRed,
    letterSpacing: 4,
  },

  instruction: {
    backgroundColor: 'rgba(80,20,20,0.3)',
    borderWidth: 1, borderColor: 'rgba(200,60,60,0.3)',
    borderRadius: 8, padding: 14, marginBottom: 20,
  },
  instructionText: {
    fontFamily: fonts.bodyItalic, fontSize: 14,
    color: 'rgba(255,200,200,0.9)', textAlign: 'center', lineHeight: 22,
  },

  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(200,60,60,0.3)' },
  sectionLabelText: { fontFamily: fonts.accent, fontSize: 10, color: colors.evilRed, letterSpacing: 3 },

  playerList: { gap: 8, marginBottom: 20 },
  playerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: 6,
    borderWidth: 1, borderColor: 'rgba(200,60,60,0.2)',
    backgroundColor: 'rgba(80,20,20,0.2)',
  },
  playerItemSelected: {
    borderColor: 'rgba(200,60,60,0.7)',
    backgroundColor: 'rgba(80,20,20,0.5)',
  },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(80,20,20,0.5)',
    borderWidth: 1, borderColor: 'rgba(200,60,60,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarSelected: { backgroundColor: 'rgba(139,26,26,0.8)', borderColor: colors.evilRed },
  avatarText: { fontFamily: fonts.accent, fontSize: 14, color: colors.evilRed },
  playerName: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.textLight },
  daggerMark: { fontSize: 18 },

  assassinBtn: { borderRadius: 4, overflow: 'hidden' },
  assassinBtnDisabled: { opacity: 0.4 },
  assassinBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  assassinBtnText: {
    fontFamily: fonts.accent, fontSize: 13, letterSpacing: 2,
    color: '#ffcccc', fontWeight: '700',
  },
});
