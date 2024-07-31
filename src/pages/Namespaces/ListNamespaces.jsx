import React, { useEffect } from 'react';
import styled from 'styled-components';
import { TextRender } from '../../components';
import { Grid } from '../../components';
import { fetchGridData, REFRESH_OPTIONS, useGlobalContext } from '../../utils';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

export const ListNamespaces = () => {
  const { state, setState } = useGlobalContext();
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <button onClick={() => handleSelectNamespace(item.id)}>
          {item.name}
        </button>
      ),
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
      width: '10%',
      renderCell: item => <TextRender text={item.version} />,
    },
    {
      label: 'Actions',
      width: '10%',
      renderCell: () => <div>Select</div>,
    },
  ];

  const SORT_FNS = {
    NAME: array => array.sort((a, b) => a.name.localeCompare(b.name)),
  };

  const clusterOptions = state.clusterList.map(item => ({
    label: item.name,
    value: item.id,
  }));

  function handleSelectNamespace(id) {
    setState(prev => ({ ...prev, selectedNamespaceId: id }));
    fetchGridData({
      setState,
      module: 'namespaces',
      selectedSourceClusterId: state.selectedSourceClusterId,
      selectedNamespaceId: 'asdf',
    });
  }

  useEffect(() => {
    fetchGridData({
      setState,
      module: 'clusters',
    });
  }, [setState]);

  return (
    <Container>
      <Grid
        module="namespaces"
        title="Namespaces List"
        columns={COLUMNS}
        sortFns={SORT_FNS}
        refreshOptions={REFRESH_OPTIONS}
        clusterOptions={clusterOptions}
      />
    </Container>
  );
};
