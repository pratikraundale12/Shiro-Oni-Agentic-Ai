import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { PencilIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import Collapsible from './Collapsible';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import AddOrEditVariablesModal from './AddOrEditVariablesModal';

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

const VariableTab = () => {
  const registryDetailsData = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  console.log(registryDetailsData, 'registryDetailsData');
  const [isAddVariablesOpen, setIsAddVariablesOpen] = useState({
    isOpen: false,
    mode: 'add',
  });

  const variablesMockData = [
    {
      pgId: '12345',
      parent: true,
      pgname: 'Parent',
      variables: [
        {
          name: 'var1',
          value: 'abcd',
        },
        {
          name: 'var2',
          value: 'abcd',
        },
      ],
    },
    {
      pgId: '3214',
      parent: false,
      pgname: 'Child1',
      variables: [
        {
          name: 'var3',
          value: 'abcd',
        },
        {
          name: 'var4',
          value: 'abcd',
        },
      ],
    },
    {
      pgId: '3215',
      parent: false,
      pgname: 'Child2',
      variables: [
        {
          name: 'var5',
          value: 'abcd',
        },
        {
          name: 'var6',
          value: 'abcd',
        },
      ],
    },
    {
      pgId: '3216',
      parent: false,
      pgname: 'Child4',
      variables: [
        {
          name: 'var7',
          value: 'abcd',
        },
        {
          name: 'var8',
          value: 'abcd',
        },
      ],
    },
    {
      pgId: '3217',
      parent: false,
      pgname: 'Child5',
      variables: [
        {
          name: 'var9',
          value: 'abcd',
        },
        {
          name: 'var10',
          value: 'abcd',
        },
      ],
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const [currentEditData, setCurrentEditData] = useState({});
  const [variableData, setVariableData] = useState(variablesMockData);
  const [currentPgId, setCurrentPgId] = useState('');

  const handleToggle = (pgId, index) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
    setCurrentPgId(pgId);
  };

  const dispatch = useDispatch();

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
  };

  const closeAddVariablesModal = () => {
    setIsAddVariablesOpen({ isOpen: false, mode: 'add' });
    dispatch(NamespacesActions.setVariableContextItem({}));
  };

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {variableData.map((item, index) => (
          <Collapsible
            onBtnClick={() => handleAddVariables(item.pgId, index)}
            key={item.pgId}
            title={item.pgname}
            isTableOpen={openIndex === index}
            toggleCollapsible={() => handleToggle(item?.pgId, index)}
          >
            <Table
              data={item.variables}
              columns={VARIABLE_COLUMNS}
              className={'variables-table'}
            />
          </Collapsible>
        ))}
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

export default VariableTab;
