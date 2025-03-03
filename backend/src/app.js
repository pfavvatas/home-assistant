import authRouter from './routes/auth.js';
import homesRouter from './routes/homes.js';
import electricityRouter from './routes/electricity.js';

app.use('/api/auth', authRouter);
app.use('/api/homes', homesRouter);
app.use('/api', electricityRouter); 