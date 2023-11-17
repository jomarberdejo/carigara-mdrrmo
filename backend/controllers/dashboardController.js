const connection = require('../dbConfig/db');

const getStats = (req, res) => {
    const query = 'SELECT COUNT(*) as totalIncidents, ' +
      'SUM(CASE WHEN status = "Ongoing" THEN 1 ELSE 0 END) as ongoingIncidents, ' +
      'SUM(CASE WHEN status = "Pending" THEN 1 ELSE 0 END) as pendingIncidents, ' +
      'SUM(CASE WHEN status = "Resolved" THEN 1 ELSE 0 END) as resolvedIncidents ' +
      'FROM reports';
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching reports:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const reportStatistics = results[0];
        res.json(reportStatistics);
      }
    });
}


    const getPieChart = (req, res) => {
        const query = 'SELECT COUNT(*) as count, severity FROM reports GROUP BY severity';
      
        connection.query(query, (err, results) => {
          if (err) {
            console.error('Error fetching chart data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            const series = results.map((result) => result.count);
            const labels = results.map((result) => result.severity);
            res.json({ series, labels });
          }
        });
      
    }

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      const getLineChart = (req, res) => {
        const query = `
          SELECT
            COUNT(*) as count,
            DATE_FORMAT(reported_at, '%b') as month
          FROM
            reports
          GROUP BY
            MONTH(reported_at)
        `;
      
        connection.query(query, (err, results) => {
          if (err) {
            console.error('Error fetching monthly data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            const monthlyData = monthNames.map((monthName) => {
              const result = results.find((entry) => entry.month === monthName);
              return result ? result.count : 0;
            });
      
            res.json({ series: [{ name: 'Monthly Incidents', data: monthlyData }], categories: monthNames });
          }
        });
      };
      
      



module.exports = {
    getStats,
    getPieChart,
    getLineChart,
}

