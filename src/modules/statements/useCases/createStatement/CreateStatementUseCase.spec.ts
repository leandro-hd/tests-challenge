import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { CreateStatementError } from "./CreateStatementError"

let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should be able to create a new statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'User test',
      email: 'user@test.com',
      password: '1234'
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 125,
      description: 'Deposit test'
    })

    expect(statement).toHaveProperty('id')
  })

  it('should not be able to create a new statement if user not exists', async () => {
    expect(async () => {
       await createStatementUseCase.execute({
        user_id: '1234',
        type: OperationType.DEPOSIT,
        amount: 125,
        description: 'Deposit test'
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it('should not be able to create a new statement if user have insufficient funds', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'User test',
        email: 'user@test.com',
        password: '1234'
      })

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 75,
        description: 'Withdraw test'
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
