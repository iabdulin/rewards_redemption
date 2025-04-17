import logo from './assets/logo.webp'
import Balance from './components/Balance'
import RewardsList from './components/RewardsList'
import Redemptions from './components/Redemptions'
import { Reward, ProfileType, DEFAULT_PROFILE, Redemption } from './types'
import { useState, useEffect, useCallback } from 'react'
import { api, ServerError } from './api'

function App() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [profile, setProfile] = useState<ProfileType>(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const handleError = (error: unknown) => {
    console.error('Error:', error)
    if (error instanceof ServerError) {
      return error.message
    } else {
      return 'Something went wrong'
    }
  }

  const fetchUserData = useCallback(async () => {
    try {
      const userData = await api.getCurrentUser()
      setProfile((prev) => ({
        ...prev,
        balance: userData.points_balance,
        name: userData.name,
        updated_at: userData.updated_at,
      }))
    } catch (error) {
      console.error('Error fetching user data:', error)
      setErrors((prev) => [
        ...prev,
        error instanceof Error ? error.message : 'Unknown error',
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRewards = useCallback(async () => {
    try {
      const rewardsData = await api.getRewards()
      setRewards(rewardsData)
    } catch (error) {
      console.error('Error fetching rewards:', error)
      setErrors((prev) => [
        ...prev,
        error instanceof Error ? error.message : 'Unknown error',
      ])
    }
  }, [])

  const fetchRedemptions = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.getRedemptions()
      setRedemptions(data)
    } catch (err) {
      setErrors((prev) => [
        ...prev,
        err instanceof Error ? err.message : 'Unknown error',
      ])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const redeemReward = useCallback(
    async (rewardId: number) => {
      try {
        await api.redeemReward(rewardId)
        await fetchRedemptions()
      } catch (error) {
        const errorMessage = handleError(error)
        alert(errorMessage)
        await fetchRewards() // in case a reward becomes unavailable
      } finally {
        setLoading(false)
        await fetchUserData()
      }
    },
    [fetchRewards, fetchUserData, fetchRedemptions],
  )

  useEffect(() => {
    setErrors([])
    fetchRedemptions()
    fetchRewards()
    fetchUserData()
  }, [fetchUserData, fetchRewards, fetchRedemptions])

  return (
    <div className="p-8">
      <header className="mb-4 flex items-center justify-center">
        <img src={logo} alt="Rewards Redemption Logo" className="w-60" />
      </header>

      <main>
        {errors.length > 0 && (
          <div
            className="text-center text-2xl text-red-500"
            role="alert"
            aria-live="assertive"
          >
            {[...new Set(errors)].join(',')}
          </div>
        )}

        {errors.length === 0 && (
          <div
            className="mx-auto max-w-7xl p-8 font-serif text-[#2d2417]"
            aria-busy={loading}
          >
            <Balance profile={profile} />
            <RewardsList
              rewards={rewards}
              balance={profile.balance}
              onRedeem={redeemReward}
            />
            <Redemptions redemptions={redemptions} loading={loading} />
          </div>
        )}
      </main>

      <footer className="mt-10 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Rewards Redemption</p>
      </footer>
    </div>
  )
}

export default App
