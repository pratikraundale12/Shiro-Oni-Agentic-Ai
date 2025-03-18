import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FlowValidationIcon, NewThreedotIcon } from '../../assets';
import { Table } from '../../components';
import { SettingsActions } from '../../store/settings';
import FlowValidationModal from './FlowValidationModal';

const HeadingStyle = styled.h3`
  font-family: 'Nato Sans', sans-serif;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;

  & .parameter-context-table {
    th {
      background-color: #dde4f0 !important;
    }
  }
`;

const FlowValidation = () => {
  const dispatch = useDispatch();
  const COLUMNS = [
    {
      label: 'Scope Type',
      renderCell: item => <div>{item.version}</div>,
      width: '15%',
    },
    {
      label: 'Display Value',
      renderCell: item => <div>{item.displayValue}</div>,
      width: '20%',
    },
    {
      label: 'Description',
      renderCell: item => <div>{item.comments}</div>,
      width: '30%',
    },
    {
      label: 'Last Updated',
      renderCell: item => <div>{item.lastUpdated || '-'}</div>,
      width: '15%',
    },
    {
      label: 'Status',
      renderCell: item => <div>{item.status || '-'}</div>,
      width: '10%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <>
          <button
            className="border-0 bg-white"
            onClick={() =>
              dispatch(SettingsActions.flowValidationModalOpen(true))
            }
          >
            <FlowValidationIcon />
          </button>

          <button
            className="border-0 bg-white"
            onClick={() => console.log(item)}
          >
            <NewThreedotIcon />
          </button>
        </>
      ),
      width: '10%',
    },
  ];

  const DATA = [
    {
      id: 1,
      version: 'Global',
      displayValue: 'Validation A',
      comments: 'Checks if value is not null',
      lastUpdated: '2025-03-18',
      status: 'Active',
    },
    {
      id: 2,
      version: 'Project',
      displayValue: 'Validation B',
      comments: 'Ensures the format is correct',
      lastUpdated: '2025-03-15',
      status: 'Inactive',
    },
    {
      id: 3,
      version: 'User',
      displayValue: 'Validation C',
      comments: 'Validates range between 1 to 100',
      lastUpdated: '2025-03-10',
      status: 'Active',
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <HeadingStyle>Flow Validation Settings</HeadingStyle>
        </div>
      </div>
      <ModalBody className="modal-body">
        <Table
          columns={COLUMNS}
          data={DATA}
          className="parameter-context-table"
        />
      </ModalBody>
      <FlowValidationModal />
    </div>
  );
};

export default FlowValidation;
