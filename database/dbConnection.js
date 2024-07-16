import mongoose from 'mongoose';

const database = ()=>{
    mongoose.connect(process.env.MONGO,{
        dbName: "CAR_RESELL",
    })
    .then(()=>{
        console.log("Connected to database");
    })
    .catch((err)=>{
        console.log(`Some error occured while connecting to databsse: ${err}`);
    });
};

export default database;