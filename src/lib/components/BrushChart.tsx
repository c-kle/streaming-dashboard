import { useQuery } from 'react-query';
import { XYPlot, AreaSeries, Highlight, HighlightProps } from 'react-vis';
import { audience } from '../apiClient/audience';
import { DEFAULT_FROM, DEFAULT_TO } from '../contexts/ChartFilterContext';
import { useAuth } from '../hooks/useAuth';
import { useChartFilter } from '../hooks/useChartFilter';

export const BrushChart = () => {
  const { token } = useAuth();
  const { setFilter, resetFilter } = useChartFilter();
  const { data: audienceData } = useQuery({
    queryKey: ['brush'],
    queryFn: () => audience({ session_token: token, from: DEFAULT_FROM, to: DEFAULT_TO }),
  });
  const updateDragState: HighlightProps['onDragStart'] = (area) => {
    if (!area) {
      return resetFilter();
    }

    setFilter({ from: area.left || 0, to: area.right || 0 });
  };

  if (!audienceData) {
    return null;
  }

  return (
    <XYPlot height={100} width={900}>
      <AreaSeries
        curve="curveBasis"
        data={audienceData.audience.map(([x, y]) => ({ x, y }))}
        opacity={0.25}
      />
      <Highlight color="#829AE3" drag enableY={false} onDragEnd={updateDragState} />
    </XYPlot>
  );
};
