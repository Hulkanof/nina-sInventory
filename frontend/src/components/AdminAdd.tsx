import React, { useState } from "react"
import updateAdmin from "../functions/user/updateAdmin"
import useUsers from "../hooks/useUsers"
import { queryClient } from "../main"
import "../styles/AdminAdd.css"

const AdminAdd: React.FC<defaultPageProps> = ({ token }) => {
	const { data, isLoading, error } = useUsers()
	const [search, setSearch] = useState("")

	if (error) return <div>Error: {error.message}</div>
	if (isLoading) return <div>Loading...</div>
	if (!data) return <div>Users fetch failed</div>

	const filterData = data.filter(user => user.name.toLowerCase().includes(search.toLowerCase()) && user.admin < 1)

	function handleUpdate(id: string) {
		updateAdmin(token, id, 1).catch(err => console.log(err))
		if (!data) return
		const newData = data.filter(user => user.id !== id)
		queryClient.setQueriesData(["users"], (oldData: any) => {
			return newData
		})
	}

	return (
		<div className="user-card">
			<div className="user-card-title"></div>
			<div className="user-card-search">
				<input type="text" placeholder="Search..." onChange={e => setSearch(e.target.value)} className="search" />
			</div>
			<div className="user-card-users">
				{filterData.map((user, index) => (
					<div className="user-card-user" key={index}>
						<div className="user-card-user-name">{user.name}</div>
						<div className="user-card-user-email">{user.email}</div>
						<button className="user-card-user-add" onClick={() => handleUpdate(user.id)}>
							Add
						</button>
					</div>
				))}
			</div>
		</div>
	)
}

export default AdminAdd
