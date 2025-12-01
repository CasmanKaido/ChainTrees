export const QUEST_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  LIFETIME: 'lifetime'
}

export const QUEST_TEMPLATES = [
  {
    id: 'plant_1',
    type: QUEST_TYPES.DAILY,
    title: 'Green Thumb',
    description: 'Plant 1 tree today',
    target: 1,
    action: 'MINT_TREE',
    reward: { xp: 50, tokens: 5 }
  },
  {
    id: 'water_3',
    type: QUEST_TYPES.DAILY,
    title: 'Hydration Hero',
    description: 'Water 3 trees',
    target: 3,
    action: 'WATER_TREE',
    reward: { xp: 30, tokens: 2 }
  },
  {
    id: 'login_streak',
    type: QUEST_TYPES.WEEKLY,
    title: 'Consistent Planter',
    description: 'Login 5 days in a row',
    target: 5,
    action: 'DAILY_LOGIN',
    reward: { xp: 200, tokens: 20 }
  },
  {
    id: 'refer_friend',
    type: QUEST_TYPES.LIFETIME,
    title: 'Community Builder',
    description: 'Refer 1 friend',
    target: 1,
    action: 'REFERRAL',
    reward: { xp: 500, tokens: 50 }
  }
]
