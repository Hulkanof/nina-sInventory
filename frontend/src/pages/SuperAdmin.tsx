import React from "react"
import AdminCard from "../components/AdminCard"
import "../styles/SuperAdmin.css"
import AdminAdd from "../components/AdminAdd"
import "../styles/AdminAdd.css"
import "../styles/AdminCard.css"

const SuperAdmin: React.FC<defaultPageProps> = props => {
	const { user } = props

	if (user.admin < 2) return <div>Not authorized</div>
	else {
		return (
			<div>
				<h1>Welcome to the SuperAdmin panel</h1>
				<div className="main">
					<div className="manage">
						<div className="manage-title">Manage current administrators :</div>
						<AdminCard {...props} />
					</div>
					<div className="add">
						<div className="add-title">Add new administrators :</div>
						<AdminAdd {...props} />
					</div>
				</div>
			</div>
		)
	}
}

export default SuperAdmin