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
  SettingSmallIcon,
} from '../../assets';
import { Table } from '../../components';
import { ModalWithIcon } from '../../shared';
import {
  AuthenticationSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';

import { Tooltip as ReactTooltip } from 'react-tooltip';
import { NoDataIcon } from '../../assets';
import { KDFM } from '../../constants';
import AddControllerServiceModal from '../ControllerService/AddControllerServiceModal';
import AddProperties from '../ControllerService/AddProperties';
import ConfigControllerService from '../ControllerService/ConfigControllerService';
import ConfigurePropertyModal from '../ControllerService/ConfigurePropertyModal';
import PropertyDropdownModal from '../ControllerService/ProprtyDropdownModel';
import Collapsible from './Collapsible';

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

const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
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
  const isListProprtyModel = useSelector(
    NamespacesSelectors.getControllerServicePropertyModel
  );
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getAllRootControllerServiceNamespace')
  );

  const [isOpen, setIsOpen] = useState(true);

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
  const handleStatusClick = () => {
    dispatch(
      NamespacesActions.changeStatusControllerService({
        state:
          selectedItemFromList?.state == 'DISABLED' ? 'ENABLED' : 'DISABLED',
        version: selectedItemFromList?.version,
        id: selectedItemFromList?.id,
      })
    );
    setTimeout(() => {
      dispatch(NamespacesActions.getControllerServiceList());
    }, 500);
    setIsEnableModalOpen(false);
  };
  const handleDeleteControllerServiceClick = () => {
    dispatch(
      NamespacesActions.deleteControllerService({
        version: selectedItemFromList?.version,
        id: selectedItemFromList?.id,
      })
    );

    setTimeout(() => {
      dispatch(NamespacesActions.getControllerServiceList());
    }, 500);
    setIsDeleteModalOpen(false);
  };

  const controllerPermissions = useSelector(
    AuthenticationSelectors.getPermissions
  );

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => item?.name,
      width: '21%',
    },
    {
      label: 'Type',
      renderCell: item => item?.typeValue,
      width: '20%',
    },
    {
      label: 'Bundle',
      renderCell: item => item?.bundleValue,
      width: '18%',
    },
    {
      label: 'State',
      renderCell: item => <StatusText text={item?.state} item={item} />,
      width: '16%',
    },
    {
      label: 'Scope',
      renderCell: item => item?.scope,
      width: '11%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <>
          {controllerPermissions.includes('edit_controller_services') && (
            <>
              <button
                className="border-0 bg-white"
                onClick={() => handleSettingClick(item)}
                data-tooltip-id={'Settings'}
              >
                <SettingSmallIcon />
              </button>
              <ReactTooltip
                id={'Settings'}
                place="left"
                content={'Settings'}
                style={{
                  width: '100px',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              />
            </>
          )}
          {item?.state != 'INVALID' &&
            item?.state != 'VALIDATING' &&
            item?.state != 'DISABLING' &&
            controllerPermissions.includes('edit_controller_services') && (
              <>
                <button
                  className="border-0 bg-white ms-1"
                  onClick={() => handleEnableClick(item)}
                  data-tooltip-id={item?.id}
                >
                  {item?.state !== 'DISABLED' ? (
                    <FlashCutIcon />
                  ) : (
                    <FlashIcon />
                  )}
                </button>
                <ReactTooltip
                  id={item?.id}
                  place="left"
                  content={item?.state !== 'DISABLED' ? 'Disable' : 'Enable'}
                  style={{
                    width: '100px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </>
            )}
          {item?.state != 'ENABLED' &&
            item?.state != 'ENABLING' &&
            item?.state != 'DISABLING' &&
            controllerPermissions.includes('delete_controller_services') && (
              <>
                <button
                  className="border-0 bg-white ms-1"
                  onClick={() => handleDeleteClick(item)}
                  data-tooltip-id={'Delete'}
                >
                  <DeleteSmallIcon color="black" height="28" />
                </button>
                <ReactTooltip
                  id={'Delete'}
                  place="left"
                  content={'Delete'}
                  style={{
                    width: '80px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </>
            )}
        </>
      ),
      width: '14%',
    },
  ];

  useEffect(() => {
    dispatch(NamespacesActions.getControllerServiceList());
  }, [dispatch, modalOpenState, selectedCluster]);

  const handleSettingClick = item => {
    setSelectedItemFromList(item);
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(true));
  };

  const handleCloseModal = () => {
    dispatch(NamespacesActions.setNewlyAddVariables([]));
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(false));
    dispatch(NamespacesActions.getControllerServiceList());
  };

  const handleAddValueModal = item => {
    setIsAddpropertiesModalOpen(true);
    setSelectedPropertyToEdit(item);
  };

  return (
    <ScrollSetGrey className="scroll-set-grey pe-1">
      {isEmpty(listData) ? (
        <>
          <div className="d-flex justify-content-center">
            <NoDataIcon width={130} />
          </div>
          <NoDataText>No Data Found!!</NoDataText>
        </>
      ) : (
        <Collapsible
          title={KDFM.CONTROLLER_SERVICE}
          isTableOpen={isOpen}
          toggleCollapsible={() => handleToggle()}
          onBtnClick={() =>
            dispatch(NamespacesActions.setIsAddControllerServiceModal(true))
          }
        >
          <Table
            data={listData}
            columns={COLUMNS}
            controllerModule={true}
            loading={loading}
          />
        </Collapsible>
      )}

      <AddControllerServiceModal />

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
    </ScrollSetGrey>
  );
};

export default ListControllerService;
