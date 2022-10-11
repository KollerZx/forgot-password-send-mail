import { UserDTO, UserRepository, UserUpdate } from './../interfaces/UserRepository';

export class UserRepositoryInMemory implements UserRepository {
    private userRepository: UserDTO[]
    constructor() {
        this.userRepository = []
    }

    async create(user: UserDTO): Promise<void> {
        this.userRepository.push(user)
    }

    async findByEmail(email: string): Promise<UserDTO | null> {
        const user = this.userRepository.find(user => user.email === email)
        return !!user ? user : null
    }

    async update(id: string, data: UserUpdate): Promise<void> {
        const index = this.userRepository.findIndex(user => user.id === id)
        this.userRepository.splice(index, 1, Object.assign(this.userRepository[index], { ...data }))
    }

}