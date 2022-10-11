import { DateProvider } from './../interfaces/DateProvider';
import { ResetPasswordRequest } from '../interfaces/ResetPasswordRequest';
import { ResetPasswordTokenRepository } from '../interfaces/ResetPasswordTokenRepository';
import { UserRepository } from './../interfaces/UserRepository';


export class ResetPasswordUseCase {
    constructor(
        private userRepository: UserRepository,
        private resetPasswordTokenRepository: ResetPasswordTokenRepository,
        private dateProvider: DateProvider
    ) { }
    async execute({ token, password }: ResetPasswordRequest) {
        const userToken = await this.resetPasswordTokenRepository.find(token)

        if (!userToken) throw new Error("Invalid Token!")

        const isBefore = this.dateProvider.isBefore(userToken.expires_in, this.dateProvider.dateNow())

        if (isBefore) throw new Error("Token expired!")

        await this.userRepository.update(userToken.user_id, { password })

        await this.resetPasswordTokenRepository.delete(userToken.token)
    }
}