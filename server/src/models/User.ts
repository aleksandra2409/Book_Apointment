import mongoose, { Types } from "mongoose";
import { User } from "../types";

const userSchema = new mongoose.Schema<User>({
    first_name: String,
    last_name:String,
    company:String,
    address1:String,
    address2:String,
    zipCode:String,
    region:String,
    country:String,
    email:String,
    emailConf:Boolean,
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;