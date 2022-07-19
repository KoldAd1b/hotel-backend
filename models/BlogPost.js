const mongoose =require("mongoose");


const commentSchema = new mongoose.Schema({
    text:{type:String,required:[true,"A comment must have some text"]},
    author:{type:String,required:[true,"A comment must have an author"]},
    photoUrl:{type:String},
})

const postSchema =new  mongoose.Schema({
    body:{type:String,required:[true,"A blog must have a body"]},
    title:{type:String,required:[true,"A blog must have a title"]},
    subHeading:{type:String},
    author:{type:mongoose.SchemaTypes.ObjectId,ref:"User",required:[true,"A blog cannot exist without an author"]},
    comments:[commentSchema],
    likes:[{type:mongoose.SchemaTypes.ObjectId}],
    image:{type:String},
})


module.exports = mongoose.model("BlogPost",postSchema);