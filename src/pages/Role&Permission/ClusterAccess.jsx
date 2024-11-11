/* eslint-disable react/prop-types */
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import {
  GreaterArrowIcon,
  PlusCircleIcon,
  SmallSearchIcon,
  TodoIcon,
} from '../../assets';
import { Table, TextRender } from '../../components';
import { Button, CheckboxField, SelectField } from '../../shared';
import AddNewRoleModal from '../../shared/AddNewRoleModal';
import Breadcrumb from '../../shared/Breadcrumb';
import {
  AuthenticationSelectors,
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
  PoliciesActions,
  PoliciesSelectors,
  RolesActions,
  RolesSelectors,
} from '../../store';
import { theme } from '../../styles';

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const ImageContainer = styled.div`
  margin-bottom: 0.8rem;
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
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

const StyledSelectField = styled(SelectField)`
  margin-bottom: 0;
  min-width: 8.5rem;

  > div {
    margin-top: 0;
  }
`;

const StyledTable = styled(Table)`
  height: 80%;
`;

const CellRender = ({
  isEdit = false,
  clusterId = '',
  policy = {},
  roleClusters = [],
  onChange = () => {},
}) => {
  const checked = roleClusters.find(
    roleCluster =>
      roleCluster.cluster_id === clusterId &&
      roleCluster.policy_id === policy.id
  );
  const item = { cluster_id: clusterId, policy_id: policy.id };

  return (
    <CheckboxField
      disabled={!isEdit}
      checked={checked}
      onChange={event => onChange(event.target.checked, item)}
    />
  );
};

const getDifference = (existing, updated) => {
  const exists = updated.filter(
    item =>
      !existing.some(
        itm =>
          item.policy_id === itm.policy_id && item.cluster_id === itm.cluster_id
      )
  );
  const updates = existing.filter(
    item =>
      !updated.some(
        itm =>
          item.policy_id === itm.policy_id && item.cluster_id === itm.cluster_id
      )
  );
  return [exists, updates];
};

export const ClusterAccess = () => {
  const dispatch = useDispatch();
  const roles = useSelector(RolesSelectors.getRoles);
  const policies = useSelector(PoliciesSelectors.getPolicies);
  const clusters = useSelector(ClustersSelectors.getClusters);
  const roleClusters = useSelector(RolesSelectors.getRoleClusters);
  const selectedRole = useSelector(RolesSelectors.getSelectedRole);
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);
  const openRoleModal = useSelector(RolesSelectors.getRoleModal);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'updateRoleClusters')
  );
  const hasEditPermssion = userPermissions.includes('edit_permission');
  const [updatedRoleClusters, setUpdatedRoleClusters] = useState([]);
  const [search, setSearch] = useState('');

  const CLUSTERS_ACCESS_COLUMNS = [
    {
      label: 'Cluster Access',
      renderCell: item => <TextRender text={item.label} />,
    },
    {
      label: 'View',
      renderCell: item => (
        <CellRender
          isEdit={hasEditPermssion}
          clusterId={item.value}
          roleClusters={updatedRoleClusters}
          policy={policies?.find(policy => policy.name === 'access_cluster')}
          onChange={handleChange}
        />
      ),
    },
    {
      label: 'Edit',
      renderCell: item => (
        <CellRender
          isEdit={hasEditPermssion}
          clusterId={item.value}
          roleClusters={updatedRoleClusters}
          policy={policies?.find(policy => policy.name === 'edit_cluster')}
          onChange={handleChange}
        />
      ),
    },
    {
      label: 'Delete',
      renderCell: item => (
        <CellRender
          isEdit={hasEditPermssion}
          clusterId={item.value}
          roleClusters={updatedRoleClusters}
          policy={policies?.find(policy => policy.name === 'delete_cluster')}
          onChange={handleChange}
        />
      ),
    },
  ];

  const roleOptions = roles.map(role => ({
    value: role.role_id,
    label: role.name,
  }));

  const path = [
    { label: 'DFM Access', path: '/role-&-permission' },
    { label: 'Cluster Management' },
  ];

  const isUpdated = () => {
    const [added, remove] = getDifference(roleClusters, updatedRoleClusters);
    const updated = !isEmpty(added) || !isEmpty(remove);
    return loading || !updated;
  };

  const onChange = option => {
    dispatch(RolesActions.setSelectedRole(option));
    dispatch(PoliciesActions.fetchPoliciesRoles({ roleId: option.value }));
  };

  const handleChange = (checked, item) => {
    if (!checked) {
      setUpdatedRoleClusters(prev =>
        prev.filter(
          policy =>
            !(
              policy.cluster_id === item.cluster_id &&
              policy.policy_id === item.policy_id
            )
        )
      );
    } else {
      setUpdatedRoleClusters(prev => [...prev, item]);
    }
  };

  const handleSubmit = () => {
    const payload = { add: [], remove: [] };

    const [added, remove] = getDifference(roleClusters, updatedRoleClusters);

    payload.add = added.map(item => ({
      role_id: selectedRole.value,
      cluster_id: item.cluster_id,
      policy_id: item.policy_id,
    }));
    payload.remove = remove.map(item => ({
      role_id: selectedRole.value,
      cluster_id: item.cluster_id,
      policy_id: item.policy_id,
    }));
    payload.roleId = selectedRole.value;

    dispatch(RolesActions.updateRoleClusters(payload));
  };

  const getFilteredData = () => {
    if (!isEmpty(search)) {
      return clusters.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase())
      );
    }
    return clusters;
  };

  useEffect(() => {
    dispatch(ClustersActions.fetchClusterList());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(selectedRole))
      dispatch(RolesActions.fetchRoleClusters({ roleId: selectedRole.value }));
  }, [dispatch, selectedRole]);

  useEffect(() => {
    setUpdatedRoleClusters(roleClusters);
  }, [roleClusters]);

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <>
      <Flex>
        <Flex>
          <button
            className="d-flex border-0 bg-white"
            onClick={handleBackButtonClick}
            style={{ marginBottom: '0.5rem' }}
          >
            <GreaterArrowIcon />
          </button>
          <ImageContainer>
            <TodoIcon width={22} height={24} />
          </ImageContainer>
          <Title>DFM Role Management</Title>
        </Flex>
        <ButtonsContainer>
          <StyledSelectField
            size="sm"
            placeholder="Select Role"
            options={roleOptions}
            value={selectedRole}
            backgroundColor={theme.colors.lightGrey}
            onChange={onChange}
          />
          {userPermissions.includes('add_permission') && (
            <Button
              icon={<PlusCircleIcon width={16} height={16} />}
              onClick={() => dispatch(RolesActions.roleModal())}
              variant="secondary"
              size="sm"
            >
              Add New Role
            </Button>
          )}
          {userPermissions.includes('edit_permission') && (
            <Button disabled={isUpdated()} onClick={handleSubmit} size="sm">
              Save Changes
            </Button>
          )}
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
          placeholder="Search cluster name"
          onChange={e => setSearch(e.target.value)}
        />
      </SearchContainer>
      {openRoleModal && <AddNewRoleModal />}
      <Breadcrumb module="path" path={path} />
      <StyledTable data={getFilteredData()} columns={CLUSTERS_ACCESS_COLUMNS} />
    </>
  );
};
