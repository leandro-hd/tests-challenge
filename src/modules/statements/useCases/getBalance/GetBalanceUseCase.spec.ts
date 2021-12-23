import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { GetBalanceError } from "./GetBalanceError"

let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase

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
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository)
  })

  it('should be able to get a balance', async () => {
    const user = await createUserUseCase.execute({
      name: 'User test',
      email: 'user@test.com',
      password: '1234'
    })

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 275,
      description: 'Deposit test'
    })

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 125,
      description: 'Deposit test'
    })

    const balance = await getBalanceUseCase.execute({ user_id: user.id as string })

    expect(balance.statement).toHaveLength(2)
    expect(balance.balance).toBe(150)
  })

  it('should not be able to get a balance if user not exists', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: '1234' })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
