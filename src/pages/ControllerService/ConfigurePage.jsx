import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { PlusCircleIcon, SmallSearchIcon } from '../../assets';
import { Table, TextRender } from '../../components';
import { KDFM, SEARCH_INPUT_ERROR } from '../../constants';
import { Button, CheckboxField, Modal, FieldErrorMessage } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { theme } from '../../styles';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const NewClassAddes = styled.div`
  &.mt-n3 {
    margin-top: -1.3rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 90%;
  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
  @media screen and (max-width: 768px) {
    width: 75% !important;
  }
  @media screen and (max-width: 820px) {
    width: 80% !important;
  }
  @media screen and (max-width: 1050px) {
    width: 82%;
  }
  @media screen and (max-width: 1400px) {
    width: 85%;
  }
`;
const Search = styled.input`
  height: 44px;
  width: 100%;
  border-radius: 6px;
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
const DisplayMessage = styled.div`
  color: #ff7a00;
  font-size: 16px;
  font-weight: 500;
`;

const ConfigurePage = ({
  isOpen,
  onClose,
  handleConfigureSubmit,
  loading,
  setIsModalOpen,
}) => {
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const listData = useSelector(
    NamespacesSelectors?.getRootControllerServiceNamespace
  );
  const [search, setSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchErrorMsg, setSearchErrorMsg] = useState({});
  const filteredModulesData = listData.filter(
    module =>
      module?.name?.toLowerCase().includes(search.toLowerCase()) ||
      module?.state?.toLowerCase().includes(search.toLowerCase())
  );
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            data-tooltip-id={`tooltip-${item.id}-name`}
          >
            <CheckboxField
              name={`check-${item.id}`}
              label=""
              checked={selectedItem?.id === item.id}
              onChange={() => handleCheckboxChange(item)}
            />
            <TextRender text={item.name} />
          </div>
          <ReactTooltip
            id={`tooltip-${item?.id}-name`}
            place="right"
            content={item?.name}
            style={{
              whiteSpace: 'normal',
              zIndex: 9999,
            }}
          />
        </>
      ),
      width: '20%',
      resize: true,
    },
    {
      label: 'Type',
      renderCell: item => (
        <>
          <TextRender
            text={item?.typeValue}
            data-tooltip-id={`tooltip-${item.id}-typeValue`}
          />
          <ReactTooltip
            id={`tooltip-${item?.id}-typeValue`}
            place="right"
            content={item?.typeValue}
            style={{
              whiteSpace: 'normal',
              zIndex: 9999,
            }}
          />
        </>
      ),
      width: '20%',
      resize: true,
    },
    {
      label: 'Bundle',
      renderCell: item => (
        <>
          <TextRender
            text={item?.bundleValue}
            data-tooltip-id={`tooltip-${item.id}-bundleValue`}
          />
          <ReactTooltip
            id={`tooltip-${item?.id}-bundleValue`}
            place="right"
            content={item?.bundleValue}
            style={{
              whiteSpace: 'normal',
              zIndex: 9999,
            }}
          />
        </>
      ),
      width: '20%',
      resize: true,
    },
    {
      label: 'State',
      renderCell: item => item?.state,
      width: '20%',
      resize: true,
    },
    {
      label: 'Scope',
      renderCell: item => item?.scope,
      width: '20%',
      resize: true,
    },
  ];

  const handleCheckboxChange = item => {
    setSelectedItem(prev => (prev?.id === item.id ? null : item));
  };

  const handleSubmit = () => {
    handleConfigureSubmit(false, selectedItem);
  };

  return (
    <Modal
      title="Configure Controller Service"
      isOpen={isOpen}
      onRequestClose={onClose}
      size="md"
      primaryButtonText="Submit"
      primaryButtonDisabled={selectedItem === null}
      footerAlign="start"
      contentStyles={{ maxWidth: '60%', maxHeight: '70%' }}
      secondaryButtonText="Back"
      onSubmit={handleSubmit}
    >
      <NewClassAddes className="d-flex align-center justify-content-between w-100 mb-2 mt-n3 gap-2">
        <SearchContainer>
          <SmallSearchIcon
            width={18}
            height={18}
            color={theme.colors.darkGrey1}
          />
          <Search
            type="search"
            value={searchText}
            placeholder="Search Controller Service by Name and State"
            onChange={e => {
              const value = e.target.value;
              setSearchText(value);
              setSearchErrorMsg({
                search: {
                  message: SEARCH_INPUT_ERROR,
                },
              });
              if (
                value.length <= 100 &&
                (value.length >= 2 || value?.length === 0)
              ) {
                setSearchErrorMsg({});
                setSearch(value);
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          />
        </SearchContainer>
        <FieldErrorMessage
          name="search"
          errors={searchErrorMsg}
          className={'mb-1'}
        />
        <Button
          icon={<PlusCircleIcon width={16} height={16} color="white" />}
          type="button"
          className="w-auto px-2"
          size="sm"
          onClick={() => {
            dispatch(NamespacesActions.setIsAddControllerServiceModal(true));
            setIsModalOpen();
          }}
          style={{ cursor: 'pointer' }}
        >
          {KDFM.ADD_NEW}
        </Button>
      </NewClassAddes>
      <DisplayMessage className="pb-3">
        Select a controller service from the available options in this instance
      </DisplayMessage>
      <div>
        <Table
          data={filteredModulesData || []}
          columns={COLUMNS}
          className="variables-table"
          loading={loading}
        />
      </div>
    </Modal>
  );
};

ConfigurePage.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleConfigureSubmit: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func,
};

export default ConfigurePage;
