import React from 'react';
import styled from 'styled-components';

import { Grid, StatusRender, TextRender } from '../../components';
import { REFRESH_OPTIONS, STATUS_OPTIONS } from '../../utils';
import { PencilIcon, DeleteSmallIcon } from '../../assets';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const ListClusters = () => {
  const navigate = useNavigate();

  const getActionsMenu = item => (
    <div>
      <ActionTd>
        <IconWrapper
          onClick={() => {
            navigate('/cluster/edit', { state: item });
          }}
        >
          <PencilIcon color="white" />
        </IconWrapper>
        {/* <IconWrapper onClick={() => openDeleteModal(item?.id)}> */}
        <IconWrapper>
          <DeleteSmallIcon color="white" />
        </IconWrapper>
      </ActionTd>
    </div>
  );

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
    {
      label: 'Actions',
      width: 120,
      renderCell: item => getActionsMenu(item),
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
