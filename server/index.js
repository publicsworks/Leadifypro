const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());

// Special middleware to capture raw body for Cashfree Webhooks
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('ProLeads API is running');
});

const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const professionalRoutes = require('./routes/professionalRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/professional', professionalRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
