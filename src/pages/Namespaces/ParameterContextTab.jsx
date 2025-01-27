import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { InfoIcon, NoDataIcon, PencilIcon, RefrenceIcon } from '../../assets';
import {
  EnhancedTextRender,
  IconButton,
  Table,
  TextRender,
} from '../../components';
import { KDFM } from '../../constants';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import AddOrEditParameterContextModal from './AddOrEditParameterContextModal';
import Collapsible from './Collapsible';
import RefreshModal from './RefreshModal';

const DataWrapper = styled.div`
  width: 100%;
  top: 273px;
  left: 290px;
  gap: 0px;
  opacity: 0px;
  border: Mixed solid rgba(221, 228, 240, 1);
`;

const ScrollSetGrey = styled.div`
  height: calc(100vh - 341px);
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

const SrollableTable = styled.div`
  table {
    overflow: auto;
    max-height: 380px;
  }

  table thead tr th:nth-child(3) {
    text-align: center;
  }
`;

const ParameterContextTab = () => {
  const registryDetailsData = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  const pcReduxData = useSelector(NamespacesSelectors.getPcLocalData);
  const pcReduxPayload = useSelector(
    NamespacesSelectors.getRegistryDeployParameterContext
  );
  const checkIfPcUpdated = useSelector(NamespacesSelectors.getIsLocalPcUpdated);
  const [isAddPcOpen, setIsAddPcOpen] = useState({
    isOpen: false,
    mode: 'add',
  });
  const [pcData, setPcData] = useState(pcReduxData);
  const [pcPayload, setPcPayload] = useState(pcReduxPayload);
  useEffect(() => {
    if (
      !pcReduxData ||
      Object.keys(pcReduxData).length === 0 ||
      (pcReduxData.inherited.length <= 0 && pcReduxData.parent.length <= 0)
    ) {
      setPcData(registryDetailsData?.parameterContextData);
    } else {
      setPcData(pcReduxData);
    }
  }, [pcReduxData, registryDetailsData]);

  const [openIndex, setOpenIndex] = useState(null);
  const [currentEditData, setCurrentEditData] = useState({});
  const [currentPgId, setCurrentPgId] = useState('');
  const [refreshItem, setRefreshItem] = useState(null);
  const dispatch = useDispatch();

  const handleToggle = index => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
    setCurrentPgId(index);
  };

  const handleAddPc = index => {
    setCurrentPgId(index);
    setOpenIndex(index);
    setIsAddPcOpen({
      isOpen: true,
      mode: 'add',
    });
  };

  const handleEditClick = item => {
    setIsAddPcOpen({ isOpen: true, mode: 'edit' });
    setCurrentEditData(item);
  };

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  };

  const PC_COLUMNS = [
    {
      label: KDFM.NAME,
      renderCell: item => (
        <TextRender
          key={item?.name}
          text={item?.name || KDFM.NA}
          capitalizeText={false}
        />
      ),
    },
    {
      label: KDFM.VALUE,
      renderCell: item => {
        return (
          <EnhancedTextRender
            key={item?.value}
            capitalizeText={false}
            text={(() => {
              if (item?.sensitive && item?.value) {
                return KDFM.SENSITIVE_VALUE_SET;
              } else if (item?.sensitive && !item?.value) {
                return KDFM.NO_VALUE_SET;
              } else if (item?.value === '') {
                return KDFM.EMPTY_STRING_SET;
              } else if (item?.value) {
                return truncateString(item.value, 40);
              } else {
                return KDFM.NO_VALUE_SET;
              }
            })()}
            tooltipText={(() => {
              if (item?.sensitive && !item?.value) {
                return KDFM.NO_VALUE_SET;
              } else if (item?.sensitive) {
                return KDFM.SENSITIVE_VALUE_SET;
              } else if (item?.value) {
                return item.value;
              } else if (item?.value === '') {
                return KDFM.EMPTY_STRING_SET;
              } else {
                return KDFM.NO_VALUE_SET;
              }
            })()}
          />
        );
      },
    },
    {
      label: 'Referencing Component',
      renderCell: item => (
        <div className="text-center">
          {!isEmpty(item?.referencingComponents) && (
            <>
              <button
                className="border-0 bg-white"
                onClick={() => {
                  setRefreshItem(item);
                  dispatch(NamespacesActions.setRefreshmodalOpen(true));
                }}
                data-tooltip-id={`Reference-${item?.id}`}
                aria-label="Reference"
              >
                <RefrenceIcon />
              </button>
              <ReactTooltip
                id={`Reference-${item?.id}`}
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
    },

    {
      renderCell: item => (
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}
        >
          <IconButton
            onClick={() => {
              handleEditClick(item);
            }}
          >
            {<PencilIcon color="black" />}
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAddOrEditVariableSave = data => {
    dispatch(NamespacesActions.setIsLocalPcUpdated(true));
    const updatedState = JSON.parse(JSON.stringify(pcData));
    const updatedPayload = {
      inherited: Array.isArray(pcPayload.inherited)
        ? [...pcPayload.inherited]
        : [],
      parent: Array.isArray(pcPayload.parent) ? [...pcPayload.parent] : [],
    };

    ['inherited', 'parent'].forEach(key => {
      updatedState[key] = updatedState[key].map(group => {
        let isGroupUpdated = false;
        const updatedParameters = group.parameters
          .map(parameter => {
            if (parameter.name === data.name) {
              isGroupUpdated = true;
              return {
                ...parameter,
                value: data?.check
                  ? ''
                  : isEmpty(data.value)
                    ? null
                    : data.value,
                check: data.check,
                description: data.description,
              };
            }
            return null;
          })
          .filter(Boolean);

        if (isGroupUpdated) {
          const existingGroupIndex = updatedPayload[key].findIndex(
            g => g.name === group.name
          );

          if (existingGroupIndex > -1) {
            updatedPayload[key][existingGroupIndex] = {
              ...updatedPayload[key][existingGroupIndex],
              parameters: updatedPayload[key][
                existingGroupIndex
              ].parameters.map(param => {
                const updatedParam = updatedParameters.find(
                  p => p.name === param.name
                );
                return updatedParam || param;
              }),
            };
            updatedParameters.forEach(updatedParam => {
              if (
                !updatedPayload[key][existingGroupIndex].parameters.some(
                  p => p.name === updatedParam.name
                )
              ) {
                updatedPayload[key][existingGroupIndex].parameters.push(
                  updatedParam
                );
              }
            });
          } else {
            updatedPayload[key].push({
              name: group.name,
              parameters: updatedParameters,
            });
          }
        }

        return {
          ...group,
          parameters: group.parameters.map(param => {
            return param.name === data.name
              ? {
                  ...param,
                  value: data?.check
                    ? ''
                    : isEmpty(data.value)
                      ? null
                      : data.value,
                  check: data.check,
                  description: data.description,
                }
              : param;
          }),
        };
      });
    });

    setPcPayload(updatedPayload);
    setPcData(prevState => {
      const updatedState = JSON.parse(JSON.stringify(prevState));

      ['inherited', 'parent'].forEach(key => {
        updatedState[key] = updatedState[key].map(group => {
          if (group.name === currentPgId) {
            return {
              ...group,
              parameters: group.parameters.map(parameter => {
                return parameter.name === data.name
                  ? {
                      ...parameter,
                      value: data?.check
                        ? ''
                        : isEmpty(data.value)
                          ? null
                          : data.value,
                      check: data.check,
                      description: data.description,
                    }
                  : parameter;
              }),
            };
          }
          return group;
        });
      });

      return updatedState;
    });
  };
  useEffect(() => {
    dispatch(NamespacesActions.setPcLocalData(pcData));
  }, [pcData]);
  useEffect(() => {
    if (checkIfPcUpdated && Object.keys(pcPayload)?.length) {
      dispatch(NamespacesActions.setRegistryDeployParameterContext(pcPayload));
    }
  });
  const closeAddVPcModal = () => {
    setIsAddPcOpen({
      isOpen: false,
      mode: 'add',
    });
  };

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {pcData?.inherited?.map(item => (
          <>
            {!isEmpty(item.parameters) && (
              <Collapsible
                isAddBtnVisible={false}
                onBtnClick={() => {
                  handleAddPc(item?.name);
                }}
                key={item?.name}
                title={
                  <>
                    {item?.name}
                    <span
                      data-tooltip-id="Parameter Context"
                      style={{ marginLeft: '8px' }}
                    >
                      <InfoIcon />
                      <ReactTooltip
                        id="Parameter Context"
                        place="right"
                        content="
                        Inherited Parameter Context "
                        style={{
                          width: 'auto',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                        }}
                      />
                    </span>
                  </>
                }
                isTableOpen={openIndex === item?.name}
                toggleCollapsible={() => handleToggle(item?.name)}
              >
                <SrollableTable className="scroll-table-y">
                  <Table data={item?.parameters} columns={PC_COLUMNS} />
                </SrollableTable>
              </Collapsible>
            )}
          </>
        ))}
        {pcData?.parent?.map(item => (
          <>
            {!isEmpty(item.parameters) && (
              <Collapsible
                isAddBtnVisible={false}
                onBtnClick={() => {
                  handleAddPc(item?.name);
                }}
                key={item?.name}
                title={`${item?.name}`}
                isTableOpen={openIndex === item?.name}
                toggleCollapsible={() => handleToggle(item?.name)}
              >
                <SrollableTable className="scroll-table-y">
                  <Table data={item?.parameters} columns={PC_COLUMNS} />
                </SrollableTable>
              </Collapsible>
            )}
          </>
        ))}
        {isEmpty(pcData?.inherited) && isEmpty(pcData?.parent) && (
          <>
            <div className="d-flex justify-content-center h-100 align-items-center">
              <div className="text-center">
                <NoDataIcon width={130} />
                <NoDataText>{KDFM.NO_DATA_FOUND}</NoDataText>
              </div>
            </div>
          </>
        )}
        {isAddPcOpen?.isOpen && (
          <AddOrEditParameterContextModal
            setIsAddParameterContextOpen={setIsAddPcOpen}
            closePopup={closeAddVPcModal}
            isAddParameterContextOpen={isAddPcOpen}
            pcEditData={currentEditData}
            handleSave={handleAddOrEditVariableSave}
          />
        )}
      </ScrollSetGrey>
      <RefreshModal refreshItem={refreshItem} />
    </DataWrapper>
  );
};
ParameterContextTab.propTypes = {
  pcPayload: PropTypes.object,
  setPcPayload: PropTypes.func,
  pcData: PropTypes.object,
  setPcData: PropTypes.func,
};
export default ParameterContextTab;
