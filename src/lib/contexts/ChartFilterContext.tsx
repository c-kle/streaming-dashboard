import * as React from 'react';

export const DEFAULT_TO = Date.now();
export const DEFAULT_FROM = DEFAULT_TO - 1335600000; // MAGIC NUMBER :P

type ChartFilter = {
  from: number;
  to: number;
};

interface ChartFilterContextType {
  filter: ChartFilter;
  setFilter: React.Dispatch<React.SetStateAction<ChartFilter>>;
  resetFilter: () => void;
}

export const ChartFilterContext = React.createContext<ChartFilterContextType>(null!);

export const ChartFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filter, setFilter] = React.useState<ChartFilter>({ from: DEFAULT_FROM, to: DEFAULT_TO });
  const resetFilter = () => setFilter({ from: DEFAULT_FROM, to: DEFAULT_TO });
  const value = { filter, setFilter, resetFilter };

  return <ChartFilterContext.Provider value={value}>{children}</ChartFilterContext.Provider>;
};
