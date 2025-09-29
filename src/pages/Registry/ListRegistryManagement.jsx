import { React, useState } from 'react';
import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  PencilIcon,
  SortDownIcon,
  SortUpIcon,
} from '../../assets';
import { Grid, IconButton, StatusRender, TextRender } from '../../components';
import { KDFM, STATUS_OPTIONS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { AddRegistryModal } from './AddRegistryModal';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { ModalWithIcon } from '../../shared';
import {
  AuthenticationSelectors,
  RegistryActions,
  RegistrySelectors,
} from '../../store';

const ListRegistryManagementPage = () => {
  const dispatch = useDispatch();
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);
  const [selectedItem, setSelectedItem] = useState({});
  const isDeleteModalOpen = useSelector(RegistrySelectors.getIsDeleteModalOpen);
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
      renderCell: item => (
        <div className="d-flex align-self-end gap-2">
          {userPermissions.includes('edit_registry') && (
            <button
              onClick={() => {
                dispatch(RegistryActions.setRegistrySelectedData(item));
                dispatch(RegistryActions.setIsAddRegistryModalOpen(true));
                setSelectedItem(item);
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              data-tooltip-id={`tooltip-group-edit-registry`}
            >
              <IconButton>
                <PencilIcon width={14} height={14} />
              </IconButton>
            </button>
          )}
          <ReactTooltip
            id={`tooltip-group-edit-registry`}
            place="left"
            content={'Edit Registry'}
            style={{
              width: '120px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          {userPermissions.includes('delete_registry') && (
            <button
              onClick={() => {
                setSelectedItem(item);
                dispatch(RegistryActions.setIsDeleteModalOpen(true));
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              data-tooltip-id={`tooltip-group-delete-registry`}
            >
              <IconButton>
                <DeleteSmallIcon width={14} height={14} color="red" />
              </IconButton>
            </button>
          )}
          <ReactTooltip
            id={`tooltip-group-delete-registry`}
            place="left"
            content={'Delete Registry'}
            style={{
              width: '120px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </div>
      ),
    },
  ];
  const handleDeleteModalClose = () => {
    dispatch(RegistryActions.setIsDeleteModalOpen(false));
  };
  const handleDeleteSubmit = () => {
    dispatch(RegistryActions.deleteRegistry(selectedItem?.id));
  };
  return (
    <>
      <AddRegistryModal />
      <ModalWithIcon
        title="Delete Registry"
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        primaryText={`Are you sure you want to delete registry?`}
        onSubmit={handleDeleteSubmit}
      />
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
