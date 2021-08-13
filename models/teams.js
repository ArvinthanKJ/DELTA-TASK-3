const mongoose = require('mongoose');

const { Schema } = mongoose;

const teams= new Schema({
    name:{ type: String },
    description:{ type: String },
    adminId:{type:String},
    groupMembers:[{ type: String }]
})  
const Teams=mongoose.model('_Teams',teams)

module.exports=Teams