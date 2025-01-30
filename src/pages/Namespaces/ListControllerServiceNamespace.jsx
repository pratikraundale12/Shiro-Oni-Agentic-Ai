/* eslint-disable react/prop-types */
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  ConfirmScheduleDeploymentIcon,
  DeleteDustbinIcon,
  DeleteSmallIcon,
  FlashCutIcon,
  FlashIcon,
  RefrenceIcon,
  SettingSmallIcon,
  SmallSearchIcon,
} from '../../assets';
import { FullPageLoader, Table, TextRender } from '../../components';
import { ModalWithIcon } from '../../shared';
import {
  AuthenticationSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';

import { Tooltip as ReactTooltip } from 'react-tooltip';
import { theme } from '../../styles';
import AddControllerServiceModal from '../ControllerService/AddControllerServiceModal';
import AddProperties from '../ControllerService/AddProperties';
import ConfigControllerService from '../ControllerService/ConfigControllerService';
import ConfigurePropertyModal from '../ControllerService/ConfigurePropertyModal';
import PropertyDropdownModal from '../ControllerService/ProprtyDropdownModel';
import Collapsible from './Collapsible';
import ControllerServerRefreshModal from './ControllerServerRefreshModal';

const StatusTexts = styled.div`
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
  letter-spacing: -0.005em;
  text-align: left;
  color: ${props => props.color || '#b5b5bd'};
  display: flex;
  align-items: center;
  cursor: pointer;
  div {
    align-items: center;
    height: 8px;
    width: 8px;
    background: ${props => props.color || '#b5b5bd'};
    margin-right: 5px;
    border-radius: 50%;
  }
`;
const statusColors = {
  DISABLED: '#b5b5bd',
  SCHEDULED: '#0cbf59',
  INVALID: 'red',
  'IN PROGRESS': '#444445',
  DEFAULT: '#F2891F',
  ENABLED: '#0cbf59',
};

const ScrollSetGrey = styled.div`
  min-height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: auto;
`;

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
          place="right"
          content={item?.tooltip ? item?.tooltip : null}
          style={{
            width: '520px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            zIndex: 9999,
          }}
        />
      )}
    </>
  );
};
export const ListControllerService = () => {
  const [updatedData, setUpdatedData] = useState([]);
  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const listData = useSelector(
    NamespacesSelectors?.getRootControllerServiceNamespace
  );
  const [refreshItem, setRefreshItem] = useState(null);

  const [isAddpropertiesModalOpen, setIsAddpropertiesModalOpen] =
    useState(false);
  const [selectedItemFromList, setSelectedItemFromList] = useState({});
  const [selectedPropertyToEdit, setSelectedPropertyToEdit] = useState({});

  const [listPropertyTableData, setListPropertTableData] = useState(
    selectedItemFromList?.properties
  );
  const isListProprtyModel = useSelector(
    NamespacesSelectors.getControllerServicePropertyModel
  );
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const stateChangeResponse = useSelector(
    NamespacesSelectors.getChangeStatusCSRespone
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getAllRootControllerServiceNamespace')
  );

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filteredModulesData = listData.filter(
    module =>
      module?.name?.toLowerCase().includes(search.toLowerCase()) ||
      module?.type?.toLowerCase().includes(search.toLowerCase())
  );
  const [isResetNotRequired, setIsResetNotRequired] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleEnableClick = item => {
    setSelectedItemFromList(item);
    setIsEnableModalOpen(true);
  };

  const handleDeleteClick = item => {
    setSelectedItemFromList(item);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    if (!isEmpty(stateChangeResponse)) {
      dispatch(NamespacesActions.getControllerServiceList({ localOnly: true }));
    }
  }, [stateChangeResponse]);

  const handleStatusClick = () => {
    dispatch(
      NamespacesActions.changeStatusControllerService({
        state:
          selectedItemFromList?.state == 'DISABLED' ? 'ENABLED' : 'DISABLED',
        version: selectedItemFromList?.version,
        id: selectedItemFromList?.id,
        isFromPgDetails: true,
        referencingComponents:
          selectedItemFromList?.referencingComponents || {},
      })
    );
    // setTimeout(() => {
    //  if(!isEmpty(stateChangeResponse)) && dispatch(NamespacesActions.getControllerServiceList({ localOnly: true }));
    // }, 500);
    setIsEnableModalOpen(false);
  };

  const handleDeleteControllerServiceClick = () => {
    setIsResetNotRequired(true);
    dispatch(
      NamespacesActions.deleteControllerService({
        version: selectedItemFromList?.version,
        id: selectedItemFromList?.id,
        isFromPgDetails: true,
      })
    );
    setTimeout(() => {
      dispatch(NamespacesActions.getControllerServiceList({ localOnly: true }));
    }, 500);
    setIsDeleteModalOpen(false);
    setIsResetNotRequired(true);
  };

  const controllerPermissions = useSelector(
    AuthenticationSelectors.getPermissions
  );
  const singleNamespaceData = useSelector(
    NamespacesSelectors.getSingleNamespaceData
  );
  const permissions = singleNamespaceData?.permissions;
  const { canWrite } = permissions || {};

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <TextRender key={item?.name} text={item?.name} capitalizeText={false} />
      ),
      width: '20%',
      resize: true,
    },
    {
      label: 'Type',
      renderCell: item => (
        <TextRender
          key={item?.typeValue}
          text={item?.typeValue}
          capitalizeText={false}
        />
      ),
      width: '20%',
      resize: true,
    },
    {
      label: 'Bundle',
      renderCell: item => (
        <TextRender
          key={item?.bundleValue}
          text={item?.bundleValue}
          capitalizeText={false}
        />
      ),
      width: '18%',
      resize: true,
    },
    {
      label: 'State',
      renderCell: item => <StatusText text={item?.state} item={item} />,
      width: '8%',
      resize: true,
    },
    {
      label: 'Scope',
      renderCell: item => item?.scope,
      width: '8%',
      resize: true,
    },
    {
      label: 'Referencing Component',
      renderCell: item => (
        <div className="d-flex justify-content-center">
          {(!isEmpty(item?.referencingComponents?.controllerService) ||
            !isEmpty(item?.referencingComponents?.processors)) && (
            <>
              <button
                className="border-0 bg-white"
                onClick={event => {
                  setRefreshItem(item);
                  dispatch(NamespacesActions.setRefreshmodalOpen(true));
                  event.currentTarget.blur();
                }}
                data-tooltip-id={`Referencing-${item?.id}`}
                aria-label="Referencing"
              >
                <RefrenceIcon />
              </button>
              <ReactTooltip
                id={`Referencing-${item?.id}`}
                place="left"
                content="Reference"
                style={{
                  width: 'auto',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              />
            </>
          )}
        </div>
      ),
      width: '16%',
      resize: true,
    },
    {
      label: 'Actions',
      renderCell: item => {
        const isBtnDisable =
          item?.state === 'INVALID' ||
          item?.state === 'VALIDATING' ||
          item?.state === 'DISABLING' ||
          (item?.state === 'DISABLED' && item?.validationStatus === 'INVALID');
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
                  data-tooltip-id={'global-tooltip'}
                  data-tooltip-content={'Settings'}
                  data-tooltip-place="left"
                  disabled={
                    !canWrite ||
                    item?.state === 'ENABLING' ||
                    item?.state === 'ENABLED'
                  }
                  style={{
                    opacity:
                      !canWrite ||
                      item?.state === 'ENABLING' ||
                      item?.state === 'ENABLED'
                        ? 0.3
                        : 1,
                    cursor:
                      !canWrite ||
                      item?.state === 'ENABLING' ||
                      item?.state === 'ENABLED'
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  <SettingSmallIcon />
                </button>
              </>
            )}
            {
              <>
                <button
                  className="border-0 bg-white ms-1"
                  onClick={event => {
                    handleEnableClick(item);
                    event.currentTarget.blur();
                  }}
                  data-tooltip-id={'global-tooltip'}
                  data-tooltip-content={
                    isBtnDisable
                      ? ''
                      : item?.state !== 'DISABLED'
                        ? 'Disable'
                        : 'Enable'
                  }
                  data-tooltip-place="left"
                  disabled={!canWrite || isBtnDisable}
                  style={{
                    opacity: !canWrite || isBtnDisable ? 0.3 : 1,
                  }}
                >
                  {item?.state !== 'DISABLED' ? (
                    <FlashCutIcon />
                  ) : (
                    <FlashIcon />
                  )}
                </button>
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
                    data-tooltip-id={'global-tooltip'}
                    data-tooltip-content={'Delete'}
                    data-tooltip-place="left"
                    disabled={!canWrite}
                    style={{
                      opacity: canWrite ? 1 : 0.3,
                      cursor: canWrite ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <DeleteSmallIcon color="black" height="28" />
                  </button>
                </>
              )}
          </>
        );
      },
      width: '10%',
      resize: true,
    },
  ];

  useEffect(() => {
    dispatch(NamespacesActions.getControllerServiceList({ localOnly: true }));
  }, [dispatch, selectedCluster]);

  const handleSettingClick = item => {
    setSelectedItemFromList(item);
    setListPropertTableData(item?.properties);
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(true));
  };

  const handleCloseModal = () => {
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(false));
  };

  const handleAddValueModal = item => {
    setIsAddpropertiesModalOpen(true);
    setSelectedPropertyToEdit(item);
  };

  const statusLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'changeStatusControllerService')
  );

  return (
    <>
      <FullPageLoader loading={statusLoading || loading} />
      <ScrollSetGrey className="scroll-set-grey pe-1">
        <Collapsible
          isAddBtnDisable={!canWrite}
          title={singleNamespaceData?.name}
          isTableOpen={isOpen}
          toggleCollapsible={() => handleToggle()}
          onBtnClick={() => {
            if (canWrite) {
              dispatch(NamespacesActions.setIsAddControllerServiceModal(true));
            }
          }}
        >
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
          <Table
            data={filteredModulesData}
            columns={COLUMNS}
            controllerModule={true}
            loading={loading}
            showPagination={true}
            isResetNotRequired={isResetNotRequired}
          />
        </Collapsible>

        <ReactTooltip
          id="global-tooltip"
          style={{
            width: '100px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          }}
        />

        <AddControllerServiceModal isFromPgDetails={true} />

        <ConfigControllerService
          isFromPgDetails={true}
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
            dispatch(
              NamespacesActions.setIsControllerServicePropertyModel(true)
            );
          }}
          selectedPropertyToEdit={selectedPropertyToEdit}
          listPropertyTableData={listPropertyTableData}
          setListPropertTableData={setListPropertTableData}
          setIsAddpropertiesModalOpen={setIsAddpropertiesModalOpen}
          setUpdatedData={setUpdatedData}
          updatedData={updatedData}
        />
        <PropertyDropdownModal
          selectedItemFromList={selectedItemFromList}
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
          title={`${selectedItemFromList?.state !== 'DISABLED' ? 'Disable' : 'Enable'}  : ${selectedItemFromList?.name}`}
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
        <ControllerServerRefreshModal refreshItem={refreshItem} />
      </ScrollSetGrey>
    </>
  );
};

export default ListControllerService;
