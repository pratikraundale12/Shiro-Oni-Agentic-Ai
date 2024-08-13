import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';
import { PlusCircleIcon, SmallSearchIcon, TodoIcon } from '../../assets';
import { Button, SelectField } from '../../shared';
import { fetchGridData } from '../../store';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonsContainer = styled(Flex)`
  gap: 0.5rem;
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

  > div {
    margin-top: 0;
  }
`;
const DropdownContainer = styled.div`
  margin-left: 10px;
  min-width: 175px;
  max-width: 175px;
  cursor: pointer;

  & div > div {
    & > div {
      min-width: 175px;
      max-width: 175px;
      cursor: pointer;
    }
  }
  & div > div {
    & > div > * {
      min-width: unset;
      max-width: unset;
      cursor: pointer;
    }
  }
`;

export const GridActions = ({
  title,
  module,
  clusterOptions,
  refreshOptions,
  statusOptions,
  search,
  placeholder = 'Search...',
  buttonText,
  addModal: Modal,
  handleRefresh = () => {},
}) => {
  const { setState } = useGlobalContext();
  const navigate = useNavigate();
  const { watch, control } = useForm();

  const watchStatus = watch('is_active');
  const watchCluster = watch('cluster');

  useEffect(() => {
    if (watchCluster || watchStatus) {
      setState(prev => ({
        ...prev,
        ...(watchStatus && { is_active: watchStatus }),
        ...(watchCluster && { selectedSourceClusterId: watchCluster }),
      }));
      fetchGridData({
        setState,
        module,
        ...(watchStatus && watchStatus !== 'all' && { is_active: watchStatus }),
        ...(watchCluster && { selectedSourceClusterId: watchCluster }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchStatus, watchCluster]);

  return (
    <>
      <Flex>
        <Flex>
          <TodoIcon width={22} height={24} />
          <Title>{title}</Title>
        </Flex>
        <ButtonsContainer>
          {!isEmpty(refreshOptions) && (
            <DropdownContainer>
              <StyledSelectField
                name="refresh"
                size="sm"
                control={control}
                options={refreshOptions}
                placeholder="Refresh"
                backgroundColor={theme.colors.lightGrey}
                onChange={handleRefresh}
              />
            </DropdownContainer>
          )}
          {!isEmpty(statusOptions) && (
            <DropdownContainer>
              <StyledSelectField
                name="is_active"
                size="sm"
                control={control}
                options={statusOptions}
                placeholder="Status"
                backgroundColor={theme.colors.lightGrey}
              />
            </DropdownContainer>
          )}
          {window.location.pathname.includes('namespaces') && (
            <DropdownContainer>
              <StyledSelectField
                size="sm"
                name="cluster"
                control={control}
                placeholder="Clusters"
                options={clusterOptions}
                backgroundColor={theme.colors.lightGrey}
              />
            </DropdownContainer>
          )}
          {!isEmpty(buttonText) && (
            <Button
              icon={<PlusCircleIcon width={16} height={16} color="white" />}
              onClick={() => navigate('add')}
              size="sm"
            >
              {buttonText}
            </Button>
          )}
          <Modal />
        </ButtonsContainer>
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
          placeholder={placeholder}
          onChange={e =>
            setState(prev => ({ ...prev, search: e.target.value }))
          }
        />
      </SearchContainer>
    </>
  );
};

GridActions.propTypes = {
  title: PropTypes.string,
  module: PropTypes.string,
  clusterOptions: PropTypes.array,
  refreshOptions: PropTypes.array,
  statusOptions: PropTypes.array,
  search: PropTypes.string,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  addModal: PropTypes.func,
  handleRefresh: PropTypes.func,
};
