import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { NoDataIcon, PencilIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import AddOrEditVariablesModal from './AddOrEditVariablesModal';
import Collapsible from './Collapsible';

const DataWrapper = styled.div`
  width: 100%;
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
const VariableTab = ({ setVariablePayload, variableData, setVariableData }) => {
  const [isAddVariablesOpen, setIsAddVariablesOpen] = useState({
    isOpen: false,
    mode: 'add',
  });

  const [openIndex, setOpenIndex] = useState(null);
  const [currentEditData, setCurrentEditData] = useState({});

  const [currentPgId, setCurrentPgId] = useState('');
  const handleToggle = (pgId, index) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
    setCurrentPgId(pgId);
  };

  const handleAddVariables = (tableId, index) => {
    setCurrentPgId(tableId);
    handleToggle(tableId, index);
    setIsAddVariablesOpen({
      isOpen: true,
      mode: 'add',
    });
  };

  const handleEditClick = item => {
    setIsAddVariablesOpen({ isOpen: true, mode: 'edit' });
    setCurrentEditData(item);
  };

  const VARIABLE_COLUMNS = [
    {
      label: KDFM.NAME,
      renderCell: item => (
        <TextRender key={item?.name} text={item?.name} capitalizeText={false} />
      ),
    },
    {
      label: KDFM.VALUE,
      renderCell: item => {
        return (
          <TextRender
            key={item?.value}
            text={
              item?.check || item?.value === ''
                ? KDFM.EMPTY_STRING_SET
                : item?.value
                  ? item?.value
                  : KDFM.NO_VALUE_SET
            }
            capitalizeText={false}
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
            <PencilIcon style={{ color: 'black' }} />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAddOrEditVariableSave = data => {
    setVariableData(prev =>
      prev.map(item =>
        item.pgId === currentPgId
          ? {
              ...item,
              variables: item.variables.some(
                variable => variable.name === data.name
              )
                ? item.variables.map(variable =>
                    variable.name === data.name
                      ? { ...variable, value: data.value }
                      : variable
                  )
                : [...item.variables, data],
            }
          : item
      )
    );

    setVariablePayload(prevPayload => {
      const existingPg = prevPayload.find(pg => pg.pgId === currentPgId);

      if (existingPg) {
        const updatedVariables = existingPg.variables.some(
          variable => variable.name === data.name
        )
          ? existingPg.variables.map(variable =>
              variable.name === data.name
                ? { ...variable, value: data.value }
                : variable
            )
          : [...existingPg.variables, data];

        return prevPayload.map(pg =>
          pg.pgId === currentPgId
            ? {
                ...pg,
                variables: updatedVariables,
              }
            : pg
        );
      } else {
        const currentPgData = variableData.find(
          item => item.pgId === currentPgId
        );
        return [
          ...prevPayload,
          {
            pgId: currentPgId,
            parent: currentPgData.parent,
            pgName: currentPgData.pgName,
            variables: [data],
            path: currentPgData.path,
          },
        ];
      }
    });
  };

  const closeAddVariablesModal = () => {
    setIsAddVariablesOpen({ isOpen: false, mode: 'add' });
  };
  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {variableData?.map((item, index) => (
          <>
            {!isEmpty(item.variables) && (
              <Collapsible
                isAddBtnVisible={false}
                onBtnClick={() => handleAddVariables(item.pgId, index)}
                key={item.pgId}
                title={item?.pgName}
                isTableOpen={openIndex === index}
                toggleCollapsible={() => handleToggle(item?.pgId, index)}
              >
                <Table
                  data={item.variables}
                  columns={VARIABLE_COLUMNS}
                  className={'variables-table'}
                />
              </Collapsible>
            )}
          </>
        ))}
        {(isEmpty(variableData) ||
          variableData.every(item => isEmpty(item.variables))) && (
          <>
            <div className="d-flex justify-content-center h-100 align-items-center">
              <div className="text-center">
                <NoDataIcon width={130} />
                <NoDataText>{KDFM.NO_DATA_FOUND}</NoDataText>
              </div>
            </div>
          </>
        )}
        {isAddVariablesOpen.isOpen && (
          <AddOrEditVariablesModal
            isOpen={isAddVariablesOpen}
            closePopup={closeAddVariablesModal}
            isAddVariablesOpen={isAddVariablesOpen}
            setIsAddVariablesOpen={setIsAddVariablesOpen}
            handleSave={handleAddOrEditVariableSave}
            variablesDetailsData={variableData}
            editVariableData={currentEditData}
          />
        )}
      </ScrollSetGrey>
    </DataWrapper>
  );
};
VariableTab.propTypes = {
  variableData: PropTypes.array,
  setVariableData: PropTypes.func,
  setVariablePayload: PropTypes.func,
  variablePayload: PropTypes.array,
};

export default VariableTab;
