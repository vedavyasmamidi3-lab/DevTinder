const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);



const mongoose=require("mongoose");

const connectDb= async()=>{
    await mongoose.connect(
       "mongodb+srv://vedavyasmamidi3_db_user:Harichandan@cluster0.g2vr9cr.mongodb.net/devtinder"
    );
};

module.exports=connectDb;