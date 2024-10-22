const express = require('express');

const {
    getItems,
    createItems
} = require('../controllers/item.controller');

const itemRouter = express.Router();

itemRouter.get('/', getItems);
itemRouter.post('/create', createItems);

module.exports = itemRouter;