const mongoose=require('mongoose');


const uploadProdSchema = new mongoose.Schema({
    prodImage:
    {
        type:String,
        required:true
    },

    prodName:
    {
        type:String,
        required:true
    },
    
    prodCategory:
    {
        type:String,
        required:true
    },

    prodOrgPrice:
    {
        type:String,
        required:true
    },

    prodDealPrice:
    {
        type:String,
        required:true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
      }
});

const uploadProdSchema1 = new mongoose.model("uploadProduct", uploadProdSchema);
module.exports = uploadProdSchema1;