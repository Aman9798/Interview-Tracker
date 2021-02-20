const mongoose =  require('mongoose');

const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    branch: {
        type: String,
        required: [true, 'This is a required field']
    },
    year: {
        type: String,
        required: [true, 'This is a required field'],
    }
});

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;