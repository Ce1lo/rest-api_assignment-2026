require('dotenv/config');
const app = require('./app');
const connectDB = require('./config/db');

async function start() {
    try {
        await connectDB();
        const port = process.env.PORT || 5000;
        app.listen(port, () => console.log(`Server: http://localhost:${port}`));
    } catch {
        console.error('Không thể khởi động. Kiểm tra MONGO_URI, tài khoản DB và Network Access của Atlas.');
        process.exitCode = 1;
    }
}

start();
