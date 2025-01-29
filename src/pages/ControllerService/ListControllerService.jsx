/* eslint-disable react/prop-types */
import { isEmpty } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  ConfirmScheduleDeploymentIcon,
  DeleteDustbinIcon,
  DeleteSmallIcon,
  FlashCutIcon,
  FlashIcon,
  RefreshIcon,
  SettingSmallIcon,
  SmallSearchIcon,
  TodoIcon,
} from '../../assets';

import { FullPageLoader, Table, TextRender } from '../../components';
import { Button, ModalWithIcon } from '../../shared';
import {
  AuthenticationSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { theme } from '../../styles';
import AddControllerServiceModal from './AddControllerServiceModal';
import AddProperties from './AddProperties';
import ConfigControllerService from './ConfigControllerService';
import ConfigurePropertyModal from './ConfigurePropertyModal';
import PropertyDropdownModal from './ProprtyDropdownModel';

const SearchContainer = styled.div`
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
`;
const Search = styled.input`
  width: 100%;
  border-radius: 2px;
  padding: 12px 12px 12px 40px;
  font-size: 16px;
  margin: 14px 0;
  font-family: ${props => props.theme.fontRedHat};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.lightGrey};

  &:focus-visible {
    outline: none;
  }
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;
const HeadingStyle = styled.h3`
  font-family: 'Nato Sans', sans-serif;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;
const StatusTexts = styled.div`
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
  letter-spacing: -0.005em;
  text-align: left;
  color: ${props => props.color || '#b5b5bd'};
  text-transform: capitalize;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
`;

const RefreshIocnPanel = styled.div`
  cursor: pointer;
  background-color: #f5f7fa;
  border: 1px solid #dde4f0;
  width: 37px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  border-radius: 4px;
`;

const statusColors = {
  DISABLED: '#b5b5bd',
  SCHEDULED: '#0cbf59',
  INVALID: 'red',
  'IN PROGRESS': '#444445',
  DEFAULT: '#F2891F',
  ENABLED: '#0cbf59',
  DISABLING: '#F2891F',
  ENABLING: '#F2891F',
  VALIDATING: '#F2891F',
};
const StatusText = ({ text = '', item }) => {
  const color = statusColors[text] || statusColors.DEFAULT;
  function capitalizeFirstLetter(text) {
    if (!text) return '';

    text = text.toLowerCase();

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return (
    <>
      <StatusTexts color={color} data-tooltip-id={`tooltip-cs-${item?.id}`}>
        {capitalizeFirstLetter(text)}
      </StatusTexts>{' '}
      {!isEmpty(item?.tooltip) && (
        <ReactTooltip
          id={`tooltip-cs-${item?.id}`}
          place="top"
          content={item?.tooltip ? item?.tooltip : null}
          style={{
            width: '520px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            zIndex: '9999',
          }}
        />
      )}
    </>
  );
};
export const ListControllerService = () => {
  const [search, setSearch] = useState('');
  const [updatedData, setUpdatedData] = useState([]);
  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const listData = useSelector(
    NamespacesSelectors?.getRootControllerServiceNamespace
  );

  const [isAddpropertiesModalOpen, setIsAddpropertiesModalOpen] =
    useState(false);
  const [selectedItemFromList, setSelectedItemFromList] = useState({});
  const [selectedPropertyToEdit, setSelectedPropertyToEdit] = useState({});
  const modalOpenState = useSelector(
    NamespacesSelectors.getIsAddControllerServiceMOdalOpen
  );
  const [listPropertyTableData, setListPropertTableData] = useState(
    selectedItemFromList?.properties
  );
  const [isResetNotRequired, setIsResetNotRequired] = useState(false);
  const filteredModulesData = useMemo(
    () =>
      listData.filter(
        module =>
          module?.name?.toLowerCase().includes(search.toLowerCase()) ||
          module?.type?.toLowerCase().includes(search.toLowerCase())
      ),
    [listData, search]
  );

  const isListProprtyModel = useSelector(
    NamespacesSelectors.getControllerServicePropertyModel
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getAllRootControllerServiceNamespace')
  );
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const handleEnableClick = item => {
    setSelectedItemFromList(item);
    setIsEnableModalOpen(true);
  };

  const handleDeleteClick = item => {
    setSelectedItemFromList(item);
    setIsDeleteModalOpen(true);
  };
  const handleStatusClick = () => {
    dispatch(
      NamespacesActions.changeStatusControllerService({
        state:
          selectedItemFromList?.state == 'DISABLED' ||
          selectedItemFromList?.state == 'DISABLING'
            ? 'ENABLED'
            : 'DISABLED',
        version: selectedItemFromList?.version,
        id: selectedItemFromList?.id,
        referencingComponents:
          selectedItemFromList?.referencingComponents || {},
      })
    );

    setIsEnableModalOpen(false);
  };
  const handleDeleteControllerServiceClick = () => {
    setIsResetNotRequired(true);
    dispatch(
      NamespacesActions.deleteControllerService({
        version: selectedItemFromList?.version,
        id: selectedItemFromList?.id,
      })
    );
    setIsDeleteModalOpen(false);
    setIsResetNotRequired(true);
  };

  const controllerPermissions = useSelector(
    AuthenticationSelectors.getPermissions
  );

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <>
          <TextRender
            text={item?.name}
            data-tooltip-id={`tooltip-${item.id}-name`}
          />
          <ReactTooltip
            id={`tooltip-${item?.id}-name`}
            place="right"
            content={item?.name}
            style={{
              whiteSpace: 'normal',
              zIndex: 9999,
            }}
          />
        </>
      ),
      width: '21%',
      resize: true,
    },
    {
      label: 'Type',
      renderCell: item => (
        <>
          <TextRender
            text={item?.typeValue}
            data-tooltip-id={`tooltip-${item.id}-typeValue`}
          />
          <ReactTooltip
            id={`tooltip-${item?.id}-typeValue`}
            place="right"
            content={item?.typeValue}
            style={{
              whiteSpace: 'normal',
              zIndex: 9999,
            }}
          />
        </>
      ),
      width: '18%',
      resize: true,
    },
    {
      label: 'Bundle',
      renderCell: item => (
        <>
          <TextRender
            text={item?.bundleValue}
            data-tooltip-id={`tooltip-${item.id}-bundleValue`}
          />
          <ReactTooltip
            id={`tooltip-${item?.id}-bundleValue`}
            place="right"
            content={item?.bundleValue}
            style={{
              whiteSpace: 'normal',
              zIndex: 9999,
            }}
          />
        </>
      ),
      width: '18%',
      resize: true,
    },
    {
      label: 'State',
      renderCell: item => <StatusText text={item?.state} item={item} />,
      width: '16%',
      resize: true,
    },
    {
      label: 'Scope',
      renderCell: item => item?.scope,
      width: '11%',
      resize: true,
    },
    {
      label: 'Actions',
      renderCell: item => {
        const isBtnDisabled =
          item?.state === 'INVALID' ||
          item?.state === 'VALIDATING' ||
          item?.state === 'DISABLING' ||
          (item?.state === 'DISABLED' &&
            item?.validationStatus === 'INVALID') ||
          !controllerPermissions.includes('edit_controller_services');
        return (
          <>
            {controllerPermissions.includes('edit_controller_services') && (
              <>
                <button
                  className="border-0 bg-white"
                  onClick={event => {
                    handleSettingClick(item);
                    event.currentTarget.blur();
                  }}
                  data-tooltip-id={'Settings'}
                >
                  <SettingSmallIcon />
                </button>
                <ReactTooltip
                  id={'Settings'}
                  place="left"
                  content={'Settings'}
                  style={{
                    width: '130px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </>
            )}
            {
              <>
                <button
                  disabled={isBtnDisabled}
                  style={{ opacity: isBtnDisabled ? 0.3 : 1 }}
                  className="border-0 bg-white ms-1"
                  onClick={event => {
                    handleEnableClick(item);
                    event.currentTarget.blur();
                  }}
                  data-tooltip-id={item?.id}
                >
                  {item?.state !== 'DISABLED' ? (
                    <FlashCutIcon />
                  ) : (
                    <FlashIcon />
                  )}
                </button>
                {!isBtnDisabled && (
                  <ReactTooltip
                    id={item?.id}
                    place="left"
                    content={item?.state !== 'DISABLED' ? 'Disable' : 'Enable'}
                    style={{
                      width: '130px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                    }}
                  />
                )}
              </>
            }
            {item?.state != 'ENABLED' &&
              item?.state != 'ENABLING' &&
              item?.state != 'DISABLING' &&
              controllerPermissions.includes('delete_controller_services') && (
                <>
                  <button
                    className="border-0 bg-white ms-1"
                    onClick={event => {
                      handleDeleteClick(item);
                      event.currentTarget.blur();
                    }}
                    data-tooltip-id={'Delete'}
                  >
                    <DeleteSmallIcon color="black" height="28" />
                  </button>
                  <ReactTooltip
                    id={'Delete'}
                    place="left"
                    content={'Delete'}
                    style={{
                      width: '130px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                    }}
                  />
                </>
              )}
          </>
        );
      },
      width: '14%',
      resize: true,
    },
  ];
  useEffect(() => {
    if (!modalOpenState && selectedCluster?.value) {
      dispatch(NamespacesActions.getControllerServiceList());
    }
  }, [dispatch, modalOpenState, selectedCluster]);

  const handleSettingClick = item => {
    setSelectedItemFromList(item);
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(true));
  };

  const handleCloseModal = () => {
    dispatch(NamespacesActions.setNewlyAddVariables([]));
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(false));
  };

  const handleAddValueModal = item => {
    setIsAddpropertiesModalOpen(true);
    setSelectedPropertyToEdit(item);
  };

  const handleRefresh = () => {
    dispatch(NamespacesActions.getControllerServiceList());
  };

  const statusLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'changeStatusControllerService')
  );

  return (
    <>
      <FullPageLoader loading={statusLoading || loading} />
      {controllerPermissions.includes('add_controller_services') && (
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <TodoIcon width={22} height={24} />
              <HeadingStyle>Controller Services List</HeadingStyle>
            </div>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <Button
              type="button"
              size={'md'}
              onClick={() =>
                dispatch(NamespacesActions.setIsAddControllerServiceModal(true))
              }
            >
              Add
            </Button>
            <RefreshIocnPanel
              onClick={handleRefresh}
              style={{
                opacity: 1,
                minWidth: '37px',
              }}
              data-tooltip-id={`tooltip-group-namespace-refresh`}
            >
              <RefreshIcon style={{ cursor: 'pointer' }} />
            </RefreshIocnPanel>
          </div>
        </div>
      )}

      <SearchContainer>
        <SmallSearchIcon
          width={18}
          height={18}
          color={theme.colors.darkGrey1}
        />
        <Search
          type="search"
          value={search}
          placeholder="Search Controller Service by Name"
          onChange={e => {
            setIsResetNotRequired(false);
            const value = e.target.value;
            if (value.length <= 100) {
              setSearch(value);
            }
          }}
        />
      </SearchContainer>

      <AddControllerServiceModal />

      <Table
        showPagination={true}
        data={filteredModulesData}
        columns={COLUMNS}
        controllerModule={true}
        csList={true}
        isResetNotRequired={isResetNotRequired}
      />

      <ConfigControllerService
        isOpen={isListProprtyModel}
        onClose={handleCloseModal}
        selectedItemFromList={selectedItemFromList}
        handleAddValueModal={handleAddValueModal}
        listPropertyTableData={listPropertyTableData}
        setListPropertTableData={setListPropertTableData}
        setSelectedPropertyToEdit={setSelectedPropertyToEdit}
        updatedData={updatedData}
        setUpdatedData={setUpdatedData}
      />
      <AddProperties
        isOpen={isAddpropertiesModalOpen}
        onClose={() => {
          setIsAddpropertiesModalOpen(false);
          dispatch(NamespacesActions.setIsControllerServicePropertyModel(true));
        }}
        selectedPropertyToEdit={selectedPropertyToEdit}
        listPropertyTableData={listPropertyTableData}
        setListPropertTableData={setListPropertTableData}
        setIsAddpropertiesModalOpen={setIsAddpropertiesModalOpen}
        setUpdatedData={setUpdatedData}
        updatedData={updatedData}
      />
      <PropertyDropdownModal
        selectedPropertyToEdit={selectedPropertyToEdit}
        setListPropertTableData={setListPropertTableData}
        setUpdatedData={setUpdatedData}
        updatedData={updatedData}
      />
      <ConfigurePropertyModal
        setListPropertTableData={setListPropertTableData}
        setUpdatedData={setUpdatedData}
        updatedData={updatedData}
      />
      <ModalWithIcon
        title={`${selectedItemFromList?.state !== 'DISABLED' || selectedItemFromList?.state !== 'DISABLING' ? 'Disable' : 'Enable'}  : ${selectedItemFromList?.name}`}
        primaryButtonText={
          selectedItemFromList?.state !== 'DISABLED' ? 'Disable' : 'Enable'
        }
        secondaryButtonText="Cancel"
        icon={<ConfirmScheduleDeploymentIcon />}
        isOpen={isEnableModalOpen}
        onRequestClose={() => setIsEnableModalOpen(false)}
        primaryText={`Are you sure you want to ${selectedItemFromList?.state !== 'DISABLED' ? 'disable' : 'enable'} ${selectedItemFromList?.name}?`}
        onSubmit={handleStatusClick}
      />
      <ModalWithIcon
        title={`Delete : ${selectedItemFromList?.name}`}
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        primaryText={`Are you sure you want to delete ${selectedItemFromList?.name}?`}
        onSubmit={handleDeleteControllerServiceClick}
      />
    </>
  );
};

export default ListControllerService;
