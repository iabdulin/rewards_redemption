import { test, expect, Locator } from '@playwright/test'
import { RRPage } from './_support'

let rrPage: RRPage
let $rewards: Locator

test.describe('Rewards', () => {
  test.beforeEach(async ({ page, request }) => {
    rrPage = new RRPage(page, request)
    await rrPage.fillDatabase()
    await page.goto('/')
    $rewards = rrPage.getRewards()
  })

  test('all available rewards are visible', async () => {
    await expect($rewards).toHaveCount(6)
    await expect($rewards.locator('button')).toHaveCount(6)
    await expect($rewards.locator('button:not([disabled])')).toHaveCount(5)
  })

  test('normal reward is enabled', async () => {
    const reward = rrPage.getReward('521828321')
    await expect(reward.getByTestId('name')).toHaveText(
      'Tennessee Walker Horse',
    )
    await expect(reward.getByTestId('description')).toHaveText(
      'A reliable horse with good stamina and handling',
    )
    await expect(reward.getByTestId('cost')).toHaveText('500 pts')
    await expect(reward.locator('button')).toBeEnabled()
    await expect(reward.locator('button')).toHaveText('Redeem')
  })

  test('expensive reward is disabled', async () => {
    const reward = rrPage.getReward('631778711')
    await expect(reward.getByTestId('name')).toHaveText('Rose Grey Bay Arabian')
    await expect(reward.getByTestId('description')).toHaveText(
      'This is the finest horse a man could own',
    )
    await expect(reward.getByTestId('cost')).toHaveText('1250 pts')
    await expect(reward.locator('button')).toBeDisabled()
    await expect(reward.locator('button')).toHaveText('Need 250 more pts')
  })
})
