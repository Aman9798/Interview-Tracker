const jwt = require('jsonwebtoken');
const User = require('../models/Users');
// const {requireAdmin} = require('./adminMiddleware');
const Admin_list = require('../admin_list/admin');

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;

    //check json web token exists & is verified
    if(token){
        jwt.verify(token, 'aman secret', (err, decodedToken) => {     // checks the token and fires the function in 3rd argument if matches
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }
            else{
                //console.log(decodedToken);
                next();
            }
        })   
    }
    else{
        res.redirect('/login');
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'aman secret', async (err, decodedToken) => {     // checks the token and fires the function in 3rd argument if matches
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else{
                let user = await User.findById(decodedToken.id);
                let Email = user.email;
                var found=0;
                for(let i=0;i<Admin_list.length;i++){
                    if(Admin_list[i].email==Email){
                        found=1;
                    }
                }
                const user1 = {name: user.name, Admin: found};
                res.locals.user = user1;  // makes it accessible to views // attaching a local property 'user' to res
                next();
            }
        })
    }
    else{
        res.locals.user = null;
        next(); 
    }
}

module.exports = {requireAuth, checkUser};