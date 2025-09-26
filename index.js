import express from 'express';
import { calculateShippingDate } from './scheduler.js';

const app = express();
app.use(express.json());

app.post('/shipping-date', (req, res) => {
  try {
    const { order_datetime, holidays } = req.body;
    if (!order_datetime) {
      return res.status(400).json({ error: 'order_datetime is required' });
    }
    const result = calculateShippingDate(order_datetime, holidays || []);
    res.json({ shipping_date: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
