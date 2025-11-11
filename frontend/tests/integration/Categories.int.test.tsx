// frontend/tests/integration/Categories.int.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import Categories from '../../src/components/Categories'
import { server, apiGet, json } from '../setup'
import { HttpResponse } from 'msw'

describe('Categories integration', () => {
  it('renderiza categorias retornadas pela API', async () => {
    server.use(
      apiGet('/categories', () =>
        json({
          data: [
            { id: '1', name: 'Trabalho', description: 'Tarefas do escritório' },
            { id: '2', name: 'Pessoal', description: 'Coisas do dia a dia' },
          ],
        })
      )
    )

    render(<Categories />)

    await waitFor(() => {
      expect(screen.getByText('Trabalho')).toBeInTheDocument()
      expect(screen.getByText('Tarefas do escritório')).toBeInTheDocument()
      expect(screen.getByText('Pessoal')).toBeInTheDocument()
    })
  })

  it('mostra mensagem de erro quando a API falha', async () => {
    server.use(
      apiGet('/categories', () => HttpResponse.error())
    )

    render(<Categories />)

    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar categorias/i)
      ).toBeInTheDocument()
    })
  })
})
