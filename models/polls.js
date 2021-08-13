const mongoose = require('mongoose');

const { Schema } = mongoose;

const polls= new Schema({
    question:{ type: String },
    options:{ type: Array },
    done:{ type: Number,default:0},
    teamID:{type:String},
    votedIds:[{type:String}],
    votes:[{vote:{type:Number,default:0}}],})  
const Polls=mongoose.model('_polls',polls)

module.exports=Polls