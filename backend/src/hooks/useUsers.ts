import { UseQueryResult, useQuery } from "@tanstack/react-query"
import getUsers from "../functions/user/users"

/**
 * Hook to get all users
 * @returns The users
 */
const useUsers = (): UseQueryResult<User[], Error> => {
	return useQuery({
		queryKey: ["users"],
		queryFn: () => getUsers(),
		cacheTime: 1000 * 60 * 5
	})
}

export default useUsers
