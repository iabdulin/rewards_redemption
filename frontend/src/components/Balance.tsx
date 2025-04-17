import { ProfileType } from '../types'

export default function Balance({ profile }: { profile: ProfileType }) {
  const { name, balance } = profile

  return (
    <div
      className="mb-4 text-2xl"
      role="region"
      aria-label="User balance information"
    >
      <p>
        <span>Welcome, {name}!</span>
        <span
          className="mt-1 block font-bold"
          data-testid="balance"
          aria-live="polite"
        >
          Your balance: {balance} pts
        </span>
      </p>
    </div>
  )
}
