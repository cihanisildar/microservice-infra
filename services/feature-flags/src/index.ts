import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'feature-flags' });
});

app.listen(PORT, () => {
    console.log(`Feature-flags service running on port ${PORT}`);
});
