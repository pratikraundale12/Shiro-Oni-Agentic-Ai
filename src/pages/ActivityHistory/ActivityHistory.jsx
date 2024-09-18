import React, { useState } from 'react';
import { Grid, StatusRender, TextRender } from '../../components';
import { ACTIVITY_STATUS_OPTIONS, KDFM } from '../../constants';

export const ActvityHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const COLUMNS = [
    {
      label: KDFM.EVENT,
      renderCell: item => (
        <TextRender text={item.event || KDFM.NA} toolTip={false} />
      ),
    },
    {
      label: KDFM.ENTITY,
      renderCell: item => (
        <TextRender text={item.entity || KDFM.NA} toolTip={false} />
      ),
    },
    {
      label: KDFM.NAMESPACE,
      renderCell: item => (
        <TextRender text={item.namespace || KDFM.NA} toolTip={false} />
      ),
      sort: { sortKey: 'namespace' },
    },
    {
      label: KDFM.CLUSTER,
      renderCell: item => (
        <TextRender text={item.cluster || KDFM.NA} toolTip={false} />
      ),
      sort: { sortKey: 'cluster' },
    },
    {
      label: KDFM.MESSAGE,
      renderCell: item => (
        <TextRender
          text={item.message || KDFM.NA}
          capitalizeText={false}
          toolTip={false}
        />
      ),
      width: '25%',
    },
    {
      label: KDFM.STATUS,
      renderCell: item => (
        <StatusRender status={item.status || KDFM.NA} toolTip={false} />
      ),
    },
    {
      label: KDFM.TIMESTAMP,
      renderCell: item => (
        <TextRender text={item.timestamp || KDFM.NA} toolTip={false} />
      ),
      sort: { sortKey: 'timestamp' },
    },
    {
      label: KDFM.CREATED_BY,
      renderCell: item => (
        <TextRender text={item.created_by_name || KDFM.NA} toolTip={false} />
      ),
    },
  ];

  const sortFns = {
    namespace: data =>
      data.sort((a, b) =>
        (a?.namespace || '').localeCompare(b?.namespace || '')
      ),
    cluster: data =>
      data.sort((a, b) => (a?.cluster || '').localeCompare(b?.cluster || '')),
    timestamp: data =>
      data.sort(
        (a, b) => new Date(a?.timestamp || 0) - new Date(b?.timestamp || 0)
      ),
  };

  return (
    <Grid
      module="activityHistory"
      title={KDFM.ACTIVITY_LIST}
      columns={COLUMNS}
      placeholder={KDFM.ACTIVITY_HISTORY_SEARCH_PLACEHOLDER}
      statusOptions={ACTIVITY_STATUS_OPTIONS}
      sortFns={sortFns}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};
