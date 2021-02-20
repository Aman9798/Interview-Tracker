const mongoose =  require('mongoose');
const {isEmail} = require('validator');
const Person = require('./person');
const bcrypt = require('bcrypt');
//const mocha = require('mocha');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],   // this checks the condition and displays the error
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']   // checks whether email entered is valid or not
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    Person: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    }
});


UserSchema.pre('save', async function(next){       // this fires before creating a new user
    var salt = await bcrypt.genSalt();            // generating string called salt to be added before the password before hashing
    this.password = await bcrypt.hash(this.password, salt);        // here this represents (user) going to be saved
    next();
});

//static method to login user
UserSchema.statics.login = async function(email, password){
    
    const user = await this.findOne({email});   //this is referred as User model
    
    if(user){
        const auth = await bcrypt.compare(password, user.password);   // it automatically compares the password entered with the hatched password in database

        if(auth){
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
} 

const User = mongoose.model('User', UserSchema);

module.exports = User;