const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { initializeDatabase } = require('../utils/db');

const userRouter = require('./routers/user.router');
const divisionRouter = require('./routers/division.router');
const itemRouter = require('./routers/item.router');

// Config.
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const PORT = 3000;

console.log(path.join(__dirname, '..', '.env'));

dotenv.config({path: path.join(__dirname, '..', '.env')});

app.use('/user', userRouter);
app.use('/division', divisionRouter);
app.use('/item', itemRouter);


app.listen(PORT, async () => {
    await initializeDatabase();
    console.log(`cei-inventory-backup Running on Port ${PORT}`);
});