const User = require('../models/Users');
const Person = require('../models/person');
const jwt = require('jsonwebtoken');
const { name } = require('ejs');
const e = require('express');
//handle errors
const handleErrors = (error) => {
    console.log(error.message, error.code);
    var err = { email: '', password: '', name: ''};

    //incorrect email
    if(error.message==='Incorrect email'){
        err.email = 'Email is not registered';
    }

    //incorrect password
    if(error.message==='Incorrect password'){
        err.password = 'Password is incorrect';
    }

    //duplicate error code
    if(error.code===11000){
        err.email = 'that email is already registered';
        return err;
    }

    // validation errors
    if(error.message.includes('user validation failed')){
        // console.log(error);
        //console.log(Object.values(error.errors));     // errors is an object of error // password and email are objects of errors
        /*
        Object.values(error.errors).forEach(error => {  // this displays erros in array form
           console.log(error.properties);
        })
        */
        /*
        // this the error format
        {
        message: 'Please enter a valid email',
        type: 'user defined',
        validator: <ref *1> [Function: isEmail] { default: [Circular *1] },
        path: 'email',
        value: 'mario'
        }
        {
        validator: [Function (anonymous)],
        message: 'Minimum password length is 6 characters',
        type: 'minlength',
        minlength: 6,
        path: 'password',
        value: '164'
        }
        */
        Object.values(error.errors).forEach(({properties}) => {  // here we are destructuring the properties  // it outputs error in same format as above
            //console.log(properties);
            err[properties.path] = properties.message;
        });
    }

    return err;
    
}

//creating jwt token
var maxAge = 6*60*60;
const createToken = (id) => {
    return jwt.sign({id}, 'aman secret', {
        expiresIn: maxAge
    });
};

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const {email, password, name, branch, year} = req.body;
    //console.log(email, password);
    //res.send('new signup');
    try{                               // try helps us to do something and catches the error  // here we will create new user
        const pers = await Person.create({name, branch, year});
        const us = await User.create({ email, password, name, Person: pers});
        const token = createToken(us._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});   // cookie name=jwt
        res.status(201).json({user: us._id});
    }
    catch(error){
        var errors = handleErrors(error);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req, res) => {
    //console.log(req.body);   // req.body is the data passed in post request  // during login { email: 'mario@google.com', password: 'test@123' }
    const {email, password, name} = req.body;
    //console.log(email, password);
    //res.send('user login');
    try{
        const user = await User.login(email, password, name);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user._id});
    }
    catch(error){
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});         // replaces the present cookie with another cookie of age 1 microsecond
    res.redirect('/');       // redirects to the home page
}