const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title:{type:String, required:true, unique:true},
    desc:{type:String},
    img:{type:String},
    imgTitle:{type:String},
    imgThumbnail:{type:String},
    trailer:{type:String},
    video:{type:String},
    year:{type:String},
    limit:{type:Number},
    genre:{type:String},
    duration:{type:String},
    isMovie:{type:Boolean, default: true},
    },
    {timestamps:true}
);

module.exports = mongoose.model("Movie", MovieSchema);