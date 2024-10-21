// qL7pgSDLW0NwddyF
// mongodb+srv://hardikgate658:qL7pgSDLW0NwddyF@cluster0.873lx.mongodb.net/

import express from 'express';
import UserApi from "./routes/userRoutes.js"
import BankApi from "./routes/bankRoutes.js";
import conn from './conn/db.js';
import cors from "cors"
import bodyParser from 'body-parser';


conn()
const app = express()

app.use(cors())
app.use(express.json())



app.use("/api/v1/user",UserApi)
app.use("/api/v1/bank",BankApi)


app.listen(3000,()=>{
    console.log("Server is running on port 3000")  // Replace with your desired port number
})