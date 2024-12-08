import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NoDataIcon, PencilIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import Collapsible from './Collapsible';
import AddOrEditParameterContextModal from './AddOrEditParameterContextModal';
import { useSelector } from 'react-redux';
import { NamespacesSelectors } from '../../store';
import { isEmpty } from 'lodash';

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
const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;
const ParameterContextTab = ({ PcData, setPcData }) => {
  const [isAddPcOpen, setIsAddPcOpen] = useState({
    isOpen: false,
    mode: 'add',
  });
  const [openIndex, setOpenIndex] = useState(null);
  const [currentEditData, setCurrentEditData] = useState({});
  const [currentPgId, setCurrentPgId] = useState('');
  const registryDetailsData = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  const parameterReduxData = useSelector(
    NamespacesSelectors.getRegistryDeployParameterContext
  );

  useEffect(() => {
    if (isEmpty(parameterReduxData)) {
      setPcData(registryDetailsData?.parameterContextData);
    } else {
      setPcData(parameterReduxData);
    }
  }, [registryDetailsData?.parameterContextData]);

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
    setPcData(prevState => {
      const updatedState = { ...prevState };

      ['inherited', 'parent'].forEach(key => {
        updatedState[key] = updatedState[key].map(group => {
          if (group.name === currentPgId) {
            return {
              ...group,
              parameters: group.parameters.some(
                parameter => parameter.name === data.name
              )
                ? group.parameters.map(parameter =>
                    parameter.name === data.name
                      ? {
                          ...parameter,
                          value: data.value,
                          check: data.check,
                          description: data.description,
                        }
                      : parameter
                  )
                : [...group.parameters, data],
            };
          }
          return group;
        });
      });

      return updatedState;
    });
  };

  const closeAddVPcModal = () => {
    setIsAddPcOpen({
      isOpen: false,
      mode: 'add',
    });
  };
  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {PcData?.inherited?.map(item => (
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
        {PcData?.parent?.map(item => (
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
        {isEmpty(PcData?.inherited) && isEmpty(PcData?.parent) && (
          <>
            <div className="d-flex justify-content-center">
              <NoDataIcon width={130} />
            </div>
            <NoDataText>No Data Found!!</NoDataText>
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
  PcData: PropTypes.func,
  setPcData: PropTypes.object,
};
export default ParameterContextTab;
