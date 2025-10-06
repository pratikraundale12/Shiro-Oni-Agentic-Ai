/*eslint-disable*/
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Button, CheckboxField, SelectField } from '../../../shared';
import {
  FullPageLoader,
  LoaderContainer,
  Table,
  TextRender,
} from '../../../components';
import GroupUserIcon from '../../../assets/Icons/GroupUserIcon';
import NewUserIcon from '../../../assets/Icons/NewUserIcon';
import {
  LoadingSelectors,
  NamespacesSelectors,
  RolesActions,
  RolesSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isEqual, sortBy } from 'lodash';
import { toast } from 'react-toastify';
import { theme } from '../../../styles';
import { DocumentTextIcon, NoDataIcon, SmallSearchIcon } from '../../../assets';

const Container = styled.div`
  background-color: #fbfcff;
  overflow: hidden;
  border: 1px solid #dde4f0;
  padding: 20px 15px;
  border-radius: 20px;
  height: 87%;
`;

const MainContent = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  min-width: 280px;
  background-color: #fff;
  border: 1px solid #dde4f0;
  border-radius: 20px;
  padding: 14px 6px;
  overflow: hidden;
`;

const SidebarItem = styled.div`
  padding: 10px 12px;
  margin-bottom: 2px;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #444445;
  cursor: pointer;

  ${props =>
    props.active &&
    `
    background-color: ${theme.colors.primary};
    color: #ffff ;
    font-weight: 500;
    border-radius: 8px;
  `}
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 0;
  overflow: auto;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: left;
  width: 100%;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 18px 16px;
  font-size: 16px;
  cursor: pointer;
  color: #444445;
  border-bottom: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  line-height: 24px;
  ${props =>
    props.active &&
    `
    color: #FF7A00;
    border-bottom-color: #FF7A00;
  `}
  &:hover {
    color: rgba(255, 122, 0, 1);
  }
`;

const TabIcon = styled.span`
  font-size: 16px;

  ${Tab}:hover & svg path {
    stroke: rgba(255, 122, 0, 1);
  }
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
  border-radius: 4px;
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

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
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

const TableHeight = styled(Table)`
  height: calc(100vh - 410px);

  & thead th {
    text-align: center;
  }
  & thead th:first-child {
    text-align: left;
  }
`;
const LeftsidebarScroll = styled.div`
  max-height: calc(100vh - 370px);
`;

const LoadingText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

const LeftSidebarHeading = styled.div`
  font-size: 18px;
  color: #343434;
  padding: 10px 0 10px 8px;
  font-weight: 600;
  border-bottom: 1px solid #dde4f0;
  margin-bottom: 15px;
`;

