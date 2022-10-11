import dotenv from 'dotenv'
dotenv.config()

import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path'

import { DateProvider } from '../interfaces/DateProvider';
import { UserRepository } from '../interfaces/UserRepository';
import { MailProvider } from '../interfaces/MailProvider';
import { ResetPasswordTokenRepository } from '../interfaces/ResetPasswordTokenRepository';


export class ForgotPasswordSendMailUseCase {
    constructor(
        private userRepository: UserRepository,
        private mailProvider: MailProvider,
        private resetPasswordTokenRepository: ResetPasswordTokenRepository,
        private dateProvider: DateProvider
    ) { }
    async execute(email: string) {
        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new Error("User not found")
        const token = randomUUID()

        const expires_in = this.dateProvider.addHours(1)

        const passForgotData = {
            token,
            user_id: user.id,
            expires_in
        }
        await this.resetPasswordTokenRepository.create(passForgotData)

        const templatePath = resolve(__dirname, '..', 'views', 'emails', 'forgotPassword.hbs')

        const link = `${process.env.FORGOT_MAIL_URL}${token}`
        const variables = {
            name: user.name,
            link
        }

        await this.mailProvider.send(email, "Recuperação de senha", variables, templatePath)
    }
}