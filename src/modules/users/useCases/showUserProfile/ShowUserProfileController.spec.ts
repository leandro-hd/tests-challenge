import { hash } from "bcryptjs"
import request from 'supertest'
import { Connection, createConnection } from "typeorm"
import { v4 as uuid } from 'uuid'

import { app } from "../../../../app"

let connection: Connection

describe('Show User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()

    await connection.runMigrations()

    const password = await hash('admin', 8)

    const id = uuid()

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'admin', 'admin@test.com.br', '${password}', 'now()', 'now()')
    `,
    );
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to show a user profile', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@test.com.br',
      password: 'admin',
    })

    const { token } = responseToken.body

    const response = await request(app)
    .get('/api/v1/profile')
    .set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
  })
})
