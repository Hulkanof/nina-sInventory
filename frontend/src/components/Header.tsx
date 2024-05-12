import { Link, useNavigate } from "react-router-dom"
import "../styles/Header.css"
import React from "react"
import useToken from "../hooks/useToken"

const Header: React.FC<defaultPageProps> = ({ user, setUser }) => {
	const { clearToken } = useToken()
	const navigate = useNavigate()

	async function handleLogout() {
		clearToken()
		setUser({ id: "", name: "", email: "", admin: 0 })
		navigate("/login")
	}

	return (
		<div className="header">
			<div className="header-title">The Compendium Project</div>
			{user.id !== "" ? (
				<div className="header-nav">
					<div className="header-username">{user.name}</div>
					<Link to="/">Home</Link>
					<a onClick={handleLogout}>Logout</a>
				</div>
			) : (
				<div className="header-nav">
					<Link to="/login">Login</Link>
					<Link to="/register">Register</Link>
				</div>
			)}
		</div>
	)
}

export default Header
