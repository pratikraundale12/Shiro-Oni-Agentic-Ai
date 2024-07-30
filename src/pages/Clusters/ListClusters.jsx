/* eslint-disable */

import React from 'react';
import styled from 'styled-components';
import { DeleteDustbinIcon, OpenEyeIcon } from '../../assets';
import { Grid, StatusRender, TextRender } from '../../components';
import {
  REFRESH_OPTIONS,
  STATUS_OPTIONS,
  useGlobalContext,
  fetchGridData,
} from '../../utils';
import { PencilIcon, DeleteSmallIcon } from '../../assets';
import { useNavigate } from 'react-router-dom';
import { deleteCluster } from '../../utils/services';
import { ModalWithIcon } from '../../shared';
import { toast } from 'react-toastify';

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
  const { state, setState } = useGlobalContext();

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
        <IconWrapper
          onClick={() =>
            setState({
              ...state,
              clusterDeleteModal: true,
              selectedItem: item,
            })
          }
        >
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
    {
      label: 'Summary',
      renderCell: item => (
        <div
          onClick={() => {
            navigate('/cluster/summary');
            setState({
              ...state,
              nodeClusterId: item.id,
            });
          }}
        >
          <OpenEyeIcon />
        </div>
      ),
    },
  ];

  const SORT_FNS = {
    NAME: array => array.sort((a, b) => a.name.localeCompare(b.name)),
  };

  const deleteUserConfirmed = async () => {
    const response = await deleteCluster(state.selectedItem.id);
    if (response.status == 204) {
      fetchGridData({ setState, module: 'clusters' });
      toast.success('cluster Deleted Successfully');
      setState({ ...state, clusterDeleteModal: false });
    } else {
      toast.error('error occured');
    }
  };

  return (
    <Container>
      <ModalWithIcon
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={state.clusterDeleteModal}
        onSubmit={deleteUserConfirmed}
        onRequestClose={() => setState({ ...state, clusterDeleteModal: false })}
        primaryText="Are You Sure You Want to Delete This Cluster"
        secondaryText="It Will Temporary Remove the Cluster"
      />

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
