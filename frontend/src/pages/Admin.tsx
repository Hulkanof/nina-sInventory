import React from "react"
import { useState } from "react"
import add from "../functions/data/add"
import "../styles/Admin.css"

/**
 * Admin page
 * @param props 
 * @returns 
 */
const Admin: React.FC<defaultPageProps> = props => {
	const { user, token } = props
	const [type, setType] = useState("")
    const [newData, setNewData] = useState<FileList | null>(null)


    function handleAddData() {
        if (newData) {
            const file = newData[0]
            if (!file) return

            add(token,type,file).catch(err => console.log(err))
        }
    }

	if (user.admin < 1) return <div>Not authorized</div>
	else {
		/**
		 * Display the admin panel
		 */
		return (
			<div>
				<h1>Welcome to the Admin panel</h1>
				<div className="main-admin">
					<div className="uploadData">
                        <div className="uploadData-title-text">Upload new data : </div>
                        <input type="text" className="uploadData-input-text" placeholder="Data Type" onChange={e => setType(e.target.value)} />
                        <input type="file" className="uploadData-input-file" onChange={e => setNewData(e.target.files)} />
                        <button className="uploadData-input-button" onClick={handleAddData}>Upload</button>
                    </div>
                </div>
			</div>
		)
	}
}

export default Admin