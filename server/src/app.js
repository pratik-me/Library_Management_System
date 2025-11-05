import express from "express"
import {config} from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import { connectDB } from "./Database/db.js";
import { errorMiddleware } from "./Middlewares/errorMiddlewares.js";
import {authRouter, bookRouter, borrowRouter, userRouter} from "./routes/index.js";
import { removeUnverfiedAccounts } from "./services/removeUnverifiedAccounts.js";

export const app = express();

config({
    path : "./src/config/.env"
})

app.use(cors({
    origin : [process.env.FRONTEND_URL],
    methods : ["GET", "POST", "PUT", "DELETE"],
    credentials : true,
}))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({
    extended : true,
}))

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

removeUnverfiedAccounts();
connectDB();

app.use(errorMiddleware);    // errorMiddleware must be in the last of program and should be passed as function not as a function call so no () after errorMiddleware.