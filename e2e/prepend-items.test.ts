import { test, expect, Page } from '@playwright/test'
import { navigateToExample } from './utils'

test.describe('list with prependable items', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await navigateToExample(page, baseURL, 'prepend-items')
    await page.waitForTimeout(100)
  })

  async function getScrollTop(page: Page) {
    await page.waitForTimeout(100)
    return page.locator('data-test-id=virtuoso-scroller').evaluate((el) => el.scrollTop)
  }

  test('keeps the location at where it should be (2 items)', async ({ page }) => {
    expect(await getScrollTop(page)).toBe(0)

    await page.locator('data-test-id=prepend-2').click()

    expect(await getScrollTop(page)).toBe(2 * 55)

    await page.locator('data-test-id=prepend-2').click()

    expect(await getScrollTop(page)).toBe(4 * 55)
  })

  test('keeps the location at where it should be (200 items)', async ({ page }) => {
    expect(await getScrollTop(page)).toBe(0)

    await page.locator('data-test-id=prepend-200').click()

    expect(await getScrollTop(page)).toBe(200 * 55)
  })
})
