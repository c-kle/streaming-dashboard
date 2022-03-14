import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { XYPlot, AreaSeries, Highlight, HighlightProps } from 'react-vis';
import { audience } from '../apiClient/audience';
import { DEFAULT_FROM, DEFAULT_TO } from '../contexts/ChartFilterContext';
import { useAuth } from '../hooks/useAuth';
import { useChartFilter } from '../hooks/useChartFilter';

export const BrushChart = (props: { height: number; width: number }) => {
  const { token } = useAuth();
  const { setFilter, resetFilter } = useChartFilter();
  const { data: audienceData, refetch } = useQuery({
    queryKey: ['brush'],
    enabled: false,
    queryFn: () => audience({ session_token: token, from: DEFAULT_FROM, to: DEFAULT_TO }),
    select: ({ audience }) => audience.map(([x, y]) => ({ x, y })),
  });

  const updateDragState: HighlightProps['onDragStart'] = (area) => {
    if (!area) {
      return resetFilter();
    }

    setFilter({ from: area.left || 0, to: area.right || 0 });
  };

  useEffect(() => {
    refetch();
  }, []);

  if (!audienceData) {
    return null;
  }

  return (
    <div className="chi-card">
      <div className="chi-card__content">
        <XYPlot {...props}>
          <AreaSeries curve="curveBasis" data={audienceData} opacity={0.25} />
          <Highlight color="#829AE3" drag enableY={false} onDragEnd={updateDragState} />
        </XYPlot>
      </div>
    </div>
  );
};
