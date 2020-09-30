const express = require('express');
const db = require("../../database/connection");
const router = new express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 12;
const jwt = require("jsonwebtoken");
const protectedRoute = require("../../utils/auth");
const { response } = require('express');


router.post("/login", async (request, response) => {
	console.log("login hit")
	try {
		// data from request.
		const { email, password } = request.body;
		console.log("email",email)
		console.log("pasword",password)

		// get hashed password from db.
		const getUserObejct = ()=>{
			return new Promise((resolve, reject)=>{
				db.query(`SELECT * FROM account WHERE email=?`, [email], (error, results, fields)=>{
					if(error !== null){
						reject(error);
					}
					resolve(results[0]);
				});
			});
		}
		const userObject = await getUserObejct();
		console.log("userObject",userObject)
		// check submitted password against hashed password in db.
		bcrypt.compare(password,userObject.password, (error, result)=>{
			if(error){
				throw new Error(error)
			}
			if(result){
				//passwords match, generate and sign JWT
				const payload = { id:userObject.id };
				const token = jwt.sign({payload}, "shushhh", {expiresIn:"24 days"});
				response.status(201).send({ 
					token: token,
					accountId:userObject.id,
					company_name:userObject.company_name,
					email:userObject.email  
				});
			}
			else{
				return response.status(401).send({ error: 'Passwords dont match dickhead' });
			}
		});
	
	} catch (error) {
		return response.sendStatus(500);
	}
});

router.post("/check-login", protectedRoute, async (request, response)=>{
	try {
		// if code gets here it means the user is authed because we have the protectedRoute argument
		const userData = {
			accountId:request.user.id,
			company_name:request.user.company_name,
			email:request.user.email
		}
		return response.status(200).send({ currentUser: userData });


	} catch (error) {
		console.log("error",error);
		return response.sendStatus(500);

	}
})

router.post("/account-sign-up", async (request, response) => {
	try {
		const hashPassword = await bcrypt.hash(request.body.password, saltRounds);
		let data = request.body;
		data["password"] = hashPassword;
		const values = Object.values(data);
		db.query(`INSERT INTO account (username,email,password,company_name,first_name,last_name) VALUES (?)`, [values], (error, results, fields) => {
			if (error !== null) {
				console.log("error", error)
				return response.sendStatus(500);
			}
			return response.sendStatus(201);
		});

	} catch (error) {
		return response.sendStatus(500);
	}
});

router.post("/user-sign-up", async (request, response)=>{
	// a user will be created either:
		// an account level user adding them in account management section
		// a user recieving an invite. (the account id will be got from email invite)
})



router.post("/forgot-password", async (request, response)=>{

})





router.post("/test",protectedRoute, async (request, response)=>{
	try {
		console.log("request.user", request.user);



	} catch (error) {
		
	}
} )


module.exports = router;