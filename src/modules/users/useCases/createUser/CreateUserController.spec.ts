import request from 'supertest'
import { Connection, createConnection } from "typeorm"

import { app } from "../../../../app"

let connection: Connection

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()

    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to authenticate a user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'user',
      email: 'user@test.com.br',
      password: '1234',
    })

    expect(response.status).toBe(201)
  })
})
