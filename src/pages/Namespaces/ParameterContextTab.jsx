import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NoDataIcon, PencilIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import Collapsible from './Collapsible';
import AddOrEditParameterContextModal from './AddOrEditParameterContextModal';
import { isEmpty } from 'lodash';

const DataWrapper = styled.div`
  width: 100%;
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
const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;
const ParameterContextTab = ({
  pcPayload,
  setPcPayload,
  pcData,
  setPcData,
}) => {
  const [isAddPcOpen, setIsAddPcOpen] = useState({
    isOpen: false,
    mode: 'add',
  });

  const [openIndex, setOpenIndex] = useState(null);
  const [currentEditData, setCurrentEditData] = useState({});
  const [currentPgId, setCurrentPgId] = useState('');

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
          <TextRender
            key={item?.value}
            text={
              (item.sensitive === true || item.sensitive === 'true') &&
              !item?.value &&
              !item.check
                ? KDFM.NO_VALUE_SET
                : item.sensitive === true || item.sensitive === 'true'
                  ? KDFM.SENSITIVE_VALUE_SET
                  : item.value
                    ? truncateString(item.value, 40)
                    : item.check
                      ? KDFM.EMPTY_STRING_SET
                      : KDFM.NO_VALUE_SET
            }
          />
        );
      },
    },
    {
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                value: data.value,
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
              parameters: [
                ...updatedPayload[key][existingGroupIndex].parameters,
                ...updatedParameters,
              ],
            };
          } else {
            updatedPayload[key].push({
              name: group.name,
              parameters: updatedParameters,
            });
          }
        }

        return {
          ...group,
          parameters: isGroupUpdated ? updatedParameters : group.parameters,
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
                if (parameter.name === data.name) {
                  return {
                    ...parameter,
                    value: data.value,
                    check: data.check,
                    description: data.description,
                  };
                }
                return parameter;
              }),
            };
          }
          return group;
        });
      });

      return updatedState;
    });
  };

  console.log('pcpayload', pcPayload);

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
                title={`${item?.name}`}
                isTableOpen={openIndex === item?.name}
                toggleCollapsible={() => handleToggle(item?.name)}
              >
                <Table data={item?.parameters} columns={PC_COLUMNS} />
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
                <Table data={item?.parameters} columns={PC_COLUMNS} />
              </Collapsible>
            )}
          </>
        ))}
        {isEmpty(pcData?.inherited) && isEmpty(pcData?.parent) && (
          <>
            <div className="d-flex justify-content-center">
              <NoDataIcon width={130} />
            </div>
            <NoDataText>{KDFM.NO_DATA_FOUND}</NoDataText>
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
