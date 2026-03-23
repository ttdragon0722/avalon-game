import { SafeAreaView, StyleSheet } from 'react-native';
import { useGame } from '../src/context/GameContext';

import SetupScreen from '../src/screens/SetupScreen';
import NightScreen from '../src/screens/NightScreen';
import ProposeScreen from '../src/screens/ProposeScreen';
import QuestVoteScreen from '../src/screens/QuestVoteScreen';
import QuestResultScreen from '../src/screens/QuestResultScreen';
import LakeScreen from '../src/screens/LakeScreen';
import AssassinScreen from '../src/screens/AssassinScreen';
import EndScreen from '../src/screens/EndScreen';

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
    backgroundColor: '#0a0e1a',
  },
});
