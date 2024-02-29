const { randomBytes, createHmac } = require('crypto');
const { Schema , model } = require("mongoose");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName : {
        type : String , 
        required : true,
    } , 
    email : {
        type : String , 
        required : true,
        unique : true ,
    } ,
    salt : {
        type : String ,
       
    } ,
    password : {
        type : String , 
        required : true , 

    } ,
    profileImgageURL : {
        type : String , 
        default : "/images/default.png"
    } , 
    role : {
        type : String , 
        enum : ["USER" , "ADMIN"],
        default : "USER" ,
    } ,
} , { timestamps : true }
);

userSchema.pre("save" , function(next) {
    const user = this;

    if(!user.isModified("password"))
    return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256" , salt)
    .update(user.password)
    .digest("hex");

    user.salt = salt;
    user.password = hashedPassword;

});

const User = mongoose.model("user" , userSchema);

module.exports = User;