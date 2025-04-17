import logo from './assets/logo.webp'
import Balance from './components/Balance'
import RewardsList from './components/RewardsList'
import Redemptions from './components/Redemptions'
import { useState, useEffect, useCallback } from 'react'
import {
  useProfile,
  useRewards,
  useRedemptions,
  useRewardRedemption,
} from './hooks'

function App() {
  const [errors, setErrors] = useState<string[]>([])

  const { profile, error: profileError, fetchUserData } = useProfile()
  const { rewards, error: rewardsError, fetchRewards } = useRewards()
  const {
    redemptions,
    loading,
    error: redemptionsError,
    fetchRedemptions,
  } = useRedemptions()

  // Refresh all data after successful/failed redemption
  // failed redemption can happen in following cases:
  // 1. that a user's balance was updated behind the scenes
  // 2. that a reward is not available anymore (eg. deleted or marked as unavailable)
  const refreshAllData = useCallback(async () => {
    await fetchRedemptions()
    await fetchRewards()
    await fetchUserData()
  }, [fetchUserData, fetchRewards, fetchRedemptions])

  const { redeemReward } = useRewardRedemption(refreshAllData)

  useEffect(() => {
    const allErrors: string[] = []
    if (profileError) allErrors.push(profileError)
    if (rewardsError) allErrors.push(rewardsError)
    if (redemptionsError) allErrors.push(redemptionsError)

    setErrors([...new Set(allErrors)]) // deduplicate errors
  }, [profileError, rewardsError, redemptionsError])

  useEffect(() => {
    refreshAllData()
  }, [refreshAllData])

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
            {errors.join(', ')}
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
