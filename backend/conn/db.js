
import mongoose from 'mongoose';

const conn = async () => {
    try {
        const connection = await mongoose.connect("mongodb+srv://hardikgate658:qL7pgSDLW0NwddyF@cluster0.873lx.mongodb.net/");
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error);
    }
};

export default conn;
