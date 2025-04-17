import { test, expect, Locator } from '@playwright/test'
import { RRPage } from './_support'

let rrPage: RRPage
let $balance: Locator
let $redemptions: Locator

test.beforeEach(async ({ page, request }) => {
  rrPage = new RRPage(page, request)
  await rrPage.fillDatabase()
  await page.goto('/')
  $balance = rrPage.getBalance()
  $redemptions = rrPage.getRedemptions()
})

test.describe('Redemption', () => {
  test('normal reward redemption', async () => {
    await expect($balance).toContainText('1000 pts')
    await expect($redemptions).toHaveCount(1)
    const reward = rrPage.getReward('569598337') // costs 350 pts

    // click and disable button
    await reward.locator('button').click()
    await expect(reward.locator('button')).toHaveText('Redeeming...')
    await expect(reward.locator('button')).toBeDisabled()
    await expect($redemptions).toHaveCount(2)
    await expect($redemptions.first()).toContainText(
      'Rolling Block Rifle–350 points',
    )

    // back to normal state
    await expect(reward.locator('button')).toHaveText('Redeem')
    await expect(reward.locator('button')).toBeEnabled()
    await expect($balance).toContainText('650 pts') // 1000 - 350

    // click again
    await reward.locator('button').click()
    await expect($balance).toContainText('300 pts') // 650 - 350
    await expect(reward.locator('button')).toBeDisabled()
    await expect(reward.locator('button')).toHaveText('Need 50 more pts')
    await expect($redemptions).toHaveCount(3)
  })

  test('free reward redemption', async () => {
    await expect($balance).toContainText('1000 pts')
    await expect($redemptions).toHaveCount(1)
    const reward = rrPage.getReward('86743210')
    await expect(reward.getByTestId('name')).toHaveText('Yarrow Collection') // free

    await reward.locator('button').click()
    await expect($balance).toContainText('1000 pts')
    await expect($redemptions).toHaveCount(2)
    await expect($redemptions.first()).toContainText('Yarrow Collectionfree')
  })

  test('negative reward redemption (earning points)', async () => {
    await expect($balance).toContainText('1000 pts')
    await expect($redemptions).toHaveCount(1)
    const reward = rrPage.getReward('581047220') // earns 25 pts

    await reward.locator('button').click()
    await expect($balance).toContainText('1025 pts')
    await expect($redemptions).toHaveCount(2)
    await expect($redemptions.first()).toContainText(
      'Debt Collection+25 points',
    )
  })
})
