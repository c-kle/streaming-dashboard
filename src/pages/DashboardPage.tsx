import Header from '../lib/components/Header';
import { CapacityOffloadChart } from '../lib/components/CapacityOffloadChart';
import { ConcurrentViewersChart } from '../lib/components/ConcurrentViewersChart';
import { BrushChart } from '../lib/components/BrushChart';
import { ChartFilterProvider } from '../lib/contexts/ChartFilterContext';
import { useEffect, useRef, useState } from 'react';
import { axiosInstance, isAxiosError } from '../lib/apiClient/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';
import { useQueryClient } from 'react-query';

const DEFAULT_MARGIN = 50;
const DEFAULT_WIDTH = 900 + DEFAULT_MARGIN;

const processWidth = (value: number | undefined) => (value ?? DEFAULT_WIDTH) - DEFAULT_MARGIN;

export const DashboardPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [width, setWidth] = useState(processWidth(contentRef.current?.clientWidth));
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = () => {
    setToken('');
    navigate('/login');
  };

  useEffect(() => {
    const handler = () => setWidth(processWidth(contentRef.current?.clientWidth));

    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const interceptorId = axiosInstance.interceptors.response.use(undefined, (error) => {
      if (isAxiosError(error) && error.response?.status === 403) {
        queryClient.cancelQueries();

        setLoggingOut(true);
      }

      return Promise.reject(error);
    });

    return () => axiosInstance.interceptors.response.eject(interceptorId);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setWidth(processWidth(contentRef.current?.clientWidth));
    }
  }, [contentRef.current]);

  return (
    <ChartFilterProvider>
      {loggingOut && (
        <div className="chi-backdrop -center">
          <div className="chi-backdrop__wrapper">
            <section
              className="chi-card -active -vertical-align--middle"
              data-position="top-end"
              aria-label="Please sign in again"
              aria-modal="true"
              role="dialog"
            >
              <header className="chi-card__header">
                <h2 className="chi-card__title">Please sign in again</h2>
              </header>
              <div className="chi-card__content">
                <p className="chi-card__text">
                  Your session has expired or has been invalidated. You will be redirected to the
                  login page
                </p>
              </div>
              <div className="chi-card__footer">
                <button className="chi-button -danger" onClick={logout}>
                  Ok
                </button>
              </div>
            </section>
          </div>
        </div>
      )}

      <Header />

      <div className="chi-main__content" ref={contentRef}>
        <div className="chi-grid">
          <div className="chi-col -w--12 -mt--2">
            <CapacityOffloadChart width={width} height={200} />
          </div>
          <div className="chi-col -w--12 -mt--2">
            <ConcurrentViewersChart width={width} height={200} />
          </div>
          <div className="chi-col -w--12 -mt--2">
            <BrushChart width={width} height={100} />
          </div>
        </div>
      </div>
    </ChartFilterProvider>
  );
};

export default DashboardPage;
