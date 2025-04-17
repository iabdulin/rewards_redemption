import { useState, useCallback } from 'react'
import { api, ServerError } from '../api'

export const useRewardRedemption = (onFinish: () => Promise<void>) => {
  const [loading, setLoading] = useState(false)

  const handleError = (error: unknown) => {
    console.error('Error:', error)
    if (error instanceof ServerError) {
      return error.message
    } else {
      return 'Something went wrong'
    }
  }

  const redeemReward = useCallback(
    async (rewardId: number) => {
      try {
        setLoading(true)
        await api.redeemReward(rewardId)
      } catch (error) {
        const errorMessage = handleError(error)
        alert(errorMessage)
      } finally {
        await onFinish()
        setLoading(false)
      }
    },
    [onFinish],
  )

  return {
    redeemReward,
    loading,
  }
}
