import React, { useState } from 'react';
import { Grid, IconButton, TextRender } from '../../components';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { DeleteDustbinIcon, HoldIcon, PencilIcon } from '../../assets';
import { STATUS_OPTIONS } from '../../constants';
import { AuthenticationSelectors } from '../../store';
import { StatusText } from './StatusText';
import { TextWithPhotoRender } from './TextWithPhotoRender';
import { ModalWithIcon } from '../../shared';

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;

export const ListScheduleDeployment = () => {
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const [deleteOpenModel, setDeleteOpenModel] = useState(false);
  const getActionsMenu = () => (
    <div>
      <ActionTd>
        <IconButton onClick={() => {}}>
          <PencilIcon width={16} height={16} />
        </IconButton>
        <IconButton onClick={() => setDeleteOpenModel(true)}>
          <HoldIcon />
        </IconButton>
      </ActionTd>
    </div>
  );

  const COLUMNS = [
    {
      label: 'Namespace',
      renderCell: item => <TextRender text={item.namespace_name || 'N/A'} />,
      width: '15%',
    },
    {
      label: 'Source Cluster',
      renderCell: item => (
        <TextRender text={item.source_cluster_name || 'N/A'} />
      ),
      width: '15%',
    },
    {
      label: 'Dest. Cluster',
      renderCell: item => (
        <TextRender text={item.destination_cluster_name || 'N/A'} />
      ),
      width: '15%',
    },
    {
      label: 'Deploy Time',
      renderCell: item => <TextRender text={item.scheduled_time || 'N/A'} />,
      width: '15%',
    },
    {
      label: 'Approver',
      renderCell: item => (
        <TextWithPhotoRender
          item={item}
          content={item?.approvers}
          currentUser={currentUser}
        />
      ),
      width: '15%',
    },
    {
      label: 'Status',
      renderCell: item => <StatusText text={item?.deployment_status} />,
      width: '15%',
    },
    {
      label: 'Actions',
      width: '10%',
      renderCell: item => getActionsMenu(item),
    },
  ];

  return (
    <>
      <ModalWithIcon
        title="Stop Schedule Deployment"
        primaryButtonText="Stop"
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={deleteOpenModel}
        // onSubmit={deleteUserConfirmed}
        onRequestClose={() => setDeleteOpenModel(false)}
        primaryText="Are you sure you want to cancel this Deployment?"
        secondaryText="This Deployment will be Cancel from Schedule Deployment Page"
      />
      <Grid
        module="scheduler"
        title="Deployment List"
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        placeholder="Search Namespace, Cluster or Approver"
      />
    </>
  );
};
