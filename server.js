import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import sellerRouter from './routes/sellerRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

await connectDB()
await connectCloudinary()

app.get('/', (req, res) => res.send("API is Working"));

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173'];

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get('/',(req,res)=>res.send("API is working"))
app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
