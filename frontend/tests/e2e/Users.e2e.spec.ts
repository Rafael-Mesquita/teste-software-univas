import { test, expect } from '@playwright/test'
test.describe('Usuários', () => {
  
  test('navega para Usuários e lista itens do backend', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Usuários/i }).click()
  await expect(page.getByRole('heading', { name: /Usuários/i })).toBeVisible()
  await expect(page.getByText(/john.doe@example.com/i)).toBeVisible()
  await expect(page.getByText(/jane.smith@example.com/i)).toBeVisible()
})


  test('cria usuário e aparece na lista', async ({ page }) => {
    await page.goto('/users')
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click()  
    const uniqueEmail = `aluno.${Date.now()}@ex.com`
    await page.getByLabel('Nome:').fill('Aluno E2E')
    await page.getByLabel('Email:').fill(uniqueEmail)  
    await page.getByRole('button', { name: /Criar/i }).click()
    await expect(page.getByText(uniqueEmail)).toBeVisible()
  });

  test('atualiza um usuário existente', async ({ page }) => {
    await page.goto('/users')
    const row = page.getByRole('row', { name: /John Doe/i })
    await row.getByRole('button', { name: /Editar/i }).click()
    const novoNome = 'Aluno Atualizado 2'
    const novoEmail = `aluno.atualizado2@ex.com`
    await page.getByLabel('Nome:').fill(novoNome)
    await page.getByLabel('Email:').fill(novoEmail)
    await page.getByRole('button', { name: /Atualizar/i }).click()
    await expect(page.getByText(novoNome)).toBeVisible()
    await expect(page.getByText(novoEmail)).toBeVisible()
  })

  test('exclui um usuário existente', async ({ page }) => {
    await page.goto('/users')
    const emailTemp = `delete.${Date.now()}@ex.com`
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click()
    await page.getByLabel('Nome:').fill('Usuario Delete')
    await page.getByLabel('Email:').fill(emailTemp)
    await page.getByRole('button', { name: /Criar/i }).click()
    await expect(page.getByText(emailTemp)).toBeVisible()
    const row = page.getByRole('row', { name: emailTemp })
    
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Tem certeza que deseja excluir este usuário?')
        await dialog.accept()  
    })

    await row.getByRole('button', { name: /Excluir/i }).click()
    await expect(page.getByText(emailTemp)).not.toBeVisible()
  })

});