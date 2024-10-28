const express = require('express');

const {
    getDataTransaksi,
    createInputItem,
    createOutputItem,
    deleteTransaksi,
    updateTransaksi
} = require('../controllers/data_transaksi.controller');

const dataTransaksiRouter = express.Router();

dataTransaksiRouter.get('/', getDataTransaksi);
dataTransaksiRouter.post('/createInput', createInputItem);
dataTransaksiRouter.post('/createOutput', createOutputItem);
dataTransaksiRouter.delete('/delete/:id', deleteTransaksi);
dataTransaksiRouter.put('/update/:id', updateTransaksi);

module.exports = dataTransaksiRouter;