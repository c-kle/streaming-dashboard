import { useQuery } from 'react-query';
import { XYPlot, XAxis, YAxis, LineSeries } from 'react-vis';
import { audience } from '../apiClient/audience';
import { useAuth } from '../hooks/useAuth';
import { toDateString } from '../utils';

export const ConcurrentViewersChart = () => {
  const { token } = useAuth();
  const from = 1509490800000;
  const to = Date.now();
  const { data: audienceData } = useQuery(['audience'], () =>
    audience({ session_token: token, to, from }),
  );

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
      <XAxis tickTotal={15} tickFormat={toDateString} />
      <YAxis tickTotal={5} />

      <LineSeries curve="curveBasis" data={audienceData.audience.map(([x, y]) => ({ x, y }))} />
    </XYPlot>
  );
};
