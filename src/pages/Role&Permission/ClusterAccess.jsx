/* eslint-disable react/prop-types */
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { SmallSearchIcon, TodoIcon } from '../../assets';
import { Table, TextRender } from '../../components';
import { Button, CheckboxField, SelectField } from '../../shared';
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
  const checked =
    roleClusters &&
    roleClusters.length > 0 &&
    roleClusters.find(
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
  const exists =
    updated &&
    updated.length > 0 &&
    updated.filter(
      item =>
        existing &&
        !existing.some(
          itm =>
            item.policy_id === itm.policy_id &&
            item.cluster_id === itm.cluster_id
        )
    );
  const updates =
    existing &&
    existing.length > 0 &&
    existing.filter(
      item =>
        updated &&
        !updated.some(
          itm =>
            item.policy_id === itm.policy_id &&
            item.cluster_id === itm.cluster_id
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
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'updateRoleClusters')
  );
  const hasEditPermssion = userPermissions.includes('edit_permission');
  const [updatedRoleClusters, setUpdatedRoleClusters] = useState([]);
  const [search, setSearch] = useState('');
  const viewId = policies?.filter(ele => ele?.name === 'access_cluster');
  const deleteId = policies?.filter(ele => ele?.name === 'delete_cluster');
  const deActivateId = policies?.filter(
    ele => ele?.name === 'deactivate_cluster'
  );

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
      label: 'De-activate',
      renderCell: item => (
        <CellRender
          isEdit={hasEditPermssion}
          clusterId={item.value}
          roleClusters={updatedRoleClusters}
          policy={policies?.find(
            policy => policy.name === 'deactivate_cluster'
          )}
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

  const path = [
    {
      label: 'DFM Access',
      path: '/role-&-permission',
      callback: () => {
        dispatch(RolesActions.setSelectedRole({}));
        dispatch(PoliciesActions.fetchPoliciesRolesSuccess({}));
        dispatch(PoliciesActions.fetchPoliciesSuccess({}));
      },
    },
    { label: 'Cluster Management' },
  ];

  const isUpdated = () => {
    const [added, remove] = getDifference(roleClusters, updatedRoleClusters);
    const updated = !isEmpty(added) || !isEmpty(remove);
    return loading || !updated;
  };

  const onChange = option => {
    dispatch(RolesActions.setSelectedRole(option));
    dispatch(PoliciesActions.fetchPoliciesRoles({ roleId: option.role_id }));
    dispatch(RolesActions.fetchRoleClusters({ roleId: option.role_id }));
  };
  const handleCheckboxAutoClick = value => {
    if (viewId?.[0]?.id !== value?.policy_id) {
      setUpdatedRoleClusters(prevItems => {
        const doesItemExist = prevItems.some(
          item =>
            item.cluster_id === value?.cluster_id &&
            item.policy_id === viewId?.[0]?.id
        );
        if (doesItemExist) {
          return prevItems;
        }
        return [
          ...prevItems,
          {
            cluster_id: value?.cluster_id,
            policy_id: viewId?.[0]?.id,
          },
        ];
      });
    }
    if (deleteId?.[0]?.id === value?.policy_id) {
      setUpdatedRoleClusters(prevItems => {
        const doesItemExist = prevItems.some(
          item =>
            item.cluster_id === value?.cluster_id &&
            item.policy_id === deActivateId?.[0]?.id
        );

        if (doesItemExist) {
          return prevItems;
        }
        return [
          ...prevItems,
          {
            cluster_id: value?.cluster_id,
            policy_id: deActivateId?.[0]?.id,
          },
        ];
      });
    }
  };

  const handleChange = (checked, item) => {
    if (!isEmpty(selectedRole)) {
      const samecluster = updatedRoleClusters.filter(
        ele => ele?.cluster_id === item.cluster_id
      );
      if (!checked) {
        if (item.policy_id === viewId?.[0]?.id && samecluster.length > 1) {
          null;
        } else {
          setUpdatedRoleClusters(prev =>
            prev.filter(policy => {
              const isSameClusterAndPolicy =
                policy.cluster_id === item.cluster_id &&
                policy.policy_id === item.policy_id;

              const isDeactivateCondition =
                item.policy_id === deActivateId?.[0]?.id &&
                policy.cluster_id === item.cluster_id &&
                policy.policy_id === deleteId?.[0]?.id;

              return !(isSameClusterAndPolicy || isDeactivateCondition);
            })
          );
        }
      } else {
        setUpdatedRoleClusters(prev => [...prev, item]);
        handleCheckboxAutoClick(item);
      }
    } else {
      toast.error('Please select a role');
    }
  };

  const handleSubmit = () => {
    const payload = { add: [], remove: [] };

    const [added, remove] = getDifference(roleClusters, updatedRoleClusters);
    payload.add =
      added &&
      added.length > 0 &&
      added.map(item => ({
        role_id: selectedRole.role_id,
        cluster_id: item.cluster_id,
        policy_id: item.policy_id,
      }));
    payload.remove =
      remove &&
      remove.length > 0 &&
      remove.map(item => ({
        role_id: selectedRole.role_id,
        cluster_id: item.cluster_id,
        policy_id: item.policy_id,
      }));

    payload.roleId = selectedRole.role_id;

    dispatch(RolesActions.updateRoleClusters(payload));
  };

  const getFilteredData = () => {
    if (!isEmpty(search)) {
      return clusters.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase())
      );
    }
    const data = [...clusters];
    const sortedData =
      data &&
      data?.length > 0 &&
      data?.sort((a, b) => a?.label?.localeCompare(b?.label));

    return sortedData;
  };

  useEffect(() => {
    dispatch(ClustersActions.fetchClusterList());
  }, [dispatch]);

  // useEffect(() => {
  //   if (!isEmpty(selectedRole))
  //     dispatch(RolesActions.fetchRoleClusters({ roleId: selectedRole.value }));
  // }, [dispatch, selectedRole]);

  useEffect(() => {
    setUpdatedRoleClusters(roleClusters);
  }, [roleClusters]);

  return (
    <>
      <Flex>
        <Flex>
          <ImageContainer>
            <TodoIcon width={22} height={24} />
          </ImageContainer>
          <Title>Cluster Management</Title>
        </Flex>
        <ButtonsContainer>
          <StyledSelectField
            size="sm"
            placeholder="Select Role"
            options={roles}
            backgroundColor={theme.colors.lightGrey}
            onChange={onChange}
          />
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
          onChange={e => {
            const value = e.target.value;
            if (value.length <= 100) {
              setSearch(value);
            }
          }}
        />
      </SearchContainer>
      <Breadcrumb module="path" path={path} />
      <StyledTable data={getFilteredData()} columns={CLUSTERS_ACCESS_COLUMNS} />
    </>
  );
};
