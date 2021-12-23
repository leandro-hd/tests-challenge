import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"

let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should be able to get a balance', async () => {
    const user = await createUserUseCase.execute({
      name: 'User test',
      email: 'user@test.com',
      password: '1234'
    })

    const statementDeposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 275,
      description: 'Deposit test'
    })

    const statementOperationDeposit = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statementDeposit.id as string
    })

    const statementWithdraw = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 275,
      description: 'Deposit test'
    })

    const statementOperationWithdraw = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statementWithdraw.id as string
    })

    expect(statementOperationDeposit.type).toBe('deposit')
    expect(statementOperationWithdraw.type).toBe('withdraw')

  })

  it('should not be able to get a statementOperation if user not exists', async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({ user_id: '1234', statement_id: '5678' })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('should not be able to get a statementOperation if statement not exists', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'User test',
        email: 'user@test.com',
        password: '1234'
      })

      await getStatementOperationUseCase.execute({ user_id: user.id as string, statement_id: '5678' })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
