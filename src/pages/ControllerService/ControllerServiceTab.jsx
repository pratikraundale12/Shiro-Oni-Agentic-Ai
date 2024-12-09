/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { Table } from '../../components';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import Collapsible from '../Namespaces/Collapsible';
import ConfigurePage from './ConfigurePage';
import AddControllerServiceModal from './AddControllerServiceModal';
import ConfigControllerService from './ConfigControllerService';
import AddProperties from './AddProperties';
import PropertyDropdownModal from './ProprtyDropdownModel';
import ConfigurePropertyModal from './ConfigurePropertyModal';
import { SettingSmallIcon } from '../../assets';
import { KDFM } from '../../constants';
import PropTypes from 'prop-types';

const DataWrapper = styled.div`
  width: 100%;
  height: 596px;
  top: 273px;
  left: 290px;
  gap: 0px;
  opacity: 0px;
  border: Mixed solid rgba(221, 228, 240, 1);
`;

const ScrollSetGrey = styled.div`
  min-height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: auto;
`;
const ConfigureButton = styled.button`
  padding: 5px 10px;
  background-color: #ff7a00;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #ff7a00;
  }
`;

const ControllerServiceTab = ({ setControllerServicePayload }) => {
  const dispatch = useDispatch();
  const [openIndex, setOpenIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedItemFromList, setSelectedItemFromList] = useState({});
  const registryAllDetails = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  const [selectedPropertyToEdit, setSelectedPropertyToEdit] = useState({});

  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const modalOpenState = useSelector(
    NamespacesSelectors.getIsNewAddControllerServiceMOdalOpen
  );
  const isListProprtyModel = useSelector(
    NamespacesSelectors.getControllerServicePropertyModel
  );
  const [controllerServicesData, setControllerServicesData] = useState(
    registryAllDetails?.controllerServicesData?.externalControllerServices
  );

  const [externalControllerServiceArray, setExternalControllerServiceArray] =
    useState();

  const [isAddpropertiesModalOpen, setIsAddpropertiesModalOpen] =
    useState(false);

  const [listPropertyTableData, setListPropertTableData] = useState(
    selectedItemFromList?.properties
  );

  const [updatedData, setUpdatedData] = useState([]);

  const [updatedLocalServicesData, setUpdatedLocalServicesData] = useState([]);
  const [updatedExternalServiceData, setUpdatedExternalServiceData] = useState(
    []
  );
  // const [controllerServicePayload, setControllerServicePayload] = useState({});
  const [isExternalServiceConfigured, setIsExternalServiceConfigured] =
    useState(false);
  const [isExternalServiceUpdated, setIsExternalServiceUpdated] =
    useState(false);

  const COLUMNS = [
    { label: 'Name', renderCell: item => item?.name, width: '21%' },
    { label: 'Type', renderCell: item => item?.typeValue, width: '20%' },
    { label: 'Bundle', renderCell: item => item?.bundleValue, width: '18%' },
    { label: 'State', renderCell: item => item?.state, width: '16%' },
    { label: 'Scope', renderCell: item => item?.scope, width: '11%' },
    {
      label: 'Action',
      renderCell: item => (
        <ConfigureButton onClick={() => handleConfigure(item)}>
          {KDFM.CONFIGURE}
        </ConfigureButton>
      ),
      width: '14%',
    },
  ];
  const COLUMNS_2 = [
    {
      label: 'Name',
      renderCell: item => item?.name || 'N/A',
      width: '21%',
    },
    {
      label: 'Type',
      renderCell: item => item?.typeValue || 'N/A',
      width: '20%',
    },
    {
      label: 'Bundle',
      renderCell: item => item?.bundleValue || 'N/A',
      width: '18%',
    },
    {
      label: 'State',
      renderCell: item => item?.state || 'N/A',
      width: '16%',
    },
    {
      label: 'Scope',
      renderCell: item => item?.scope || 'N/A',
      width: '11%',
    },
    {
      label: 'Action',
      renderCell: item => (
        <>
          <button
            className="border-0 bg-white"
            onClick={() => handleSettingClick(item)}
            data-tooltip-id={`Settings-${item?.id}`}
            aria-label="Settings"
          >
            <SettingSmallIcon />
          </button>
          <ReactTooltip
            id={`Settings-${item?.id}`}
            place="left"
            content="Settings"
            style={{
              width: '130px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </>
      ),
      width: '14%',
    },
  ];

  const handleAddValueModal = item => {
    setIsAddpropertiesModalOpen(true);
    setSelectedPropertyToEdit(item);
  };

  const handleSettingClick = item => {
    setSelectedItemFromList(item);
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(true));
  };

  useEffect(() => {
    dispatch(NamespacesActions.getControllerServiceList());
  }, [dispatch, modalOpenState, selectedCluster]);

  const handleConfigure = item => {
    setSelectedService(item);
    setIsModalOpen(true);
    if (!modalOpenState && selectedCluster?.value) {
      dispatch(NamespacesActions.getControllerServiceList());
    }
  };

  const handleConfigureSubmit = data => {
    const updatedData = controllerServicesData.map(service =>
      service.identifier === selectedService.identifier
        ? { ...service, controllerService: [data] }
        : service
    );
    setControllerServicesData(updatedData);
    const newExternalControllerServiceArray = updatedData.map(
      service => service.controllerService
    );
    setExternalControllerServiceArray(newExternalControllerServiceArray);
    setIsModalOpen(false);
    setSelectedService(null);
    setIsExternalServiceUpdated(true);
  };

  const handleConfigCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleCloseModal = () => {
    dispatch(NamespacesActions.setNewlyAddVariables([]));
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(false));
    dispatch(NamespacesActions.getControllerServiceList());
  };

  const handleToggle = index => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const classifyServiceData = (data, serviceObject) => {
    const externalServiceState = [];
    const localServiceState = [];
    const isExternal =
      isExternalServiceUpdated &&
      controllerServicesData?.some(service =>
        service.controllerService.some(
          controller =>
            controller && controller.identifier === serviceObject.identifier
        )
      );

    if (isExternal) {
      externalServiceState.push(serviceObject);
    } else {
      const isLocal = data.localServices.some(localService =>
        localService.controllerData.some(
          controller =>
            controller && controller.identifier === serviceObject.identifier
        )
      );

      if (isLocal) {
        localServiceState.push(serviceObject);
      }
    }
    return { externalServiceState, localServiceState };
  };

  const [collapsibles, setCollapsibles] = useState([]);

  useEffect(() => {
    const newCollapsibles = [
      {
        title: 'External Controller Service',
        content: externalControllerServiceArray?.length ? (
          <Table
            data={externalControllerServiceArray[0]}
            columns={COLUMNS_2}
            className={'variables-table'}
          />
        ) : (
          <Table
            data={controllerServicesData}
            columns={COLUMNS}
            className={'variables-table'}
          />
        ),
      },
      ...(registryAllDetails?.controllerServicesData?.localServices?.map(
        service => ({
          title: service?.processGroupName || 'Unnamed Group',
          content: (
            <Table
              data={service?.controllerData || []}
              columns={COLUMNS_2}
              className={'variables-table'}
            />
          ),
        })
      ) || []),
    ];
    setCollapsibles(newCollapsibles);
  }, [
    controllerServicesData,
    registryAllDetails,
    externalControllerServiceArray,
  ]);

  const handleServiceConfigure = data => {
    const { externalServiceState, localServiceState } = classifyServiceData(
      registryAllDetails?.controllerServicesData,
      data
    );
    if (externalServiceState?.length) {
      setIsExternalServiceConfigured(true);
      setUpdatedExternalServiceData(prevState => {
        const mergedExternalState = [
          ...prevState.filter(
            item =>
              !externalServiceState.some(
                newItem => newItem.identifier === item.identifier
              )
          ),
          ...externalServiceState,
        ];
        return mergedExternalState;
      });
    }
    if (localServiceState?.length) {
      setUpdatedLocalServicesData(prevState => {
        const mergedLocalState = [
          ...prevState.filter(
            item =>
              !localServiceState.some(
                newItem => newItem.identifier === item.identifier
              )
          ),
          ...localServiceState,
        ];
        return mergedLocalState;
      });
    }
  };

  useEffect(() => {
    setControllerServicePayload(prevState => {
      const newPayload = {
        externalServicesData:
          updatedExternalServiceData?.length && isExternalServiceConfigured
            ? updatedExternalServiceData
            : externalControllerServiceArray?.length
              ? externalControllerServiceArray
              : prevState.externalServicesData || [],
        localServicesData: updatedLocalServicesData?.length
          ? updatedLocalServicesData
          : prevState.localServicesData || [],
      };
      return newPayload;
    });
  }, [
    externalControllerServiceArray,
    updatedExternalServiceData,
    updatedLocalServicesData,
    isExternalServiceConfigured,
  ]);

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {collapsibles &&
          collapsibles.map((item, index) => (
            <Collapsible
              key={index}
              title={item.title}
              isTableOpen={openIndex === index}
              toggleCollapsible={() => handleToggle(index)}
              onBtnClick={() =>
                dispatch(NamespacesActions.setIsAddControllerServiceModal(true))
              }
            >
              {item.content}
            </Collapsible>
          ))}
      </ScrollSetGrey>

      {isModalOpen && (
        <ConfigurePage
          isOpen={isModalOpen}
          onClose={handleConfigCloseModal}
          service={selectedService}
          handleConfigureSubmit={handleConfigureSubmit}
        />
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
        isFromControllerServiceTab={true}
        handlePropertyUpdate={handleServiceConfigure}
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
        isFromControllerServiceTab={true}
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
    </DataWrapper>
  );
};
ControllerServiceTab.propTypes = {
  setControllerServicePayload: PropTypes.func,
  controllerServicePayload: PropTypes.object,
};
export default ControllerServiceTab;
