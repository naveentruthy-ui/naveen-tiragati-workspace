
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/upload', (req, res) => {
  const { make, model, badge, log } = req.body;
  res.json({ make, model, badge, log });
});

app.listen(4000, () => console.log('Server running on 4000'));
