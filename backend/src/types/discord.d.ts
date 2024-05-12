import { Message } from "discord.js"
import ChatBot from "../classes/ChatBot"

export interface DiscordClientConfig {
	token: string
	clientId: string
	clientSecret: string
	prefix: string
}

export interface ICommand {
	name: string
	helpName: string
	description: string
	execute: (message: Message, args: string[]) => void | Promise<void>
}

export interface IChat {
	channelId: string
	chatBot?: ChatBot
}
