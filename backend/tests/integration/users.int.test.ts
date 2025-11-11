import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb } from './testDb'

describe('Users API', () => {
  afterAll(async () => {
    await prisma.$disconnect()
    await appPrisma.$disconnect()
  })
  beforeEach(async () => {
    await resetDb()
  })
  it('POST /api/users cria usuário válido', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Ana', email: 'ana@ex.com' })
    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({ name: 'Ana', email: 'ana@ex.com' })
  })
  it('GET /api/users lista usuários', async () => {
    await prisma.user.create({ data: { name: 'Ana', email: 'ana@ex.com' } })
    const res = await request(app).get('/api/users')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.some((u: any) => u.email === 'ana@ex.com')).toBe(true)
  })
 it('PUT /api/users/:id atualiza um usuário existente', async () => {
    const user = await prisma.user.create({
      data: { name: 'Carlos', email: 'carlos@ex.com' }
    })

    const res = await request(app)
      .put(`/api/users/${user.id}`)
      .send({ name: 'Carlos Atualizado', email: 'carlos@novo.com' })

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({
      id: user.id,
      name: 'Carlos Atualizado',
      email: 'carlos@novo.com'
    })

    // Confirma no banco
    const updated = await prisma.user.findUnique({ where: { id: user.id } })
    expect(updated?.name).toBe('Carlos Atualizado')
    expect(updated?.email).toBe('carlos@novo.com')
  })

  it('PUT /api/users/:id retorna 404 se o usuário não existir', async () => {
    const res = await request(app)
      .put('/api/users/999')
      .send({ name: 'Inexistente', email: 'no@ex.com' })
    expect(res.status).toBe(404)
  })

  it('DELETE /api/users/:id exclui um usuário existente', async () => {
    const user = await prisma.user.create({
      data: { name: 'Maria', email: 'maria@ex.com' }
    })

    const res = await request(app).delete(`/api/users/${user.id}`)
    expect(res.status).toBe(200)

    const deleted = await prisma.user.findUnique({ where: { id: user.id } })
    expect(deleted).toBeNull()
  })

  it('DELETE /api/users/:id retorna 404 se o usuário não existir', async () => {
    const res = await request(app).delete('/api/users/999')
    expect(res.status).toBe(404)
  })
})