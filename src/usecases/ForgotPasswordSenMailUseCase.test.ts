import { MailProvider } from './../interfaces/MailProvider';
import { ResetPasswordTokenRepositoryInMemory } from './../databases/ResetPasswordTokenRepositoryInMemory';
import { DayjsDateProvider } from './../services/DayjsDateProvider';
import { UserRepositoryInMemory } from './../databases/UserRepositoryInMemory';
import { ForgotPasswordSendMailUseCase } from './ForgotPasswordSendMailUseCase';


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

describe('Send Mail use Case', () => {
    let forgotPasswordSendMailUseCase: ForgotPasswordSendMailUseCase
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
    })

    it('Should be able to send mail for recovery password', async () => {
        await userRepository.create({
            email: "sijowu@bamcaku.ke",
            id: "0591fe17-286e-550d-b284-5e9a9e6e2cb7",
            name: "Kathryn Anderson",
            password: "768284"
        })

        const findUserByEmailSpy = jest.spyOn(userRepository, "findByEmail")
        const sendMailSpy = jest.spyOn(mailProvider, "send")

        await forgotPasswordSendMailUseCase.execute("sijowu@bamcaku.ke")

        expect(findUserByEmailSpy).toHaveBeenCalledWith("sijowu@bamcaku.ke")
        expect(sendMailSpy).toHaveBeenCalledTimes(1)

    })

    it('Should not be able to send email if user does not exists', async () => {
        await expect(
            forgotPasswordSendMailUseCase.execute("hatok@hibfaino.ba")
        )
            .rejects
            .toThrowError("User not found")
    })

    it('Should be able to create an forgot password token', async () => {
        await userRepository.create({
            email: "hamdalni@ega.gm",
            id: "d950037c-2dd4-5f27-b20f-188102c40f09",
            name: "Lydia Hunt",
            password: "727663764"
        })
        const dateProviderSpy = jest.spyOn(dateProvider, 'addHours')
        const resetPasswordTokenRepositorySpy = jest.spyOn(resetPasswordTokenRepository, "create")

        await forgotPasswordSendMailUseCase.execute("hamdalni@ega.gm")

        expect(dateProviderSpy).toHaveBeenCalledWith(1)
        expect(resetPasswordTokenRepositorySpy).toHaveBeenCalledTimes(1)
    })
})