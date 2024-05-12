import { Request, Response } from "express"
import { generateAccessToken, verifyAccessToken, generateResetToken, generateAccessResetToken } from "../utils/token"
import { createHash } from "crypto"
import { prisma } from "../main"
import { JsonWebTokenError } from "jsonwebtoken"
import { sendResetEmail } from "../controller/mailService"
import { log } from "console"
require("dotenv").config()

/**
 * Route handler to get all users: /api/v1/users
 * @param req Request
 * @param res Response body will contain all users
 */
export async function getUsers(req: Request, res: Response) {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				admin: true
			}
		})
		return res.status(200).send({ type: "success", data: users })
	} catch (error: any) {
		console.error(error)
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler to login a user with the token: /api/v1/user
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme
 * @param res Response body will contain the user information
 */
export async function getUser(req: Request, res: Response) {
	try {
		if (!req.headers.authorization) return res.status(400).send({ type: "error", error: "Not Authorized" })
		const token = req.headers.authorization.split(" ")[1]
		const user = verifyAccessToken(token)

		res.status(200).send({ type: "success", data: user })
	} catch (error) {
		if (error instanceof JsonWebTokenError) return res.status(400).send({ type: "error", error: "Invalid token" })

		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler that logs in a user: /api/v1/user/login
 * @param req Request body must contain username and password
 * @param res Response body will contain the user and a JWT token
 */
export async function loginUser(req: Request, res: Response) {
	try {
		if (!req.body) return res.status(400).send({ type: "error", error: "No request body" })

		const { username, password } = req.body
		if (!username || !password) return res.status(400).send({ type: "error", error: "Missing fields" })

		const passhash = createHash("sha256").update(req.body.password).digest("hex")

		const user = await prisma.user.findUnique({
			where: {
				name: username
			}
		})
		if (!user) return res.status(400).send({ type: "error", error: "User not found" })

		if (user.password !== passhash) return res.status(400).send({ type: "error", error: "Incorrect password" })

		const { password: _, ...userWithoutPassword } = user
		const token = generateAccessToken(userWithoutPassword)
		res.status(200).send({ type: "success", data: { user: userWithoutPassword, token } })
	} catch (error: any) {
		console.log(error)
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}

/**
 * Route handler that creates an account and logs in the user: /api/v1/user/register
 * @param req Request body must contain username, email and password
 * @param res Response body will contain the user and a JWT token
 */
export async function createUser(req: Request, res: Response) {
	try {
		if (!req.body) return res.status(400).send({ type: "error", error: "No request body" })

		const { username, email, password } = req.body
		if (!username || !email || !password) return res.status(400).send({ type: "error", error: "Missing fields" })

		const passhash = createHash("sha256").update(req.body.password).digest("hex")
		const user = await prisma.user.create({
			data: {
				email: req.body.email,
				name: req.body.username,
				password: passhash,
				lastLogin: new Date() ,
				lastIp: req.socket.remoteAddress || "",
			},
			select: {
				id: true,
				name: true,
				email: true,
				admin: true
			}
		})

		if (!user) return res.status(400).send({ type: "error", error: "User not created" })

		const token = generateAccessToken(user)
		res.status(200).send({ type: "success", data: { user: user, token } })
	} catch (error: any) {
		console.error(error)
		if (error.code === "P2002") return res.status(400).send({ type: "error", error: "User already exists" })
		return res.status(500).send({ type: "error", error: "Internal error!" })
	}
}

/**
 * Route handler that update the admin state of a user: /api/v1/user/:id/admin
 * @param req Request must contain a valid JWT token in the Authorization header with the Bearer scheme and body must contain admin field
 * @param res Response body will contain the updated user
 */
export async function updateAdmin(req: Request, res: Response) {
	if (!req.body) return res.status(400).send({ type: "error", error: "No request body" })
	if (req.body.admin === null || req.params.id === null) return res.status(400).send({ type: "error", error: "Missing fields" })
	if (req.body.admin !== 0 && req.body.admin !== 1) return res.status(400).send({ type: "error", error: "Invalid admin value" })

	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.params.id
			},
			select: {
				admin: true
			}
		})

		if (!user) return res.status(404).send({ type: "error", error: "User does not exist!" })
		if (user.admin === 2) return res.status(403).send({ type: "error", error: "User is owner, cannot change role!" })

		const newUser = await prisma.user.update({
			where: {
				id: req.params.id
			},
			data: {
				admin: req.body.admin
			},
			select: {
				id: true,
				name: true,
				email: true,
				admin: true
			}
		})
		return res.status(200).send({ type: "success", data: newUser })
	} catch (error: unknown) {
		console.error(error)
		return res.status(500).send({ type: "error", error: "Internal error!" })
	}
}

/**
 * Route handler that asks for password reset: /api/v1/user/reset
 * @param req Request must contain email field
 */
export async function passwordReset(req: Request, res: Response) {
	if (!req.body) return res.status(400).send({ type: "error", error: "No request body" })
	if (!req.body.email) return res.status(400).send({ type: "error", error: "Missing fields" })

	try {
		const user = await prisma.user.findUnique({
			where: {
				email: req.body.email
			}
		})

		if (!user) return res.status(404).send({ type: "error", error: "User does not exist!" })



		let resetToken = generateResetToken()

		while (await prisma.user.findFirst({ where: { resetToken: resetToken } })) {
			resetToken = generateResetToken()
		}

		await prisma.user.update({
			where: {
				email: req.body.email
			},
			data: {
				resetToken: resetToken
			}
		})

		sendResetEmail(req.body.email, resetToken)

		return res.status(200).send({ type: "success", data: "Email sent" })
	} catch (error: unknown) {
		console.error(error)
		return res.status(500).send({ type: "error", error: "Internal error!" })
	}
}

/**
 * Route handler that sets new password: /api/v1/user/setNewPassword
 * @param req Request must contain password field
 */
export async function setNewPassword(req: Request, res: Response) {
	if (!req.body) return res.status(400).send({ type: "error", error: "No request body" })
	if (!req.body.password) return res.status(400).send({ type: "error", error: "Missing fields" })
	if (!req.body.token) return res.status(400).send({ type: "error", error: "Missing fields" })


	try {
		const user = verifyAccessToken(req.body.token)

		if (!user) return res.status(404).send({ type: "error", error: "Token is not valid" })

		const passhash = createHash("sha256").update(req.body.password).digest("hex")

		await prisma.user.update({
			where: {
				id : user.id
			},
			data: {
				password: passhash
			}
		})

		return res.status(200).send({ type: "success", data: "Password changed" })
	} catch (error: unknown) {
		console.error(error)
		return res.status(500).send({ type: "error", error: "Internal error!" })
	}
}

/*
 * Route handler that checks if reset token is valid: /api/v1/user/checkResetToken
 * @param req Request must contain token field
 */
export async function checkResetToken(req: Request, res: Response) {
	if (!req.body) return res.status(400).send({ type: "error", error: "No request body" })
	if (!req.body.resetToken) return res.status(400).send({ type: "error", error: "Missing fields" })

	try {
		const user = await prisma.user.findFirst({
			where: {
				resetToken: req.body.resetToken
			}
		})

		if (!user) return res.status(404).send({ type: "error", error: "Token is not valid" })

		const passhash = createHash("sha256").update(req.body.password).digest("hex")

		await prisma.user.update({
			where: {
				id : user.id
			},
			data: {
				password: passhash,
				resetToken: null
			}
		})
		

		return res.status(200).send({ type: "success", data: "Password changed" })
	} catch (error: unknown) {
		console.error(error)
		return res.status(500).send({ type: "error", error: "Internal error!" })
	}
}