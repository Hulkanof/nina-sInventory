import express from "express"
import cookieParser from "cookie-parser"
import { Server } from "http"
import type { Express } from "express"
import type { Route } from "../types/express"


/**
 * Express Client
 */
export default class ExpressClient {
	/**
	 * Express app
	 */
	private app: Express

	/**
	 * Express Server
	 */
	private server?: Server

	/**
	 * Port to run the server on
	 */
	private port: number

	private botName: string | null = null

	/**
	 * Array of used ports
	 */
	public static usedPorts: number[] = []

	/**
	 * Creates an instance of ExpressClient.
	 * @param routes An array of routes to add to the server
	 * @param port Port to run the server on
	 * @param start Whether to start the server or not (default: false)
	 */
	constructor(routes: Route[], port: number, options?: { start?: boolean; botName?: string }) {
		this.port = port
		this.app = express()
		this.app.use(cookieParser())
		this.app.use(express.json( {limit: '50mb'}))
		this.app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000 }))


		// Add routes from routes array
		routes.forEach(route => {
			for (let i = 0; i < route.methods.length; i++) {
				const method = route.methods[i]
				if (route.middlewares) this.app[method](route.path, route.middlewares, route.handler)
				else this.app[method](route.path, route.handler)
			}
		})

		ExpressClient.usedPorts.push(port)

		if (options?.botName) this.botName = options.botName
		if (options?.start) this.start()
	}

	/**
	 * Starts the server
	 */
	public start() {
		if (this.server) throw new Error("[ApiClient] Server already started")
		this.server = this.app.listen(this.port, () => {
			console.log(`[ApiClient${this.botName !== null ? ` - ${this.botName}` : ""}] API server running on port ${this.port}`)
		})
	}

	/**
	 * Starts the server for the provided http server
	 * @param server http server to start the server for
	 */
	public startWithServer(server: Server) {
		if (this.server) throw new Error(`[ApiClient${this.botName !== null ? ` - ${this.botName}` : ""}] Server already started`)
		this.server = server
		this.server.listen(this.port, () => {
			console.log(`[ApiClient${this.botName !== null ? ` - ${this.botName}` : ""}] Server running on port ${this.port}`)
		})
	}

	/**
	 * Returns the express app
	 */
	public getApp(): Express {
		return this.app
	}

	/**
	 * Returns the server
	 */
	public getServer(): Server | undefined {
		return this.server
	}

	/**
	 * Returns the port the server is running on
	 */
	public getPort(): number {
		return this.port
	}

	/**
	 * Closes the server
	 */
	public close() {
		if (this.server) {
			this.server.close(error => {
				if (error) console.error(error)
				console.log(`[ApiClient${this.botName !== null ? ` - ${this.botName}` : ""}] Server on port ${this.port} closed`)
			})
		}
	}
}
