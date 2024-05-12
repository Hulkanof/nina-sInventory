/**
 * Update a user's admin state
 * @param token The user token
 * @param userId The id of the user to update
 * @param newAdminState The new admin state (0 for user, 1 for admin)
 * @returns The updated user
 * @throws Error if the request fails
 */
export default async function updateAdmin(token: string, userId: string, newAdminState: 0 | 1) {
	const response = await fetch(`/api/v1/user/${userId}/admin`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			admin: newAdminState
		})
	})

	const data: BasicAPIResponse<User> = await response.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
