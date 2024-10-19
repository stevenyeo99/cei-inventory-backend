const express = require('express');

const userRouter = require('./routers/user.router');
const divisionRouter = require('./routers/division.router');
const itemRouter = require('./routers/item.router');

const app = express();
const PORT = 3000;

app.use('/user', userRouter);
app.use('/division', divisionRouter);
app.use('/item', itemRouter);


app.listen(PORT, () => {
    console.log(`cei-inventory-backup Running on Port ${PORT}`);
});