import { useState, useCallback } from 'react'
import { api, ServerError } from '../api'
import { ProfileType, DEFAULT_PROFILE } from '../types'

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileType>(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true)
      const userData = await api.getCurrentUser()
      setProfile((prev) => ({
        ...prev,
        balance: userData.points_balance,
        name: userData.name,
        updated_at: userData.updated_at,
      }))
      setError(null)
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError(err instanceof ServerError ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    profile,
    loading,
    error,
    fetchUserData,
  }
}
