import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { XYPlot, XAxis, YAxis, LineSeries } from 'react-vis';
import { audience } from '../apiClient/audience';
import { useAuth } from '../hooks/useAuth';
import { useChartFilter } from '../hooks/useChartFilter';
import { msToDays, toDateString } from '../utils';

export const ConcurrentViewersChart = () => {
  const { token } = useAuth();
  const { filter } = useChartFilter();
  const from = filter.from;
  const to = filter.to;
  const { data: audienceData, refetch } = useQuery({
    queryKey: ['audience'],
    enabled: false,
    queryFn: () => audience({ session_token: token, from, to }),
  });

  useEffect(() => {
    refetch();
  }, [filter.from, filter.to]);

  if (!audienceData) {
    return null;
  }

  return (
    <XYPlot
      height={300}
      width={900}
      margin={{
        left: 80,
      }}
    >
      <XAxis tickTotal={msToDays(to - from)} tickFormat={toDateString} />
      <YAxis tickTotal={5} />

      <LineSeries curve="curveBasis" data={audienceData.audience.map(([x, y]) => ({ x, y }))} />
    </XYPlot>
  );
};
