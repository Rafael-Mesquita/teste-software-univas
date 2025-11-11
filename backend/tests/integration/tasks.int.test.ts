import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb } from './testDb'

describe('Tasks API', () => {
  let user: any

  beforeAll(async () => {
    // Cria um usuário antes de todos os testes
    user = await prisma.user.create({
      data: { name: 'Usuário Teste', email: 'teste@teste.com' },
    })
  })

  afterAll(async () => {
    await prisma.$disconnect()
    await appPrisma.$disconnect()
  })

  beforeEach(async () => {
    await resetDb()
    // Garante que o usuário sempre exista após resetar o DB
    user = await prisma.user.create({
      data: { name: 'Usuário Teste', email: 'teste@teste.com' },
    })
  })

  // CREATE
  it('POST /api/tasks cria uma tarefa válida', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Estudar Vitest',
        description: 'Aprender a testar rotas',
        done: false,
        userId: user.id, // <-- Adicionado
      })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      title: 'Estudar Vitest',
      description: 'Aprender a testar rotas',
      done: false,
    })

    const dbTask = await prisma.task.findUnique({ where: { id: res.body.data.id } })
    expect(dbTask).not.toBeNull()
  })

  it('POST /api/tasks retorna erro se dados forem inválidos', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: '' })
    expect(res.status).toBe(400)
  })

  // READ ALL
  it('GET /api/tasks lista todas as tarefas', async () => {
    await prisma.task.createMany({
      data: [
        { title: 'Tarefa 1', description: 'Primeira', done: false, userId: user.id },
        { title: 'Tarefa 2', description: 'Segunda', done: true, userId: user.id },
      ],
    })

    const res = await request(app).get('/api/tasks')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBe(2)
  })

  // READ ONE
  it('GET /api/tasks/:id retorna uma tarefa específica', async () => {
    const task = await prisma.task.create({
      data: {
        title: 'Tarefa única',
        description: 'Apenas uma',
        done: false,
        userId: user.id,
      },
    })

    const res = await request(app).get(`/api/tasks/${task.id}`)
    expect(res.status).toBe(200) // ← Corrigido (era 204)
    expect(res.body.data).toMatchObject({ id: task.id, title: 'Tarefa única' })
  })

  it('GET /api/tasks/:id retorna 404 se não existir', async () => {
    const res = await request(app).get('/api/tasks/999')
    expect(res.status).toBe(404)
  })

  // UPDATE
  it('PUT /api/tasks/:id atualiza uma tarefa existente', async () => {
    const task = await prisma.task.create({
      data: {
        title: 'Antigo título',
        description: 'Desc',
        done: false,
        userId: user.id,
      },
    })

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({
        title: 'Novo título',
        description: 'Atualizada',
        done: true,
      })

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({
      id: task.id,
      title: 'Novo título',
      description: 'Atualizada',
      done: true,
    })

    const updated = await prisma.task.findUnique({ where: { id: task.id } })
    expect(updated?.title).toBe('Novo título')
  })

  it('PUT /api/tasks/:id retorna 404 se tarefa não existir', async () => {
    const res = await request(app)
      .put('/api/tasks/999')
      .send({ title: 'Nada' })
    expect(res.status).toBe(404)
  })

  // DELETE
  it('DELETE /api/tasks/:id exclui uma tarefa existente', async () => {
    const task = await prisma.task.create({
      data: {
        title: 'Apagar',
        description: 'Será deletada',
        done: false,
        userId: user.id,
      },
    })

    const res = await request(app).delete(`/api/tasks/${task.id}`)
    expect(res.status).toBe(204)

    const deleted = await prisma.task.findUnique({ where: { id: task.id } })
    expect(deleted).toBeNull()
  })

  it('DELETE /api/tasks/:id retorna 404 se não existir', async () => {
    const res = await request(app).delete('/api/tasks/999')
    expect(res.status).toBe(404)
  })
})
