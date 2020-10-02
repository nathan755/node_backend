const { response } = require('express');
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
// whats stopping another user with a verified token making any of these requests --> have to check company id aswell? 
router.delete("/delete-user", async (request, response)=>{
	try {
		console.log("request.query",request.query)
		const userId = request.query.userId;
		db.query(`DELETE FROM user WHERE id=?`, [userId], (error, results, fields)=>{
			if(error){
				console.log("error", error)
				return response.sendStatus(500);
			}
			else{
				return response.sendStatus(200);
			}
		});
	} catch (error) {
		console.log("error", error);
		return response.sendStatus(500);
	}
});

router.get("/confirm-delete", async (request, response)=>{
	try {
		const accountId =  request.query.accountId
		db.query(`SELECT (confirm_delete) FROM account WHERE id=?`, [accountId], (error, results, fields)=>{
			if(error){
				console.log("error", error)
				return response.sendStatus(500);
			}
			else{
				return response.status(200).send(results[0])
			}
		});
	} catch (error) {
		console.log("error", error);
		return response.sendStatus(500);
	}
});



module.exports = router;