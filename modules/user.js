const { required } = require("joi");
const mongoose = require("mongoose");
const passport = require("passport");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const useSchema = new Schema({
    email: {
        type: String,
        required: true
    },

});

useSchema.plugin(passportLocalMongoose);//automatically implement username,hashing,salting and hashed password

module.exports = mongoose.model("User", useSchema);
