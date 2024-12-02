/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { difference, isEmpty, unionBy, uniqBy } from 'lodash';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import {
  DeleteDustbinIcon,
  GreaterArrowIcon,
  GreenRightCircleIcon,
  PlusCircleIcon,
  SmallSearchIcon,
  TodoIcon,
} from '../../assets';
import { Table, TextRender } from '../../components';
import { history } from '../../helpers/history';
import {
  Button,
  CheckboxField,
  ModalWithIcon,
  SelectField,
  TextButton,
} from '../../shared';
import AddNewRoleModal from '../../shared/AddNewRoleModal';
import {
  AuthenticationSelectors,
  LoadingSelectors,
  PoliciesActions,
  PoliciesSelectors,
  RolesActions,
  RolesSelectors,
} from '../../store';
import { theme } from '../../styles';
import ListRoleModal from './ListRoleModal';

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

const LinkButton = styled(TextButton)`
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fontRedHat};
  font-weight: 800;
  font-size: 14px;
  text-transform: capitalize;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const StyledTable = styled(Table)`
  height: 82%;
`;

const MODULES = [
  {
    label: 'Cluster',
    value: 'cluster',
  },
  {
    label: 'Process Group',
    value: 'namespace',
  },
  {
    label: 'User Management',
    value: 'user',
  },
  {
    label: 'Role & Permission',
    value: 'permission',
  },
  {
    label: 'LDAP Configuration',
    value: 'ldap',
  },
  {
    label: 'Activity History',
    value: 'history',
  },
  {
    label: 'Controller Service',
    value: 'controller_services',
  },
];

const EXCLUDE_ADD_PERMISSION = ['namespace', 'history', 'user'];
const EXCLUDE_EDIT_PERMISSION = ['cluster', 'namespace', 'history', 'user'];
const EXCLUDE_DELETE_PERMISSION = [
  'cluster',
  'namespace',
  'permission',
  'ldap',
  'history',
  'user',
];

const CellRender = ({
  isEdit = false,
  policy_name = '',
  policies = [],
  updatedRolePolicies = [],
  onChange = () => {},
}) => {
  const item = policies.find(item => item.name === policy_name) || {};
  const checked = !!updatedRolePolicies.find(
    policy => policy.policy_id === item.id
  )?.policy_id;
  return (
    <CheckboxField
      disabled={!isEdit || isEmpty(item)}
      checked={checked}
      onChange={event => onChange(event.target.checked, item)}
    />
  );
};

const getDifference = (existing, updated) => {
  const exists = existing.map(item => item.policy_id);
  const updates = updated.map(item => item.policy_id);
  return [difference(updates, exists), difference(exists, updates)];
};

export const ModuleAccess = () => {
  const dispatch = useDispatch();
  const policies = useSelector(PoliciesSelectors.getPolicies);
  const rolePolicies = useSelector(PoliciesSelectors.getPoliciesRoles);
  const roles = useSelector(RolesSelectors.getRoles);
  const selectedRole = useSelector(RolesSelectors.getSelectedRole);
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);
  const openRoleModal = useSelector(RolesSelectors.getRoleModal);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'updateRolesPolicies')
  );
  const deleteConfirmtionModelOpen = useSelector(
    RolesSelectors.getIsDeleteConfirmationModelOpen
  );
  const duplicateUserModalUser = useSelector(
    RolesSelectors.getInActiveUserIdModelOpen
  );
  const selectedItem = useSelector(RolesSelectors.getRoleListSelectedItem);
  const hasEditPermssion = userPermissions.includes('edit_permission');
  const [updatedRolePolicies, setUpdatedRolePolicies] = useState([]);
  const [search, setSearch] = useState('');

  const DFM_ACCESS_COLUMNS = [
    {
      label: 'DFM Access',
      renderCell: item => <TextRender text={item.label} />,
    },
    {
      label: 'View',
      renderCell: item => (
        <CellRender
          isEdit={hasEditPermssion}
          policy_name={`view_${item.value}`}
          policies={policies}
          updatedRolePolicies={updatedRolePolicies}
          onChange={handleChange}
        />
      ),
    },
    {
      label: 'Add',
      renderCell: item =>
        !EXCLUDE_ADD_PERMISSION.includes(item.value) && (
          <CellRender
            isEdit={hasEditPermssion}
            policy_name={`add_${item.value}`}
            policies={policies}
            updatedRolePolicies={updatedRolePolicies}
            onChange={handleChange}
          />
        ),
    },
    {
      label: 'Edit',
      renderCell: item =>
        !EXCLUDE_EDIT_PERMISSION.includes(item.value) && (
          <CellRender
            isEdit={hasEditPermssion}
            policy_name={`edit_${item.value}`}
            policies={policies}
            updatedRolePolicies={updatedRolePolicies}
            onChange={handleChange}
          />
        ),
    },
    {
      label: 'Delete',
      renderCell: item =>
        !EXCLUDE_DELETE_PERMISSION.includes(item.value) && (
          <CellRender
            isEdit={hasEditPermssion}
            policy_name={`delete_${item.value}`}
            policies={policies}
            updatedRolePolicies={updatedRolePolicies}
            onChange={handleChange}
          />
        ),
    },
    {
      label: '',
      renderCell: item =>
        item.value === 'cluster' && (
          <LinkButton
            onClick={() => history.push('/role-&-permission/cluster-access')}
          >{`Manage ${item.value} List`}</LinkButton>
        ),
    },
  ];

  const roleOptions = roles.map(role => ({
    value: role.role_id,
    label: role.name,
  }));

  const isUpdated = () => {
    const [added, remove] = getDifference(rolePolicies, updatedRolePolicies);
    const updated = !isEmpty(added) || !isEmpty(remove);
    return loading || !updated;
  };

  const onChange = option => {
    dispatch(RolesActions.setSelectedRole(option));
    dispatch(PoliciesActions.fetchPoliciesRoles({ roleId: option.value }));
  };
  useEffect(() => {
    const uniqueArray = unionBy(updatedRolePolicies, 'policy_id');
    if (
      updatedRolePolicies.length !==
      uniqBy(updatedRolePolicies, 'policy_id').length
    ) {
      setUpdatedRolePolicies(uniqueArray);
    }
  }, [updatedRolePolicies]);

  const handleCheckboxAutoClick = value => {
    const controllerPolicies = [
      'delete_controller_services',
      'add_controller_services',
      'edit_controller_services',
    ];

    const userPolicies = ['add_user', 'edit_user', 'delete_user'];
    const clusterPolicies = ['add_cluster'];
    const ldapPolicies = ['add_ldap', 'edit_ldap'];
    const rolesPolicies = ['add_permission', 'edit_permission'];

    const handlePolicyCheck = (policiesArray, viewPolicyName) => {
      if (policiesArray.some(element => element.includes(value.name))) {
        const item = policies.find(element => element.name === viewPolicyName);
        if (item) {
          const stateObject = {
            policy_id: item.id,
            policy_name: item.name,
          };
          const testCheck = updatedRolePolicies.some(
            item => item.policy_name === value.name
          );
          if (!testCheck) {
            setUpdatedRolePolicies(prevState => [...prevState, stateObject]);
          }
        }
      }
    };

    handlePolicyCheck(controllerPolicies, 'view_controller_services');
    handlePolicyCheck(userPolicies, 'view_user');
    handlePolicyCheck(clusterPolicies, 'view_cluster');
    handlePolicyCheck(ldapPolicies, 'view_ldap');
    handlePolicyCheck(rolesPolicies, 'view_permission');
    //
  };

  const handleChange = (checked, value) => {
    if (!checked) {
      setUpdatedRolePolicies(prev =>
        prev.filter(item => item.policy_id !== value.id)
      );
    } else {
      setUpdatedRolePolicies(prev => [
        ...prev,
        { policy_id: value.id, policy_name: value.name },
      ]);
    }

    handleCheckboxAutoClick(value);
  };

  const handleSubmit = () => {
    const payload = { add: [], remove: [] };

    const [added, remove] = getDifference(rolePolicies, updatedRolePolicies);

    payload.add = added.map(policy_id => ({
      role_id: selectedRole.value,
      policy_id,
    }));
    payload.remove = remove.map(policy_id => ({
      role_id: selectedRole.value,
      policy_id,
    }));
    payload.roleId = selectedRole.value;

    dispatch(PoliciesActions.updateRolesPolicies(payload));
  };

  useEffect(() => {
    if (isEmpty(roles)) {
      dispatch(RolesActions.fetchRoles());
    }
    if (isEmpty(policies)) {
      dispatch(PoliciesActions.fetchPolicies());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(selectedRole))
      dispatch(
        PoliciesActions.fetchPoliciesRoles({ roleId: selectedRole.value })
      );
  }, [dispatch, selectedRole]);

  useEffect(() => {
    setUpdatedRolePolicies(rolePolicies);
  }, [rolePolicies]);

  // Filter the modules based on the search query
  const filteredModules = MODULES.filter(module =>
    module.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleBackButtonClick = () => {
    window.history.back();
  };

  const capitalizeFirstLetter = text => {
    if (!text) return '';

    text = text.toLowerCase();

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  return (
    <>
      <Flex>
        <Flex>
          <button
            className="d-flex border-0 bg-white"
            onClick={handleBackButtonClick}
            style={{ marginBottom: '0.5rem' }}
            data-tooltip-id={`tooltip-group-role-module`}
          >
            <GreaterArrowIcon />
          </button>
          <ReactTooltip
            id={`tooltip-group-role-module`}
            place="right"
            content={'Back'}
            style={{
              width: '65px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
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
              onClick={() => {
                // setIsRoleListModalOpen
                dispatch(RolesActions.setIsRoleListModalOpen(true));
              }}
              variant="secondary"
              size="sm"
            >
              Roles
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
          placeholder="Search DFM access"
          onChange={e => setSearch(e.target.value)}
        />
      </SearchContainer>
      {openRoleModal && <AddNewRoleModal />}
      <ListRoleModal />
      <ModalWithIcon
        title={'Delete role'}
        primaryButtonText={'Delete'}
        secondaryButtonText={'Cancel'}
        icon={<DeleteDustbinIcon />}
        isOpen={deleteConfirmtionModelOpen}
        onSubmit={() => {
          dispatch(RolesActions.deleteRole());
          dispatch(RolesActions.setIsDeleteConfirmationModelOpen(false));
          dispatch(RolesActions.setRoleListSelectedItem({}));
          dispatch(RolesActions.setIsRoleListModalOpen(true));
        }}
        onRequestClose={() => {
          dispatch(RolesActions.setIsDeleteConfirmationModelOpen(false));
          dispatch(RolesActions.setRoleListSelectedItem({}));
          dispatch(RolesActions.setIsRoleListModalOpen(true));
        }}
        primaryText={`Are you sure you want to delete ${capitalizeFirstLetter(selectedItem?.name)} role`}
      />
      <ModalWithIcon
        title={'Inactive Role'}
        primaryButtonText={'Active'}
        secondaryButtonText={'Cancel'}
        icon={<GreenRightCircleIcon />}
        isOpen={duplicateUserModalUser}
        onSubmit={() => {
          dispatch(RolesActions.editRole({ is_active: true }));
          dispatch(RolesActions.setInActiveUserIdModelOpen(false));
          dispatch(RolesActions.setIsRoleListModalOpen(true));
        }}
        onRequestClose={() => {
          dispatch(RolesActions.setInActiveUserIdModelOpen(false));
          dispatch(RolesActions.setInactiveUserId(''));
          dispatch(RolesActions.setIsRoleListModalOpen(true));
        }}
        primaryText={`This role is inactive, would you like to activate it?`}
      />
      <StyledTable data={filteredModules} columns={DFM_ACCESS_COLUMNS} />
    </>
  );
};
