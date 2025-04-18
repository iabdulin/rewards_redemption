import { type Reward as RewardType } from '../types'
import Reward from './Reward'

type RewardsListProps = {
  rewards: RewardType[]
  balance: number
  onRedeem: (rewardId: number) => void
}

export default function RewardsList({
  rewards,
  balance,
  onRedeem,
}: RewardsListProps) {
  return (
    <section aria-labelledby="rewards-heading">
      <h2 id="rewards-heading" className="mb-6 text-2xl font-bold">
        Available Rewards
      </h2>
      <div
        className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"
        role="list"
        aria-label="Available rewards"
      >
        {rewards.map((reward) => (
          <Reward
            reward={reward}
            balance={balance}
            onRedeem={onRedeem}
            key={reward.id}
          />
        ))}
      </div>
    </section>
  )
}
