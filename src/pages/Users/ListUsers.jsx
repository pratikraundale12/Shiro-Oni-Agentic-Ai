import { React, useState } from 'react';
import styled from 'styled-components';
import {
  Grid,
  TextRender,
  StatusRender,
  ProfileRender,
} from '../../components';
import { AddUserModal } from './AddUserModal';
import { PencilIcon, DeleteSmallIcon, DeleteDustbinIcon } from '../../assets';
import { REFRESH_OPTIONS, STATUS_OPTIONS, useGlobalContext } from '../../utils';
import { deleteUserApi } from '../../utils/services';
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

const ImageContainer = styled.div`
  border-radius: 100%;
  // border: 1px solid #d7d7d7;
  min-height: 50px;
  height: 50px;
  max-height: 50px;
  min-width: 50px;
  width: 50px;
  max-width: 50px;
  object-fit: contain;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfileImage = styled.img`
  object-fit: contain;
  height: 40px;
  width: 40px;
  border-radius: 50%;
`;
export const ListUsers = () => {
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [deleteUserData, setDeleteUserData] = useState(null);
  const { state, setState } = useGlobalContext();

  const getActionsMenu = item => (
    <div>
      <ActionTd>
        <IconWrapper onClick={() => editUser(item)}>
          <PencilIcon color="white" />
        </IconWrapper>
        <IconWrapper onClick={() => openDeleteModal(item?.id)}>
          <DeleteSmallIcon color="white" />
        </IconWrapper>
      </ActionTd>
    </div>
  );

  const showProfilePicture = item => (
    <ImageContainer>
      {item.photo ? (
        <ProfileImage src={`media/users/${item?.id}.png`} alt="img" />
      ) : (
        <ProfileRender />
      )}
    </ImageContainer>
  );
  const COLUMNS = [
    {
      label: 'Profile',
      renderCell: item => showProfilePicture(item),
      sort: { sortKey: 'PORFILE' },
    },

    {
      label: 'Name',
      renderCell: item => <TextRender text={item.username} />,
      sort: { sortKey: 'NAME' },
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
    NAME: array => array.sort((a, b) => a.username.localeCompare(b.username)),
    EMAIL: array => array.sort((a, b) => a.email.localeCompare(b.email)),
    TYPE: array => array.sort((a, b) => a.type.localeCompare(b.type)),
    STATUS: array => array.sort((a, b) => a.is_active - b.is_active),
  };

  const editUser = async item => {
    setState({
      ...state,
      userModal: true,
      selectedItem: item,
    });
  };
  const openDeleteModal = id => {
    setOpenDeleteModel(true);
    setDeleteUserData(id);
  };
  const closeDeleteModal = () => {
    setOpenDeleteModel(false);
  };
  const deleteUserConfirmed = async () => {
    const response = await deleteUserApi(deleteUserData);
    if (response.status == 204) {
      setOpenDeleteModel(false);
      toast.success('User Deleted Successfully');
      setOpenDeleteModel(false);
    } else {
      toast.error('error occured');
    }
    setDeleteUserData(null);
  };

  return (
    <>
      {' '}
      <Container>
        <ModalWithIcon
          primaryText="Are You Sure You Want to Delete This User"
          secondaryText="It Will Temporary Remove the User"
          icon={<DeleteDustbinIcon />}
          isOpen={openDeleteModel}
          primaryButtonText="Delete"
          secondaryButtonText="Cancel"
          onRequestClose={closeDeleteModal}
          onSubmit={deleteUserConfirmed}
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
