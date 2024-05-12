import { PrismaClient } from "@prisma/client"
import ExpressClient from "./classes/ExpressClient"
import { exit } from "process"
import { routes } from "./constants/routes"
require("dotenv").config()

// Check for required environment variables
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set")
if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET not set")

let botsReady = false

let environment = {
	DATABASE_URL: process.env.DATABASE_URL,
	JWT_SECRET: process.env.TOKEN_SECRET,
	PORT: process.env.PORT || 4000,
}

// Prisma Client
const prisma = new PrismaClient({ errorFormat: "pretty" })

/**
 * Change Slack Bot and restarts it
 */

// Express Client
const expressClient = new ExpressClient(routes, 4000, { start: true })


// Graceful Shutdown
process.on("SIGTERM", async () => {
	console.log("Gracefully shutting down!")
	expressClient.close()
	exit(0)
})

process.on("SIGINT", async () => {
	console.log("Gracefully shutting down!")
	expressClient.close()
	exit(0)
})

process.on("unhandledRejection", error => {
	console.log("unhandledRejection", error)
})

export { botsReady, expressClient, prisma, environment}
