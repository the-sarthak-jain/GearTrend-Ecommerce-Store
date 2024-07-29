const mongoose=require('mongoose');


const contactSchema = new mongoose.Schema({
    fullName:
    {
        type:String,
        required:true
    },

    emailAddress:
    {
        type:String,
        required:true
    },
    
    message:
    {
        type:String,
        required:true
    },
});

const contactSchema1 = new mongoose.model("contact", contactSchema);
module.exports = contactSchema1;