import { hash } from "bcryptjs"
import request from 'supertest'
import { Connection, createConnection } from "typeorm"
import { v4 as uuid } from 'uuid'

import { app } from "../../../../app"

let connection: Connection

describe('Get Statement Operation Controller', () => {
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

  it('should be able to get a statement operation', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@test.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body

    const deposit = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 325,
        description: 'Deposit test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const withdraw = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 275,
        description: 'Withdraw test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseDeposit = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseWithdraw = await request(app)
      .get(`/api/v1/statements/${withdraw.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseDeposit.status).toBe(200)
    expect(responseDeposit.body.type).toBe('deposit')
    expect(responseWithdraw.status).toBe(200)
    expect(responseWithdraw.body.type).toBe('withdraw')
  })
})
