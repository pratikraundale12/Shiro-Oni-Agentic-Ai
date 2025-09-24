import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { NoDataIcon, PencilIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import AddOrEditVariablesModal from './AddOrEditVariablesModal';
import Collapsible from './Collapsible';
import { Tooltip as ReactTooltip } from 'react-tooltip';

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
const VariableTab = () => {
  const dispatch = useDispatch();
  const variableReduxPayload = useSelector(
    NamespacesSelectors.getRegistryDeployVariable
  );
  const [variablePayload, setVariablePayload] = useState(variableReduxPayload);
  const [isAddVariablesOpen, setIsAddVariablesOpen] = useState({
    isOpen: false,
    mode: 'add',
  });
  const registryDetailsData = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  const variableReduxData = useSelector(
    NamespacesSelectors.getVariableLocalData
  );
  const checkIfVariableUpdated = useSelector(
    NamespacesSelectors.getIsLocalVariableUpdated
  );
  const [variableData, setVariableData] = useState(variableReduxData);
  useEffect(() => {
    if (!variableReduxData || !variableReduxData?.length) {
      setVariableData(registryDetailsData?.variablesData);
    } else {
      setVariableData(variableReduxData);
    }
  }, [variableReduxData, registryDetailsData]);
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
    setCurrentEditData({
      check: item?.value === '' ? true : false,
      value: item?.value ? item?.value : null,
      ...item,
    });
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
              item?.check
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
            data-tooltip-id={`Edit-${item?.id}`}
          >
            <PencilIcon />
          </IconButton>
          <ReactTooltip
            id={`Edit-${item?.id}`}
            place="left"
            content="Edit"
            style={{
              width: 'auto',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </div>
      ),
    },
  ];

  const handleAddOrEditVariableSave = data => {
    dispatch(NamespacesActions.setIsLocalVariableUpdated(true));
    updateVariableData(data);
    updateVariablePayload(data);
  };

  const updateVariableData = data => {
    setVariableData(prev =>
      prev.map(item =>
        item.pgId === currentPgId ? updateVariables(item, data) : item
      )
    );
  };

  const updateVariables = (item, data) => ({
    ...item,
    variables: item.variables.some(variable => variable.name === data.name)
      ? item.variables.map(variable =>
          variable.name === data.name
            ? {
                ...variable,
                value: data?.check
                  ? ''
                  : isEmpty(data.value)
                    ? null
                    : data.value,
                check: data.check,
              }
            : variable
        )
      : [...item.variables, data],
  });

  const updateVariablePayload = data => {
    setVariablePayload(prevPayload => {
      const existingPg = prevPayload.find(pg => pg.pgId === currentPgId);

      if (existingPg) {
        return prevPayload.map(pg =>
          pg.pgId === currentPgId
            ? { ...pg, variables: updateExistingVariables(existingPg, data) }
            : pg
        );
      }

      return addNewPgData(prevPayload, data);
    });
  };

  const updateExistingVariables = (pg, data) =>
    pg.variables.some(variable => variable.name === data.name)
      ? pg.variables.map(variable =>
          variable.name === data.name
            ? { ...variable, value: data.value }
            : variable
        )
      : [...pg.variables, data];

  const addNewPgData = (prevPayload, data) => {
    const currentPgData = variableData.find(item => item.pgId === currentPgId);
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
  };

  useEffect(() => {
    if (checkIfVariableUpdated && variablePayload?.length) {
      dispatch(NamespacesActions.setRegistryDeployVariable(variablePayload));
    }
  }, [variablePayload, checkIfVariableUpdated]);

  useEffect(() => {
    dispatch(NamespacesActions.setVariableLocalData(variableData));
  }, [variableData]);

  const closeAddVariablesModal = () => {
    setIsAddVariablesOpen({ isOpen: false, mode: 'add' });
  };
  const sortByName = array => {
    return [...array].sort((a, b) => a.name.localeCompare(b.name));
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
                  data={
                    !isEmpty(sortByName(item?.variables))
                      ? sortByName(item?.variables)
                      : []
                  }
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
