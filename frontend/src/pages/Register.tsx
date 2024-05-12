import { useState } from "react"
import "../styles/Register.css"
import useToken from "../hooks/useToken"
import { useNavigate } from "react-router-dom"

const Register: React.FC<defaultPageProps> = ({ setUser }) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [email, setEmail] = useState("")
	const [info, setInfo] = useState<{
		message: string
		type: string
	}>()
	const navigate = useNavigate()
	const { setToken } = useToken()

	async function handleSubmit() {
		if (username === "" || password === "" || email === "")
			return setInfo({
				message: "Please fill in all fields",
				type: "warning"
			})

		if (!email.includes("@"))
			return setInfo({
				message: "Please enter a valid email",
				type: "warning"
			})

		const res = await fetch("/api/v1/user/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username,
				password,
				email
			})
		})

		const data: BasicAPIResponse<{ user: User; token: string }> = await res.json()
		if (data.type === "error") {
			setInfo({
				message: `${data.error}`,
				type: "error"
			})
			return
		}

		setUser(data.data.user)
		setToken(data.data.token)
		navigate("/")
	}

	return (
		<div className="register-container">
			<div className="register">
				<input className="register-input" type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
				<input className="register-input" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
				<input className="register-input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
				<button className="register-button" onClick={handleSubmit}>
					Register
				</button>
				{info ? (
					<div
						className={`register-info`}
						style={info.type === "warning" ? { border: "1px solid orange" } : info.type === "error" ? { border: "1px solid red" } : {}}
					>
						{info.message}
					</div>
				) : null}
			</div>
		</div>
	)
}

export default Register
