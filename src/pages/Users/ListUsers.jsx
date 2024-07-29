import { React } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import {
  Grid,
  TextRender,
  StatusRender,
  ProfileRender,
} from '../../components';
import { AddUserModal } from './AddUserModal';
import { PencilIcon, DeleteSmallIcon, DeleteDustbinIcon } from '../../assets';
import {
  fetchGridData,
  REFRESH_OPTIONS,
  STATUS_OPTIONS,
  useGlobalContext,
} from '../../utils';
import { deleteUserApi } from '../../utils/services';
import { ModalWithIcon } from '../../shared';

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

export const ListUsers = () => {
  const { state, setState } = useGlobalContext();

  const getActionsMenu = item => (
    <div>
      <ActionTd>
        <IconWrapper
          onClick={() =>
            setState({
              ...state,
              userModal: true,
              selectedItem: item,
            })
          }
        >
          <PencilIcon color="white" />
        </IconWrapper>
        <IconWrapper
          onClick={() =>
            setState({
              ...state,
              userDeleteModal: true,
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
      label: 'Profile',
      renderCell: item => <ProfileRender url={item.photo} />,
      sort: { sortKey: 'PORFILE' },
    },
    {
      label: 'Name',
      renderCell: item => (
        <TextRender
          text={`${item.first_name} ${item.middle_name} ${item.last_name}`}
        />
      ),
      sort: { sortKey: 'NAME' },
    },
    {
      label: 'Username',
      renderCell: item => <TextRender text={item.username} />,
      sort: { sortKey: 'USERNAME' },
    },
    {
      label: 'Email',
      renderCell: item => <TextRender text={item.email} />,
      sort: { sortKey: 'EMAIL' },
    },
    {
      label: 'Role',
      renderCell: item => <TextRender text={item.type} />,
      sort: { sortKey: 'TYPE' },
    },
    {
      label: 'Status',
      renderCell: item => (
        <StatusRender status={item.is_active ? 'Active' : 'Inactive'} />
      ),
      sort: { sortKey: 'STATUS' },
    },
    {
      label: 'Actions',
      width: 120,
      renderCell: item => getActionsMenu(item),
    },
  ];

  const SORT_FNS = {
    NAME: array =>
      array.sort((a, b) => a.first_name.localeCompare(b.first_name)),
    USERNAME: array =>
      array.sort((a, b) => a.username.localeCompare(b.username)),
    EMAIL: array => array.sort((a, b) => a.email.localeCompare(b.email)),
    TYPE: array => array.sort((a, b) => a.type.localeCompare(b.type)),
    STATUS: array => array.sort((a, b) => a.is_active - b.is_active),
  };

  const deleteUserConfirmed = async () => {
    const response = await deleteUserApi(state.selectedItem.id);
    if (response.status == 204) {
      fetchGridData({ setState, module: 'users' });
      toast.success('User Deleted Successfully');
      setState({ ...state, userDeleteModal: false });
    } else {
      toast.error('error occured');
    }
  };

  return (
    <>
      <Container>
        <ModalWithIcon
          primaryButtonText="Delete"
          secondaryButtonText="Cancel"
          icon={<DeleteDustbinIcon />}
          isOpen={state.userDeleteModal}
          onSubmit={deleteUserConfirmed}
          onRequestClose={() => setState({ ...state, userDeleteModal: false })}
          primaryText="Are You Sure You Want to Delete This User"
          secondaryText="It Will Temporary Remove the User"
        />
        <Grid
          module="users"
          title="User List"
          columns={COLUMNS}
          sortFns={SORT_FNS}
          statusOptions={STATUS_OPTIONS}
          refreshOptions={REFRESH_OPTIONS}
          addModal={AddUserModal}
        />
      </Container>
    </>
  );
};
