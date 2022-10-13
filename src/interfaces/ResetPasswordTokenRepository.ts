export type ResetPasswordTokenDTO = {
    token: string
    user_id: string
    expires_in: Date
}

export interface ResetPasswordTokenRepository {
    create(data: ResetPasswordTokenDTO): Promise<void>
    findByToken(token: string): Promise<ResetPasswordTokenDTO | null>
    findByUserId(id: string): Promise<ResetPasswordTokenDTO | null>
    delete(token: string): Promise<void>
}