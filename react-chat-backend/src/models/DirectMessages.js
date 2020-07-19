const mongoose = require('mongoose')

const directSchema = new mongoose.Schema({
    users: {type:Array,required:true},
    logs : {type:Array, required:true}
  } 
)

module.exports = mongoose.model("DirectMessages", directSchema)