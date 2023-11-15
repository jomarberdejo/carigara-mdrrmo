import PieChart from './PieChart'
import LineChart from './LineChart'

const Charts = () => {
  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <PieChart />
        <LineChart />
    </div>
  );
};

export default Charts;
