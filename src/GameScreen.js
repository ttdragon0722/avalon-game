import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useGame } from './context/GameContext';
import { colors } from './constants/colors';

import SetupScreen from './screens/SetupScreen';
import NightScreen from './screens/NightScreen';
import ProposeScreen from './screens/ProposeScreen';
import QuestVoteScreen from './screens/QuestVoteScreen';
import QuestResultScreen from './screens/QuestResultScreen';
import LakeScreen from './screens/LakeScreen';
import AssassinScreen from './screens/AssassinScreen';
import EndScreen from './screens/EndScreen';

export default function GameScreen() {
  const { state } = useGame();

  function renderPhase() {
    switch (state.phase) {
      case 'setup':        return <SetupScreen />;
      case 'night':        return <NightScreen />;
      case 'propose':      return <ProposeScreen />;
      case 'quest_vote':   return <QuestVoteScreen />;
      case 'quest_result': return <QuestResultScreen />;
      case 'lake':         return <LakeScreen />;
      case 'assassin':     return <AssassinScreen />;
      case 'end':          return <EndScreen />;
      default:             return <SetupScreen />;
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderPhase()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepBlue,
  },
});
