import { test, expect } from '@playwright/test'
import { RRPage } from './_support'

let rrPage: RRPage

test.describe('Fixtures', () => {
  test.beforeEach(async ({ page, request }) => {
    rrPage = new RRPage(page, request)
    await rrPage.fillDatabase()
    await page.goto('/')
  })

  test('validate all available rewards fixtures are loaded', async ({
    page,
  }) => {
    await expect(page.getByText('Welcome, Arthur Morgan!')).toBeVisible()
    await expect(rrPage.getBalance()).toHaveText('Your balance: 1000 pts')

    await expect(rrPage.getRewards()).toHaveCount(6)
    await expect(
      await rrPage.getRewards().getByTestId('name').allTextContents(),
    ).toEqual([
      'Leather Journal',
      'Rose Grey Bay Arabian',
      'Debt Collection',
      'Rolling Block Rifle',
      'Tennessee Walker Horse',
      'Yarrow Collection',
    ])
    await expect(
      await rrPage.getRewards().getByTestId('cost').allTextContents(),
    ).toEqual(['10 pts', '1250 pts', '-25 pts', '350 pts', '500 pts', 'free'])

    await expect(page.getByText('No redemptions found')).not.toBeVisible()
    await expect(page.getByText('Your Redemption History')).toBeVisible()
    await expect(rrPage.getRedemptions()).toHaveCount(1)
    await expect(rrPage.getRedemptions().first()).toContainText(
      'Leather Journal–10 points',
    )
  })
})
