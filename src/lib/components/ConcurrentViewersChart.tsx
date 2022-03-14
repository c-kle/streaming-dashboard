import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  XYPlot,
  XAxis,
  YAxis,
  LineSeries,
  Crosshair,
  RVNearestXEventHandler,
  AreaSeriesPoint,
} from 'react-vis';
import { audience } from '../apiClient/audience';
import { useAuth } from '../hooks/useAuth';
import { useChartFilter } from '../hooks/useChartFilter';
import { msToDays, toDateString, toDateTimeString } from '../utils';

export const ConcurrentViewersChart = (props: { height: number; width: number }) => {
  const { token } = useAuth();
  const { filter } = useChartFilter();
  const [crosshairValues, setCrosshairValues] = useState<{ x: number; y: number }[]>([]);

  const from = filter.from;
  const to = filter.to;

  const { data: audienceData, refetch } = useQuery({
    queryKey: ['audience'],
    enabled: false,
    queryFn: () => audience({ session_token: token, from, to }),
  });

  const hooverHandler: RVNearestXEventHandler<AreaSeriesPoint> = (data, { index }) => {
    setCrosshairValues([data]);
  };

  useEffect(() => {
    refetch();
  }, [filter.from, filter.to]);

  if (!audienceData) {
    return null;
  }

  return (
    <div className="chi-card">
      <div className="chi-card__header -sm">
        <div className="chi-card__title">Concurrent viewers</div>
      </div>
      <div className="chi-card__content">
        <XYPlot
          {...props}
          margin={{
            left: 80,
          }}
          onMouseLeave={() => setCrosshairValues([])}
        >
          <XAxis tickTotal={msToDays(to - from)} tickFormat={toDateString} />
          <YAxis tickTotal={4} />

          <LineSeries
            curve="curveBasis"
            data={audienceData.audience.map(([x, y]) => ({ x, y }))}
            onNearestX={hooverHandler}
          />

          <Crosshair
            values={crosshairValues}
            titleFormat={({ 0: audience }) => ({ title: toDateTimeString(audience.x), value: '' })}
            itemsFormat={({ 0: audience }) => [{ title: 'Audience', value: audience.y }]}
          />
        </XYPlot>
      </div>
    </div>
  );
};
