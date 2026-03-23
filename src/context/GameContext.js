import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROLES, DEFAULT_ROLES_BY_COUNT, QUEST_SIZES, DOUBLE_FAIL_QUESTS, FACTION_COUNTS } from '../constants/gameData';

// ─── helpers ────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRole(id) { return ROLES[id]; }

export function getKnownInfo(player, players) {
  const role = getRole(player.role);
  const known = [];
  if (player.role === 'merlin') {
    players.forEach(p => {
      if (p.id !== player.id) {
        const pr = getRole(p.role);
        if (pr.faction === 'evil' && p.role !== 'mordred') {
          known.push({ player: p, hint: '邪惡', dotType: 'evil' });
        }
      }
    });
  } else if (player.role === 'percival') {
    players.forEach(p => {
      if (p.id !== player.id && (p.role === 'merlin' || p.role === 'morgana')) {
        known.push({ player: p, hint: '預言者之一', dotType: 'mystery' });
      }
    });
  } else if (player.role === 'oberon') {
    // sees nobody
  } else if (role.faction === 'evil') {
    players.forEach(p => {
      if (p.id !== player.id && getRole(p.role).faction === 'evil' && p.role !== 'oberon') {
        known.push({ player: p, hint: '邪惡同伴', dotType: 'evil' });
      }
    });
  }
  return known;
}

export function questSizeFor(playerCount, round) {
  return QUEST_SIZES[playerCount][round - 1];
}

export function needsDoubleFail(playerCount, round) {
  return DOUBLE_FAIL_QUESTS[playerCount] === round;
}

export function countQuestResults(questResults) {
  const pass = questResults.filter(r => r.result === 'pass').length;
  const fail = questResults.filter(r => r.result === 'fail').length;
  return { pass, fail };
}

// ─── initial state ───────────────────────────────────
function makeInitialState(playerNames) {
  return {
    phase: 'setup',
    players: [],
    playerCount: 6,
    playerNames: playerNames || Array.from({ length: 10 }, (_, i) => `玩家${i + 1}`),
    maxRejectCount: 5,
    useLake: false,
    lakePlayerIndex: -1,

    round: 1,
    leaderIndex: 0,
    proposedTeam: [],
    questPhase: { teamMembers: [], currentIndex: 0, votes: [] },
    questResults: [],
    rejectCount: 0,
    nightIndex: 0,

    lakePhase: null,
    lakeTargetId: null,
    lakeRevealResult: null,

    selectedAssassinTarget: null,
    gameEndReason: '',
    winner: '',

    showRoleCard: false,
    questVoteUnlocked: null,
    confirmReset: false,
    reviewCardOpen: false,
    reviewCardPlayer: null,
  };
}

