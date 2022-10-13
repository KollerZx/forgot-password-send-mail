import { ResetPasswordTokenDTO, ResetPasswordTokenRepository } from './../interfaces/ResetPasswordTokenRepository';

export class ResetPasswordTokenRepositoryInMemory implements ResetPasswordTokenRepository {
    private resetPasswordTokenRepository: ResetPasswordTokenDTO[]
    constructor() {
        this.resetPasswordTokenRepository = []
    }


    async create(data: ResetPasswordTokenDTO): Promise<void> {
        this.resetPasswordTokenRepository.push(data)
    }

    async findByToken(token: string): Promise<ResetPasswordTokenDTO | null> {
        const data = this.resetPasswordTokenRepository.find(data => data.token === token)
        return !!data ? data : null
    }

    async findByUserId(id: string): Promise<ResetPasswordTokenDTO | null> {
        const data = this.resetPasswordTokenRepository.find(user => user.user_id === id)
        return !!data ? data : null
    }

    async delete(token: string): Promise<void> {
        const index = this.resetPasswordTokenRepository.findIndex(data => data.token === token)
        this.resetPasswordTokenRepository.splice(index, 1)
    }

}