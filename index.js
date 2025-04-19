const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectMongoose = require("./utils/connectMongoose");
const Logger = require("./utils/logger");

// تهيئة متغيرات البيئة
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Logging middleware
app.use((req, res, next) => {
    Logger.info(`${req.method} ${req.path}`, {
        query: req.query,
        body: req.body,
        ip: req.ip
    });
    next();
});

// Routes

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const courseRoutes = require("./routes/courseRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");

app.use('/', express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoutes);
// app.use("/api/students", studentRoutes); 
// app.use("/api/instructors", instructorRoutes);
app.use("/api/courses", courseRoutes);
// app.use("/api/statistics", statisticsRoutes);

app.get("/", (req, res) => {
    Logger.info('Root endpoint accessed');  
    res.send("Hello World");
});

// Error handling middleware
app.use((err, req, res, next) => {
    // تسجيل تفاصيل الخطأ
    Logger.error('Server Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        statusCode: err.statusCode || 500,
        body: req.body,
        params: req.params,
        query: req.query
    });
    
    // إرسال رسالة الخطأ للمستخدم
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'حدث خطأ في الخادم',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// تشغيل السيرفر والاتصال بقاعدة البيانات
(async () => {
    try {
        // الاتصال بقاعدة البيانات
        await connectMongoose();
        
        // تشغيل السيرفر
        app.listen(port, () => {
            Logger.info(`🚀 Server is running on port ${port}`);
        });
    } catch (error) {
        Logger.error('Failed to start server:', {
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
})();

// معالجة إنهاء التطبيق بشكل آمن
process.on('SIGTERM', () => {
    Logger.info('SIGTERM received. Shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    Logger.info('SIGINT received. Shutting down gracefully');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    Logger.error('Uncaught Exception:', {
        error: err.message,
        stack: err.stack
    });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    Logger.error('Unhandled Rejection:', {
        reason: reason,
        promise: promise
    });
    process.exit(1);
});
 

