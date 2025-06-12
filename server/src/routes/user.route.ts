import { Hono } from "hono"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from "hono/jwt"
import { setCookie, deleteCookie } from 'hono/cookie'
import { signupInput, signinInput } from "@medium-clone/common"

const user = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>()

user.post('/signup', async (c) => {
    const body = await c.req.json()
    const { success } = signupInput.safeParse(body)
    if (!success) {
        c.status(411)
        return c.json({ message: "Input not correct" })
    }
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())

    const res = await prisma.user.create({
        data: {
            username: body.username,
            password: body.password,
            name: body.name
        }
    })

    return c.text("user created", 201)
})

user.get('/signout', async (c) => {
    deleteCookie(c, 'token')
    return c.json({ message: "User logged out successfully!" })
})

user.post('/signin', async (c) => {
    const body = await c.req.json()
    const { success } = signupInput.safeParse(body)
    if (!success) {
        c.status(411)
        return c.json({ message: "Input not correct" })
    }
    if (!c.env.JWT_SECRET) throw new Error("JWT_SECRET is undefined!")
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())

    try {
        const user = await prisma.user.findUnique({ where: { username: body.username, password: body.password } })

        if (!user) {
            c.status(404)
            return c.json({ message: "User not found" })
        }

        const token = await sign({ id: user.id }, c.env.JWT_SECRET, "HS256")
        setCookie(c, "token", "", { path: "/", maxAge: 0 })
        setCookie(c, "token", token, {
            path: "/",
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24
        })
        return c.json({ message: "User logged in successfully" })
    } catch (error) {
        const err = error as Error
        c.status(500)
        return c.json({ message: err.message })
    }

})

export default user