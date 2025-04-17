import { Redemption } from '../types'
import hr from '../assets/hr.webp'

type RedemptionsProps = {
  redemptions: Redemption[]
  loading: boolean
}

export default function Redemptions({
  redemptions,
  loading,
}: RedemptionsProps) {
  if (redemptions.length === 0)
    return (
      <div role="region" aria-label="Redemption history" className="mt-10">
        <p>No redemptions found</p>
      </div>
    )

  return (
    <div
      className={`mt-10 ${loading ? 'opacity-50' : ''}`}
      role="region"
      aria-label="Redemption history"
      aria-busy={loading}
    >
      <img src={hr} alt="" className="mb-10 h-3.5 w-full" role="presentation" />
      <h2
        id="redemption-history-heading"
        className="mb-4 text-2xl font-bold text-shadow-sm"
      >
        Your Redemption History {loading ? '— loading...' : ''}
      </h2>
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse border-black"
          aria-labelledby="redemption-history-heading"
          aria-busy={loading}
        >
          <caption className="sr-only">
            Your history of redeemed rewards
          </caption>
          <thead>
            <tr className="border-b border-dotted border-black font-bold">
              <th scope="col" className="p-4 text-left">
                Reward
              </th>
              <th scope="col" className="p-4 text-right">
                Cost
              </th>
              <th scope="col" className="p-4 text-right">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {redemptions.map((redemption) => (
              <tr
                key={redemption.id}
                data-testid={`redemption-row`}
                tabIndex={0}
              >
                <td className="border-b border-dotted border-black p-4">
                  <div>{redemption.reward_name}</div>
                </td>
                <td className="border-b border-dotted border-black p-4 text-right">
                  {redemption.reward_cost != 0 ? (
                    <div>
                      {redemption.reward_cost > 0 ? '–' : '+'}
                      {Math.abs(redemption.reward_cost)} points
                    </div>
                  ) : (
                    <div>free</div>
                  )}
                </td>
                <td className="border-b border-dotted border-black p-4 text-right">
                  <time dateTime={redemption.created_at}>
                    {new Date(redemption.created_at).toLocaleDateString()}
                    <br />
                    {new Date(redemption.created_at).toLocaleTimeString()}
                  </time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
