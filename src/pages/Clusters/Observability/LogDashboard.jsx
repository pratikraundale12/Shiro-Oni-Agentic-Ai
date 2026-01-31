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

const DashboardWrapper = styled.div`
  padding: 0 24px;
  color: #333;
  background: #ffffff;
`;

const HeaderSection = styled.section`
  margin-bottom: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SyncText = styled.small`
  color: #666;
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

  const handleZoom = useCallback((start, end) => {
    setTimeRange([new Date(start), new Date(end)]);
  }, []);

  const resetZoom = useCallback(() => {
    const now = new Date();
    setTimeRange([new Date(now.getTime() - 60 * 60 * 1000), now]);
  }, []);

  return (
    <DashboardWrapper>
      <HeaderSection>
        <HeaderRow>{loading && <SyncText>Syncing logs...</SyncText>}</HeaderRow>

        <Section>
          <SectionHeading>Metrics</SectionHeading>
          <MetricsGauges />
        </Section>

        <Section>
          <SectionHeading>Logs Volume</SectionHeading>
          <LogVolumeChart
            logs={logs}
            timeRange={timeRange}
            onTimeRangeChange={handleZoom}
            onReset={resetZoom}
            height={250}
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
