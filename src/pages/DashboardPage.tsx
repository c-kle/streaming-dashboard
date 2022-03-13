import Header from '../lib/components/Header';
import { CapacityOffloadChart } from '../lib/components/CapacityOffloadChart';

export const DashboardPage = () => (
  <>
    <Header />
    <div className="chi-main__content">
      <div className="chi-grid">
        <div className="chi-col" style={{ height: '300px' }}>
          <CapacityOffloadChart />
        </div>
      </div>
    </div>
  </>
);

export default DashboardPage;
