import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextRender } from '../../components';
import { Grid } from '../../components';
import { REFRESH_OPTIONS } from '../../utils';
import { fetchClustersList } from '../../utils/services';
import Deploy from './Deploy';
import { Button } from '../../shared';
import { useNavigate } from 'react-router-dom';
import { OpenEyeIcon } from '../../assets';
import AuditLog from './AuditLog';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

export const ListNamespaces = () => {
  const [clusterOptions, setClusterOptions] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState(null);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleSelect = namespace => {
    setSelectedNamespace(namespace);
    navigate('/namespaces/deploy');
  };

  const handleOpenAuditLog = () => {
    console.log('hi');
    setIsAuditLogOpen(true);
  };

  const handleCloseAuditLog = () => {
    setIsAuditLogOpen(false);
  };

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
      width: 120,
      renderCell: () => (
        <button
          onClick={handleOpenAuditLog}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
          aria-label="Open Audit Log"
        >
          <OpenEyeIcon />
        </button>
      ),
    },
    {
      label: 'Actions',
      width: 120,
      renderCell: item => (
        <Button onClick={() => handleSelect(item)}>Select</Button>
      ),
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
      {selectedNamespace && <Deploy selectedNamespace={selectedNamespace} />}
      <AuditLog isOpen={isAuditLogOpen} closePopup={handleCloseAuditLog} />
    </Container>
  );
};
