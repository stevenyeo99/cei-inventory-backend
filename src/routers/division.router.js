const express = require('express');

const {
    createDivision,
    getDivisions,
} = require('../controllers/division.controller');

const divisionRouter = express.Router();

divisionRouter.post('/create', createDivision);
divisionRouter.get('/', getDivisions);

module.exports = divisionRouter;