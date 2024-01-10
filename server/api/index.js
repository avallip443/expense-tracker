const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/Transaction.js');
const { default: mongoose } = require('mongoose');
const app = express();

const url = '/api/test';
const port = 4040;
const message = 'test okkkkk';

app.use(cors());
app.use(express.json());

app.get(url, (req, res) => {
  res.json(message);
});

app.post('/api/transaction', async (req, res) => {
    try {
        console.log('Connecting to MongoDB database...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB database connected successfully');

        if (
            !req.body.name ||
            !req.body.description ||
            !req.body.datetime ||
            !req.body.price
        ) {
            res.status(400).send('Missing required fields');
            return;
        }

        const { price, name, description, datetime } = req.body;
        const transaction = await Transaction.create({
            price, 
            name, 
            description, 
            datetime
        });

        res.json(transaction);
    } catch (error) {
        console.error('Error connecting to MongoDB database:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/transaction', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();
    res.json(transactions);
});

// static port
app.listen(4040);
console.log(`App listening on port http://localhost:${port}${url}`);

// pwd: vVgc9gnHAFk7I8ly
