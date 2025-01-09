import { React, useState } from 'react';
import { DeleteDustbinIcon } from '../../assets';
import {
  Grid,
  ProfileRender,
  StatusRender,
  TextRender,
} from '../../components';
import { KDFM, STATUS_OPTIONS } from '../../constants';
import { ModalWithIcon } from '../../shared';
import { useGlobalContext } from '../../utils';

export const ListUsers = () => {
  const { state, setState } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);

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
        <TextRender text={item?.email} capitalizeText={false} toolTip={false} />
      ),
    },
    {
      label: KDFM.ROLE,
      width: '20%',
      renderCell: item => <TextRender text={item?.role?.join(', ')} />,
    },
    {
      label: KDFM.STATUS,
      width: '10%',
      renderCell: item => (
        <StatusRender status={item?.is_active ? 'Active' : 'Inactive'} />
      ),
    },
  ];

  const sortFns = {};

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
        sortFns={sortFns}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
};
