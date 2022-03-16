import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { XYPlot, AreaSeries, AreaSeriesPoint } from 'react-vis';
import { audience } from '../apiClient/audience';
import { DEFAULT_FROM, DEFAULT_TO } from '../contexts/ChartFilterContext';
import { useAuth } from '../hooks/useAuth';
import { useChartFilter } from '../hooks/useChartFilter';
import { Highlight, HighlightProps } from './Highlight';

export const BrushChart = (props: { height: number; width: number }) => {
  const { token } = useAuth();
  const { setFilter, resetFilter } = useChartFilter();
  const { data: audienceData, refetch } = useQuery({
    queryKey: ['brush'],
    enabled: false,
    queryFn: () => audience({ session_token: token, from: DEFAULT_FROM, to: DEFAULT_TO }),
    select: ({ audience }) =>
      audience.reduce(
        (acc, [x, y]) => {
          acc.minX = isNaN(acc.minX) ? x : Math.min(acc.minX, x);
          acc.maxX = Math.max(acc.maxX, x);
          acc.points.push({ x, y });

          return acc;
        },
        { points: [] as AreaSeriesPoint[], minX: NaN, maxX: 0 },
      ),
  });

  const updateFilter: HighlightProps['onDragEnd'] = (area) => {
    if ((!area.left && !area.right) || !audienceData) {
      return resetFilter();
    }

    const timerange = audienceData.maxX - audienceData.minX;

    setFilter({
      from: Math.max(audienceData.minX + (area.left * timerange) / props.width, 0),
      to: Math.min(audienceData.minX + (area.right * timerange) / props.width, audienceData.maxX),
    });
  };

  useEffect(() => {
    refetch();
  }, []);

  if (!audienceData || !audienceData.points.length) {
    return null;
  }

  return (
    <div className="chi-card">
      <div className="chi-card__content">
        <XYPlot {...props} margin={{ left: 0, right: 0, top: 10, bottom: 20 }}>
          <AreaSeries curve="curveBasis" data={audienceData.points} opacity={0.25} />
          <Highlight color="#829AE3" {...props} opacity={0.25} onDragEnd={updateFilter} />
        </XYPlot>
      </div>
    </div>
  );
};
