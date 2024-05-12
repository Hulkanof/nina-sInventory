import { createUser, loginUser, getUser, getUsers, updateAdmin, passwordReset, setNewPassword } from "../api/user"
import { verifyToken } from "../middlewares/verifyToken"
import type { Route } from "../types/express"
import { verifyTokenAdmin } from "../middlewares/verifyTokenAdmin"
import multer from "multer"
import { questionNewPassword } from "readline-sync"
import { checkResetToken } from "../api/user"
import { uploadData } from "../api/data"

/**
 * Express routes
 */
export const routes: Route[] = [
	{
		// Get all users
		methods: ["get"],
		path: "/api/v1/users",
		middlewares: [],
		handler: getUsers
	},
	// ------------------ user Routes ------------------
	{
		// Get user data from JWT token
		methods: ["get"],
		path: "/api/v1/user",
		handler: getUser
	},
	{
		// Create a new user account and return a JWT token
		methods: ["post"],
		path: "/api/v1/user/create",
		handler: createUser
	},
	{
		// Login to an existing user account and return a JWT token
		methods: ["post"],
		path: "/api/v1/user/login",
		handler: loginUser
	},
	{
		// Change admin state of user
		methods: ["put"],
		path: "/api/v1/user/:id/admin",
		middlewares: [verifyTokenAdmin],
		handler: updateAdmin
	},
	{
		// Ask for password reset
		methods: ["post"],
		path: "/api/v1/user/reset",
		handler: passwordReset
	},
	{
		// Set new password
		methods: ["post"],
		path: "/api/v1/user/setNewPassword",
		handler: setNewPassword
	},
	{
		// Check if reset token is valid
		methods: ["post"],
		path: "/api/v1/user/checkResetToken",
		handler: checkResetToken
	},
	// ------------------ data Routes ------------------
	{
		// Upload data
		methods: ["post"],
		path: "/api/v1/data",
		middlewares: [multer({limits:{fileSize: 10000000, files: 1} }).single("file")],
		handler: uploadData
	}

]
