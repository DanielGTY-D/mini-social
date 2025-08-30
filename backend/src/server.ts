import express, { json } from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes'
import userRouter from './routes/userRoutes';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';

const app = express()

// habilitar lectura del body
app.use(json());

// cors
app.use(cors(corsConfig))

// leer env
dotenv.config();

// morgan para losg
app.use(morgan('dev'));

// aui la conexion a la base de datos
connectDB()
// aqui las rutas
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


export default app