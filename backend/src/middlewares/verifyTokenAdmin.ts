import { NextFunction, Request, Response } from "express"
import { verifyAccessToken } from "../utils/token"
import { JsonWebTokenError } from "jsonwebtoken"
import { prisma } from "../main"

/**
 * Middleware to verify if the user is an admin
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export async function verifyTokenAdmin(req: Request, res: Response, next: NextFunction) {
	try {
		if (!req.headers.authorization) return res.status(401).send({ error: "Not Authorized" })
		const token = req.headers.authorization.split(" ")[1]
		const user = verifyAccessToken(token)

		const result = await prisma.user.findUnique({
			where: {
				id: user.id
			},
			select: {
				admin: true
			}
		})
		if (!result) return res.status(401).send({ error: "Not Authorized" })
		if (result.admin < 1) return res.status(403).send({ error: "Not Authorized" })

		next()
	} catch (error) {
		if (error instanceof JsonWebTokenError) return res.status(401).send({ error: "Invalid token" })
		console.log(error)
		return res.status(500).send({ error: "Internal Server Error" })
	}
}
