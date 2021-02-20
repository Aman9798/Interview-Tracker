const mongoose =  require('mongoose');
const Company = require('./company');
const Person = require('./person');

/*
const ExperienceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    branch: {
        type: String,
        required: [true, 'This is a required field']
    },
    year:{
        type: String,
        required: [true, 'This is a required field'],
    },
    company:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company name is required']
    },
    experience:{
        type: String,
        required: [true, 'This is a required field'],
    },
    verify:{
        type: Boolean,
    }

});
*/
const ExperienceSchema = new mongoose.Schema({
    // name: {
    //     type: String,
    //     required: [true, 'Name is required']
    // },
    // branch: {
    //     type: String,
    //     required: [true, 'This is a required field']
    // },
    // year:{
    //     type: String,
    //     required: [true, 'This is a required field'],
    // },
    Person: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    },
    company:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company name is required']
    },
    experience:{
        type: String,
        required: [true, 'This is a required field'],
    },
    verify:{
        type: Boolean,
    },
    img: {
        data: Buffer,
        contentType: String
    }
});

ExperienceSchema.virtual('imgSrc').get(function(){
    if(this.img.data!=null && this.img.contentType!=null){
        return `data:${this.img.contentType};charset=utf-8;base64,${this.img.data.toString('base64')}`
    }
})

const Experience = mongoose.model('Experience', ExperienceSchema);

module.exports = Experience;