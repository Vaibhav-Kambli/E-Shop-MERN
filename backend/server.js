import express from "express";
import products from "./data/products.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import productRoutes from './routes/productRoutes.js'
import {notFound, errorHandler} from './middleware/errorMiddleware.js'

dotenv.config();

connectDB();

const app = express();

// //middleware
// app.use((req, res, next) => {
// 	console.log("Hello, world!");
// 	next()
// })

app.get("/", (req, res) => {
	res.send("API is running");
});

app.use('/api/products', productRoutes)

app.use(notFound)

app.use(errorHandler)



const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`)
);
