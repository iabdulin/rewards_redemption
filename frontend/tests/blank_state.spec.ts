import { test, expect } from '@playwright/test'
import { RRPage } from './_support'

let rrPage: RRPage

test.describe('Fixtures', () => {
  test.beforeEach(async ({ page, request }) => {
    rrPage = new RRPage(page, request)
    await rrPage.clearDatabase()
  })

  test('user is not logged in (no user present)', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Unauthorized')).toBeVisible()
  })

  test('empty database but user is logged in', async ({ page }) => {
    await rrPage.fillDatabase(['users'])
    await page.goto('/')
    await expect(page.getByText('Welcome, Arthur Morgan!')).toBeVisible()
    await expect(rrPage.getBalance()).toHaveText('Your balance: 1000 pts')
    await expect(rrPage.getRedemptions()).toHaveCount(0)
    await expect(page.getByText('No redemptions found')).toBeVisible()
  })
})
