import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  XYPlot,
  XAxis,
  YAxis,
  AreaSeries,
  LineSeries,
  Crosshair,
  AreaSeriesPoint,
  RVNearestXEventHandler,
} from 'react-vis';
import { bandwidth, bandwidthAggregate } from '../apiClient/bandwidth';
import { useAuth } from '../hooks/useAuth';
import { useChartFilter } from '../hooks/useChartFilter';
import { msToDays, toDateString, toGbps } from '../utils';

export const CapacityOffloadChart = () => {
  const { filter } = useChartFilter();
  const { token } = useAuth();
  const [crosshairValues, setCrosshairValues] = useState<{ x: number; y: number }[]>([]);

  const from = filter.from;
  const to = filter.to;

  const { data: bandwithData, refetch: refetchBandwithData } = useQuery({
    queryKey: ['bandwith'],
    enabled: false,
    queryFn: () => bandwidth({ session_token: token, to, from }),
  });
  const { data: maxesData, refetch: refetchMaxesData } = useQuery({
    queryKey: ['maxes'],
    enabled: false,
    queryFn: () => bandwidthAggregate({ session_token: token, to, from, aggregate: 'max' }),
  });
  const hooverHandler: RVNearestXEventHandler<AreaSeriesPoint> = (data, { index }) => {
    setCrosshairValues([
      //   data,
      { x: data.x, y: maxesData?.cdn || 0 },
      { x: data.x, y: maxesData?.p2p || 0 },
      //   { x: bandwithData?.cdn[index][0], y: bandwithData?.cdn[index][1] },
    ]);
  };

  useEffect(() => {
    refetchBandwithData();
    refetchMaxesData();
  }, [filter.from, filter.to]);

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
      onMouseLeave={() => setCrosshairValues([])}
    >
      <XAxis tickTotal={msToDays(to - from)} tickFormat={toDateString} />
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

      <Crosshair values={crosshairValues} />
    </XYPlot>
  );
};
