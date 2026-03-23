export const ROLES = {
  merlin:   { id: 'merlin',   name: '梅林',     icon: '🧙',  faction: 'good', desc: '知道所有邪惡玩家（莫德雷德除外）', ability: '知曉邪惡' },
  percival: { id: 'percival', name: '派西維爾',  icon: '⚔️',  faction: 'good', desc: '知道梅林與摩甘娜（但分不清）',     ability: '識別預言者' },
  loyal:    { id: 'loyal',    name: '忠誠騎士',  icon: '🛡️',  faction: 'good', desc: '忠心侍奉亞瑟王',                   ability: '無特殊能力' },
  morgana:  { id: 'morgana',  name: '摩甘娜',    icon: '🌙',  faction: 'evil', desc: '對派西維爾偽裝成梅林',             ability: '偽裝預言者' },
  mordred:  { id: 'mordred',  name: '莫德雷德',  icon: '💀',  faction: 'evil', desc: '梅林看不到你，你看得到邪惡同伴',   ability: '隱身於梅林' },
  oberon:   { id: 'oberon',   name: '奧伯倫',    icon: '🌑',  faction: 'evil', desc: '你不認識邪惡同伴，他們也不認識你；梅林看得到你', ability: '孤狼黑暗' },
  assassin: { id: 'assassin', name: '刺客',      icon: '🗡️',  faction: 'evil', desc: '認識所有邪惡同伴，遊戲結束時可刺殺梅林', ability: '刺殺梅林' },
  minion:   { id: 'minion',   name: '邪惡爪牙',  icon: '👤',  faction: 'evil', desc: '認識所有邪惡同伴（奧伯倫除外）',  ability: '無特殊能力' },
};

export const DEFAULT_ROLES_BY_COUNT = {
  5:  { good: ['merlin', 'percival', 'loyal'],                           evil: ['morgana', 'assassin'] },
  6:  { good: ['merlin', 'percival', 'loyal', 'loyal'],                  evil: ['morgana', 'assassin'] },
  7:  { good: ['merlin', 'percival', 'loyal', 'loyal'],                  evil: ['morgana', 'assassin', 'oberon'] },
  8:  { good: ['merlin', 'percival', 'loyal', 'loyal', 'loyal'],         evil: ['morgana', 'assassin', 'minion'] },
  9:  { good: ['merlin', 'percival', 'loyal', 'loyal', 'loyal', 'loyal'],evil: ['morgana', 'assassin', 'mordred'] },
  10: { good: ['merlin', 'percival', 'loyal', 'loyal', 'loyal', 'loyal'],evil: ['morgana', 'assassin', 'oberon', 'mordred'] },
};

export const QUEST_SIZES = {
  5:  [2, 3, 2, 3, 3],
  6:  [2, 3, 4, 3, 4],
  7:  [2, 3, 3, 4, 4],
  8:  [3, 4, 4, 5, 5],
  9:  [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5],
};

// Round index (1-based) that requires 2 fail votes to fail the quest
export const DOUBLE_FAIL_QUESTS = { 7: 4, 8: 4, 9: 4, 10: 4 };

// [goodCount, evilCount]
export const FACTION_COUNTS = {
  5: [3, 2], 6: [4, 2], 7: [4, 3], 8: [5, 3], 9: [6, 3], 10: [6, 4],
};
