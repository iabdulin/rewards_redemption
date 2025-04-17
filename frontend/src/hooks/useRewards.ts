import { useState, useCallback } from 'react'
import { api } from '../api'
import { Reward } from '../types'

export const useRewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true)
      const rewardsData = await api.getRewards()
      setRewards(rewardsData)
      setError(null)
    } catch (err) {
      console.error('Error fetching rewards:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    rewards,
    loading,
    error,
    fetchRewards,
  }
}
