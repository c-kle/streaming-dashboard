import Header from '../lib/components/Header';
import { CapacityOffloadChart } from '../lib/components/CapacityOffloadChart';
import { ConcurrentViewersChart } from '../lib/components/ConcurrentViewersChart';
import { BrushChart } from '../lib/components/BrushChart';
import { ChartFilterProvider } from '../lib/contexts/ChartFilterContext';
import { useEffect, useRef, useState } from 'react';

const DEFAULT_MARGIN = 50;
const DEFAULT_WIDTH = 900 + DEFAULT_MARGIN;

const processWidth = (value: number | undefined) => (value ?? DEFAULT_WIDTH) - DEFAULT_MARGIN;

export const DashboardPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(processWidth(contentRef.current?.clientWidth));

  useEffect(() => {
    const handler = () => setWidth(processWidth(contentRef.current?.clientWidth));

    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setWidth(processWidth(contentRef.current?.clientWidth));
    }
  }, [contentRef.current]);

  return (
    <ChartFilterProvider>
      <Header />
      <div className="chi-main__content" ref={contentRef}>
        <div className="chi-grid">
          <div className="chi-col -w--12 -mt--2">
            <CapacityOffloadChart width={width} height={200} />
          </div>
          <div className="chi-col -w--12 -mt--2">
            <ConcurrentViewersChart width={width} height={200} />
          </div>
          <div className="chi-col -w--12 -mt--2">
            <BrushChart width={width} height={100} />
          </div>
        </div>
      </div>
    </ChartFilterProvider>
  );
};

export default DashboardPage;
