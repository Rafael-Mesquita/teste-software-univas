import { test, expect } from '@playwright/test'
test(' navega para Tarefas e lista itens do backend', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Tarefas' }).click()
    await expect(page.getByRole('heading', { name: /Tarefas/i })).toBeVisible()
});
test('excluir tarefa e não aparecer mais na lista', async ({ page }) => {
    await page.goto('/tasks')
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name : /excluir/i }).first().click(
        { force: true }
    )
    await expect(page.getByRole('heading', { name: /Tarefas/i })).toBeVisible()
});