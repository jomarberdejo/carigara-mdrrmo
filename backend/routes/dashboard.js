
const express = require('express');
const { getStats, getPieChart, getLineChart } = require('../controllers/dashboardController');


const router = express.Router();

router.get('/stats', getStats)
router.get('/piechart', getPieChart)
router.get('/linechart', getLineChart)
module.exports = router