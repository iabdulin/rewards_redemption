import { Page, APIRequestContext, expect, Locator } from '@playwright/test'

const API_URL = 'http://localhost:3000'

export class RRPage {
  constructor(
    private page: Page,
    private request: APIRequestContext,
  ) {}

  getBalance(): Locator {
    return this.page.getByTestId('balance')
  }

  getRewards(): Locator {
    return this.page.getByTestId(/reward-/)
  }

  getReward(id: string): Locator {
    return this.page.getByTestId(`reward-${id}`)
  }

  getRedemptions(): Locator {
    return this.page.getByTestId('redemption-row')
  }

  async clearDatabase(): Promise<void> {
    const response = await this.request.delete(`${API_URL}/test/clear_database`)
    expect(response.status()).toBe(200)
  }

  async fillDatabase(fixtures?: string[]): Promise<void> {
    const response = await this.request.post(`${API_URL}/test/fill_database`, {
      data: { fixtures },
    })
    expect(response.status()).toBe(200)
  }

  async updateBalance(points_balance: number): Promise<void> {
    const response = await this.request.patch(
      `${API_URL}/test/update_balance`,
      {
        data: { points_balance },
      },
    )
    expect(response.status()).toBe(200)
  }

  async updateRewardAvailability(
    reward_id: string,
    available: boolean,
  ): Promise<void> {
    const response = await this.request.patch(
      `${API_URL}/test/update_reward_availability`,
      {
        data: { reward_id, available },
      },
    )
    expect(response.status()).toBe(200)
  }

  async deleteReward(reward_id: string): Promise<void> {
    const response = await this.request.delete(
      `${API_URL}/test/delete_reward`,
      {
        data: { reward_id },
      },
    )
    expect(response.status()).toBe(200)
  }
}
