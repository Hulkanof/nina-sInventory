import { useState } from "react"
import useToken from "../hooks/useToken"
import { useNavigate } from "react-router-dom"
import "../styles/Login.css"

const Login: React.FC<defaultPageProps> = ({ setUser }) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [info, setInfo] = useState<{
		message: string
		type: string
	}>()
	const navigate = useNavigate()
	const { setToken } = useToken()

	async function handleSubmit() {
		if (username === "" || password === "")
			return setInfo({
				message: "Please fill in all fields",
				type: "warning"
			})

		const res = await fetch("/api/v1/user/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username,
				password
			})
		})

		const data: BasicAPIResponse<{ user: User; token: string }> = await res.json()
		if (data.type === "error") {
			return setInfo({
				message: `${data.error}`,
				type: "error"
			})
		}

		setUser(data.data.user)
		setToken(data.data.token)
		navigate("/")
	}

	return (
		<div className="login-container">
			<div className="login">
				<input className="login-input" type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
				<input className="login-input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
				<button className="login-button" onClick={handleSubmit}>
					Login
				</button>
				<button className="forgot-password-button" onClick={() => navigate("/forgot-password")}>
					Forgot password
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
export default Login
