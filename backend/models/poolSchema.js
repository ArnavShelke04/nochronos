import mongoose from 'mongoose';
const { Schema } = mongoose;

const poolSchema = new Schema({
    pool_id : String,
  subscription : {
    name : String,
    monthly_cost : String,
    category :
  },
  creator :{
    creator_id : String,
    creator_accname : String,
    avatarUrl : String
  }
},{
 timestamps :true
});
export const Pool = mongoose.model('Pool',poolSchema)