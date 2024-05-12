import React, { useState } from 'react';
import '../styles/ResetPassword.css';
import { useNavigate } from "react-router-dom"
import useToken from "../hooks/useToken"


const ResetPassword: React.FC<defaultPageProps> = () => {
    const [resetToken, setResetToken] = useState("")
    const [info, setInfo] = useState<{
        message: string
        type: string
    }>()
    const navigate = useNavigate()
    const { setToken } = useToken()
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    async function handleSubmit() {
        if (resetToken === "")
            return setInfo({
                message: "Please fill in all fields",
                type: "warning"
            })

        if (password === "" || password2 === "")
            return setInfo({
                message: "Please fill in all fields",
                type: "warning"
            })

        if (password !== password2)
            return setInfo({
                message: "Passwords do not match",
                type: "warning"
            })

        const res = await fetch("/api/v1/user/checkResetToken", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                resetToken : resetToken,
                password : password
            })
        })

        const data: BasicAPIResponse<{ user: User; token: string }> = await res.json()
        if (data.type === "error") {
            setInfo({
                message: `${data.error}`,
                type: "error"
            })
            return
        }

        setInfo({
            message: `${data.data}`,
            type: "success"
        })
        
        
        navigate("/login")
        
    }

    return (
        <div className="main">
            <div className="reset-password">
                <h1>Reset Password</h1>
                <h2>Enter your reset token to reset your password.</h2>
                <input className="reset-password-input" type="text" placeholder="Reset Token" onChange={e => setResetToken(e.target.value)} />
                <input className="reset-password-input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <input className="reset-password-input" type="password" placeholder="Confirm Password" onChange={e => setPassword2(e.target.value)} />
                <button className="reset-password-button" onClick={handleSubmit}>
                    Send
                </button>
                {info ? (
                        <div
                            className={`register-info`}
                            style={info.type === "warning" ? { border: "1px solid orange" } : info.type === "error" ? { border: "1px solid red" } : {}}
                        >
                            {info.message}
                        </div>
                    ) : (
                        <></>
                    )}
            </div>
        </div>
    );
}

export default ResetPassword;