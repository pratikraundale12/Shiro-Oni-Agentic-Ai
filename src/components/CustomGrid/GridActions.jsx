import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { PlusCircleIcon, SmallSearchIcon, TodoIcon } from '../../assets';
import {
  ACCESS_OPTIONS,
  ACTIVITY_EVENTS,
  KDFM,
  MODULE_LIST_MAP,
} from '../../constants';
import { history } from '../../helpers/history';
import { Button, SelectField } from '../../shared';
import {
  AuthenticationSelectors,
  GridActions as GridSagsActions,
  RolesActions,
  RolesSelectors,
} from '../../store';
import {
  ActivityHistoryActions,
  ActivityHistorySelectors,
} from '../../store/activityHistory/redux';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';
import { ClusterSelect } from '../ClusterSelect';
import { getButtonPermissions } from '../../helpers/permissions';

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

const StyledClusterSelect = styled(ClusterSelect)`
  margin-bottom: 0;

  > div {
    margin-top: 0;
  }
`;

const StyledSelectField = styled(SelectField)`
  margin-bottom: 0;
  min-width: 8.5rem;

  &.entity-dropdown {
    min-width: 10rem;
  }

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

const ImageContainer = styled.div`
  margin-bottom: 0.5rem;
`;

export const GridActions = ({
  title,
  module,
  refreshOptions,
  statusOptions,
  search,
  placeholder = 'Search...',
  buttonText,
  addModal: Modal,
  handleRefresh = () => {},
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);
  const accessType = useSelector(RolesSelectors.getAccessType);
  const selectedEntity = useSelector(
    ActivityHistorySelectors.getSelectedEntity
  );
  const selectedEvent = useSelector(ActivityHistorySelectors.getSelectedEvent);
  const { setState } = useGlobalContext();
  const { watch, control } = useForm();

  const watchStatus = watch('is_active');
  const entity = watch('entityName');
  const event = watch('activityEvent');

  const getModuleBasedStatusKey = module => {
    if (module === 'activityHistory') {
      return 'status';
    } else {
      return 'is_active';
    }
  };

  useEffect(() => {
    if (watchStatus || entity || event) {
      dispatch(
        GridSagsActions.fetchGrid({
          module,
          params: {
            page: 1,
            ...(search && { search }),
            ...(watchStatus &&
              watchStatus !== 'all' && {
                [getModuleBasedStatusKey(module)]: watchStatus,
              }),
            ...(entity && entity !== 'all' && { entity }),
            ...(event && event !== 'all' && { event }),
          },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchStatus, entity, event, search]);

  return (
    <>
      <Flex className="flex-wrap gap-2">
        <Flex>
          <ImageContainer>
            <TodoIcon width={22} height={24} />
          </ImageContainer>
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
                placeholder={KDFM.REFRESH}
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
                title={KDFM.SELECT_STATUS}
                control={control}
                options={statusOptions}
                placeholder={KDFM.STATUS}
                backgroundColor={theme.colors.lightGrey}
              />
            </DropdownContainer>
          )}
          {location.pathname.includes('namespaces') && (
            <DropdownContainer>
              <StyledClusterSelect
                size="sm"
                placeholder={KDFM.CLUSTER}
                title={KDFM.SELECT_CLUSTER}
                backgroundColor={theme.colors.lightGrey}
              />
            </DropdownContainer>
          )}
          {location.pathname.includes('permission-matrix') && (
            <StyledSelectField
              size="sm"
              placeholder={KDFM.ACCESS}
              options={ACCESS_OPTIONS}
              defaultValue={accessType}
              backgroundColor={theme.colors.lightGrey}
              onChange={option => dispatch(RolesActions.setAccessType(option))}
            />
          )}
          {location.pathname.includes('activity-history') && (
            <StyledSelectField
              size="sm"
              name="activityEvent"
              control={control}
              title={KDFM.SELECT_EVENT}
              className="entity-dropdown"
              placeholder={KDFM.SELECT_EVENT}
              options={ACTIVITY_EVENTS}
              defaultValue={selectedEvent}
              backgroundColor={theme.colors.lightGrey}
              onChange={option =>
                dispatch(ActivityHistoryActions.setSelectedEvent(option))
              }
            />
          )}
          {location.pathname.includes('activity-history') && (
            <StyledSelectField
              size="sm"
              name="entityName"
              control={control}
              className="entity-dropdown"
              title={KDFM.SELECT_ENTITY}
              placeholder={KDFM.SELECT_ENTITY}
              options={MODULE_LIST_MAP}
              defaultValue={selectedEntity}
              backgroundColor={theme.colors.lightGrey}
              onChange={option =>
                dispatch(ActivityHistoryActions.setSelectedEntity(option))
              }
            />
          )}
          {!isEmpty(buttonText) &&
            userPermissions.includes(getButtonPermissions(module)) && (
              <Button
                icon={<PlusCircleIcon width={16} height={16} color="white" />}
                onClick={() => history.push(`/${module}/add`)}
                size="sm"
              >
                {buttonText}
              </Button>
            )}
          {userPermissions.includes(getButtonPermissions(module)) && <Modal />}
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
