import { useState } from 'react'
import type { Reward } from '../types'

type RewardProps = {
  reward: Reward
  balance: number
  onRedeem: (rewardId: number) => void
}

export default function Reward({ reward, onRedeem, balance }: RewardProps) {
  const canRedeem = balance >= reward.cost
  const [loading, setLoading] = useState<boolean>(false)

  const isEnabled = canRedeem && !loading

  const getButtonLabel = () => {
    if (loading) return 'Redeeming...'
    if (canRedeem) return 'Redeem'
    return `Need ${reward.cost - balance} more pts`
  }

  const buttonLabel = getButtonLabel()

  const handleRedeem = async () => {
    if (isEnabled) {
      setLoading(true)
      try {
        await onRedeem(reward.id)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (isEnabled) {
        handleRedeem()
      }
    }
  }

  return (
    <div
      key={reward.id}
      className="relative flex flex-col justify-between overflow-hidden border-[2px] border-dashed border-[#2d2417] p-6 hover:border-solid"
      data-testid={`reward-${reward.id}`}
      role="listitem"
      aria-labelledby={`reward-title-${reward.id}`}
    >
      <h2
        id={`reward-title-${reward.id}`}
        data-testid="name"
        className="mb-4 text-3xl font-bold tracking-wider text-[#2d2417] uppercase text-shadow-sm"
      >
        {reward.name}
      </h2>
      <p
        data-testid="description"
        className="text-base leading-relaxed"
        id={`reward-desc-${reward.id}`}
      >
        {reward.description}
      </p>
      <div
        data-testid="cost"
        className="mt-4 font-bold text-primary text-shadow-sm"
        aria-label={`Cost: ${reward.cost !== 0 ? `${reward.cost} points` : 'free'}`}
      >
        {reward.cost !== 0 ? `${reward.cost} pts` : 'free'}
      </div>
      <button
        className={`mt-4 cursor-pointer bg-primary px-4 py-2 text-white transition-colors *:rounded-md hover:bg-[#a22222] disabled:cursor-not-allowed disabled:bg-gray-400`}
        disabled={!isEnabled}
        onClick={handleRedeem}
        onKeyDown={handleKeyDown}
        aria-busy={loading}
        aria-disabled={!isEnabled}
        aria-describedby={!canRedeem ? `reward-cost-${reward.id}` : undefined}
      >
        {buttonLabel}
      </button>
      {!canRedeem && (
        <span id={`reward-cost-${reward.id}`} className="sr-only">
          You need {reward.cost - balance} more points to redeem this reward
        </span>
      )}
    </div>
  )
}
