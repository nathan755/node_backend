const { response } = require('express');
const express = require('express');
const router = new express.Router();
const db = require("../../database/connection");
const protectedRoute = require("../../utils/auth");
const accountUsers = require("../../utils/query");
const cryptoRandomString = require('crypto-random-string');
const nodemailer = require('nodemailer');
const transport = require("../../settings/email");
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

router.patch("/update-user", async (request, response)=>{
	try {
		// will have to update this kind of thing to only update the user with the correct id and company id
		// fix this when i go over auth agian.
		const userId =  request.query.userId
		const {email, role, first_name, last_name } = request.body
		db.query(`UPDATE user SET email = ?, role = ?, first_name = ?, last_name = ? WHERE id=?`, [email,role,first_name,last_name,userId], (error, results, fields)=>{
			if(error){
				console.log("error", error)
				return response.sendStatus(500);
			}
			else{
				return response.status(201).send(results[0])
			}
		});
	} catch (error) {
		console.log("error", error);
		return response.sendStatus(500);
	}
});

router.post("/invite", async (request, response)=>{
	try {
		const token = cryptoRandomString({length: 32});
		const {email,accountId} = request.body;
		const values = [parseInt(accountId),email,token];
		const insertToken = () => {
			return new Promise ((resolve, reject)=>{
				db.query(`INSERT INTO invites (accountid,email,token) VALUES (?)`, [values], (error, results, fields) => {
					if (error !== null) {
						reject(error)
						return response.sendStatus(500);
					}
					resolve(results[0]);
				});
			});
		}
		// only send an email if the data is successfully inserted to db;
		await insertToken();
		const message = {
			from: 'hello@food.com', // Sender address
			to: email,         // List of recipients
			subject: 'Invite Link', // Subject line
			html: `<a>http://localhost:3000?token=${token}</a>` // encode?
		};
		transport.sendMail(message, function(err, info) {
			if (err) {
			  console.log(err)
			  return response.sendStatus(500);
			} else {
			  console.log(info);
			  return response.sendStatus(200);
			}
		});
	} 
	catch (error) {
		return response.sendStatus(500);
	}
});





module.exports = router;