import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import { userRoutes } from './app/modules/User/user.routes';
import { AdminRoutes } from './app/modules/Admin/admin.routes';


const app:Application = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());

app.get('/',(req:Request,res:Response)=>{
    res.send({
        Message:"PH HealthCare Server"
    })
})
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/admin',AdminRoutes)
export default app;