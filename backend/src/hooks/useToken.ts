import { useEffect, useState } from "react"

/**
 * Hook to get the token of the user
 * @returns The token of the user
 */ 
const useToken = () => {
	const [token, setToken] = useState<string>("")
	const [isLoading, setIsLoading] = useState(true)
	function saveToken(userToken: string) {
		localStorage.setItem("token", userToken)
		setToken(userToken)
	}

	function clearToken() {
		localStorage.removeItem("token")
		setToken("")
	}

	useEffect(() => {
		const localToken = localStorage.getItem("token")
		if (localToken) setToken(localToken)
		setIsLoading(false)
	}, [])

	return {
		clearToken,
		isLoading,
		setToken: saveToken,
		token
	}
}

export default useToken
