import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { AddIcon, FlowValidationIcon, NewEditIcon } from '../../assets';
import { Table } from '../../components';
import { Button } from '../../shared';
import { SettingsActions } from '../../store/settings';
import AddNewValidationModal from './AddNewValidationModal';
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
      renderCell: () => (
        <>
          <button
            className="border-0 bg-white me-2"
            onClick={() =>
              dispatch(SettingsActions.flowValidationModalOpen(true))
            }
          >
            <FlowValidationIcon />
          </button>

          <button
            className="border-0 bg-white"
            onClick={() =>
              dispatch(SettingsActions.addNewValidationModalOpen(true))
            }
          >
            <NewEditIcon />
          </button>
        </>
      ),
      width: '10%',
    },
  ];

  const DATA = [
    {
      id: 1,
      version: 'Processor',
      displayValue: 'Concurrent Task',
      comments: 'Rules for Concurrent Task',
      lastUpdated: '03/12/25, 1:28:00 PM',
      status: 'Active',
    },
    {
      id: 2,
      version: 'Connections',
      displayValue: 'Flowfile Expiry Time',
      comments: 'Rules for Flowfile Expiry Time',
      lastUpdated: '03/12/25, 1:28:00 PM',
      status: 'Inactive',
    },
    {
      id: 3,
      version: 'Processor',
      displayValue: 'Processor Color',
      comments: 'Rules for Processor Color',
      lastUpdated: '03/12/25, 1:28:00 PM',
      status: 'Active',
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <HeadingStyle>Flow Validation Settings</HeadingStyle>
        </div>
        <div className="mb-2 d-flex align-items-center">
          <Button
            type="button"
            size={'md'}
            onClick={() =>
              dispatch(SettingsActions.addNewValidationModalOpen(true))
            }
          >
            <AddIcon color="#fff" /> Add New Validation
          </Button>
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
      <AddNewValidationModal />
    </div>
  );
};

export default FlowValidation;
