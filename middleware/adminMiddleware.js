const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Admin_list = require('../admin_list/admin');

const requireAdmin = async  (req, res) => {

    const token = req.cookies.jwt;
    var approved = 0;
    await jwt.verify(token, 'aman secret', async (err, decodedToken) => {     // checks the token and fires the function in 3rd argument if matches
            
            if(err){
                approved=0;
            }
            if(decodedToken){
                       
                const Id = decodedToken.id;
                let user = await User.findById(Id);
                let Email = user.email;
                   
                for(var i=0;i<Admin_list.length;i++){
                            
                    if(Admin_list[i].email===Email){
                        approved = 1;
                        return approved;                              
                    }
                }
            }
        })   

    return approved;
}

module.exports = {requireAdmin };