const NiFiClusterAccessManagement = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [activeSidebarItem, setActiveSidebarItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupsColumns, setGroupsColumns] = useState([]);
  const [usersColumns, setUsersColumns] = useState([]);
  const [usersActions, setUsersActions] = useState([]);
  const [selectedGroupDropdown, setSelectedGroupDropdown] = useState({
    label: 'All',
    value: 'all',
  });
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);

  const [hasUserChanges, setHasUserChanges] = useState(false);
  const [hasUserGroupChanges, setHasUserGroupChanges] = useState(false);
  const [initialUsersActions, setInitialUsersActions] = useState(null);

  const clusterUsers = useSelector(RolesSelectors.getClusterUsers);
  const clusterNiFiPolicies = useSelector(
    RolesSelectors.getClusterNiFiPolicies
  );
  const policiesAndActions = useSelector(
    RolesSelectors.getPoliciesAndActionsData
  );
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchClusterUsers')
  );
  const loading2 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchClusterNiFiPolicies')
  );
  const loading3 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchPoliciesandActions')
  );
  const loading4 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'updateClusterPermissionsAndActions')
  );

  const arePoliciesDifferent = (obj1, obj2) => {
    if (!obj1?.policies || !obj2?.policies) return true;

    if (obj1.policies.length !== obj2.policies.length) return true;

    return obj1.policies.some((p1, index) => {
      const p2 = obj2.policies[index];

      const p1Users = sortBy(p1.users, 'id');
      const p2Users = sortBy(p2.users, 'id');
      const p1Groups = sortBy(p1.userGroups, 'id');
      const p2Groups = sortBy(p2.userGroups, 'id');

      return !isEqual(p1Users, p2Users) || !isEqual(p1Groups, p2Groups);
    });
  };

  const hasUserChangesOnly = (obj1, obj2) => {
    if (!obj1?.policies || !obj2?.policies) return false;
    return obj1.policies.some((p1, index) => {
      const p2 = obj2.policies[index];
      if (!p2) return false;
      const p1Users = sortBy(p1.users, 'id');
      const p2Users = sortBy(p2.users, 'id');
      const p1Groups = sortBy(p1.userGroups, 'id');
      const p2Groups = sortBy(p2.userGroups, 'id');
      return !isEqual(p1Users, p2Users) && isEqual(p1Groups, p2Groups);
    });
  };

  const hasUserGroupChangesOnly = (obj1, obj2) => {
    if (!obj1?.policies || !obj2?.policies) return false;

    return obj1.policies.some((p1, index) => {
      const p2 = obj2.policies[index];
      if (!p2) return false;

      const p1Users = sortBy(p1.users, 'id');
      const p2Users = sortBy(p2.users, 'id');
      const p1Groups = sortBy(p1.userGroups, 'id');
      const p2Groups = sortBy(p2.userGroups, 'id');
      return isEqual(p1Users, p2Users) && !isEqual(p1Groups, p2Groups);
    });
  };

  const hasAnyChanges = (obj1, obj2) => {
    if (!obj1?.policies || !obj2?.policies) return false;

    return obj1.policies.some((p1, index) => {
      const p2 = obj2.policies[index];
      if (!p2) return false;

      const p1Users = sortBy(p1.users, 'id');
      const p2Users = sortBy(p2.users, 'id');
      const p1Groups = sortBy(p1.userGroups, 'id');
      const p2Groups = sortBy(p2.userGroups, 'id');

      return !isEqual(p1Users, p2Users) || !isEqual(p1Groups, p2Groups);
    });
  };

  useEffect(() => {
    if (!isEmpty(policiesAndActions)) {
      setUsersActions(policiesAndActions);
      setInitialUsersActions(policiesAndActions);
      setHasUserChanges(false);
      setHasUserGroupChanges(false);
    }
  }, [policiesAndActions]);

  useEffect(() => {
    if (initialUsersActions && usersActions) {
      const userChanges = hasUserChangesOnly(usersActions, initialUsersActions);
      const userGroupChanges = hasUserGroupChangesOnly(
        usersActions,
        initialUsersActions
      );
      const anyChanges = hasAnyChanges(usersActions, initialUsersActions);
      setHasUserChanges(userChanges);
      setHasUserGroupChanges(userGroupChanges);
      if (activeTab === 'users') {
        setDisableSaveBtn(!(userChanges || anyChanges));
      } else {
        setDisableSaveBtn(!(userGroupChanges || anyChanges));
      }
    }
  }, [usersActions, initialUsersActions, activeTab]);

  const handleTabSwitch = tab => {
    setActiveTab(tab);
    resetCheckboxTracking();
  };

  const handleGroupDropdownChange = selectedOption => {
    setSelectedGroupDropdown(selectedOption);
    resetCheckboxTracking();
  };

  const handleSidebarClick = item => {
    setActiveSidebarItem(item);
    resetCheckboxTracking();
    setSelectedGroupDropdown({
      label: 'All',
      value: 'all',
    });
  };

  const resetCheckboxTracking = () => {
    setHasUserChanges(false);
    setHasUserGroupChanges(false);
    if (policiesAndActions) {
      setInitialUsersActions(policiesAndActions);
      setUsersActions(policiesAndActions);
    }
  };

  const rawGroup = clusterUsers?.userGroups?.map(ele => ({
    identity: ele?.identity,
    id: ele?.id,
  }));
  const userIdentities = clusterUsers?.nifiUsers?.map(name => {
    return {
      name: name?.identity,
      id: name?.id,
    };
  });
  const specificGroupByDropdown = clusterUsers?.userGroups?.filter(
    ele => ele?.id === selectedGroupDropdown?.value
  );
  const usersOfSelectedGroup =
    Array.isArray(specificGroupByDropdown?.[0]?.users) &&
    specificGroupByDropdown?.[0]?.users?.map(name => {
      return {
        name: name?.identity,
        id: name?.id,
      };
    });
  const userList =
    selectedGroupDropdown?.value === 'all'
      ? userIdentities
      : usersOfSelectedGroup;
  const filteredDataUsers = userList?.filter(item =>
    item?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const rawUsers = filteredDataUsers?.map(ele => ({
    identity: ele?.name,
    id: ele?.id,
  }));

  const sidebarItems = useMemo(
    () => clusterNiFiPolicies?.accessPolicies || [],
    [clusterNiFiPolicies]
  );

  useEffect(() => {
    if (!isEmpty(sidebarItems)) {
      setActiveSidebarItem(sidebarItems?.[0]);
    }
  }, [sidebarItems]);

  const [checkboxStates, setCheckboxStates] = useState({});
  useEffect(() => {
    if (activeSidebarItem?.policies?.length) {
      const initialStates = activeSidebarItem?.policies.reduce((acc, item) => {
        acc[item.id] = false;
        return acc;
      }, {});
      setCheckboxStates(initialStates);
    }
  }, [activeSidebarItem?.policies]);

  const userGroupIdentities = clusterUsers?.userGroups?.map(name => {
    return {
      name: name?.identity,
      id: name?.id,
    };
  });

  const filteredDataUsersGrp = userGroupIdentities?.filter(item =>
    item?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dynamicColumns = useMemo(() => {
    function getEqualParts(num) {
      if (!num || num <= 0) return 0;
      return +(100 / num).toFixed(2);
    }

    const createDynamicColumns = nameColumnLabel => {
      const columns = [
        {
          label: nameColumnLabel,
          renderCell: item => <TextRender text={item.name} />,
        },
      ];

      // compute widths based on policy(action) count
      const policyCount = activeSidebarItem?.policies?.length || 0;
      const policyMinPx = 270; // control width of columns
      const nameColWidth = policyCount === 0 ? '1fr' : '20%';
      const otherColWidth = `minmax(${policyMinPx}px, 1fr)`;
      columns[0].width = nameColWidth;

      const visibleRows =
        (activeTab === 'groups' ? filteredDataUsersGrp : filteredDataUsers) ||
        [];

      const handleHeaderToggle = (sidebarItem, checked) => {
        setCheckboxStates(prev => ({ ...prev, [sidebarItem.id]: checked }));

        if (checked) {
          const toAdd = visibleRows.map(row => ({
            id: row.id,
            identity: row.name,
          }));
          if (activeTab === 'groups') {
            setUsersActions(prev => ({
              ...prev,
              policies: prev.policies.map(policy =>
                policy.policyId === sidebarItem.id
                  ? { ...policy, userGroups: toAdd }
                  : policy
              ),
            }));
          } else {
            setUsersActions(prev => ({
              ...prev,
              policies: prev.policies.map(policy =>
                policy.policyId === sidebarItem.id
                  ? { ...policy, users: toAdd, userCount: toAdd.length }
                  : policy
              ),
            }));
          }
        } else {
          setUsersActions(prev => ({
            ...prev,
            policies: prev.policies.map(policy =>
              policy.policyId === sidebarItem.id
                ? activeTab === 'groups'
                  ? { ...policy, userGroups: [] }
                  : { ...policy, users: [], userCount: 0 }
                : policy
            ),
          }));
        }
      };

      const handleRowToggle = (check, item, sidebarItem) => {
        if (activeTab === 'groups') {
          if (check) {
            setUsersActions(prev => ({
              ...prev,
              policies: prev.policies.map(policy =>
                policy.policyId === sidebarItem?.id
                  ? {
                      ...policy,
                      userGroups: policy.userGroups.some(
                        group => group.id === item.id
                      )
                        ? policy.userGroups
                        : [
                            ...policy.userGroups,
                            { id: item.id, identity: item.name },
                          ],
                    }
                  : policy
              ),
            }));
          } else {
            setUsersActions(prev => ({
              ...prev,
              policies: prev.policies.map(policy =>
                policy.policyId === sidebarItem?.id
                  ? {
                      ...policy,
                      userGroups: policy.userGroups.filter(
                        group => group.id !== item.id
                      ),
                    }
                  : policy
              ),
            }));
          }
        } else {
          if (check) {
            setUsersActions(prev => ({
              ...prev,
              policies: prev.policies.map(policy =>
                policy.policyId === sidebarItem.id
                  ? {
                      ...policy,
                      users: [
                        ...policy.users,
                        { id: item.id, identity: item.name },
                      ],
                      userCount: policy.userCount + 1,
                    }
                  : policy
              ),
            }));
          } else {
            setUsersActions(prev => ({
              ...prev,
              policies: prev.policies.map(policy =>
                policy.policyId === sidebarItem.id
                  ? {
                      ...policy,
                      users: policy.users.filter(user => user.id !== item.id),
                      userCount: policy.userCount - 1,
                    }
                  : policy
              ),
            }));
          }
        }
      };

      activeSidebarItem?.policies?.forEach((sidebarItem, index) => {
        const targetPolicy = usersActions?.policies?.find(
          policy => policy.policyId === sidebarItem.id
        );
        const targetArr =
          activeTab === 'groups'
            ? targetPolicy?.userGroups || []
            : targetPolicy?.users || [];

        const visibleIds = visibleRows.map(r => r.id);
        const isAllSelected =
          visibleRows.length > 0 &&
          visibleIds.every(id => targetArr.some(target => target.id === id));
        const isSomeSelected =
          visibleRows.length > 0 &&
          visibleIds.some(id => targetArr.some(target => target.id === id)) &&
          !isAllSelected;
        const headerDisabled = visibleRows.length === 0;

        columns.push({
          label: (
            <div
              className="d-flex justify-content-center gap-1 ms-1"
              style={{
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <CheckboxField
                name={`name-${sidebarItem.id}`}
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                disabled={headerDisabled}
                onCheckBoxChange={e =>
                  handleHeaderToggle(sidebarItem, e.target.checked)
                }
                data-tooltip-id={`name-${
                  activeSidebarItem?.hasSubNames
                    ? activeSidebarItem?.policies?.[index]?.subName
                    : sidebarItem?.actionName
                }`}
              />
              <ReactTooltip
                id={`name-${
                  activeSidebarItem?.hasSubNames
                    ? activeSidebarItem?.policies?.[index]?.subName
                    : sidebarItem?.actionName
                }`}
                place="bottom"
                effect="solid"
                content="Select All"
                style={{
                  width: 'auto',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              />
              <span>
                {activeSidebarItem?.hasSubNames
                  ? activeSidebarItem?.policies?.[index]?.subName
                  : sidebarItem?.actionName}
              </span>
            </div>
          ),
          renderCell: item => {
            const permissionExists = targetArr.some(obj => obj.id === item?.id);

            return (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CheckboxField
                  name={`${sidebarItem?.actionName}-${item.name}`}
                  checked={permissionExists}
                  onChange={e => {
                    handleRowToggle(e.target.checked, item, sidebarItem);
                  }}
                  data-tooltip-id={`name-${sidebarItem.id}`}
                />
                <ReactTooltip
                  id={`name-${sidebarItem?.id}`}
                  place="bottom"
                  effect="solid"
                  content="Select"
                  style={{
                    width: 'auto',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </div>
            );
          },
          width: otherColWidth,
        });
      });

      return columns;
    };

    return createDynamicColumns(
      activeTab === 'groups' ? 'All Groups' : 'All Users'
    );
  }, [
    activeSidebarItem,
    policiesAndActions,
    activeTab,
    usersActions,
    checkboxStates,
    filteredDataUsers,
    filteredDataUsersGrp,
  ]);

  useEffect(() => {
    setGroupsColumns(dynamicColumns);
    setUsersColumns(dynamicColumns);
  }, [dynamicColumns]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedCluster?.value) {
      dispatch(
        RolesActions.fetchClusterUsers({
          clusterId: selectedCluster?.value,
        })
      );

      dispatch(
        RolesActions.fetchClusterNiFiPolicies({
          clusterId: selectedCluster?.value,
        })
      );
    } else {
      toast.info('Please login to the cluster.');
    }
  }, [dispatch, selectedCluster]);

  useEffect(() => {
    if (!isEmpty(activeSidebarItem)) {
      const actionPayload = activeSidebarItem?.policies?.map(
        ele => ele?.action
      );
      const subPayload = activeSidebarItem?.policies?.map(
        ele => ele?.subResource
      );
      const payload = {
        id: selectedCluster?.value,
        descriptionPayload: {
          action: activeSidebarItem?.hasSubNames ? ['write'] : actionPayload,
          resource: activeSidebarItem?.type,
          ...(activeSidebarItem?.hasSubNames && {
            subResource: subPayload,
          }),
        },
      };
      if (selectedCluster?.value) {
        dispatch(
          RolesActions.fetchPoliciesandActions({
            payload,
          })
        );
      }
    }
  }, [selectedCluster?.value, activeSidebarItem]);

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab, activeSidebarItem]);

  const groupOptions = [
    { label: 'All', value: 'all' },
    ...(clusterUsers?.userGroups?.map(ele => ({
      label: ele?.identity,
      value: ele?.id,
    })) || []),
  ];

  const handleSavePermission = () => {
    const actionPayload = activeSidebarItem?.policies?.map(ele => ele?.action);
    const subPayload = activeSidebarItem?.policies?.map(
      ele => ele?.subResource
    );
    const updatedAPIpayload = {
      action: activeSidebarItem?.hasSubNames ? ['write'] : actionPayload,
      resource: activeSidebarItem?.type,
      ...(activeSidebarItem?.hasSubNames && {
        subResource: subPayload,
      }),
    };
    const payload = {
      id: selectedCluster?.value,
      descriptionPayload: usersActions,
      updatedAPIpayload,
      forCluster: true,
      changeFlags: {
        usersAssignedChanged: hasUserChanges,
        groupsAssignedChanged: hasUserGroupChanges,
      },
      selectedPolicyName: activeSidebarItem?.name,
    };

    dispatch(RolesActions.updateClusterPermissionsAndActions(payload));
    setHasUserChanges(false);
    setHasUserGroupChanges(false);
    setInitialUsersActions(usersActions);
  };

  const getSearchPlaceholder = () => {
    if (activeTab === 'groups') return 'Select Group Names';
    if (activeTab === 'users') return 'Select User Names';
    return 'Search';
  };

  const shouldEnableSave = () => {
    if (activeTab === 'users') {
      return hasUserChanges;
    } else {
      return hasUserGroupChanges;
    }
  };

  return (
    <>
      <FullPageLoader loading={loading || loading2 || loading3 || loading4} />
      <Flex className="mb-3">
        <Flex>
          <Title>Cluster Access Management</Title>
        </Flex>
        {selectedCluster?.value && (
          <ButtonsContainer>
            <Button
              size="sm"
              disabled={isEmpty(activeSidebarItem) || !shouldEnableSave()}
              onClick={() => {
                handleSavePermission();
              }}
            >
              Save Changes
            </Button>
          </ButtonsContainer>
        )}
      </Flex>
      <Container>
        {selectedCluster?.value ? (
          <MainContent className="gap-3">
            <Sidebar>
              <LeftsidebarScroll className="overflow-y-auto">
                <>
                  <LeftSidebarHeading>Policies</LeftSidebarHeading>
                  {sidebarItems.map(item => (
                    <SidebarItem
                      key={item?.name}
                      active={activeSidebarItem?.name === item?.name}
                      onClick={() => handleSidebarClick(item)}
                    >
                      {item?.name}
                    </SidebarItem>
                  ))}
                </>
              </LeftsidebarScroll>
            </Sidebar>

            <ContentArea>
              {
                <>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ borderBottom: '1px solid #e9ecef' }}
                  >
                    <TabContainer>
                      <Tab
                        active={activeTab === 'groups'}
                        onClick={() => handleTabSwitch('groups')}
                      >
                        <TabIcon>
                          <GroupUserIcon
                            color={
                              activeTab === 'groups' ? '#f0701a' : '#6c757d'
                            }
                          />
                        </TabIcon>
                        Groups
                      </Tab>
                      <Tab
                        active={activeTab === 'users'}
                        onClick={() => handleTabSwitch('users')}
                      >
                        <TabIcon>
                          <NewUserIcon
                            color={
                              activeTab === 'users' ? '#f0701a' : '#6c757d'
                            }
                          />
                        </TabIcon>
                        Users
                      </Tab>
                    </TabContainer>
                    {activeTab !== 'groups' && (
                      <SelectField
                        id="policy"
                        className="w-25 mb-0"
                        name="policy"
                        icon={<DocumentTextIcon />}
                        options={groupOptions || []}
                        value={selectedGroupDropdown}
                        placeholder={'Select Group'}
                        showCircleIcon={true}
                        sortAlphabetically={false}
                        onChange={handleGroupDropdownChange}
                      />
                    )}
                  </div>
                  {
                    <>
                      <SearchContainer>
                        <SmallSearchIcon
                          width={18}
                          height={18}
                          color={theme.colors.darkGrey1}
                        />
                        <Search
                          type="search"
                          placeholder={getSearchPlaceholder()}
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                      </SearchContainer>

                      <div
                        style={{
                          backgroundColor: '#F5F7FA',
                          borderRadius: '14px',
                        }}
                      >
                        <TableHeight
                          data={
                            isEmpty(activeSidebarItem)
                              ? []
                              : activeTab === 'groups'
                                ? filteredDataUsersGrp
                                : filteredDataUsers
                          }
                          columns={
                            isEmpty(activeSidebarItem)
                              ? []
                              : activeTab === 'groups'
                                ? groupsColumns
                                : usersColumns
                          }
                          className={
                            activeTab === 'groups'
                              ? 'groups-table'
                              : 'users-table'
                          }
                          emptyMessage={'No Data Found'}
                        />
                      </div>
                    </>
                  }
                </>
              }
            </ContentArea>
          </MainContent>
        ) : (
          <LoaderContainer>
            <NoDataIcon width={140} />
            <LoadingText>No Policies Available</LoadingText>
          </LoaderContainer>
        )}
      </Container>
    </>
  );
};

export default NiFiClusterAccessManagement;
