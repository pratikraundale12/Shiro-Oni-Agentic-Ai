import React, { useState } from 'react';
import styled from 'styled-components';
import { PencilIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
// import { Modal } from '../../shared';
import Collapsible from './Collapsible';

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
  const [isAddVariablesOpen, setIsAddVariablesOpen] = useState({
    isOpen: false,
    mode: 'add',
  });

  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = index => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const handleAddVariables = () => {
    setIsAddVariablesOpen({
      isOpen: true,
      mode: 'add',
    });
  };

  const variableTableData = [
    {
      variable: {
        name: 'var',
        value: '1',
        processGroupId: '8b21e2ec-0193-1000-0000-00003edd6348',
        affectedComponents: [],
      },
      canWrite: true,
    },
    {
      variable: {
        name: 'var 1',
        value: '1',
        processGroupId: '8b21e2ec-0193-1000-0000-00003edd6348',
        affectedComponents: [],
      },
      canWrite: true,
    },
    {
      variable: {
        name: 'var 2',
        value: '2',
        processGroupId: '8b21e2ec-0193-1000-0000-00003edd6348',
        affectedComponents: [],
      },
      canWrite: true,
    },
    {
      variable: {
        name: 'var 3',
        value: '1',
        processGroupId: '8b21e2ec-0193-1000-0000-00003edd6348',
        affectedComponents: [],
      },
      canWrite: true,
    },
    {
      variable: {
        name: 'var',
        value: '1',
        processGroupId: '8b21e2ec-0193-1000-0000-00003edd6348',
        affectedComponents: [],
      },
      canWrite: true,
    },
    {
      variable: {
        name: 'var 1',
        value: '1',
        processGroupId: '8b21e2ec-0193-1000-0000-00003edd6348',
        affectedComponents: [],
      },
      canWrite: true,
    },
    {
      variable: {
        name: 'var 2',
        value: '2',
        processGroupId: '8b21e2ec-0193-1000-0000-00003edd6348',
        affectedComponents: [],
      },
      canWrite: true,
    },
    {
      variable: {
        name: 'var 3',
        value: '1',
        processGroupId: '8b21e2ec-0193-1000-0000-00003edd6348',
        affectedComponents: [],
      },
      canWrite: true,
    },
  ];

  const VARIABLE_COLUMNS = [
    {
      label: KDFM.NAME,
      renderCell: item => (
        <TextRender
          key={item?.variable?.name}
          text={item?.variable?.name}
          capitalizeText={false}
        />
      ),
    },
    {
      label: KDFM.VALUE,
      renderCell: item => {
        return (
          <TextRender
            key={item?.variable?.value}
            text={
              item?.variable?.check || item?.variable?.value === ''
                ? KDFM.EMPTY_STRING_SET
                : item?.variable?.value
                  ? item?.variable?.value
                  : KDFM.NO_VALUE_SET
            }
            capitalizeText={false}
          />
        );
      },
    },
    {
      renderCell: () => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            // disabled={loading}
            onClick={() => {
              setIsAddVariablesOpen({ isOpen: true, mode: 'edit' });
            }}
          >
            <PencilIcon style={{ color: 'black' }} />
          </IconButton>
        </div>
      ),
    },
  ];

  const collapsibles = [
    {
      id: 1,
      title: 'Variables Parent',
      content: (
        <Table
          data={variableTableData}
          columns={VARIABLE_COLUMNS}
          className={'variables-table'}
        />
      ),
    },
    {
      id: 2,
      title: 'Variables Child',
      content: (
        <Table
          data={variableTableData}
          columns={VARIABLE_COLUMNS}
          className={'variables-table'}
        />
      ),
    },
    {
      id: 3,
      title: 'Variables Child',
      content: (
        <Table
          data={variableTableData}
          columns={VARIABLE_COLUMNS}
          className={'variables-table'}
        />
      ),
    },
  ];

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        {collapsibles.map((item, index) => (
          <Collapsible
            onBtnClick={handleAddVariables}
            key={item.id}
            title={item.title}
            isTableOpen={openIndex === index}
            toggleCollapsible={() => handleToggle(index)}
          >
            <p>{item.content}</p>
          </Collapsible>
        ))}
        {isAddVariablesOpen.isOpen && <p>Test</p>}
      </ScrollSetGrey>
    </DataWrapper>
  );
};

export default VariableTab;
