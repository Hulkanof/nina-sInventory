/**
 * Get all the users in the database
 * @throws Error if the request fails
 */
export default async function getUsers() {
	const response = await fetch("/api/v1/users")

	const data: BasicAPIResponse<User[]> = await response.json()
	if (data.type === "error") throw new Error(data.error)
	return data.data
}
