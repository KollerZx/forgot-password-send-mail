import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars';

import fs from 'node:fs'

import { MailProvider } from '../interfaces/MailProvider';


export class EtherealMailProvider implements MailProvider {
    private client: Transporter;
    constructor() {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            })

            this.client = transporter
        })
            .catch(err => console.error(err))
    }


    async send(to: string, subject: string, variables: any, path: string): Promise<void> {
        const templateFileContent = fs.readFileSync(path).toString("utf-8")

        const templateParse = handlebars.compile(templateFileContent)

        const templateHTML = templateParse(variables)

        const message = await this.client.sendMail({
            to,
            from: "Aceno <noreplay@aceno.com>",
            subject,
            html: templateHTML
        })

        console.log('Message sent: %s', message.messageId)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
    }

}