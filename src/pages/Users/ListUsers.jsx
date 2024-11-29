import { React, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteDustbinIcon, DeleteSmallIcon, PencilIcon } from '../../assets';
import {
  Grid,
  IconButton,
  ProfileRender,
  StatusRender,
  TextRender,
} from '../../components';
import { KDFM, STATUS_OPTIONS } from '../../constants';
import { ModalWithIcon } from '../../shared';
import {
  AuthenticationSelectors,
  GridActions,
  RolesActions,
  RolesSelectors,
  UsersActions,
} from '../../store';
import { deleteUserApi } from '../../store/index1';
import { useGlobalContext } from '../../utils';
import { AddUserModal } from './AddUserModal';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;

export const ListUsers = () => {
  const dispatch = useDispatch();
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);
  const { state, setState } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const roleData = useSelector(RolesSelectors.getRoles);

  const getActionsMenu = item => (
    <div>
      <ActionTd>
        {userPermissions.includes('edit_user') && (
          <>
            <IconButton
              onClick={() => {
                setState({
                  ...state,
                  userModal: true,
                  selectedItem: item,
                  label: 'User',
                });
                dispatch(UsersActions.setUserModalOpen(true));
              }}
              data-tooltip-id={`tooltip-group-edit-user`}
            >
              <PencilIcon width={16} height={16} />
            </IconButton>
            <ReactTooltip
              id={`tooltip-group-edit-user`}
              place="left"
              content={'Edit user'}
              style={{
                width: '90px',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            />
          </>
        )}
        {userPermissions.includes('delete_user') && (
          <>
            <IconButton
              onClick={() =>
                setState({
                  ...state,
                  userDeleteModal: true,
                  selectedItem: item,
                })
              }
              data-tooltip-id={`tooltip-group-delete-user`}
            >
              <DeleteSmallIcon color="red" />
            </IconButton>
            <ReactTooltip
              id={`tooltip-group-delete-user`}
              place="left"
              content={'Delete user'}
              style={{
                width: '110px',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            />
          </>
        )}
      </ActionTd>
    </div>
  );

  const COLUMNS = [
    {
      label: KDFM.PROFILE,
      renderCell: item => <ProfileRender url={item.photo} />,
      width: '10%',
    },
    {
      label: KDFM.NAME,
      width: '20%',
      renderCell: item => (
        <TextRender
          text={`${item?.first_name || ''} ${item?.middle_name || ''} ${item?.last_name || ''}`}
          capitalizeText={false}
          toolTip={false}
        />
      ),
    },
    {
      label: KDFM.USERNAME,
      width: '20%',
      renderCell: item => (
        <TextRender
          text={item.username || ''}
          capitalizeText={false}
          toolTip={false}
        />
      ),
    },
    {
      label: KDFM.EMAIL,
      width: '20%',
      renderCell: item => (
        <TextRender text={item.email} capitalizeText={false} toolTip={false} />
      ),
    },
    {
      label: KDFM.ROLE,
      renderCell: item => <TextRender text={item.role} toolTip={false} />,
    },
    {
      label: KDFM.STATUS,
      renderCell: item => (
        <StatusRender status={item.is_active ? 'Active' : 'Inactive'} />
      ),
    },
    {
      label: KDFM.ACTIONS,
      renderCell: item => getActionsMenu(item),
    },
  ];

  const sortFns = {};

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

  useEffect(() => {
    if (isEmpty(roleData)) {
      dispatch(RolesActions.fetchRoles());
    }
  }, [dispatch]);

  return (
    <>
      <ModalWithIcon
        title={KDFM.DELETE_USER}
        primaryButtonText={KDFM.DELETE}
        secondaryButtonText={KDFM.CANCEL}
        icon={<DeleteDustbinIcon />}
        isOpen={state.userDeleteModal}
        onSubmit={deleteUserConfirmed}
        onRequestClose={() => setState({ ...state, userDeleteModal: false })}
        primaryText={KDFM.DELETE_USER_WARNING}
        secondaryText={KDFM.DELETE_USER_DESCRIPTION}
      />
      <Grid
        module="users"
        title={KDFM.USER_LIST}
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        placeholder={KDFM.SEARCH_USER_PLACEHOLDER}
        addModal={AddUserModal}
        sortFns={sortFns}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
};
