import { useState, useCallback } from 'react'
import { api, ServerError } from '../api'
import { Redemption } from '../types'

export const useRedemptions = () => {
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRedemptions = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.getRedemptions()
      setRedemptions(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching redemptions:', err)
      setError(err instanceof ServerError ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    redemptions,
    loading,
    error,
    fetchRedemptions,
  }
}
