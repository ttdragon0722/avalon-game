import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../constants/colors';
import { QUEST_SIZES, DOUBLE_FAIL_QUESTS } from '../constants/gameData';
import { useGame } from '../context/GameContext';

export default function ScoreTrack() {
  const { state } = useGame();
  const { playerCount, questResults, round, phase } = state;
  const sizes = QUEST_SIZES[playerCount];

  return (
    <View style={styles.track}>
      {[0, 1, 2, 3, 4].map(i => {
        const qr = questResults[i];
        const isCurrentRound = i === questResults.length && !['setup', 'night'].includes(phase);
        const needDouble = DOUBLE_FAIL_QUESTS[playerCount] === (i + 1);

        let gemStyle = styles.gemEmpty;
        let icon = '';
        let iconColor = colors.gold;

        if (qr) {
          if (qr.result === 'pass') {
            gemStyle = styles.gemGood;
            icon = '✓';
            iconColor = colors.goodGreenLight;
          } else {
            gemStyle = styles.gemEvil;
            icon = '✗';
            iconColor = colors.evilRedLight;
          }
        } else if (isCurrentRound) {
          gemStyle = styles.gemPending;
        }

        const sizeColor = isCurrentRound ? colors.goldLight : 'rgba(232,223,192,0.4)';
        const sizeFontWeight = isCurrentRound ? '700' : '400';

        return (
          <View key={i} style={styles.gemWrap}>
            <View style={[styles.gem, gemStyle]}>
              {needDouble && <Text style={styles.doubleMark}>✕²</Text>}
              {icon ? <Text style={[styles.gemIcon, { color: iconColor }]}>{icon}</Text> : null}
              {qr && qr.result === 'fail' && qr.failCount > 0 && (
                <View style={styles.failBadge}>
                  <Text style={styles.failBadgeText}>{qr.failCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.sizeLabel, { color: sizeColor, fontWeight: sizeFontWeight }]}>
              {sizes[i]}人
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginVertical: 8,
  },
  gemWrap: {
    alignItems: 'center',
    gap: 2,
  },
  gem: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gemEmpty: {
    backgroundColor: colors.stone,
    borderColor: 'rgba(201,168,76,0.2)',
  },
  gemGood: {
    backgroundColor: '#1a4a1a',
    borderColor: colors.goodGreen,
  },
  gemEvil: {
    backgroundColor: '#4a1010',
    borderColor: colors.evilRed,
  },
  gemPending: {
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderColor: 'rgba(201,168,76,0.5)',
  },
  gemIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  doubleMark: {
    position: 'absolute',
    top: -6,
    right: -6,
    fontSize: 8,
    color: colors.evilRedLight,
    lineHeight: 10,
  },
  failBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: colors.crimson,
    borderWidth: 1,
    borderColor: colors.evilRed,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  failBadgeText: {
    color: '#ffcccc',
    fontSize: 8,
    fontWeight: '700',
    fontFamily: fonts.accent,
  },
  sizeLabel: {
    fontSize: 9,
    fontFamily: fonts.accent,
  },
});
