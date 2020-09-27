const express = require('express');
const db = require("../../database/connection");
const router = new express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 12;
const jwt = require("jsonwebtoken");
const protectedRoute = require("../../utils/auth");
const { request, response } = require('express');

router.post("/login", async (request, response) => {
	try {
		// data from request.
		const { email, password } = request.body;
		// get hashed password from db.
		const getUserObejct = ()=>{
			return new Promise((resolve, reject)=>{
				db.query(`SELECT * FROM user WHERE email=?`, [email], (error, results, fields)=>{
					if(error !== null){
						reject(error);
					}
					resolve(results[0]);
				});
			});
		}
		const userObject = await getUserObejct();
		// check submitted password against hashed password in db.
		bcrypt.compare(password,userObject.password, (error, result)=>{
			if(error){
				throw new Error(error)
			}
			if(result){
				//passwords match, generate and sign JWT
				const payload = { id:userObject.id };
				const token = jwt.sign({payload}, "shushhh", {expiresIn:"24 hours"});
				response.status(201).send({ token: token });
			}
			else{
				return response.status(401).send({ error: 'Passwords dont match dickhead' });
			}
		});
	
	} catch (error) {
		return response.sendStatus(500);
	}
});

router.post("/sign-up", async (request, response) => {
	try {
		const hashPassword = await bcrypt.hash(request.body.password, saltRounds);
		let data = request.body;
		data["password"] = hashPassword;
		const values = Object.values(data);
		db.query(`INSERT INTO user (username,email,password,role,first_name,last_name,company_id) VALUES (?)`, [values], (error, results, fields) => {
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

router.post("/test",protectedRoute, async (request, response)=>{
	try {
		console.log("request.user", request.user);



	} catch (error) {
		
	}
} )


module.exports = router;