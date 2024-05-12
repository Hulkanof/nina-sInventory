import express from "express"
import WebSocket from "ws"

export interface Route {
	path: string
	methods: ("get" | "post" | "put" | "delete" | "patch")[]
	middlewares?: express.RequestHandler[]
	handler: express.RequestHandler
}

interface SocketClient {
	ws: WebSocket
	name?: string
}
