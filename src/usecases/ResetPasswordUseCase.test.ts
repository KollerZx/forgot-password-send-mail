import { ResetPasswordUseCase } from './ResetPasswordUseCase';
import { ResetPasswordTokenRepositoryInMemory } from "../databases/ResetPasswordTokenRepositoryInMemory"
import { UserRepositoryInMemory } from "../databases/UserRepositoryInMemory"
import { DayjsDateProvider } from "../services/DayjsDateProvider"
import { ForgotPasswordSendMailUseCase } from "./ForgotPasswordSendMailUseCase"
import { MailProvider } from '../interfaces/MailProvider';

export class MailProviderInMemory implements MailProvider {
    private message: any[] = []
    async send(to: string, subject: string, variables: any, path: string): Promise<void> {
        this.message.push({
            to,
            subject,
            variables,
            path
        })
    }

}
describe('Reset password use case', () => {

    let forgotPasswordSendMailUseCase: ForgotPasswordSendMailUseCase
    let resetPasswordUseCase: ResetPasswordUseCase
    let userRepository: UserRepositoryInMemory
    let mailProvider: MailProviderInMemory
    let dateProvider: DayjsDateProvider
    let resetPasswordTokenRepository: ResetPasswordTokenRepositoryInMemory
    beforeAll(() => {
        userRepository = new UserRepositoryInMemory()
        dateProvider = new DayjsDateProvider()
        mailProvider = new MailProviderInMemory()
        resetPasswordTokenRepository = new ResetPasswordTokenRepositoryInMemory()
        forgotPasswordSendMailUseCase = new ForgotPasswordSendMailUseCase(userRepository, mailProvider, resetPasswordTokenRepository, dateProvider)
        resetPasswordUseCase = new ResetPasswordUseCase(userRepository, resetPasswordTokenRepository, dateProvider)
    })

    it('Should be able to reset password with a valid token', async () => {
        await userRepository.create({
            id: "854173b7-0d09-53de-9a5c-21bc26b89863",
            email: "ubfames@ver.ml",
            name: "Bruce Martin",
            password: "589040033"
        })
        await forgotPasswordSendMailUseCase.execute("ubfames@ver.ml")

        const findByTokenRepositorySpy = jest.spyOn(resetPasswordTokenRepository, "findByToken")
        const deleteTokenRepositorySpy = jest.spyOn(resetPasswordTokenRepository, "delete")
        const dateProviderSpy = jest.spyOn(dateProvider, "isBefore")
        const userRepositorySpy = jest.spyOn(userRepository, "update")

        const userToken = await resetPasswordTokenRepository.findByUserId("854173b7-0d09-53de-9a5c-21bc26b89863")
        await resetPasswordUseCase.execute({ token: userToken.token, password: "71849233" })

        expect(findByTokenRepositorySpy).toHaveBeenCalledWith(userToken.token)
        expect(dateProviderSpy).toBeCalledTimes(1)
        expect(userRepositorySpy).toHaveBeenCalledWith(userToken.user_id, { password: "71849233" })
        expect(deleteTokenRepositorySpy).toHaveBeenCalledWith(userToken.token)
    })

    it('Should not be able to reset password with a invalid token', async () => {
        await expect(
            resetPasswordUseCase.execute({ token: "132465", password: "3213213213" })
        )
            .rejects
            .toThrowError("Invalid Token")
    })
})