import express from "express";
import cors from "cors";
import { router as apiRoutes } from "./routes/index.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { limiter } from "./middlewares/rateLimiter.js";

export const app = express();

// ต้องมี app.set("trust proxy", 1);  เพื่อให้ limiter ทำงาน
// เชื่อ ip นั้นๆ ไม่ใช่เพียงแค่ vercel อย่างเดียว
app.set("trust proxy", 1);

// GLobal middleware
app.use(helmet());
//

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://frontend-react-app-liart.vercel.app",
    ],
    credentials: true,
}; 

app.use(cors(corsOptions));

// GLobal middleware มี app.use(helmet()); แล้วก็ setting ดานล้า่ง
app.use(limiter);

app.use(express.json());

// middleware to parse cookies (required for cookie-based auth)
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api", apiRoutes);


// *** error มันจะเข้าตรงนี้ก่อน ***   // อยากให้เข้าตัวนี้ ให้เอาตัวนี้ไว้บน
// catch-all for 404: Not Found
app.use((req, res, next) => {
    const error = new Error(`Not Found ${req.method} ${req.originalUrl}`);
    error.name = error.name || "Not Found";
    error.status = error.status || 404;
    next(error)
});


// *** error จะเข้าตัว Centralized Error เมื่อเข้าตัวบนก่อน
// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        stack: err.stack,
    });
});



