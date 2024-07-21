import React from 'react';
import styled from 'styled-components';

import { Grid, StatusRender, TextRender } from '../../components';
import { REFRESH_OPTIONS, STATUS_OPTIONS } from '../../utils';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

export const ListClusters = () => {
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <TextRender text={item.name} />,
      sort: { sortKey: 'NAME' },
    },
    {
      label: 'NiFi Url',
      renderCell: item => <TextRender text={item.nifi_url} />,
    },
    {
      label: 'Status',
      renderCell: item => <StatusRender status={item.status} />,
    },
  ];

  const SORT_FNS = {
    NAME: array => array.sort((a, b) => a.name.localeCompare(b.name)),
  };

  return (
    <Container>
      <Grid
        module="clusters"
        title="Clusters List"
        buttonText="Add New Cluster"
        columns={COLUMNS}
        sortFns={SORT_FNS}
        statusOptions={STATUS_OPTIONS}
        refreshOptions={REFRESH_OPTIONS}
      />
    </Container>
  );
};
