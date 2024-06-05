import mongoose from "mongoose";



const Connection = async () => {
  const Url = process.env.MONGO_URL
  try {
    await mongoose.connect(Url)
    console.log('Databse Connected successfully');
  } catch (error) {
    console.log('Error while connecting with database', error.message);
  }
}

export default Connection;