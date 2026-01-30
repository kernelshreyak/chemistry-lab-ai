import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reactionsRouter from './routes/reactions.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reactions', reactionsRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Chemistry Lab API is running' });
});

app.listen(PORT, () => {
    console.log(`🧪 Chemistry Lab API server running on http://localhost:${PORT}`);
});
