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
  DiscreteColorLegend,
} from 'react-vis';
import { bandwidth, bandwidthAggregate } from '../apiClient/bandwidth';
import { isAxiosErrorStatus } from '../apiClient/utils';
import { useAuth } from '../hooks/useAuth';
import { useChartFilter } from '../hooks/useChartFilter';
import { msToDays, toDateString, toDateTimeString, toGbps } from '../utils';

const CHARTS_CONFIG = {
  p2p: { title: 'P2P', color: 'rgba(18, 147, 154, .5)' },
  http: { title: 'Http', color: 'rgba(121, 199, 227, .5)' },
  maxHttp: {
    title: 'Max http',
    color: 'rgb(255, 152, 51)',
    strokeStyle: 'dashed',
  },
  maxP2p: {
    title: 'Max P2P',
    color: 'rgb(26, 49, 119)',
    strokeStyle: 'dashed',
  },
};

const CHART_LEGEND_ITEMS = Object.values(CHARTS_CONFIG);

const retry = (count: number, error: unknown) => !isAxiosErrorStatus(error, 404);

export const CapacityOffloadChart = (props: { height: number; width: number }) => {
  const { filter } = useChartFilter();
  const { token } = useAuth();
  const [crosshairValues, setCrosshairValues] = useState<{ x: number; y: number }[]>([]);

  const from = filter.from;
  const to = filter.to;

  const { data: bandwithData, refetch: refetchBandwithData } = useQuery({
    queryKey: ['bandwith'],
    enabled: false,
    queryFn: () => bandwidth({ session_token: token, from, to }),
    select: (data) => ({
      p2p: data.p2p.map(([x, y]) => ({ x, y })),
      cdn: data.cdn.map(([x, y]) => ({ x, y })),
    }),
    retry,
  });
  const { data: maxesData, refetch: refetchMaxesData } = useQuery({
    queryKey: ['maxes'],
    enabled: false,
    queryFn: () => bandwidthAggregate({ session_token: token, from, to, aggregate: 'max' }),
    select: (data) => ({
      p2pMax: data.p2p,
      cdnMax: data.cdn,
      p2p: bandwithData?.p2p.map(({ x }) => ({ x, y: data.p2p })),
      cdn: bandwithData?.cdn.map(({ x }) => ({ x, y: data.cdn })),
    }),
    retry,
  });

  const hooverHandler: RVNearestXEventHandler<AreaSeriesPoint> = (data, { index }) => {
    setCrosshairValues([
      data,
      { x: data.x, y: maxesData?.p2pMax ?? 0 },
      { x: bandwithData?.cdn?.[index]?.x ?? 0, y: bandwithData?.cdn?.[index]?.y ?? 0 },
      { x: data.x, y: maxesData?.cdnMax ?? 0 },
    ]);
  };

  useEffect(() => {
    refetchBandwithData();
    refetchMaxesData();
  }, [filter.from, filter.to]);

  return (
    <div className="chi-card">
      <div className="chi-card__header -sm">
        <div className="chi-card__title">Capacity offload</div>
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
          <YAxis tickTotal={4} tickFormat={toGbps} />
          <AreaSeries
            curve="curveBasis"
            data={bandwithData?.p2p ?? []}
            opacity={0.25}
            onNearestX={hooverHandler}
            color={CHARTS_CONFIG.p2p.color}
          />
          <AreaSeries
            curve="curveBasis"
            data={bandwithData?.cdn ?? []}
            opacity={0.25}
            color={CHARTS_CONFIG.http.color}
          />
          <LineSeries
            data={maxesData?.p2p ?? []}
            strokeStyle="dashed"
            color={CHARTS_CONFIG.maxP2p.color}
          />
          <LineSeries
            data={maxesData?.cdn ?? []}
            strokeStyle="dashed"
            color={CHARTS_CONFIG.maxHttp.color}
          />
          <Crosshair
            values={crosshairValues}
            titleFormat={({ 0: p2p }) => ({ title: toDateTimeString(p2p.x), value: '' })}
            itemsFormat={({ 0: p2p, 1: maxP2p, 2: http, 3: maxHttp }) => [
              { title: 'P2P', value: toGbps(p2p.y) },
              { title: 'Max P2P', value: toGbps(maxP2p.y) },
              { title: 'Http', value: toGbps(http.y) },
              { title: 'Max http', value: toGbps(maxHttp.y) },
              { title: 'Total', value: toGbps(p2p.y + http.y) },
            ]}
          />
        </XYPlot>
      </div>
      <div className="chi-card__footer -sm">
        <DiscreteColorLegend width={900} items={CHART_LEGEND_ITEMS} orientation="horizontal" />
      </div>
    </div>
  );
};
