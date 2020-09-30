const db = require("../database/connection");

const accountUsers = (accountId) => {
    // get all users associated with certain account.
    console.log("acc user query func")
    return new Promise((resolve, reject)=>{
        db.query(`SELECT email, role, first_name, last_name, id FROM user WHERE company_id=?`, [accountId], (error, results, fields)=>{
            if(error){
                reject(error)
                console.log("error", error)
            }
            resolve(results)
        })
    })
}

module.exports = accountUsers;