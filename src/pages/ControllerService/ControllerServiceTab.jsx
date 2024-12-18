/*eslint-disable*/
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  ConfirmScheduleDeploymentIcon,
  FlashCutIcon,
  FlashIcon,
  NoDataIcon,
  PencilIcon,
  RefrenceIcon,
  SettingSmallIcon,
} from '../../assets';
import { Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { ModalWithIcon } from '../../shared';
import {
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import ControllerServerRefreshModal from '../Namespaces/COntrollerServerRefreshModal';
import Collapsible from '../Namespaces/Collapsible';
import AddControllerServiceModal from './AddControllerServiceModal';
import AddProperties from './AddProperties';
import ConfigControllerService from './ConfigControllerService';
import ConfigurePage from './ConfigurePage';
import ConfigurePropertyModal from './ConfigurePropertyModal';
import PropertyDropdownModal from './ProprtyDropdownModel';

const DataWrapper = styled.div`
  width: 100%;
`;

const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

const ScrollSetGrey = styled.div`
  height: calc(100vh - 341px);
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

const ReConfigureButton = styled.button`
  border: none;
  cursor: pointer;
  background: none;
`;

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

const ControllerServiceTab = ({ setControllerServicePayload }) => {
  const dispatch = useDispatch();
  const [openIndex, setOpenIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedItemFromList, setSelectedItemFromList] = useState({});
  const [selectedPropertyToEdit, setSelectedPropertyToEdit] = useState({});

  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const modalOpenState = useSelector(
    NamespacesSelectors.getIsNewAddControllerServiceMOdalOpen
  );
  const registryDetailsData = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  const [controllerServicesData, setControllerServicesData] = useState(
    registryDetailsData?.controllerServicesData
  );
  const isListProprtyModel = useSelector(
    NamespacesSelectors.getControllerServicePropertyModel
  );
  const loadingForConfigureTable = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getAllRootControllerServiceNamespace')
  );
  const newlyAddedExternalServiceResponse = useSelector(
    NamespacesSelectors.getNewlyAddedExternalServiceCS
  );
  const stateChangeResponse = useSelector(
    NamespacesSelectors.getChangeStatusCSRespone
  );

  const [externalControllerServices, setExternalControllerServices] = useState(
    controllerServicesData?.externalControllerServices
  );
  const [
    externalControllerServicesTableData,
    setExternalControllerServicesTableData,
  ] = useState(controllerServicesData?.externalControllerServices);

  const [selectedExternalService, setSelectedExternalService] = useState({});
  const [externalControllerServiceArray, setExternalControllerServiceArray] =
    useState();

  const [localServices, setLocalServices] = useState(
    controllerServicesData?.localServices
  );

  const [isAddpropertiesModalOpen, setIsAddpropertiesModalOpen] =
    useState(false);

  const [listPropertyTableData, setListPropertTableData] = useState(
    selectedItemFromList?.properties
  );

  const [updatedData, setUpdatedData] = useState([]);

  const [updatedLocalServicesData, setUpdatedLocalServicesData] = useState([]);

  const [externalServicePayload, setExternalServicePayload] = useState([]);

  const [isExternalServiceUpdated, setIsExternalServiceUpdated] =
    useState(false);

  const [isFromExternalService, setisFromExternalService] = useState(false);

  const [isAddedViaAdd, setIsAddedViaAdd] = useState(null);
  const [refreshItem, setRefreshItem] = useState(null);

  const [initialExternalService] = useState(
    controllerServicesData?.externalControllerServices
  );

  const [
    selectedExternalServiceIdentifier,
    setSelectedExternalServiceIdentifier,
  ] = useState('');

  const [collapsibles, setCollapsibles] = useState([]);

  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
  const listData = useSelector(
    NamespacesSelectors?.getRootControllerServiceNamespace
  );
  const isUpgrade = useSelector(NamespacesSelectors.getDeployRegistryFlow);

  useEffect(() => {
    if (!isEmpty(newlyAddedExternalServiceResponse)) {
      const newalyAddedObject = {
        identifier: newlyAddedExternalServiceResponse?.value,
        name: newlyAddedExternalServiceResponse?.label,
        parentId: selectedExternalServiceIdentifier,
      };
      const updatedArray = externalControllerServices.map(obj =>
        obj.identifier === selectedExternalService.identifier
          ? newalyAddedObject
          : obj
      );
      setExternalControllerServicesTableData(updatedArray);
    }
  }, [newlyAddedExternalServiceResponse]);

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

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <TextRender
          key={item?.name}
          text={
            item?.controllerService?.length
              ? item?.controllerService[0]?.name
              : item?.name
          }
          capitalizeText={false}
        />
      ),
      width: '21%',
    },
    {
      label: 'Type',
      renderCell: item => (
        <TextRender
          key={item?.typeValue}
          text={
            item?.controllerService?.length
              ? item?.controllerService[0]?.typeValue
              : item?.typeValue
          }
          capitalizeText={false}
        />
      ),
      width: '20%',
    },
    {
      label: 'Bundle',
      renderCell: item => (
        <TextRender
          key={item?.bundleValue}
          text={
            item?.controllerService?.length
              ? item?.controllerService[0]?.bundleValue
              : item?.bundleValue
          }
          capitalizeText={false}
        />
      ),
      width: '18%',
    },
    {
      label: 'State',
      renderCell: item =>
        item?.controllerService?.length ? (
          <StatusText
            text={item?.controllerService[0]?.state}
            item={item?.controllerService[0]}
          />
        ) : (
          <StatusText text={item?.state} item={item} />
        ),
      width: '16%',
    },
    {
      label: 'Scope',
      renderCell: item =>
        item?.controllerService?.length
          ? item?.controllerService[0]?.scope
          : item?.scope,
      width: '11%',
    },
    {
      label: 'Action',
      renderCell: item => {
        const tooltipContent =
          item?.controllerService?.length &&
          item?.controllerService[0]?.state === 'DISABLED'
            ? 'Enable'
            : 'Disable';
        return item?.controllerService?.length ? (
          <div className="d-flex">
            <button
              className="border-0 bg-white"
              onClick={() => handleSettingClick(item?.controllerService[0])}
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
            {item.updatedValue &&
              item?.controllerService[0]?.state != 'INVALID' &&
              item?.controllerService[0]?.state != 'VALIDATING' &&
              item?.controllerService[0]?.state != 'DISABLING' && (
                <>
                  <button
                    className="border-0 bg-white ms-2"
                    onClick={() =>
                      handleEnableClick(item?.controllerService[0])
                    }
                    data-tooltip-id={item?.controllerService[0]?.id}
                  >
                    {item?.controllerService[0]?.state !== 'DISABLED' ? (
                      <FlashCutIcon />
                    ) : (
                      <FlashIcon />
                    )}
                  </button>
                  <ReactTooltip
                    id={item?.controllerService[0]?.id}
                    place="left"
                    content={tooltipContent}
                    style={{
                      width: '130px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                    }}
                  />
                </>
              )}
            {item.updatedValue && (
              <React.Fragment>
                <ReConfigureButton
                  className="ms-2"
                  data-tooltip-id={`configure-${item?.controllerService[0]?.id}`}
                  onClick={() => handleConfigure(item)}
                >
                  <PencilIcon />
                </ReConfigureButton>
                <ReactTooltip
                  id={`configure-${item?.controllerService[0]?.id}`}
                  place="left"
                  content="Re-Configure"
                  style={{
                    width: '130px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </React.Fragment>
            )}
          </div>
        ) : (
          <>
            {item.updatedValue ? (
              <React.Fragment>
                <ReConfigureButton
                  data-tooltip-id={`configure-${item?.id}`}
                  onClick={() => handleConfigure(item)}
                >
                  <PencilIcon />
                </ReConfigureButton>
                <ReactTooltip
                  id={`configure-${item?.id}`}
                  place="left"
                  content="Re-Configure"
                  style={{
                    width: '130px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </React.Fragment>
            ) : (
              <ConfigureButton onClick={() => handleConfigure(item)}>
                {KDFM.CONFIGURE}
              </ConfigureButton>
            )}
          </>
        );
      },
      width: '14%',
    },
  ];
  const COLUMNS_2 = [
    {
      label: 'Name',
      renderCell: item => (
        <TextRender
          key={item?.name}
          text={item?.name || 'N/A'}
          capitalizeText={false}
        />
      ),
      width: '21%',
    },
    {
      label: 'Type',
      renderCell: item => (
        <TextRender
          key={item?.typeValue}
          text={item?.typeValue || 'N/A'}
          capitalizeText={false}
        />
      ),
      width: '20%',
    },
    {
      label: 'Bundle',
      renderCell: item => (
        <TextRender
          key={item?.bundleValue}
          text={item?.bundleValue || 'N/A'}
          capitalizeText={false}
        />
      ),
      width: '18%',
    },
    {
      label: 'State',
      renderCell: item =>
        item?.state ? <StatusText text={item?.state} item={item} /> : 'N/A',
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
        <div className="d-flex gap-10">
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
        </div>
      ),
      width: '14%',
    },
  ];

  const COLUMNS_3 = [
    {
      label: 'Name',
      renderCell: item => (
        <TextRender
          key={item?.name}
          text={item?.name || 'N/A'}
          capitalizeText={false}
        />
      ),
      width: '20%',
    },
    {
      label: 'Type',
      renderCell: item => (
        <TextRender
          key={item?.typeValue}
          text={item?.typeValue || 'N/A'}
          capitalizeText={false}
        />
      ),
      width: '20%',
    },
    {
      label: 'Bundle',
      renderCell: item => (
        <TextRender
          key={item?.bundleValue}
          text={item?.bundleValue || 'N/A'}
          capitalizeText={false}
        />
      ),
      width: '15%',
    },
    {
      label: 'State',
      renderCell: item =>
        item?.state ? <StatusText text={item?.state} item={item} /> : 'N/A',
      width: '10%',
    },
    {
      label: 'Scope',
      renderCell: item => item?.scope || 'N/A',
      width: '10%',
    },
    {
      label: 'Refrenceing Component',
      renderCell: item => (
        <div className="d-flex justify-content-center">
          {(!isEmpty(item?.referencingComponents?.controllerService) ||
            !isEmpty(item?.referencingComponents?.processors)) && (
            <>
              <button
                className="border-0 bg-white"
                onClick={() => {
                  setRefreshItem(item);
                  dispatch(NamespacesActions.setRefreshmodalOpen(true));
                }}
                data-tooltip-id={`Refrence-${item?.id}`}
                aria-label="Refrence"
              >
                <RefrenceIcon />
              </button>
              <ReactTooltip
                id={`Refrence-${item?.id}`}
                place="left"
                content="Refrence"
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
      width: '14%',
    },

    {
      label: 'Action',
      renderCell: item => (
        <div className="d-flex gap-10">
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
        </div>
      ),
      width: '10%',
    },
  ];

  const handleEnableClick = item => {
    setSelectedItemFromList(item);
    setIsEnableModalOpen(true);
  };

  useEffect(() => {
    if (!isEmpty(stateChangeResponse)) {
      setExternalControllerServices(prevServices =>
        prevServices.map(service => {
          if (service.updatedValue === selectedItemFromList?.id) {
            return {
              ...service,
              controllerService: service.controllerService.map((cs, index) =>
                index === 0
                  ? {
                      ...cs,
                      state:
                        selectedItemFromList?.state === 'DISABLED' ||
                        selectedItemFromList?.state === 'DISABLING'
                          ? 'ENABLED'
                          : 'DISABLED',
                    }
                  : cs
              ),
            };
          }
          return service;
        })
      );
    }
  }, [stateChangeResponse]);

  const handleStatusClick = () => {
    dispatch(
      NamespacesActions.changeStatusControllerService({
        state:
          selectedItemFromList?.state === 'DISABLED' ||
          selectedItemFromList?.state === 'DISABLING'
            ? 'ENABLED'
            : 'DISABLED',
        version: selectedItemFromList?.version,
        id: selectedItemFromList?.id,
      })
    );
    setIsEnableModalOpen(false);
  };

  const handleAddValueModal = item => {
    setIsAddpropertiesModalOpen(true);
    setSelectedPropertyToEdit(item);
  };

  const handleSettingClick = item => {
    const match = externalControllerServices?.some(data =>
      data.controllerService?.some(service => service.id === item.id)
    );
    setisFromExternalService(match);
    setSelectedItemFromList(item);
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(true));
  };

  const handleConfigure = item => {
    setSelectedExternalServiceIdentifier(
      item?.parentId ? item?.parentId : item?.identifier
    );
    setSelectedExternalService(item);
    setSelectedService(item);
    setIsModalOpen(true);
    if (!modalOpenState && selectedCluster?.value) {
      dispatch(NamespacesActions.getControllerServiceList());
    }
  };

  const handleConfigureSubmit = (
    isAdd,
    data = newlyAddedExternalServiceResponse
  ) => {
    setIsAddedViaAdd(isAdd);
    !isAdd &&
      setExternalControllerServicesTableData(prevState =>
        prevState.filter(
          service => service.identifier !== selectedExternalService.identifier
        )
      );
    const updatedData = externalControllerServices.map(service => {
      return (service.parentId ? service.parentId : service.identifier) ===
        (selectedService?.parentId
          ? selectedService?.parentId
          : selectedService?.identifier)
        ? { ...service, controllerService: [data], updatedValue: data?.id }
        : service;
    });
    !isAdd && setExternalControllerServices(updatedData);
    !isAdd && setExternalControllerServiceArray(updatedData);
    setIsModalOpen(false);
    setSelectedService(null);
    !isAdd && setIsExternalServiceUpdated(true);
  };

  useEffect(() => {
    const finalPayload = initialExternalService
      ?.map(service => {
        const matchingTableData = externalControllerServices?.find(tableItem =>
          tableItem.parentId
            ? tableItem.parentId
            : tableItem?.identifier === service.identifier
        );
        if (matchingTableData) {
          const isNameUpdated = matchingTableData?.name !== service.name;
          const newData = matchingTableData?.controllerService?.length;
          if (isNameUpdated || newData) {
            return {
              ...service,
              updatedValue: newData
                ? matchingTableData?.controllerService?.[0]?.id
                : matchingTableData?.updatedValue,
            };
          }
        }
        return null;
      })
      .filter(service => service !== null);
    setExternalServicePayload(finalPayload);
  }, [externalControllerServices]);

  const handleConfigCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleCloseModal = () => {
    dispatch(NamespacesActions.setNewlyAddVariables([]));
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(false));
  };
  const selectedNamespace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );
  const handleToggle = index => {
    if (!isUpgrade && openIndex !== index) {
      dispatch(
        NamespacesActions.getControllerServiceList(selectedNamespace?.id)
      );
    }
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const classifyServiceData = (data, serviceObject) => {
    const localServiceState = [];
    const isLocal = data.localServices.some(localService =>
      localService.controllerData.some(
        controller =>
          controller && controller.identifier === serviceObject.identifier
      )
    );
    if (isLocal) {
      localServiceState.push(serviceObject);
    }
    return { localServiceState };
  };

  useEffect(() => {
    const updatedControllerServices = externalControllerServices?.map(
      service => {
        const matchingTableData = externalControllerServicesTableData?.find(
          tableItem => tableItem?.parentId === service?.identifier
        );

        if (matchingTableData) {
          return {
            ...service,
            controllerService: isAddedViaAdd ? [] : service?.controllerService,
            name: matchingTableData?.name,
            updatedValue: matchingTableData?.identifier,
          };
        }
        return service;
      }
    );

    setExternalControllerServices(updatedControllerServices);
  }, [externalControllerServicesTableData]);

  useEffect(() => {
    const collapsibles = [];
    if (externalControllerServices?.length) {
      collapsibles.push({
        title: KDFM.CONTROLLER_SERVICE_DATA,
        content: (
          <Table
            data={externalControllerServices}
            columns={COLUMNS}
            className={'variables-table'}
          />
        ),
      });
    }
    if (isUpgrade) {
      if (localServices?.length) {
        collapsibles.push(
          ...localServices.map(service => ({
            title: service?.processGroupName || 'Unnamed Group',
            content: (
              <Table
                data={service?.controllerData || []}
                columns={COLUMNS_2}
                className={'variables-table'}
              />
            ),
          }))
        );
      }
    } else {
      collapsibles.push({
        title: selectedNamespace?.name || 'Unnamed Group',
        content: (
          <Table
            data={listData}
            columns={COLUMNS_3}
            className={'variables-table'}
          />
        ),
      });
    }

    setCollapsibles(collapsibles);
  }, [
    localServices,
    externalControllerServices,
    externalControllerServiceArray,
    newlyAddedExternalServiceResponse,
    externalControllerServicesTableData,
    listData,
  ]);

  const handleServiceConfigure = data => {
    const { localServiceState } = classifyServiceData(
      controllerServicesData,
      data
    );
    if (localServiceState?.length) {
      setUpdatedLocalServicesData(prevState => {
        const mergedLocalState = [
          ...prevState.filter(
            item =>
              !localServiceState?.some(
                newItem => newItem?.identifier === item?.identifier
              )
          ),
          ...localServiceState,
        ];
        return mergedLocalState;
      });
    }
  };

  const mergeProperties = (existingProperties, updatedProperties) => {
    const propertyMap = new Map(
      existingProperties?.map(prop => [prop.name, prop])
    );
    updatedProperties?.forEach(updatedProp => {
      propertyMap.set(updatedProp.name, updatedProp);
    });
    return Array.from(propertyMap.values());
  };

  useEffect(() => {
    setLocalServices(prevLocalServices => {
      const updatedServices = prevLocalServices?.map(processGroup => {
        return {
          ...processGroup,
          controllerData: processGroup?.controllerData?.map(controller => {
            const updatedController = updatedLocalServicesData?.find(
              updated => updated.identifier === controller.identifier
            );
            if (updatedController) {
              return {
                ...controller,
                ...updatedController,
                properties: mergeProperties(
                  controller.properties,
                  updatedController.properties
                ),
              };
            }
            return controller;
          }),
        };
      });
      return updatedServices;
    });
  }, [updatedLocalServicesData]);

  useEffect(() => {
    setControllerServicePayload(prevState => {
      const newPayload = {};
      if (!isEmpty(externalServicePayload)) {
        newPayload.externalServicesData = externalServicePayload;
      }
      if (
        !isEmpty(updatedLocalServicesData) ||
        !isEmpty(prevState.localServicesData)
      ) {
        newPayload.localServicesData = updatedLocalServicesData?.length
          ? updatedLocalServicesData
          : prevState.localServicesData;
      }
      return newPayload;
    });
  }, [
    externalServicePayload,
    updatedLocalServicesData,
    isExternalServiceUpdated,
  ]);

  useEffect(() => {
    setControllerServicesData({
      externalControllerServices: externalControllerServices,
      localServices: localServices,
    });
  }, [localServices, externalControllerServices]);

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {localServices?.length || externalControllerServices?.length ? (
          collapsibles &&
          collapsibles?.map((item, index) => (
            <Collapsible
              key={index}
              title={item.title}
              isTableOpen={openIndex === index}
              toggleCollapsible={() => handleToggle(index)}
              isAddBtnVisible={false}
              onBtnClick={() => {
                setOpenIndex(index);
                dispatch(
                  NamespacesActions.setIsAddControllerServiceModal(true)
                );
              }}
            >
              {item.content}
            </Collapsible>
          ))
        ) : (
          <>
            <div className="d-flex justify-content-center h-100 align-items-center">
              <div className="text-center">
                <NoDataIcon width={130} />
                <NoDataText>{KDFM.NO_DATA_FOUND}</NoDataText>
              </div>
            </div>
          </>
        )}
      </ScrollSetGrey>

      {isModalOpen && (
        <ConfigurePage
          isOpen={isModalOpen}
          onClose={handleConfigCloseModal}
          service={selectedService}
          handleConfigureSubmit={handleConfigureSubmit}
          loading={loadingForConfigureTable}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      <AddControllerServiceModal
        setIsAddedViaAdd={setIsAddedViaAdd}
        handleSubmitData={handleConfigureSubmit}
        isFromControllerServiceTab={true}
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
        isFromControllerServiceTab={true}
        isFromExternalService={isFromExternalService}
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
      <ControllerServerRefreshModal refreshItem={refreshItem} />
    </DataWrapper>
  );
};
ControllerServiceTab.propTypes = {
  setControllerServicePayload: PropTypes.func,
  controllerServicePayload: PropTypes.object,
};
export default ControllerServiceTab;
