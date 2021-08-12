const mongoose = require('mongoose');

const { Schema } = mongoose;

const teams= new Schema({
    name:{ type: String },
    description:{ type: String },
    adminId:{type:String},
    groupMembers:[{ type: String }],
    polls:[{ 
        question:{ type: String },
        options:[{type:String}],
        votes:[{vote:{type:Number,default:0}}],
        done:{ type: Number,default:0},
        votedIds:[{type:String}]
     }]
})  
const Teams=mongoose.model('_Teams',teams)

module.exports=Teams