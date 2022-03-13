import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  AreaSeries,
  LineSeries,
  Hint,
  Crosshair,
  RVNearestXYEventHandler,
  AreaSeriesPoint,
  RVNearestXEventHandler,
} from 'react-vis';
import { bandwidth, bandwidthAggregate } from '../apiClient/bandwidth';
import { useAuth } from '../hooks/useAuth';

const toGbps = (value: number) => {
  const gbpsValue = value / (1000 * 1000 * 1000);

  return `${gbpsValue.toFixed(0)}Gbps`;
};
const toDateString = (value: number) => {
  const date = new Date(value);

  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
};

const useDebounce = <T = any>(value: T, delay: number) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );
  return debouncedValue;
};

export const CapacityOffloadChart = () => {
  const { token } = useAuth();
  //   const [, setHoveredValue] = useState({ x: 0, y: 0 });
  const [crosshairValues, setCrosshairValues] = useState<{ x: number; y: number }[]>([]);
//   const debouncedCrosshairValues = useDebounce(crosshairValues, 50);
  const from = 1509490800000;
  const to = Date.now();
  const { data: bandwithData } = useQuery(['bandwith'], () =>
    bandwidth({ session_token: token, to, from }),
  );
  const { data: maxesData } = useQuery(['maxes'], () =>
    bandwidthAggregate({ session_token: token, to, from, aggregate: 'max' }),
  );
  const hooverHandler: RVNearestXEventHandler<AreaSeriesPoint> = (data, { index }) => {
    // console.log({ data, e });
    // setHoveredValue(data);
    setCrosshairValues([
      //   data,
      { x: data.x, y: maxesData?.cdn || 0 },
      { x: data.x, y: maxesData?.p2p || 0 },
      //   { x: bandwithData?.cdn[index][0], y: bandwithData?.cdn[index][1] },
    ]);
  };

  if (!bandwithData || !maxesData) {
    return null;
  }

  const maxP2pLineData = bandwithData.p2p.map(([x]) => ({
    x,
    y: maxesData?.p2p,
  }));
  const maxCdnLineData = bandwithData.cdn.map(([x]) => ({
    x,
    y: maxesData?.cdn,
  }));

  return (
    <XYPlot
      height={300}
      width={900}
      margin={{
        left: 80,
      }}
      animation
      onMouseLeave={() => setCrosshairValues([])}
    >
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis tickTotal={15} tickFormat={toDateString} />
      <YAxis tickTotal={5} tickFormat={toGbps} />
      <AreaSeries
        curve="curveBasis"
        data={((bandwithData.p2p as Array<[number, number]>) || []).map(([x, y]) => ({ x, y }))}
        opacity={0.25}
        onNearestX={hooverHandler}
      />
      <AreaSeries
        curve="curveBasis"
        data={((bandwithData.cdn as Array<[number, number]>) || []).map(([x, y]) => ({ x, y }))}
        opacity={0.25}
      />
      <LineSeries data={maxP2pLineData} strokeStyle="dashed" />
      <LineSeries data={maxCdnLineData} strokeStyle="dashed" />

      {/* <Hint value={hoveredValue}>
        <div style={{ background: 'black' }}>
          <h3>Value of hint</h3>
          <p>{myValue.x}</p>
        </div>
      </Hint> */}
      <Crosshair values={crosshairValues} />
    </XYPlot>
  );
};
