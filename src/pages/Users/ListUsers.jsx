import { React, useState } from 'react';
import styled from 'styled-components';
import { DeleteDustbinIcon, SortDownIcon, SortUpIcon } from '../../assets';
import {
  Grid,
  ProfileRender,
  StatusRender,
  TextRender,
} from '../../components';
import { KDFM, STATUS_OPTIONS } from '../../constants';
import { ModalWithIcon } from '../../shared';
import { useGlobalContext } from '../../utils';

const GridComponent = styled(Grid)`
  table {
    td {
      height: 61px;
    }
  }
`;

export const ListUsers = () => {
  const { state, setState } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortingState, setSortingState] = useState('');

  const toggleSorting = column => {
    setSortingState(prevState => {
      if (prevState === column) {
        return `-${column}`;
      }
      return column;
    });
  };

  const COLUMNS = [
    {
      label: KDFM.PROFILE,
      renderCell: item => <ProfileRender url={item.photo} />,
      width: '10%',
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
      width: '20%',
      resize: true,
      renderCell: item => (
        <TextRender text={item?.role?.join(', ')} capitalizeText={false} />
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
      width: '10%',
      resize: true,
      renderCell: item => (
        <StatusRender status={item?.is_active ? 'Active' : 'Inactive'} />
      ),
    },
  ];

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
      <GridComponent
        module="users"
        title={KDFM.USER_LIST}
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        placeholder={KDFM.SEARCH_USER_PLACEHOLDER}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        sortingState={sortingState}
        setSortingState={setSortingState}
        itemsPerPage={KDFM.ITEMS_PER_PAGE}
      />
    </>
  );
};
