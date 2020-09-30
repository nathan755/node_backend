
const jwt = require("jsonwebtoken");
const db = require("../database/connection");

const authenticate = async (request, response, next) => {
    try {
        // get jwt from auth header
        const authToken = request.header("Authorization").replace("Bearer ", "");
        // check authToken is valid using signiture. if not valid throws error.
        decodedToken = jwt.verify(authToken,"shushhh");
        // get user obj from db using id from jwt,
        const fetchUser = () => {
            return new Promise((resolve, reject)=>{
                db.query(`SELECT * FROM account WHERE id=?`,[decodedToken.payload.id], (error, results, fields)=>{
                    if(error!==null){
                        reject(error);
                    }
                    resolve(results[0]);
                })
            });
        }
        const currentUser = await fetchUser();
        // set user to current user. All auth routes will have access to user object.
        request.user = currentUser;
        next();
    } catch (error) {
        response.sendStatus(401)
    }
}

module.exports = authenticate;