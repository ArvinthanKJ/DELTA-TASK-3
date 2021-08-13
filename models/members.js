const mongoose = require('mongoose');

const { Schema } = mongoose;

const members= new Schema({
    name:{ type: String },
    email:{ type: String },
    roll:{ type: Number },
    password:{ type: String },
    teams:[{type:String}],
    teamNames:[{type:String}],
    teamCount:{type:Number,default:0}
})  
const Members=mongoose.model('_Members',members)

module.exports=Members