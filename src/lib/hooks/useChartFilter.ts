import * as React from 'react';
import { ChartFilterContext } from '../contexts/ChartFilterContext';

export const useChartFilter = () => React.useContext(ChartFilterContext);