// ─── reducer ────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_PLAYER_NAMES':
      return { ...state, playerNames: action.names };

    case 'SET_PLAYER_COUNT':
      return { ...state, playerCount: action.count, useLake: action.count < 7 ? false : state.useLake };

    case 'SET_MAX_REJECT':
      return { ...state, maxRejectCount: action.count };

    case 'TOGGLE_LAKE':
      return { ...state, useLake: !state.useLake };

    case 'START_GAME': {
      const { playerCount, playerNames, useLake, maxRejectCount } = state;
      const preset = DEFAULT_ROLES_BY_COUNT[playerCount];
      const rolePool = shuffle([...preset.good, ...preset.evil]);
      const players = playerNames.slice(0, playerCount).map((name, i) => ({
        id: `p${i}`,
        name: name || `玩家${i + 1}`,
        role: rolePool[i],
      }));
      const leaderIndex = Math.floor(Math.random() * playerCount);
      const lakePlayerIndex = (useLake && playerCount >= 7)
        ? (leaderIndex - 1 + playerCount) % playerCount
        : -1;
      return {
        ...state,
        phase: 'night',
        players,
        round: 1,
        leaderIndex,
        proposedTeam: [],
        questResults: [],
        rejectCount: 0,
        nightIndex: 0,
        showRoleCard: false,
        questVoteUnlocked: null,
        lakePhase: null,
        lakeTargetId: null,
        lakeRevealResult: null,
        lakePlayerIndex,
        selectedAssassinTarget: null,
        gameEndReason: '',
        winner: '',
        confirmReset: false,
        reviewCardOpen: false,
        reviewCardPlayer: null,
      };
    }

    case 'REVEAL_NIGHT_CARD':
      return { ...state, showRoleCard: true };

    case 'NEXT_NIGHT_PLAYER': {
      const next = state.nightIndex + 1;
      if (next >= state.playerCount) {
        return { ...state, showRoleCard: false, nightIndex: 0, phase: 'propose' };
      }
      return { ...state, showRoleCard: false, nightIndex: next };
    }

    case 'TOGGLE_TEAM_MEMBER': {
      const { playerId } = action;
      const size = questSizeFor(state.playerCount, state.round);
      const idx = state.proposedTeam.indexOf(playerId);
      if (idx >= 0) {
        return { ...state, proposedTeam: state.proposedTeam.filter(id => id !== playerId) };
      } else if (state.proposedTeam.length < size) {
        return { ...state, proposedTeam: [...state.proposedTeam, playerId] };
      }
      return state;
    }

    case 'CONFIRM_TEAM':
      return {
        ...state,
        phase: 'quest_vote',
        questPhase: {
          teamMembers: [...state.proposedTeam],
          currentIndex: 0,
          votes: [],
        },
      };

    case 'PASS_LEADER':
      return {
        ...state,
        leaderIndex: (state.leaderIndex + 1) % state.playerCount,
        proposedTeam: [],
      };

    case 'SUBMIT_QUEST_VOTE': {
      const { vote } = action;
      const newVotes = [...state.questPhase.votes, vote];
      const newIndex = state.questPhase.currentIndex + 1;
      if (newIndex >= state.questPhase.teamMembers.length) {
        const fails = newVotes.filter(v => v === 'fail').length;
        const required = needsDoubleFail(state.playerCount, state.round) ? 2 : 1;
        const result = fails < required ? 'pass' : 'fail';
        return {
          ...state,
          questVoteUnlocked: null,
          questPhase: {
            ...state.questPhase,
            votes: newVotes,
            currentIndex: newIndex,
            result,
            failCount: fails,
          },
          questResults: [
            ...state.questResults,
            { result, failCount: fails },
          ],
          phase: 'quest_result',
        };
      }
      return {
        ...state,
        questVoteUnlocked: null,
        questPhase: {
          ...state.questPhase,
          votes: newVotes,
          currentIndex: newIndex,
        },
      };
    }

    case 'UNLOCK_QUEST_VOTE':
      return { ...state, questVoteUnlocked: action.playerId };

    case 'CONFIRM_QUEST_RESULT': {
      const { pass, fail } = countQuestResults(state.questResults);
      if (fail >= 3) {
        return { ...state, winner: 'evil', gameEndReason: 'quests', phase: 'end' };
      }
      if (pass >= 3) {
        const hasAssassin = state.players.some(p => p.role === 'assassin');
        if (hasAssassin) {
          return { ...state, phase: 'assassin', selectedAssassinTarget: null };
        }
        return { ...state, winner: 'good', gameEndReason: 'quests', phase: 'end' };
      }
      // Next round — check lake
      const lakeTriggerRounds = [2, 3, 4];
      if (state.useLake && state.lakePlayerIndex >= 0 && lakeTriggerRounds.includes(state.round)) {
        return { ...state, lakePhase: 'pick', lakeTargetId: null, phase: 'lake' };
      }
      return {
        ...state,
        round: state.round + 1,
        leaderIndex: (state.leaderIndex + 1) % state.playerCount,
        proposedTeam: [],
        phase: 'propose',
      };
    }

    case 'SET_LAKE_TARGET':
      return { ...state, lakeTargetId: action.playerId };

    case 'CONFIRM_LAKE_CHECK': {
      const target = state.players.find(p => p.id === state.lakeTargetId);
      const result = getRole(target.role).faction;
      return { ...state, lakePhase: 'reveal', lakeRevealResult: result };
    }

    case 'CONFIRM_LAKE_RESULT': {
      const newLakeIndex = state.players.findIndex(p => p.id === state.lakeTargetId);
      return {
        ...state,
        lakePlayerIndex: newLakeIndex,
        lakePhase: null,
        lakeTargetId: null,
        lakeRevealResult: null,
        round: state.round + 1,
        leaderIndex: (state.leaderIndex + 1) % state.playerCount,
        proposedTeam: [],
        phase: 'propose',
      };
    }

    case 'SET_ASSASSIN_TARGET':
      return { ...state, selectedAssassinTarget: action.playerId };

    case 'CONFIRM_ASSASSINATE': {
      const target = state.players.find(p => p.id === state.selectedAssassinTarget);
      const winner = target.role === 'merlin' ? 'evil' : 'good';
      return { ...state, winner, gameEndReason: 'assassin', phase: 'end' };
    }

    case 'SET_REJECT_COUNT':
      return { ...state, rejectCount: action.count };

    case 'SET_CONFIRM_RESET':
      return { ...state, confirmReset: action.value };

    case 'RESET_TO_SETUP':
      return {
        ...makeInitialState(state.playerNames),
        playerNames: state.playerNames,
      };

    case 'TOGGLE_REVIEW_CARD':
      return {
        ...state,
        reviewCardOpen: !state.reviewCardOpen,
        reviewCardPlayer: !state.reviewCardOpen ? null : state.reviewCardPlayer,
      };

    case 'SET_REVIEW_PLAYER':
      return { ...state, reviewCardPlayer: action.playerId };

    default:
      return state;
  }
}

// ─── context ────────────────────────────────────────
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, makeInitialState());

  // Load player names from storage on mount
  useEffect(() => {
    AsyncStorage.getItem('avalon_player_names').then(saved => {
      if (saved) {
        try {
          dispatch({ type: 'SET_PLAYER_NAMES', names: JSON.parse(saved) });
        } catch {}
      }
    });
  }, []);

  // Save player names whenever they change
  useEffect(() => {
    AsyncStorage.setItem('avalon_player_names', JSON.stringify(state.playerNames)).catch(() => {});
  }, [state.playerNames]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
