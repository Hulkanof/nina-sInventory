import { NextFunction, Request, Response } from "express"
import { verifyAccessToken } from "../utils/token"
import { JsonWebTokenError } from "jsonwebtoken"

/**
 * Express Middleware Verify if the token is valid
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
	try {
		if (!req.headers.authorization) return res.status(401).send({ type: "error", error: "Not Authorized" })
		const token = req.headers.authorization.split(" ")[1]
		verifyAccessToken(token)
		next()
	} catch (error) {
		if (error instanceof JsonWebTokenError) return res.status(401).send({ type: "error", error: "Invalid token" })
		console.log(error)
		return res.status(500).send({ type: "error", error: "Internal Server Error" })
	}
}
