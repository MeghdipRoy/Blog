import express from 'express';
import cors from 'cors';
// import { prisma } from './prisma';
// import authRouter from './routes/auth';
import postsRouter from './routes/posts';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);

app.get('/', (req, res) => {
  res.send('Blog API is running...');
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle Prisma shutdown
// process.on('SIGINT', async () => {
//   await prisma.$disconnect();
//   server.close(() => {
//     console.log('Server closed');
//     process.exit(0);
//   });
// });

// process.on('SIGTERM', async () => {
//   await prisma.$disconnect();
//   server.close(() => {
//     console.log('Server closed');
//     process.exit(0);
//   });
// });