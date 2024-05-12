import React, { useState } from "react"
import updateAdmin from "../functions/user/updateAdmin"
import useUsers from "../hooks/useUsers"
import "../styles/AdminCard.css"
import { queryClient } from "../main"

const AdminCard: React.FC<defaultPageProps> = ({ token }) => {
	const { data, isLoading, error } = useUsers()
	const [search, setSearch] = useState("")

	if (error) return <div>Error: {error.message}</div>
	if (isLoading) return <div>Loading...</div>
	if (!data) return <div>Users fetch failed</div>

	const filterData = data.filter(user => user.name.toLowerCase().includes(search.toLowerCase()) && user.admin > 0)

	function handleRemove(id: string) {
		updateAdmin(token, id, 0).then(() => {
			if (!data) return
			const newData = data.filter(user => user.id !== id)
			queryClient.setQueriesData(["users"], (oldData: any) => {
				return newData
			})
		}).catch(err => console.log(err))
	}

	return (
		<div className="admin-card">
			<div className="admin-card-title"></div>
			<div className="admin-card-search">
				<input type="text" placeholder="Search..." onChange={e => setSearch(e.target.value)} className="search" />
			</div>
			<div className="admin-card-users">
				{filterData.map((user, index) => (
					<div className="admin-card-user" key={index}>
						<div className="admin-card-user-name">{user.name}</div>
						<div className="admin-card-user-email">{user.email}</div>
						{user.admin === 1 ? (
							<button className="admin-card-user-remove" onClick={() => handleRemove(user.id)}>
								Remove
							</button>
						) : (
							<div className="empty"></div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export default AdminCard
