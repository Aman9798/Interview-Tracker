const mongoose =  require('mongoose');
const Topic = require('./topic');


const QuestionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Question name is required']
    },
    link: {
        type: String,
        required: [true, 'Link to the source is required']
    },
    topic:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: [true, 'Question topic is required']
    },
    verify:{
        type: Boolean
    }

});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;