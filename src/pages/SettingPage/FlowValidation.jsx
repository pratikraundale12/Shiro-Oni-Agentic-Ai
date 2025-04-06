import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  AddIcon,
  DeleteSmallIcon,
  FlowValidationIcon,
  NewEditIcon,
} from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import {
  FLOWVALIDATION_CONSTANTS,
  convertDateTime,
} from '../../constants/flowValidation.constant';
import { Button } from '../../shared';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';
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

  const ruleScopes = useSelector(FlowValidationSelectors.getRuleScopes);
  useEffect(() => {
    dispatch(FlowValidationActions.ruleScopeFetch());
  }, [dispatch]);

  const COLUMNS = [
    {
      label: FLOWVALIDATION_CONSTANTS.SCOPE_TYPE,
      renderCell: item => <TextRender text={item?.scope_type} />,
      width: '20%',
    },
    {
      label: FLOWVALIDATION_CONSTANTS.DISPLAY_VALUE,
      renderCell: item => <TextRender text={item?.header} />,
      width: '25%',
    },
    {
      label: FLOWVALIDATION_CONSTANTS.DESCRIPTION,
      renderCell: item => <TextRender text={item?.description} />,
      width: '30%',
    },
    {
      label: FLOWVALIDATION_CONSTANTS.LASTUPDATE,
      renderCell: item => (
        <TextRender text={convertDateTime(item?.updated_at)} />
      ),
      width: '15%',
    },

    {
      label: FLOWVALIDATION_CONSTANTS.ACTION,
      renderCell: item => (
        <>
          <button
            className="border-0 bg-white me-2"
            onClick={() => {
              dispatch(SettingsActions.flowValidationModalOpen(true));
              dispatch(FlowValidationActions.fetchRules(item?.id));
              dispatch(FlowValidationActions.fetchProperty(item?.scope_type));
              dispatch(
                FlowValidationActions.setSelectedItem({
                  ...item,
                  deletable: item?.deletable ?? true,
                })
              );
            }}
          >
            <FlowValidationIcon />
          </button>
          {item?.deletable === true && (
            <button
              className="border-0 bg-white mr-2"
              onClick={() => {
                dispatch(SettingsActions.addNewValidationModalOpen(true));
                dispatch(FlowValidationActions.setSelectedItem(item));
              }}
            >
              <NewEditIcon />
            </button>
          )}
          {item?.deletable === true && (
            <button
              className="border-none bg-white"
              onClick={() => {
                dispatch(FlowValidationActions.deleteRuleScope(item.id));
              }}
            >
              <IconButton>
                <DeleteSmallIcon color="#444445" height="12" width="12" />
              </IconButton>
            </button>
          )}
        </>
      ),
      width: '10%',
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <HeadingStyle>
            {FLOWVALIDATION_CONSTANTS.FLOW_VALIDATION_SETTINGS}
          </HeadingStyle>
        </div>
        <div className="mb-2 d-flex align-items-center">
          <Button
            type="button"
            size={'md'}
            onClick={() =>
              dispatch(SettingsActions.addNewValidationModalOpen(true))
            }
          >
            <AddIcon color="#fff" />{' '}
            {FLOWVALIDATION_CONSTANTS.ADD_NEW_VALIDATION}
          </Button>
        </div>
      </div>

      <ModalBody className="modal-body">
        <Table
          columns={COLUMNS}
          data={ruleScopes?.data}
          className="parameter-context-table"
          showPagination={true}
        />
      </ModalBody>
      <FlowValidationModal />
      <AddNewValidationModal />
    </div>
  );
};

export default FlowValidation;
