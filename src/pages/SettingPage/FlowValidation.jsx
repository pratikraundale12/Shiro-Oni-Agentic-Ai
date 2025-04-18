import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  DeleteSmallIcon,
  FlowValidationIcon,
  NewEditIcon,
  SmallSearchIcon,
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
import { theme } from '../../styles';
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
const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
`;

const Search = styled.input`
  width: 100%;
  border-radius: 2px;
  padding: 12px 12px 12px 40px;
  font-size: 16px;
  margin: 14px 0;
  font-family: ${props => props.theme.fontRedHat};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.lightGrey};

  &:focus-visible {
    outline: none;
  }
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
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
  const [searchText, setSearchText] = useState('');

  const ruleScopes = useSelector(FlowValidationSelectors.getRuleScopes);
  useEffect(() => {
    dispatch(FlowValidationActions.ruleScopeFetch());
  }, [dispatch]);
  const handleSearch = e => {
    setSearchText(e.target.value);
  };
  const filteredData = (ruleScopes?.data || []).filter(item =>
    item?.header?.toLowerCase().includes(searchText.toLowerCase())
  );

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
            onClick={e => {
              e.currentTarget.blur();
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
            data-tooltip-id={`tooltip-validation-${item.id}`}
          >
            <FlowValidationIcon />
          </button>
          <ReactTooltip
            id={`tooltip-validation-${item.id}`}
            place="left"
            content="View Validation Rules"
            style={{
              width: '130px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          {item?.deletable === true && (
            <button
              className="border-0 bg-white mr-2"
              onClick={event => {
                event.currentTarget.blur();
                dispatch(SettingsActions.addNewValidationModalOpen(true));
                dispatch(FlowValidationActions.setSelectedItem(item));
              }}
              data-tooltip-id={`tooltip-edit-${item.id}`}
            >
              <NewEditIcon />
            </button>
          )}
          <ReactTooltip
            id={`tooltip-edit-${item.id}`}
            place="left"
            content="Edit Validation"
            style={{
              width: '130px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          {item?.deletable === true && (
            <button
              className="border-none bg-white"
              onClick={() => {
                dispatch(FlowValidationActions.deleteRuleScope(item.id));
              }}
              data-tooltip-id={`tooltip-delete-${item.id}`}
            >
              <IconButton>
                <DeleteSmallIcon color="#444445" height="12" width="12" />
              </IconButton>
            </button>
          )}
          <ReactTooltip
            id={`tooltip-delete-${item.id}`}
            place="left"
            content="Delete Validation"
            style={{
              width: '130px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
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
            onClick={() => {
              dispatch(SettingsActions.addNewValidationModalOpen(true));
              dispatch(FlowValidationActions.setSelectedItem(null));
            }}
          >
            {FLOWVALIDATION_CONSTANTS.ADD_NEW_VALIDATION}
          </Button>
        </div>
      </div>
      <div className="w-100">
        <SearchContainer>
          <SmallSearchIcon
            width={18}
            height={18}
            color={theme.colors.darkGrey1}
          />
          <Search
            type="search"
            placeholder={FLOWVALIDATION_CONSTANTS.SEARCH_DISPLAY_VALUE}
            onChange={handleSearch}
            value={searchText}
          />
        </SearchContainer>
      </div>
      <ModalBody className="modal-body">
        <Table
          columns={COLUMNS}
          data={filteredData}
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
