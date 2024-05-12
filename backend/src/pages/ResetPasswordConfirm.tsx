import React, { useState } from 'react';
import '../styles/ResetPasswordConfirmed.css';
import { useNavigate } from "react-router-dom"
import useToken from "../hooks/useToken"

const ResetPasswordConfirmed: React.FC<defaultPageProps> = () => {
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [info, setInfo] = useState<{
        message: string
        type: string
    }>()
    const navigate = useNavigate()
    const {token} = useToken()

    async function handleSubmit() {
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

        const res = await fetch("/api/v1/user/setNewPassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token : token,
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
        
    };

    return (
        <div className="main">
            <div className="reset-password">
                <h1>Reset Password</h1>
                <h2>Enter your new password.</h2>
                <input className="reset-password-input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <input className="reset-password-input" type="password" placeholder="Confirm Password" onChange={e => setPassword2(e.target.value)} />
                <button className="reset-password-button" onClick={handleSubmit}>
                    Send
                </button>
                {info ? (
                        <div
                            className={`alert alert-${info.type}`}
                            role="alert"
                        >
                            {info.message}
                        </div>
                    ) : null}
            </div>
        </div>
    );
}

export default ResetPasswordConfirmed;