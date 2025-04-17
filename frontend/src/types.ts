export type Redemption = {
  id: number
  reward_name: string
  reward_cost: number
  created_at: string
}

export type Reward = {
  id: number
  name: string
  description: string
  cost: number
  available: boolean
}

export type ProfileType = {
  balance: number
  name: string
  updated_at: string
  redeemReward?: (rewardId: number) => void
  fetchRewards?: () => Promise<Reward[]>
}

export const DEFAULT_PROFILE: ProfileType = {
  balance: 0,
  name: 'Guest',
  updated_at: '',
}
