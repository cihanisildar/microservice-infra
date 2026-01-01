import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'rate-limit' });
});

app.listen(PORT, () => {
    console.log(`Rate-limit service running on port ${PORT}`);
});
