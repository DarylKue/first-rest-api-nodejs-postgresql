const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

const port = process.env.port || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}...`)
});

app.get('/', (req, res) => {
    res.send('This is the home page');
});

app.use('/category', categoryRoutes);

app.use('/product', productRoutes);