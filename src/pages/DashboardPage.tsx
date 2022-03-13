import Header from '../lib/components/Header';
import { CapacityOffloadChart } from '../lib/components/CapacityOffloadChart';
import { ConcurrentViewersChart } from '../lib/components/ConcurrentViewersChart';

export const DashboardPage = () => (
  <>
    <Header />
    <div className="chi-main__content">
      <div className="chi-grid">
        <div className="chi-col" style={{ height: '300px' }}>
          <CapacityOffloadChart />
          <ConcurrentViewersChart />
        </div>
      </div>
    </div>
  </>
);

export default DashboardPage;
