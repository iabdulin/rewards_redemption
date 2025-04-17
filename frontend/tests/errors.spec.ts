import { test, expect, Locator } from '@playwright/test'
import { RRPage } from './_support'

let rrPage: RRPage
let $balance: Locator
let $redemptions: Locator
let $rewards: Locator
const ROLLING_BLOCK_RIFLE_ID = '569598337'

test.beforeEach(async ({ page, request }) => {
  rrPage = new RRPage(page, request)
  await rrPage.fillDatabase()
  await page.goto('/')
  $balance = rrPage.getBalance()
  $redemptions = rrPage.getRedemptions()
  $rewards = rrPage.getRewards()
})

test.describe('Errors', () => {
  test('should show error when user has insufficient balance', async ({
    page,
  }) => {
    await expect($balance).toContainText('1000 pts')
    const reward = rrPage.getReward(ROLLING_BLOCK_RIFLE_ID) // cost 350 pts
    await expect(reward.getByTestId('cost')).toHaveText('350 pts')
    await expect(reward.locator('button')).not.toBeDisabled()
    await expect($rewards.locator('button[disabled]')).toHaveCount(1)
    await expect($rewards.locator('button:not([disabled])')).toHaveCount(5)

    // Update the balance to 123 pts directly via test API
    await rrPage.updateBalance(123)

    // try to redeem the reward
    page.on('dialog', (dialog) => {
      expect(dialog.message()).toContain(
        'Insufficient balance: user has 123 points, reward costs 350 points',
      )
      dialog.dismiss()
    })
    await reward.locator('button').click()

    // The page updated the balance & disabled rewards
    await expect($balance).toContainText('123 pts')
    await expect(reward.locator('button')).toBeDisabled() // the button is disabled now
    await expect(reward.locator('button')).toHaveText('Need 227 more pts')
    await expect($rewards.locator('button[disabled]')).toHaveCount(3)
    await expect($rewards.locator('button:not([disabled])')).toHaveCount(3)
    await expect($redemptions).toHaveCount(1) // nothing changed
  })

  test('should show error when trying to redeem unavailable reward', async ({
    page,
  }) => {
    await expect($rewards).toHaveCount(6)
    const reward = rrPage.getReward(ROLLING_BLOCK_RIFLE_ID)
    await expect(page.getByText('Rolling Block Rifle')).toBeVisible()

    // Simulate making reward unavailable via direct API call
    await rrPage.updateRewardAvailability(ROLLING_BLOCK_RIFLE_ID, false)

    // try to redeem the reward
    page.on('dialog', (dialog) => {
      expect(dialog.message()).toContain(
        "Reward 'Rolling Block Rifle' is not available for redemption",
      )
      dialog.dismiss()
    })
    await reward.locator('button').click()
    await expect(reward.locator('button')).toHaveText('Redeeming...')

    // The page hides the unavailable reward
    await expect($rewards).toHaveCount(5)
    await expect(page.getByText('Rolling Block Rifle')).not.toBeVisible()
  })

  test('should show error when reward is not found', async ({ page }) => {
    await expect($rewards).toHaveCount(6)
    const reward = rrPage.getReward(ROLLING_BLOCK_RIFLE_ID)
    await expect(page.getByText('Rolling Block Rifle')).toBeVisible()

    // Simulate making reward unavailable via direct API call
    await rrPage.deleteReward(ROLLING_BLOCK_RIFLE_ID)

    // try to redeem the reward
    page.on('dialog', (dialog) => {
      expect(dialog.message()).toContain('Reward not found')
      dialog.dismiss()
    })
    await reward.locator('button').click()
    await expect(reward.locator('button')).toHaveText('Redeeming...')

    // The page hides the unavailable reward
    await expect($rewards).toHaveCount(5)
    await expect(page.getByText('Rolling Block Rifle')).not.toBeVisible()
  })

  test('should show error for unexpected server error', async ({ page }) => {
    // stub the server to return a 500 error
    page.route('**/api/v1/redemptions', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
        })
      } else {
        await route.continue()
      }
    })

    const reward = rrPage.getReward(ROLLING_BLOCK_RIFLE_ID)

    // try to redeem the reward
    page.on('dialog', (dialog) => {
      expect(dialog.message()).toContain('Something went wrong')
      dialog.dismiss()
    })
    await reward.locator('button').click()
    await page.waitForTimeout(200)
  })
})
