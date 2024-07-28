import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextRender } from '../../components';
import { Grid } from '../../components';
import { REFRESH_OPTIONS } from '../../utils';
import { fetchClustersList } from '../../utils/services';
import Deploy from './Deploy';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

export const ListNamespaces = () => {
  const [clusterOptions, setClusterOptions] = useState([]);

  useEffect(() => {
    const getClusterOptions = async () => {
      try {
        const clusters = await fetchClustersList();
        if (clusters) {
          const options = clusters?.data?.map(cluster => ({
            label: cluster?.name,
            value: cluster?.id,
          }));

          setClusterOptions(options);
        }
      } catch (error) {
        console.error('Failed to fetch cluster options:', error);
      }
    };

    getClusterOptions();
  }, []);

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
        clusterOptions={clusterOptions}
        breadcrumbs={[
          { id: '1', name: 'Namespace1' },
          { id: '2', name: 'Namespace2' },
        ]}
        onBreadcrumbClick={breadcrumb => {
          console.log('Breadcrumb clicked:', breadcrumb);
        }}
      />
      {/* Pass clusterOptions to Deploy component */}
      <Deploy clusterOptions={clusterOptions} />
    </Container>
  );
};
