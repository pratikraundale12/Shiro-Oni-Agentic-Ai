/*eslint-disable*/
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  ConfirmScheduleDeploymentIcon,
  FlashCutIcon,
  FlashIcon,
  InfoIcon,
  NoDataIcon,
  PencilIcon,
  RefrenceIcon,
  SettingSmallIcon,
  SmallSearchIcon,
} from '../../assets';
import { Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { ModalWithIcon } from '../../shared';
import {
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { theme } from '../../styles';
import Collapsible from '../Namespaces/Collapsible';
import ControllerServerRefreshModal from '../Namespaces/ControllerServerRefreshModal';
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

const ControllerServiceTab = ({
  setControllerServicePayload,
  setCsFromParent,
  csFromParent,
}) => {
  const dispatch = useDispatch();
  const [openIndex, setOpenIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedItemFromList, setSelectedItemFromList] = useState({});
  const [selectedPropertyToEdit, setSelectedPropertyToEdit] = useState({});

  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);

  const controllerServicesData = csFromParent;
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
  const propertyUpdateResponse = useSelector(
    NamespacesSelectors.getPropertyUpdateResponse
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

  const [isPropertyResponse, setIsPropertyResponse] = useState(false);
  const [isStateChangeResponse, setIsStateChangeResponse] = useState(false);
  const [
    isNewlyAddedExternalServiceResponse,
    setIsNewlyAddedExternalServiceResponse,
  ] = useState(false);

  const [versionList, setVersionList] = useState([]);

  const [lsForUpgrade, setLsForUpgrade] = useState(localServices);
  const [updatedLsForUpgrade, setUpdatedLsForUpgrade] = useState([]);

  const onSearch = (e, currentService) => {
    const value = e.target.value;
    if (value.length === 0) {
      setLsForUpgrade(prevData =>
        prevData.map(service => {
          if (
            service.processGroupIdentifier ===
            currentService?.processGroupIdentifier
          ) {
            return {
              ...service,
              filteredServicesData: [],
            };
          }
          return service;
        })
      );
      return;
    }
    if (value.length <= 100 && value.length >= 3) {
      const filteredServices = currentService?.controllerData?.filter(
        module =>
          module?.name?.toLowerCase().includes(value.toLowerCase()) ||
          module?.type?.toLowerCase().includes(value.toLowerCase())
      );
      if (value.length >= 3) {
        setLsForUpgrade(prevData =>
          prevData.map(service => {
            if (
              service.processGroupIdentifier ===
              currentService?.processGroupIdentifier
            ) {
              return {
                ...service,
                filteredServicesData: filteredServices,
              };
            }
            return service;
          })
        );
      }
    }
  };

  useEffect(() => {
    const updateControllerData = () => {
      const updatedServices = lsForUpgrade?.map(service => {
        const updatedControllerData = service?.controllerData?.map(
          controller => {
            const matchingObject = listData?.find(
              item => item.identifier === controller?.identifier
            );
            return matchingObject ? matchingObject : controller;
          }
        );

        return {
          ...service,
          controllerData: updatedControllerData,
        };
      });

      setLsForUpgrade(updatedServices);
    };

    updateControllerData();
  }, [listData]);

  useEffect(() => {
    if (!isEmpty(newlyAddedExternalServiceResponse)) {
      const newalyAddedObject = {
        identifier: newlyAddedExternalServiceResponse?.id,
        name: newlyAddedExternalServiceResponse?.name,
        parentId: selectedExternalServiceIdentifier,
        typeValue: newlyAddedExternalServiceResponse?.typeValue,
        bundleValue: newlyAddedExternalServiceResponse?.bundleValue,
        state: newlyAddedExternalServiceResponse?.state,
        scope: newlyAddedExternalServiceResponse?.scope
          ? newlyAddedExternalServiceResponse?.scope
          : 'N/A',
        version: newlyAddedExternalServiceResponse?.version,
        properties: newlyAddedExternalServiceResponse?.properties,
        tooltip: newlyAddedExternalServiceResponse?.tooltip,
        validationStatus: newlyAddedExternalServiceResponse?.validationStatus
          ? newlyAddedExternalServiceResponse?.validationStatus
          : '',
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

  useEffect(() => {
    dispatch(NamespacesActions.setPropertyUpdateResponse({}));
    dispatch(NamespacesActions.setChangeStatusCSRespone({}));
    dispatch(NamespacesActions.setNewlyAddedExternalServiceCS({}));
  }, []);

  useEffect(() => {
    const uniqueId =
      selectedItemFromList?.id ||
      selectedItemFromList?.updatedValue ||
      selectedItemFromList?.identifier;

    const addOrUpdateVersion = (prev, version) => {
      const existingIndex = prev.findIndex(item => item.uniqueId === uniqueId);

      if (existingIndex > -1) {
        if (prev[existingIndex].version !== version) {
          const updatedList = [...prev];
          updatedList[existingIndex] = {
            ...updatedList[existingIndex],
            isUpdatedAlready: true,
            version,
          };
          return updatedList;
        }
        return prev;
      }
      return [...prev, { uniqueId, version }];
    };
    if (
      isPropertyResponse &&
      !isNewlyAddedExternalServiceResponse &&
      !isStateChangeResponse
    ) {
      const version =
        propertyUpdateResponse?.id === uniqueId
          ? propertyUpdateResponse?.version
          : selectedItemFromList?.version;
      setVersionList(prev =>
        addOrUpdateVersion(
          prev,
          prev?.find(item => item.uniqueId === uniqueId)?.isUpdatedAlready &&
            propertyUpdateResponse?.id !== uniqueId
            ? prev.find(item => item.uniqueId === uniqueId)?.version
            : version
        )
      );
    } else if (
      isStateChangeResponse &&
      !isPropertyResponse &&
      !isNewlyAddedExternalServiceResponse
    ) {
      const version =
        stateChangeResponse?.data?.id === uniqueId
          ? stateChangeResponse?.data?.revision?.version
          : selectedItemFromList?.version;
      setVersionList(prev =>
        addOrUpdateVersion(
          prev,
          prev?.find(item => item.uniqueId === uniqueId)?.isUpdatedAlready &&
            stateChangeResponse?.data?.id !== uniqueId
            ? prev.find(item => item.uniqueId === uniqueId)?.version
            : version
        )
      );
    } else if (
      isNewlyAddedExternalServiceResponse &&
      !isPropertyResponse &&
      !isStateChangeResponse
    ) {
      const version =
        newlyAddedExternalServiceResponse?.id === uniqueId
          ? newlyAddedExternalServiceResponse?.version
          : selectedItemFromList?.version;
      setVersionList(prev =>
        addOrUpdateVersion(
          prev,
          prev?.find(item => item.uniqueId === uniqueId)?.isUpdatedAlready &&
            newlyAddedExternalServiceResponse?.id !== uniqueId
            ? prev.find(item => item.uniqueId === uniqueId)?.version
            : version
        )
      );
    } else if (
      !isNewlyAddedExternalServiceResponse &&
      !isPropertyResponse &&
      !stateChangeResponse
    ) {
      const version = selectedItemFromList?.version;
      setVersionList(prev => addOrUpdateVersion(prev, version));
    }
  }, [
    propertyUpdateResponse,
    selectedItemFromList,
    stateChangeResponse,
    newlyAddedExternalServiceResponse,
    isPropertyResponse,
    isStateChangeResponse,
    isNewlyAddedExternalServiceResponse,
  ]);

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => {
        const currentItem = item?.controllerService?.length
          ? item?.controllerService[0]
          : item?.configuredData
            ? item?.configuredData
            : item;
        return (
          <TextRender
            key={currentItem?.name}
            text={currentItem?.name}
            capitalizeText={false}
          />
        );
      },
      width: '21%',
    },
    {
      label: 'Type',
      renderCell: item => {
        const currentItem = item?.controllerService?.length
          ? item?.controllerService[0]
          : item?.configuredData
            ? item?.configuredData
            : item;
        return (
          <TextRender
            key={currentItem?.typeValue}
            text={currentItem?.typeValue}
            capitalizeText={false}
          />
        );
      },
      width: '20%',
    },
    {
      label: 'Bundle',
      renderCell: item => {
        const currentItem = item?.controllerService?.length
          ? item?.controllerService[0]
          : item?.configuredData
            ? item?.configuredData
            : item;
        return (
          <TextRender
            key={currentItem?.bundleValue}
            text={currentItem?.bundleValue}
            capitalizeText={false}
          />
        );
      },
      width: '18%',
    },
    {
      label: 'State',
      renderCell: item => {
        const currentItem = item?.controllerService?.length
          ? item?.controllerService[0]
          : item?.configuredData || item;

        return (
          <StatusText
            text={
              currentItem?.state === 'DISABLED' &&
              currentItem?.validationStatus === 'INVALID'
                ? 'INVALID'
                : currentItem?.state
            }
            item={currentItem}
          />
        );
      },
      width: '16%',
    },
    {
      label: 'Scope',
      renderCell: item => {
        const currentItem = item?.controllerService?.length
          ? item?.controllerService[0]
          : item?.configuredData || item;
        return currentItem?.scope || 'N/A';
      },
      width: '11%',
    },
    {
      label: 'Action',
      renderCell: item => {
        const isControllerService = item?.controllerService?.length > 0;
        const stateItem = item?.controllerService?.length
          ? item?.controllerService[0]
          : item?.configuredData
            ? item?.configuredData
            : item;
        const state = stateItem?.state;
        const tooltipContent = state === 'DISABLED' ? 'Enable' : 'Disable';

        const isButtonVisible =
          (item.updatedValue &&
            state !== 'INVALID' &&
            state !== 'VALIDATING' &&
            state !== 'DISABLING') ||
          (state === 'DISABLED' && stateItem?.validationStatus !== 'INVALID') ||
          (state === 'ENABLED' && stateItem?.validationStatus === 'VALID');

        return (
          <div>
            {/* Settings Button */}
            {(isControllerService || stateItem?.properties?.length) && (
              <>
                <button
                  className="border-0 bg-white"
                  onClick={() => handleSettingClick(stateItem)}
                  data-tooltip-id={`Settings-${item?.id}`}
                  aria-label="Settings"
                  disabled={
                    stateItem?.state === 'ENABLING' ||
                    stateItem?.state === 'ENABLED'
                  }
                  style={{
                    opacity:
                      stateItem?.state === 'ENABLING' ||
                      stateItem?.state === 'ENABLED'
                        ? 0.3
                        : 1,
                    cursor:
                      stateItem?.state === 'ENABLING' ||
                      stateItem?.state === 'ENABLED'
                        ? 'not-allowed'
                        : 'pointer',
                  }}
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
            )}

            {/* Enable/Disable Button */}
            {isButtonVisible && !item?.configured && (
              <>
                <button
                  className="border-0 bg-white ms-2"
                  onClick={() => handleEnableClick(stateItem)}
                  data-tooltip-id={stateItem?.id}
                >
                  {state !== 'DISABLED' ? <FlashCutIcon /> : <FlashIcon />}
                </button>
                <ReactTooltip
                  id={stateItem?.id}
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

            {/* Re-Configure Button */}
            {item.updatedValue && !item?.configured && (
              <React.Fragment>
                <ReConfigureButton
                  className="ms-2"
                  data-tooltip-id={`configure-${stateItem?.id}`}
                  onClick={() => handleConfigure(item)}
                >
                  <PencilIcon />
                </ReConfigureButton>
                <ReactTooltip
                  id={`configure-${stateItem?.id}`}
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

            {/* Configure Button */}
            {!isControllerService &&
              !isButtonVisible &&
              !item?.updatedValue &&
              !item?.configured && (
                <ConfigureButton onClick={() => handleConfigure(item)}>
                  {KDFM.CONFIGURE}
                </ConfigureButton>
              )}
          </div>
        );
      },
      width: '14%',
    },
  ];
  const COLUMNS_Upgrade_External = [
    {
      label: 'Name',
      renderCell: item => {
        const currentItem = item?.controllerService?.length
          ? item?.controllerService[0]
          : item?.configuredData
            ? item?.configuredData
            : item;
        return (
          <TextRender
            key={currentItem?.name}
            text={currentItem?.name}
            capitalizeText={false}
          />
        );
      },
      width: '20%',
    },
    {
      label: 'Type',
      renderCell: item => {
        const currentItem = item?.controllerService?.length
          ? item?.controllerService[0]
          : item?.configuredData
            ? item?.configuredData
            : item;
        return (
          <TextRender
            key={currentItem?.typeValue}
            text={currentItem?.typeValue}
            capitalizeText={false}
          />
        );
      },
      width: '16%',
    },
    {
      label: 'Bundle',
      renderCell: item => {
        const currentItem = item?.controllerService?.length
          ? item?.controllerService[0]
          : item?.configuredData
            ? item?.configuredData
            : item;
        return (
          <TextRender
            key={currentItem?.bundleValue}
            text={currentItem?.bundleValue}
            capitalizeText={false}
          />
        );
      },
      width: '15%',
    },
    {
      label: 'State',
      renderCell: item => {
        const currentItem = item?.controllerService?.length
          ? item?.controllerService[0]
          : item?.configuredData || item;

        return (
          <StatusText
            text={
              currentItem?.state === 'DISABLED' &&
              currentItem?.validationStatus === 'INVALID'
                ? 'INVALID'
                : currentItem?.state
            }
            item={currentItem}
          />
        );
      },
      width: '14%',
    },
    {
      label: 'Scope',
      renderCell: item => {
        const currentItem = item?.controllerService?.length
          ? item?.controllerService[0]
          : item?.configuredData || item;
        return currentItem?.scope || 'N/A';
      },
      width: '10%',
    },
    {
      label: 'Referencing Component',
      renderCell: item => (
        <div className="d-flex justify-content-center">
          {(!isEmpty(
            item?.configuredData?.referencingComponents?.controllerService
          ) ||
            !isEmpty(
              item?.configuredData?.referencingComponents?.processors
            )) && (
            <>
              <button
                className="border-0 bg-white"
                onClick={() => {
                  setRefreshItem(item);
                  dispatch(NamespacesActions.setRefreshmodalOpen(true));
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
      width: '15%',
    },
    {
      label: 'Action',
      renderCell: item => {
        const isControllerService = item?.controllerService?.length > 0;
        const stateItem = item?.controllerService?.length
          ? item?.controllerService[0]
          : item?.configuredData
            ? item?.configuredData
            : item;
        const state = stateItem?.state;
        const tooltipContent = state === 'DISABLED' ? 'Enable' : 'Disable';

        const isButtonVisible =
          (item.updatedValue &&
            state !== 'INVALID' &&
            state !== 'VALIDATING' &&
            state !== 'DISABLING') ||
          (state === 'DISABLED' && stateItem?.validationStatus !== 'INVALID') ||
          (state === 'ENABLED' && stateItem?.validationStatus === 'VALID');

        return (
          <div>
            {/* Settings Button */}
            {(isControllerService || stateItem?.properties?.length) && (
              <>
                <button
                  className="border-0 bg-white"
                  onClick={() => handleSettingClick(stateItem)}
                  data-tooltip-id={`Settings-${item?.id}`}
                  aria-label="Settings"
                  disabled={
                    stateItem?.state === 'ENABLING' ||
                    stateItem?.state === 'ENABLED'
                  }
                  style={{
                    opacity:
                      stateItem?.state === 'ENABLING' ||
                      stateItem?.state === 'ENABLED'
                        ? 0.3
                        : 1,
                    cursor:
                      stateItem?.state === 'ENABLING' ||
                      stateItem?.state === 'ENABLED'
                        ? 'not-allowed'
                        : 'pointer',
                  }}
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
            )}

            {/* Enable/Disable Button */}
            {isButtonVisible && !item?.configured && (
              <>
                <button
                  className="border-0 bg-white ms-2"
                  onClick={() => handleEnableClick(stateItem)}
                  data-tooltip-id={stateItem?.id}
                >
                  {state !== 'DISABLED' ? <FlashCutIcon /> : <FlashIcon />}
                </button>
                <ReactTooltip
                  id={stateItem?.id}
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

            {/* Re-Configure Button */}
            {item.updatedValue && !item?.configured && (
              <React.Fragment>
                <ReConfigureButton
                  className="ms-2"
                  data-tooltip-id={`configure-${stateItem?.id}`}
                  onClick={() => handleConfigure(item)}
                >
                  <PencilIcon />
                </ReConfigureButton>
                <ReactTooltip
                  id={`configure-${stateItem?.id}`}
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

            {/* Configure Button */}
            {!isControllerService &&
              !isButtonVisible &&
              !item?.updatedValue &&
              !item?.configured && (
                <ConfigureButton onClick={() => handleConfigure(item)}>
                  {KDFM.CONFIGURE}
                </ConfigureButton>
              )}
          </div>
        );
      },
      width: '10%',
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
            disabled={item?.state === 'ENABLING' || item?.state === 'ENABLED'}
            style={{
              opacity:
                item?.state === 'ENABLING' || item?.state === 'ENABLED'
                  ? 0.3
                  : 1,
              cursor:
                item?.state === 'ENABLING' || item?.state === 'ENABLED'
                  ? 'not-allowed'
                  : 'pointer',
            }}
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
      label: 'Referencing Component',
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
          if (
            service.updatedValue === stateChangeResponse?.data?.id &&
            service.updatedValue === selectedItemFromList?.updatedValue
          ) {
            return {
              ...service,
              state: stateChangeResponse?.data?.status?.runStatus,
              validationStatus:
                stateChangeResponse?.data?.status?.validationStatus,
              isStatusUpdated: true,
            };
          }
          return service;
        })
      );
    }
  }, [stateChangeResponse, externalControllerServicesTableData]);

  useEffect(() => {
    if (!isEmpty(stateChangeResponse)) {
      setExternalControllerServices(prevServices =>
        prevServices?.map(service => {
          if (service?.updatedValue === selectedItemFromList?.id) {
            return {
              ...service,
              controllerService: service?.controllerService?.map((cs, index) =>
                index === 0
                  ? {
                      ...cs,
                      state:
                        selectedItemFromList?.state === 'DISABLED' ||
                        selectedItemFromList?.state === 'DISABLING'
                          ? 'ENABLED'
                          : 'DISABLED',
                      validationStatus:
                        stateChangeResponse?.data?.status?.validationStatus,
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

  useEffect(() => {
    if (!isEmpty(propertyUpdateResponse)) {
      setExternalControllerServices(prevServices =>
        prevServices.map(service => {
          if (
            service.updatedValue === selectedItemFromList?.id &&
            service?.controllerService?.length
          ) {
            return {
              ...service,
              controllerService: service?.controllerService?.map((cs, index) =>
                index === 0
                  ? {
                      ...cs,
                      state: propertyUpdateResponse?.state,
                      validationStatus:
                        propertyUpdateResponse?.validationStatus,
                    }
                  : cs
              ),
            };
          } else if (
            service.updatedValue === propertyUpdateResponse?.id &&
            service.updatedValue === selectedItemFromList?.updatedValue
          ) {
            return {
              ...service,
              state: propertyUpdateResponse?.state,
              validationStatus: propertyUpdateResponse?.validationStatus,
              isPropertyUpdated: true,
            };
          } else if (
            service?.configured &&
            service?.configuredData?.id === selectedItemFromList?.id
          ) {
            return {
              ...service,
              configuredData: {
                ...service?.configuredData,
                state: propertyUpdateResponse?.state,
                validationStatus: propertyUpdateResponse?.validationStatus,
              },
            };
          }
          return service;
        })
      );
    }
  }, [propertyUpdateResponse]);

  const handleStatusClick = () => {
    setIsStateChangeResponse(true);
    setIsNewlyAddedExternalServiceResponse(false);
    setIsPropertyResponse(false);
    const currentVersion = versionList?.find(
      version =>
        version?.uniqueId ===
        (selectedItemFromList?.id || selectedItemFromList?.updatedValue)
    );
    dispatch(
      NamespacesActions.changeStatusControllerService({
        state:
          selectedItemFromList?.state === 'DISABLED' ||
          selectedItemFromList?.state === 'DISABLING'
            ? 'ENABLED'
            : 'DISABLED',
        version: currentVersion?.version,
        id: selectedItemFromList?.id || selectedItemFromList?.updatedValue,
      })
    );
    setIsEnableModalOpen(false);
  };

  const handleAddValueModal = item => {
    setIsAddpropertiesModalOpen(true);
    setSelectedPropertyToEdit(item);
  };

  const handleSettingClick = item => {
    setSelectedItemFromList(item);
    setIsPropertyResponse(true);
    setIsNewlyAddedExternalServiceResponse(false);
    setIsStateChangeResponse(false);
    const match = externalControllerServices?.some(data => {
      if (data.controllerService?.length) {
        return data.controllerService.some(
          service =>
            service?.id === item?.id || service?.id === item?.identifier
        );
      }
      if (data?.configured) {
        return true;
      }
      return (
        item?.updatedValue !== undefined &&
        data?.updatedValue === item.updatedValue
      );
    });
    setisFromExternalService(match ? true : false);
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(true));
  };

  const handleConfigure = item => {
    setIsNewlyAddedExternalServiceResponse(true);
    setIsPropertyResponse(false);
    setIsStateChangeResponse(false);
    dispatch(NamespacesActions.setPropertyUpdateResponse({}));
    setSelectedExternalServiceIdentifier(
      item?.parentId ? item?.parentId : item?.identifier
    );
    setSelectedExternalService(item);
    setSelectedService(item);
    setSelectedItemFromList(item);
    setIsModalOpen(true);
    if (selectedCluster?.value) {
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
          tableItem?.parentId
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
  const handleToggle = (index, item) => {
    if (!isUpgrade && openIndex !== index && item?.isUpgradeLocal) {
      dispatch(NamespacesActions.getControllerServiceList({ localOnly: true }));
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
          tableItem =>
            tableItem?.parentId === service?.identifier &&
            !service?.isStatusUpdated &&
            !service?.isPropertyUpdated
        );

        if (matchingTableData) {
          return {
            ...service,
            controllerService: isAddedViaAdd ? [] : service?.controllerService,
            name: matchingTableData?.name,
            updatedValue: matchingTableData?.identifier,
            typeValue: matchingTableData?.typeValue
              ? matchingTableData?.typeValue
              : '',
            bundleValue: matchingTableData?.bundleValue
              ? matchingTableData?.bundleValue
              : '',
            state: matchingTableData?.state ? matchingTableData?.state : '',
            scope: matchingTableData?.scope ? matchingTableData?.scope : '',
            version: matchingTableData?.version
              ? matchingTableData?.version
              : '',
            properties: matchingTableData?.properties
              ? matchingTableData?.properties
              : [],
            validationStatus: matchingTableData?.validationStatus
              ? matchingTableData?.validationStatus
              : '',
          };
        }
        return service;
      }
    );
    setExternalControllerServices(updatedControllerServices);
  }, [externalControllerServicesTableData]);

  useEffect(() => {
    const collapsibles = [];
    if (isUpgrade) {
      if (externalControllerServices?.length) {
        collapsibles.push({
          title: (
            <div className="d-flex">
              {KDFM.CONTROLLER_SERVICE_DATA}
              <div
                data-tooltip-id="External Controller Services"
                className="ml-2"
              >
                <InfoIcon />
                <ReactTooltip
                  id="External Controller Services"
                  place="right"
                  content="Available external controller services to configure
                  "
                  style={{
                    width: 'auto',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </div>
            </div>
          ),
          content: (
            <Table
              data={externalControllerServices}
              columns={COLUMNS}
              className={'variables-table'}
            />
          ),
        });
      }
    } else {
      if (externalControllerServices?.length) {
        collapsibles.push({
          title: (
            <div className="d-flex">
              {KDFM.CONTROLLER_SERVICE_DATA}
              <div
                data-tooltip-id="External Controller Services"
                className="ml-2"
              >
                <InfoIcon />
                <ReactTooltip
                  id="External Controller Services"
                  place="right"
                  content="Available external controller services to configure
                  "
                  style={{
                    width: 'auto',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </div>
            </div>
          ),
          content: (
            <Table
              data={externalControllerServices}
              columns={COLUMNS_Upgrade_External}
              className={'variables-table'}
            />
          ),
        });
      }
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
      if (lsForUpgrade?.length) {
        collapsibles.push(
          ...lsForUpgrade.map(service => ({
            isUpgradeLocal: true,
            title: service?.processGroupName || 'Unnamed Group',
            content: (
              <>
                <SearchContainer>
                  <SmallSearchIcon
                    width={18}
                    height={18}
                    color={theme.colors.darkGrey1}
                  />
                  <Search
                    type="search"
                    placeholder="Search Controller Service by Name and Type"
                    onChange={e => onSearch(e, service)}
                  />
                </SearchContainer>
                <Table
                  data={
                    service?.filteredServicesData?.length
                      ? service?.filteredServicesData
                      : service?.controllerData || []
                  }
                  columns={COLUMNS_3}
                  className={'variables-table'}
                />
              </>
            ),
          }))
        );
      }
    }

    setCollapsibles(collapsibles);
  }, [
    localServices,
    externalControllerServices,
    externalControllerServiceArray,
    newlyAddedExternalServiceResponse,
    externalControllerServicesTableData,
    listData,
    lsForUpgrade,
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

    if (!isUpgrade) {
      let newLsData = [];
      newLsData.push(data);

      if (newLsData?.length) {
        setUpdatedLsForUpgrade(prevState => {
          const prevStateMap = new Map(
            prevState.map(item => [item?.identifier, item])
          );
          newLsData.forEach(newItem => {
            const key = newItem?.identifier;
            prevStateMap.set(key, newItem);
          });
          return Array.from(prevStateMap.values());
        });
      }
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
    setLsForUpgrade(prevLocalServices => {
      const updatedServices = prevLocalServices?.map(processGroup => {
        return {
          ...processGroup,
          controllerData: processGroup?.controllerData?.map(controller => {
            const updatedController = updatedLsForUpgrade?.find(
              updated => updated?.identifier === controller?.identifier
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
  }, [updatedLsForUpgrade]);

  useEffect(() => {
    if (isUpgrade) {
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
    } else {
      setControllerServicePayload(prevState => {
        const newPayload = {};
        if (!isEmpty(externalServicePayload)) {
          newPayload.externalServicesData = externalServicePayload;
        }
        if (
          !isEmpty(updatedLsForUpgrade) ||
          !isEmpty(prevState.localServicesData)
        ) {
          newPayload.localServicesData = updatedLsForUpgrade?.length
            ? updatedLsForUpgrade
            : prevState.localServicesData;
        }
        return newPayload;
      });
    }
  }, [
    externalServicePayload,
    updatedLsForUpgrade,
    isExternalServiceUpdated,
    updatedLocalServicesData,
  ]);

  useEffect(() => {
    setCsFromParent({
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
              toggleCollapsible={() => handleToggle(index, item)}
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
        versionList={versionList}
        setSelectedItemFromList={setSelectedItemFromList}
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
  setCsFromParent: PropTypes.func,
  csFromParent: PropTypes.array,
  setControllerServicePayload: PropTypes.func,
  controllerServicePayload: PropTypes.object,
};
export default ControllerServiceTab;
