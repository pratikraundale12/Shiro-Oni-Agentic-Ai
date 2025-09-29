/*eslint-disable*/
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
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
  const clusterUsers = useSelector(RolesSelectors.getClusterUsers);
  console.log('Users and Groups:', clusterUsers);
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

  const clusterNiFiPolicies = useSelector(
    RolesSelectors.getClusterNiFiPolicies
  );
  const policiesAndActions = useSelector(
    RolesSelectors.getPoliciesAndActionsData
  );

  useEffect(() => {
    if (!isEmpty(usersActions)) {
      const isDifferent = arePoliciesDifferent(
        usersActions,
        policiesAndActions
      );
      setDisableSaveBtn(isDifferent);
    }
  }, [usersActions]);
  useEffect(() => {
    if (!isEmpty(policiesAndActions)) {
      setUsersActions(policiesAndActions);
    }
  }, [policiesAndActions]);

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

      const handlePropertyHeaderClick = (item, click) => {
        if (activeTab === 'groups') {
          setUsersActions(prevState => ({
            ...prevState,
            policies: prevState.policies.map(policy =>
              policy.policyId === item?.id
                ? { ...policy, userGroups: click ? rawGroup : [] }
                : policy
            ),
          }));
        } else {
          setUsersActions(prevState => ({
            ...prevState,
            policies: prevState.policies.map(policy =>
              policy.policyId === item?.id
                ? { ...policy, users: click ? rawUsers : [] }
                : policy
            ),
          }));
        }
      };
      const handleCheckboxChange = (item, checked) => {
        setCheckboxStates(prev => ({
          ...prev,
          [item.id]: checked,
        }));
        handlePropertyHeaderClick(item, checked);
      };

      activeSidebarItem?.policies?.forEach((sidebarItem, index) => {
        columns.push({
          label: (
            <>
              <div className="d-flex justify-content-center gap-1 ms-1">
                <CheckboxField
                  name={`name-${sidebarItem.id}`}
                  checked={checkboxStates[sidebarItem.id] || false}
                  onCheckBoxChange={e =>
                    handleCheckboxChange(sidebarItem, e.target.checked)
                  }
                />
                {activeSidebarItem?.hasSubNames
                  ? activeSidebarItem?.policies?.[index]?.subName
                  : sidebarItem?.actionName}
              </div>
            </>
          ),
          renderCell: item => {
            const targetPolicies = usersActions?.policies?.filter(
              ele => ele?.policyId === sidebarItem?.id
            );
            const targetUserArrBasedOnAction =
              activeTab === 'groups'
                ? targetPolicies?.[0]?.userGroups
                : targetPolicies?.[0]?.users;

            const permissionExists = targetUserArrBasedOnAction?.some(
              obj => obj.id === item?.id
            );
            const handleChangeCheck = (check, item, sidebarItem) => {
              if (activeTab === 'groups') {
                if (check) {
                  setUsersActions(prev => ({
                    ...prev,
                    policies: prev.policies.map(policy =>
                      policy.policyId === sidebarItem?.id
                        ? {
                            ...policy,
                            userGroups: policy.userGroups.some(
                              group => group.id === item?.id
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
                              group => group.id !== item?.id
                            ),
                          }
                        : policy
                    ),
                  }));
                }
              } else {
                if (check) {
                  setUsersActions(prevData => ({
                    ...prevData,
                    policies: prevData.policies.map(policy =>
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
                  setUsersActions(prevData => ({
                    ...prevData,
                    policies: prevData.policies.map(policy =>
                      policy.policyId === sidebarItem.id
                        ? {
                            ...policy,
                            users: policy.users.filter(
                              group => group.id !== item?.id
                            ),
                            userCount: policy.userCount - 1,
                          }
                        : policy
                    ),
                  }));
                }
              }
            };

            return (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CheckboxField
                  name={`${sidebarItem?.actionName}-${item.name}`}
                  checked={permissionExists}
                  onChange={e => {
                    handleChangeCheck(e.target.checked, item, sidebarItem);
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
    rawGroup,
    rawUsers,
  ]);

  useEffect(() => {
    setGroupsColumns(dynamicColumns);
    setUsersColumns(dynamicColumns);
  }, [dynamicColumns]);

  const dispatch = useDispatch();
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);

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

  const userGroupIdentities = clusterUsers?.userGroups?.map(name => {
    return {
      name: name?.identity,
      id: name?.id,
    };
  });

  const filteredDataUsersGrp = userGroupIdentities?.filter(item =>
    item?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
    };

    dispatch(RolesActions.updateClusterPermissionsAndActions(payload));
  };
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

  const handleSidebarClick = () => {
    setCheckboxStates(prev => {
      const resetStates = Object.keys(prev).reduce((acc, id) => {
        acc[id] = false;
        return acc;
      }, {});
      return resetStates;
    });
    setSelectedGroupDropdown({
      label: 'All',
      value: 'all',
    });
  };

  const getSearchPlaceholder = () => {
    if (activeTab === 'groups') return 'Select Group Names';
    if (activeTab === 'users') return 'Select User Names';
    return 'Search';
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
              disabled={isEmpty(activeSidebarItem) || !disableSaveBtn}
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
                {sidebarItems.map(item => (
                  <SidebarItem
                    key={item?.name}
                    active={activeSidebarItem?.name === item?.name}
                    onClick={() => {
                      setActiveSidebarItem(item);
                      handleSidebarClick();
                    }}
                  >
                    {item?.name}
                  </SidebarItem>
                ))}
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
                        onClick={() => {
                          setActiveTab('groups');
                          handleSidebarClick();
                        }}
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
                        onClick={() => {
                          setActiveTab('users');
                          handleSidebarClick();
                        }}
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
                        onChange={e => {
                          setSelectedGroupDropdown(e);
                        }}
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
                          emptyMessage={
                            'No Data Found'
                            // !isEmpty(activeSidebarItem) &&
                            // isEmpty(filteredDataUsersGrp)
                            //   ? 'No Data Found'
                            //   : 'Select Any Policy'
                          }
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
