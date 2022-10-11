import { DayjsDateProvider } from './../services/DayjsDateProvider';
import { EtherealMailProvider } from '../services/EtherealMailProvider';
import { ForgotPasswordSendMailUseCase } from '../usecases/ForgotPasswordSendMailUseCase';
import { ResetPasswordUseCase } from '../usecases/ResetPasswordUseCase';
import { UserRepositoryInMemory } from '../databases/UserRepositoryInMemory';
import { ResetPasswordTokenRepositoryInMemory } from '../databases/ResetPasswordTokenRepositoryInMemory';

const resetPasswordTokenRepositoryInMemory = new ResetPasswordTokenRepositoryInMemory()
const userRepositoryInMemory = new UserRepositoryInMemory()
const etherealMailProvider = new EtherealMailProvider()
const dayJsDateProvider = new DayjsDateProvider()
const resetPasswordUseCase = new ResetPasswordUseCase(userRepositoryInMemory, resetPasswordTokenRepositoryInMemory, dayJsDateProvider)
const forgotPasswordSendMailUseCase = new ForgotPasswordSendMailUseCase(userRepositoryInMemory, etherealMailProvider, resetPasswordTokenRepositoryInMemory, dayJsDateProvider)

export {
    resetPasswordUseCase,
    forgotPasswordSendMailUseCase,
    userRepositoryInMemory
}