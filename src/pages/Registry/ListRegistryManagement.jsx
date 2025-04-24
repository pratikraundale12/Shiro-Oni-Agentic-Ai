import { React, useState } from 'react';
import { SortDownIcon, SortUpIcon } from '../../assets';
import { Grid, StatusRender, TextRender } from '../../components';
import { KDFM, STATUS_OPTIONS } from '../../constants';
import { useDispatch } from 'react-redux';
import { AddRegistryModal } from './AddRegistryModal';

const ListRegistryManagementPage = () => {
  const dispatch = useDispatch();
  dispatch;
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
      width: '30%',
      resize: true,
      renderCell: item => (
        <TextRender
          text={`${item?.name || ''}`}
          capitalizeText={false}
          toolTip={false}
        />
      ),
    },

    {
      label: 'Registry URL',
      width: '40%',
      resize: true,
      renderCell: item => (
        <TextRender
          text={item?.registry_url || ''}
          capitalizeText={false}
          toolTip={true}
        />
      ),
    },
    {
      label: <>{KDFM.STATUS}</>,
      width: '10%',
      resize: true,
      renderCell: item => (
        <StatusRender status={item?.is_active ? 'Active' : 'Inactive'} />
      ),
    },

    {
      label: <>Actions</>,
      width: '20%',
      resize: true,
      renderCell: () => {},
    },
  ];

  return (
    <>
      <AddRegistryModal />
      <Grid
        module="registry"
        title={'Registry List'}
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        placeholder={KDFM.SEARCH_USER_PLACEHOLDER}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        sortingState={sortingState}
        setSortingState={setSortingState}
      />
    </>
  );
};
export default ListRegistryManagementPage;
