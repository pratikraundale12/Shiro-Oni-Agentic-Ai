import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../styles';
import { Button, Dropdown } from '../../shared';
import { PlusCircleIcon, SmallSearchIcon, TodoIcon } from '../../assets';

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

export const GridActions = ({
  title,
  clusterOptions,
  refreshOptions,
  statusOptions,
  search,
  setSearch,
  buttonText,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Flex>
        <Flex>
          <TodoIcon width={28} height={28} />
          <Title>{title}</Title>
        </Flex>
        <Flex>
          {!isEmpty(refreshOptions) && (
            <Dropdown placeholder="Refresh" options={refreshOptions} />
          )}
          {!isEmpty(statusOptions) && (
            <Dropdown placeholder="Status" options={statusOptions} />
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
};
