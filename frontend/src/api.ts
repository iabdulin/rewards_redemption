const API_URL = 'http://localhost:3000/api/v1'
import type { Reward as RewardType } from './types'

export type UserType = {
  name: string
  points_balance: number
  updated_at: string
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ServerError'
  }
}

export const api = {
  getCurrentUser: async (): Promise<UserType> => {
    const response = await fetch(`${API_URL}/users/current`)
    const data = await response.json()
    if (!response.ok) {
      throw new ServerError((data.errors || ['Unknown error']).join(', '))
    }
    return data
  },
  getRewards: async (): Promise<RewardType[]> => {
    const response = await fetch(`${API_URL}/rewards`)
    const data = await response.json()
    if (!response.ok) {
      throw new ServerError((data.errors || ['Unknown error']).join(', '))
    }
    return data
  },
  redeemReward: async (rewardId: number) => {
    const response = await fetch(`${API_URL}/redemptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reward_id: rewardId }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new ServerError((data.errors || ['Unknown error']).join(', '))
    }
    return data
  },
  getRedemptions: async () => {
    const response = await fetch(`${API_URL}/redemptions`)
    const data = await response.json()
    if (!response.ok) {
      throw new ServerError((data.errors || ['Unknown error']).join(', '))
    }
    return data
  },
}
