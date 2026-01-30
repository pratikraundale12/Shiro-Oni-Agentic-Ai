import React, { useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { transformLogsForTable } from './helper';
import LogVolumeChart from './LogVolumeChart';
import LogTable from './LogTable';

import {
  LoadingSelectors,
  ObservabilityActions,
  ObservabilitySelectors,
} from '../../../store';
// import { MetricsCarousel } from './MetricsCarousel';
import MetricsGauges from './MetricsGauges';

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

export const LogDashboard = () => {
  const dispatch = useDispatch();

  const { logs = [] } = useSelector(ObservabilitySelectors.getLogs) || {};

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchLogs')
  );

  const tableData = useMemo(() => transformLogsForTable(logs), [logs]);

  useEffect(() => {
    dispatch(
      ObservabilityActions.fetchLogs({
        params: { limit: 100 },
      })
    );
  }, [dispatch]);

  const handleTimeRangeChange = useCallback(
    (start, end) => {
      dispatch(
        ObservabilityActions.fetchLogs({
          params: { start, end },
        })
      );
    },
    [dispatch]
  );

  return (
    <DashboardWrapper>
      <HeaderSection>
        <HeaderRow>{loading && <SyncText>Syncing logs...</SyncText>}</HeaderRow>

        {/* <MetricsCarousel /> */}

        <MetricsGauges />

        <LogVolumeChart
          logs={logs}
          onTimeRangeChange={handleTimeRangeChange}
          showBar
          showLine
        />
      </HeaderSection>

      <LogTable data={tableData} />
    </DashboardWrapper>
  );
};
