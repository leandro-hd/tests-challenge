import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to show user profile', async () => {
    const user = await createUserUseCase.execute({
      name: 'User exammple',
      email: 'user@example.com',
      password: '1234'
    })

    const userProfile = await showUserProfileUseCase.execute(user.id as string)

    expect(userProfile).toHaveProperty('id')
  })

  it('should not be able to show user profile if user not exists', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('1234')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
