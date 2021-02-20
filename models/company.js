const mongoose =  require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    verify: {
        type: Boolean,
       // default: false
    }
});


const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;