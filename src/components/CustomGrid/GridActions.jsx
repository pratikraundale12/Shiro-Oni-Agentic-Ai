import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { theme } from '../../styles';
import { Button, Dropdown, SelectField } from '../../shared';
import { PlusCircleIcon, SmallSearchIcon, TodoIcon } from '../../assets';
import { useForm } from 'react-hook-form';

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  font-family: ${props => props.theme.fontNato};
  font-weight: 500;
  font-size: 20px;
  margin-left: 10px;
`;

const SearchContainer = styled.div`
  position: relative;

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
`;

const StyledSelectField = styled(SelectField)`
  margin-bottom: 0;
  margin-right: 1.4rem;

  > div {
    margin-top: 0;
  }
`;

export const GridActions = ({
  title,
  clusterOptions,
  refreshOptions,
  statusOptions,
  search,
  setSearch,
  buttonText,
  addModal: Modal,
}) => {
  const navigate = useNavigate();
  const { control } = useForm();

  const statusOption = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];

  return (
    <>
      <Flex>
        <Flex>
          <TodoIcon width={28} height={28} />
          <Title>{title}</Title>
        </Flex>
        <Flex>
          {!isEmpty(refreshOptions) && (
            <StyledSelectField
              name="refresh"
              size="sm"
              control={control}
              options={refreshOptions}
              placeholder="Refresh"
              backgroundColor={theme.colors.lightGrey}
            />
          )}
          {!isEmpty(statusOptions) && (
            <StyledSelectField
              name="is_active"
              size="sm"
              control={control}
              options={statusOption}
              placeholder="Status"
              backgroundColor={theme.colors.lightGrey}
            />
          )}
          {!isEmpty(clusterOptions) && (
            <Dropdown placeholder="Clusters" options={clusterOptions} />
          )}
          {!isEmpty(buttonText) && (
            <Button
              icon={<PlusCircleIcon width={20} height={20} color="white" />}
              onClick={() => navigate('add')}
            >
              {buttonText}
            </Button>
          )}
          <Modal />
        </Flex>
      </Flex>
      <SearchContainer>
        <SmallSearchIcon
          width={18}
          height={18}
          color={theme.colors.darkGrey1}
        />
        <Search
          type="search"
          value={search}
          placeholder="Search User Name, Email, Status"
          onChange={e => setSearch(e.target.value)}
        />
      </SearchContainer>
    </>
  );
};

GridActions.propTypes = {
  title: PropTypes.string,
  clusterOptions: PropTypes.array,
  refreshOptions: PropTypes.array,
  statusOptions: PropTypes.array,
  search: PropTypes.string,
  setSearch: PropTypes.func,
  buttonText: PropTypes.string,
  addModal: PropTypes.func,
};
