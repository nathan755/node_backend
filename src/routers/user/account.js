const express = require('express');
const router = new express.Router();
const db = require("../../database/connection");
const protectedRoute = require("../../utils/auth");
const accountUsers = require("../../utils/query");
//// make these functions protected!!!! --- >>>

router.get("/account-users", async (request, response)=>{
	try {
		// get all users associated with specific account - account id in query param 
		const accountId = request.query.account;
		const users = await accountUsers(accountId);
		response.status(200).send(users);
	} catch (error) {
		console.log("error", error);
		return response.sendStatus(500);
	}
});

odule.exports = router;