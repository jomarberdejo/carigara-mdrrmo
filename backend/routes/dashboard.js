
const express = require('express');



const router = express.Router();
const { getStats, getPieChart, getLineChart } = require('../controllers/dashboardController');

const requireAuth = require('../middleware/requireAuth')

//require auth for all routes
router.use(requireAuth)

router.get('/stats', getStats)
router.get('/piechart', getPieChart)
router.get('/linechart', getLineChart)
module.exports = router