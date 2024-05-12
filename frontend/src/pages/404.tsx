import React, { useEffect } from "react"

const Page404: React.FC = () => {
	useEffect(() => {
		setTimeout(() => {
			window.location.href = "/"
		}, 5_000)
	})

	return (
		<div className="container-404">
			<h1>Page Not found!</h1>
		</div>
	)
}

export default Page404
