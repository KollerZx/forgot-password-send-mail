export type UserDTO = {
    id: string
    name: string
    email: string
    password: string
}
export type UserUpdate = Partial<Omit<UserDTO, "id">>

export interface UserRepository {
    create(user: UserDTO): Promise<void>
    findByEmail(email: string): Promise<UserDTO | null>
    update(id: string, data: UserUpdate): Promise<void>
}