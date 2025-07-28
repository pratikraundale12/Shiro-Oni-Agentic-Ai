import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DeleteDustbinIcon,
  RoleswtichIcon,
  SortDownIcon,
  SortUpIcon,
} from '../../assets';
import {
  Grid,
  IconButton,
  ProfileRender,
  StatusRender,
  TextRender,
} from '../../components';
import { KDFM, STATUS_OPTIONS } from '../../constants';
import { ModalWithIcon } from '../../shared';
import { GridSelectors, RolesActions, UsersActions } from '../../store';
import { useGlobalContext } from '../../utils';
import { isEmpty } from 'lodash';
import { UserRoleEditModal } from './UserRoleEditModal';
import { Tooltip as ReactTooltip } from 'react-tooltip';

export const ListUsers = () => {
  const { state, setState } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortingState, setSortingState] = useState('');
  const [removeSearch, setRemoveSearch] = useState(false);
  const dispatch = useDispatch();

  const gridData = useSelector(state =>
    GridSelectors.getGridData(state, 'users')
  );
  const toggleSorting = column => {
    setSortingState(prevState => {
      if (prevState === column) {
        return `-${column}`;
      }
      return column;
    });
  };
  const getRolesName = arrayOfObj => {
    const nameArr = arrayOfObj?.map(ele => ele.role_name);
    return nameArr?.join(', ');
  };

  const COLUMNS = [
    {
      label: KDFM.PROFILE,
      renderCell: item => <ProfileRender url={item.photo} />,
      width: '6%',
      resize: true,
    },
    {
      label: (
        <>
          <button
            onClick={() => toggleSorting('first_name')}
            style={{ background: 'none' }}
          >
            {KDFM.NAME}{' '}
            {sortingState === 'first_name' ? (
              <SortUpIcon />
            ) : sortingState === '-first_name' ? (
              <SortDownIcon />
            ) : (
              <SortDownIcon />
            )}
          </button>
        </>
      ),
      width: '20%',
      resize: true,
      renderCell: item => (
        <TextRender
          text={`${item?.first_name || ''} ${item?.middle_name || ''} ${item?.last_name || ''}`}
          capitalizeText={false}
          toolTip={false}
        />
      ),
    },
    {
      label: (
        <>
          <button
            onClick={() => toggleSorting('username')}
            style={{ background: 'none' }}
          >
            {KDFM.USERNAME}{' '}
            {sortingState === 'username' ? (
              <SortUpIcon />
            ) : sortingState === '-username' ? (
              <SortDownIcon />
            ) : (
              <SortDownIcon />
            )}
          </button>
        </>
      ),
      width: '20%',
      resize: true,
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
      resize: true,
      renderCell: item => (
        <TextRender text={item?.email} capitalizeText={false} toolTip={false} />
      ),
    },
    {
      label: KDFM.ROLE,
      width: '18%',
      resize: true,
      renderCell: item => (
        <TextRender text={getRolesName(item?.role)} capitalizeText={false} />
      ),
    },
    {
      label: (
        <>
          <button
            onClick={() => toggleSorting('is_active')}
            style={{ background: 'none' }}
          >
            {KDFM.STATUS}{' '}
            {sortingState === 'is_active' ? (
              <SortUpIcon />
            ) : sortingState === '-is_active' ? (
              <SortDownIcon />
            ) : (
              <SortDownIcon />
            )}
          </button>
        </>
      ),
      width: '8%',
      resize: true,
      renderCell: item => (
        <StatusRender status={item?.is_active ? 'Active' : 'Inactive'} />
      ),
    },
    {
      label: 'Action',
      renderCell: item => (
        <>
          <IconButton
            onClick={e => {
              e.currentTarget.blur();
              dispatch(UsersActions.setuserRoleEditModalOpen(true));
              dispatch(UsersActions.setSingleUserForEdit(item));
            }}
            data-tooltip-id={`tooltip-user-role-update`}
          >
            <RoleswtichIcon />
          </IconButton>
          <ReactTooltip
            id={`tooltip-user-role-update`}
            place="right"
            content={'Role Update'}
            style={{
              whiteSpace: 'normal',
              zIndex: 9999,
            }}
          />
        </>
      ),
      width: '8%',
      resize: true,
    },
  ];

  useEffect(() => {
    if (!isEmpty(gridData)) {
      dispatch(RolesActions.fetchRoles());
    }
  }, [dispatch, gridData]);

  return (
    <>
      <ModalWithIcon
        title={KDFM.DELETE_USER}
        primaryButtonText={KDFM.DELETE}
        secondaryButtonText={KDFM.CANCEL}
        icon={<DeleteDustbinIcon />}
        isOpen={state.userDeleteModal}
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
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        sortingState={sortingState}
        setSortingState={setSortingState}
        removeSearch={removeSearch}
      />
      <UserRoleEditModal setRemoveSearch={setRemoveSearch} />
    </>
  );
};
