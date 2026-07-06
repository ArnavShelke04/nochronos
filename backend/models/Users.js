import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  _id : mongoose.Schema.ObjectId,
  name :{type : String}
},{
 timestamps :true
});
export const Users = mongoose.model('Users',userSchema)