import { hash } from "bcryptjs"
import request from 'supertest'
import { Connection, createConnection } from "typeorm"
import { v4 as uuid } from 'uuid'

import { app } from "../../../../app"

let connection: Connection

describe('Create Statement Controller', () => {
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

  it('should be able to create a new deposit', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@test.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body

    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 325,
        description: 'Deposit test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201)
    expect(response.body.amount).toBe(325)
  })

  it('should be able to create a new withdraw', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@test.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 275,
        description: 'Withdraw test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201)
    expect(response.body.amount).toBe(275)
  })
})
