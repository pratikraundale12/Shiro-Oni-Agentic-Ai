import { React } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import {
  Grid,
  TextRender,
  StatusRender,
  ProfileRender,
  IconButton,
} from '../../components';
import { AddUserModal } from './AddUserModal';
import { PencilIcon, DeleteSmallIcon, DeleteDustbinIcon } from '../../assets';
import { useGlobalContext } from '../../utils';
import { deleteUserApi } from '../../store/index1';
import { ModalWithIcon } from '../../shared';
import { STATUS_OPTIONS } from '../../constants';
import { GridActions } from '../../store';
import { useDispatch } from 'react-redux';

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;

export const ListUsers = () => {
  const dispatch = useDispatch();
  const { state, setState } = useGlobalContext();

  const getActionsMenu = item => (
    <div>
      <ActionTd>
        <IconButton
          onClick={() =>
            setState({
              ...state,
              userModal: true,
              selectedItem: item,
            })
          }
        >
          <PencilIcon width={16} height={16} />
        </IconButton>
        <IconButton
          onClick={() =>
            setState({
              ...state,
              userDeleteModal: true,
              selectedItem: item,
            })
          }
        >
          <DeleteSmallIcon color="red" />
        </IconButton>
      </ActionTd>
    </div>
  );

  const COLUMNS = [
    {
      label: 'Profile',
      renderCell: item => <ProfileRender url={item.photo} />,
      width: '10%',
    },
    {
      label: 'Name',
      width: '20%',
      renderCell: item => (
        <TextRender
          text={`${item?.first_name || ''} ${item?.middle_name || ''} ${item?.last_name || ''}`}
        />
      ),
    },
    {
      label: 'Username',
      width: '20%',
      renderCell: item => <TextRender text={item.username || ''} />,
    },
    {
      label: 'Email',
      width: '20%',
      renderCell: item => <TextRender text={item.email} />,
    },
    {
      label: 'Role',
      width: '10%',
      renderCell: item => <TextRender text={item.type} />,
    },
    {
      label: 'Status',
      width: '10%',
      renderCell: item => (
        <StatusRender status={item.is_active ? 'Active' : 'Inactive'} />
      ),
    },
    {
      label: 'Actions',
      width: '10%',
      renderCell: item => getActionsMenu(item),
    },
  ];

  const deleteUserConfirmed = async () => {
    const response = await deleteUserApi(state.selectedItem.id);
    if (response.status == 204) {
      dispatch(GridActions.fetchGrid({ module: 'users' }));
      toast.success('User Deleted Successfully');
      setState({ ...state, userDeleteModal: false });
    } else {
      toast.error('error occured');
    }
  };

  return (
    <>
      <ModalWithIcon
        title="Delete User"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={state.userDeleteModal}
        onSubmit={deleteUserConfirmed}
        onRequestClose={() => setState({ ...state, userDeleteModal: false })}
        primaryText="Are You Sure You Want to Delete This User?"
        secondaryText="It Will Temporary Remove the User"
      />
      <Grid
        module="users"
        title="User List"
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        placeholder="Search Name, Username, Email, Status"
        addModal={AddUserModal}
      />
    </>
  );
};
