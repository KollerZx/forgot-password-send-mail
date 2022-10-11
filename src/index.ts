import express, { Request, Response } from 'express'

import { randomUUID } from 'node:crypto';

import { UserDTO } from './interfaces/UserRepository';
import { resetPasswordUseCase, forgotPasswordSendMailUseCase, userRepositoryInMemory } from './main'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/users', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body
        const newUser: UserDTO = {
            id: randomUUID(),
            name,
            email,
            password
        }
        await userRepositoryInMemory.create(newUser)

        res.status(201).send()
    } catch (error) {
        res.status(500).end()
    }
})

app.get('/users/:email', async (req: Request, res: Response) => {
    try {
        const { email } = req.params
        const user = await userRepositoryInMemory.findByEmail(email)

        res.status(200).json({ user })
    } catch (error) {
        res.status(404).end()
    }
})

app.post('/auth/password/forgot', async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        await forgotPasswordSendMailUseCase.execute(email)

        res.status(200).send()
    } catch (error) {
        res.status(404).end()
    }
})

app.post('/auth/password/reset', async (req: Request, res: Response) => {
    try {
        const { token } = req.query
        const { password } = req.body
        await resetPasswordUseCase.execute({ token: String(token), password })

        res.status(200).send()
    } catch (error) {
        res.status(401).end(0)
    }
})

app.listen(3000, () => console.log(`Server running on: http://localhost:3000`))