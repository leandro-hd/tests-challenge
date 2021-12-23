import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'User exammple',
      email: 'user@example.com',
      password: '1234'
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with exists email', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'User exammple',
        email: 'user@example.com',
        password: '1234'
      })

      await createUserUseCase.execute({
        name: 'User exists',
        email: 'user@example.com',
        password: '1234'
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
