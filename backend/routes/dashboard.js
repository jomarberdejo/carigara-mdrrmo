
const express = require('express');



const router = express.Router();
const { getStats, getPieChart, getLineChart } = require('../controllers/dashboardController');



router.get('/stats', getStats)
router.get('/piechart', getPieChart)
router.get('/linechart', getLineChart)
module.exports = router