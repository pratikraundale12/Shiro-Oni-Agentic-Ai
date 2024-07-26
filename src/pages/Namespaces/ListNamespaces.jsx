import React from 'react';
import styled from 'styled-components';
import { TextRender } from '../../components';
import { Grid } from '../../components';
import { REFRESH_OPTIONS } from '../../utils';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

export const ListNamespaces = () => {
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <TextRender text={item.name} />,
      sort: { sortKey: 'NAME' },
    },
    {
      label: 'Namespace ID',
      renderCell: item => <TextRender text={item.id} />,
    },
    {
      label: 'Flow Name',
      renderCell: item => <TextRender text={item.flowName} />,
    },
    {
      label: 'Bucket Name',
      renderCell: item => <TextRender text={item.bucketName} />,
    },
    {
      label: 'Version',
      width: 120,
      renderCell: item => <TextRender text={item.version} />,
    },
    {
      label: 'Actions',
      width: 120,
      renderCell: () => <div>Select</div>,
    },
  ];

  const SORT_FNS = {
    NAME: array => array.sort((a, b) => a.name.localeCompare(b.name)),
  };

  return (
    <Container>
      <Grid
        module="namespaces"
        title="Namespaces List"
        columns={COLUMNS}
        sortFns={SORT_FNS}
        refreshOptions={REFRESH_OPTIONS}
        clusterOptions={[
          { label: 'Dev', value: '403ca918-331f-48ba-ae08-7de17489b6b8' },
          { label: 'Prod', value: 'd8dd9461-53d5-4f69-94a9-5e9f6c734d64' },
        ]}
        breadcrumbs={[
          { id: '1', name: 'Namespace1' },
          { id: '2', name: 'Namespace2' },
        ]}
        onBreadcrumbClick={breadcrumb => {
          console.log('Breadcrumb clicked:', breadcrumb);
        }}
      />
    </Container>
  );
};
