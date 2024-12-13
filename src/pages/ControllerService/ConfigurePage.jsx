import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { PlusCircleIcon, SmallSearchIcon } from '../../assets';
import { Table } from '../../components';
import { Button, CheckboxField, Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { KDFM } from '../../constants';
import { theme } from '../../styles';

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
  const filteredModulesData = listData.filter(
    module =>
      module?.name?.toLowerCase().includes(search.toLowerCase()) ||
      module?.state?.toLowerCase().includes(search.toLowerCase())
  );
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckboxField
            name={`check-${item.id}`}
            label=""
            checked={selectedItem?.id === item.id}
            onChange={() => handleCheckboxChange(item)}
          />
          {item?.name}
        </div>
      ),
      width: '20%',
    },
    { label: 'Type', renderCell: item => item?.typeValue, width: '20%' },
    { label: 'Bundle', renderCell: item => item?.bundleValue, width: '20%' },
    { label: 'State', renderCell: item => item?.state, width: '20%' },
    { label: 'Scope', renderCell: item => item?.scope, width: '20%' },
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
      footerAlign="start"
      contentStyles={{ maxWidth: '60%', maxHeight: '70%' }}
      secondaryButtonText="Back"
      onSubmit={handleSubmit}
    >
      <NewClassAddes className="d-flex align-center justify-content-between w-100 mb-3 mt-n3">
        <SearchContainer>
          <SmallSearchIcon
            width={18}
            height={18}
            color={theme.colors.darkGrey1}
          />
          <Search
            type="search"
            value={search}
            placeholder="Search Controller Service by Name and State"
            onChange={e => setSearch(e.target.value)}
          />
        </SearchContainer>
        <Button
          icon={<PlusCircleIcon width={16} height={16} color="white" />}
          type="button"
          className="w-auto px-3"
          size="sm"
          onClick={() => {
            dispatch(NamespacesActions.setIsAddControllerServiceModal(true));
            setIsModalOpen();
          }}
        >
          {KDFM.ADD}
        </Button>
      </NewClassAddes>

      <div>
        <Table
          data={filteredModulesData?.length ? filteredModulesData : listData}
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
