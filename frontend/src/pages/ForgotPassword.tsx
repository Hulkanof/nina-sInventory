import React, { useState } from "react";
import "../styles/ForgotPassword.css"

const ForgotPassword: React.FC<defaultPageProps> = () => {
    const [email, setEmail] = useState("")
    const [info, setInfo] = useState<{
        message: string
        type: string
    }>()

    async function handleSubmit() {
        if (email === "")
            return setInfo({
                message: "Please fill in all fields",
                type: "warning"
            })

        if (!email.includes("@"))
            return setInfo({
                message: "Please enter a valid email",
                type: "warning"
            })

        const res = await fetch("/api/v1/user/reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email
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
    }
    
    return (
        <div className="main">
            <div className="forgot-password">
                <h1>Forgot Password</h1>
                <h2>Enter your email to receive a link to reset your password.</h2>
                <input className="forgot-password-input" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                <button className="forgot-password-button" onClick={handleSubmit}>
                    Send
                </button>
                {info ? (
                        <div
                            className={`register-info`}
                            style={info.type === "warning" ? { border: "1px solid orange" } : info.type === "error" ? { border: "1px solid red" } : {}}
                        >
                            {info.message}
                        </div>
                    ) : null}
            </div>
        </div>
    );
}

export default ForgotPassword;