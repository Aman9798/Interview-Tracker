const mongoose =  require('mongoose');

const TopicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    verify:{
        type: Boolean,
       // default: false
    }
});


const Topic = mongoose.model('Topic', TopicSchema);

module.exports = Topic;