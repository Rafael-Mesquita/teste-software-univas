import { test, expect } from '@playwright/test'

test.describe('Categorias', () => {

  test('cria categoria e aparece na lista', async ({ page }) => {

    await page.goto('/categories')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: 'Adicionar Categoria' }).click()

    const uniqueName = `Categoria ${Date.now()}`
    const uniqueDescription = `Descrição ${Date.now()}`

    const nameInput = page.locator('input').first()
    const descriptionInput = page.locator('textarea').first()

    await expect(nameInput).toBeVisible()
    await expect(descriptionInput).toBeVisible()

    await nameInput.fill(uniqueName)
    await descriptionInput.fill(uniqueDescription)

    await page.getByRole('button', { name: 'Criar' }).click()

    await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 5000 })
  })

})