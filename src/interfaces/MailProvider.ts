export interface MailProvider {
    send(to: string, subject: string, variables: any, path: string): Promise<void>
}