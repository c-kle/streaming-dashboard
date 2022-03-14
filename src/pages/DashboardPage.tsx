import Header from '../lib/components/Header';
import { CapacityOffloadChart } from '../lib/components/CapacityOffloadChart';
import { ConcurrentViewersChart } from '../lib/components/ConcurrentViewersChart';
import { BrushChart } from '../lib/components/BrushChart';
import { ChartFilterProvider } from '../lib/contexts/ChartFilterContext';

export const DashboardPage = () => (
  <ChartFilterProvider>
    <Header />
    <div className="chi-main__content">
      <div className="chi-grid">
        <div className="chi-col" style={{ height: '300px' }}>
          <CapacityOffloadChart />
          <ConcurrentViewersChart />
          <BrushChart />
        </div>
      </div>
    </div>
  </ChartFilterProvider>
);

export default DashboardPage;
