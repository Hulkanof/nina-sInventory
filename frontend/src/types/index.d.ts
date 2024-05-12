type defaultPageProps = {
	user: User
	setUser: React.Dispatch<React.SetStateAction<User>>
	token: string
}

type BasicAPIResponse<T> = BasicAPIResponseError | BasicAPIResponseNoError<T>

type BasicAPIResponseError = {
	type: "error"
	error: string
}

type BasicAPIResponseNoError<T> = {
	type: "success"
	message: string
	data: T
}

interface User {
	id: string
	name: string
	email: string
	admin: 0 | 1 | 2
}

interface Bot {
	id: string
	name: string
	activeChatCount: number
	brain: Omit<Brain, "data">
	serviceAccess: ServiceAccess
	socketPort: number
}

interface Brain {
	id: string
	name: string
	data: string
}

interface ServiceAccess {
	discord: boolean
	mastodon: boolean
	slack: boolean
	socket: boolean
}

type AvailableServices = ServiceAccess

type ServiceConfig = DiscordServiceConfig | MastodonServiceConfig | SlackServiceConfig

interface DiscordServiceConfig {
	type: "discord"
	token?: string
	clientId?: string
	clientSecret?: string
}

interface MastodonServiceConfig {
	type: "mastodon"
}

interface SlackServiceConfig {
	type: "slack"
	signingSecret?: string
	token?: string
	appToken?: string
}
