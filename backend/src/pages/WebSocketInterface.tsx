import React, { useEffect } from "react"
import useWebSocket from "react-use-websocket"
import { useParams } from "react-router-dom"
import "../styles/messageBox.css"

interface messageObject {
	name: string
	message: string
}

const WebSocketInterface: React.FC<defaultPageProps> = ({ user }) => {
	const { socketPort } = useParams<{ socketPort: string }>()
	const [message, setMessage] = React.useState("")
	const [recievedMessages, setRecievedMessages] = React.useState<messageObject[]>([])
	const bottomRef = React.useRef<HTMLDivElement>(null)

	const { sendMessage, readyState } = useWebSocket(`ws://localhost:${socketPort}?name=${user.name}`, {
		onOpen: () => console.log("Connected"),
		shouldReconnect: () => true,
		onMessage: e => {
			if (!user.name) return
			setRecievedMessages(prevState => [...prevState, { name: "Bot", message: e.data }])
			bottomRef.current?.scrollIntoView({ behavior: "smooth" })
		}
	})

	function handleSend() {
		if (!message || message === "") return
		sendMessage(message)
		setRecievedMessages(prevState => [...prevState, { name: user.name, message: message }])
		setMessage("")
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			handleSend()
		}
	}

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [recievedMessages])

	if (readyState !== 1) return <div>Not connected</div>
	return (
		<div className="message-grid">
			<div className="message-box-container">
				<div className="message-box">
					{recievedMessages.map((rMessage, index) => {
						const capitalizedName = rMessage.name.charAt(0).toUpperCase() + rMessage.name.slice(1)
						return (
							<div key={index} className={`message-box-message ${rMessage.name === user.name ? "sender" : "receiver"}`}>
								<div className={`name`}>{capitalizedName}</div>
								<div className="text">{rMessage.message}</div>
							</div>
						)
					})}
					<div ref={bottomRef} />
				</div>
				<div className="message-input-section">
					<input
						className="message-input"
						type="text"
						placeholder="Your message"
						value={message}
						onChange={e => setMessage(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<input className="message-button" type="button" value="Send" onClick={() => handleSend()} />
				</div>
			</div>
		</div>
	)
}

export default WebSocketInterface
