import React, { useMemo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { transformLogsForTable } from './helper';
import LogVolumeChart from './LogVolumeChart';
import LogTable from './LogTable';
import MetricsGauges from './MetricsGauges';

import {
  LoadingSelectors,
  ObservabilityActions,
  ObservabilitySelectors,
} from '../../../store';
import { TimeRangeSelector } from './TimeRangeSelector';
import { FullPageLoader } from '../../../components';

const DashboardWrapper = styled.div`
  padding: 0 24px;
  color: #333;
  background: #ffffff;
`;

const HeaderSection = styled.section`
  margin-bottom: 20px;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionHeading = styled.h3`
  // margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #222;
  letter-spacing: 0.3px;
`;

export const LogDashboard = () => {
  const dispatch = useDispatch();
  const [selectedRange, setSelectedRange] = useState('1H');
  const [isZoomed, setIsZoomed] = useState(false);
  const [timeRange, setTimeRange] = useState(() => {
    const now = new Date();
    return [new Date(now.getTime() - 60 * 60 * 1000), now];
  });

  const { logs = [] } = useSelector(ObservabilitySelectors.getLogs) || {};

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchLogs')
  );

  const tableData = useMemo(() => transformLogsForTable(logs), [logs]);

  useEffect(() => {
    dispatch(
      ObservabilityActions.fetchLogs({
        params: {
          start: timeRange[0].toISOString(),
          end: timeRange[1].toISOString(),
          limit: 500,
        },
      })
    );
  }, [dispatch, timeRange]);

  const handleRangeSelect = option => {
    const now = new Date();
    const start = new Date(now.getTime() - option.value * 60 * 1000);
    setSelectedRange(option.label);
    setIsZoomed(false);
    setTimeRange([start, now]);
  };

  const handleZoom = useCallback((start, end) => {
    setTimeRange([new Date(start), new Date(end)]);
    setIsZoomed(true);
    setSelectedRange(null);
  }, []);

  const resetZoom = useCallback(() => {
    const now = new Date();
    setSelectedRange('1H');
    setIsZoomed(false);
    setTimeRange([new Date(now.getTime() - 60 * 60 * 1000), now]);
  }, []);

  return (
    <DashboardWrapper>
      <HeaderSection>
        {loading && <FullPageLoader loading={loading} />}

        <TimeRangeSelector
          selectedRange={selectedRange}
          onRangeSelect={handleRangeSelect}
        />

        <Section>
          <SectionHeading>Metrics</SectionHeading>
          <MetricsGauges />
        </Section>

        <Section>
          <SectionHeading>Logs Volume</SectionHeading>
          <LogVolumeChart
            logs={logs}
            timeRange={timeRange}
            onReset={resetZoom}
            height={250}
            isZoomed={isZoomed}
            onTimeRangeChange={handleZoom}
          />
        </Section>
      </HeaderSection>

      <Section>
        <SectionHeading>Logs</SectionHeading>
        <LogTable data={tableData} />
      </Section>
    </DashboardWrapper>
  );
};
