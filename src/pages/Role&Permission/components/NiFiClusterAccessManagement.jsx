/*eslint-disable*/
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Button, CheckboxField } from '../../../shared';
import { FullPageLoader, Table } from '../../../components';
import GroupUserIcon from '../../../assets/Icons/GroupUserIcon';
import NewUserIcon from '../../../assets/Icons/NewUserIcon';
import {
  LoadingSelectors,
  NamespacesSelectors,
  RolesActions,
  RolesSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { theme } from '../../../styles';

const Container = styled.div`
  background-color: #fbfcff;
  overflow: hidden;
  border: 1px solid #dde4f0;
  padding: 20px 15px;
  border-radius: 20px;
`;

const MainContent = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  min-width: 280px;
  background-color: #f8f9fa;
  border: 1px solid #dde4f0;
  border-radius: 20px;
  padding: 14px 6px;
  overflow: hidden;
`;

const SidebarItem = styled.div`
  padding: 10px 12px;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #444445;
  cursor: pointer;
  border-bottom: 1px solid #e9ecef;

  ${props =>
    props.active &&
    `
    background-color: #fff3e0;
    color: #ff6b35;
    font-weight: 500;
  `}

  &:hover {
    background-color: #f1f3f4;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 0;
  overflow: auto;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e9ecef;
  background-color: white;
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
    color: #ff6b35;
    border-bottom-color: #ff6b35;
  `}
`;

const TabIcon = styled.span`
  font-size: 16px;
`;

const SearchContainer = styled.div`
  padding: 16px 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;

  &::placeholder {
    color: #6c757d;
  }

  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
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

const NiFiClusterAccessManagement = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [activeSidebarItem, setActiveSidebarItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupsColumns, setGroupsColumns] = useState([]);
  const [usersColumns, setUsersColumns] = useState([]);
  const [usersActions, setUsersActions] = useState([]);
  const clusterNiFiPolicies = useSelector(
    RolesSelectors.getClusterNiFiPolicies
  );
  const policiesAndActions = useSelector(
    RolesSelectors.getPoliciesAndActionsData
  );
  useEffect(() => {
    if (!isEmpty(policiesAndActions)) {
      setUsersActions(policiesAndActions);
    }
  }, [policiesAndActions]);

  const sidebarItems = [
    ...(clusterNiFiPolicies?.accessPolicies?.map(policy => policy) || []),
  ];

  const dynamicColumns = useMemo(() => {
    function getEqualParts(num) {
      if (!num || num <= 0) return 0;
      return +(100 / num).toFixed(2);
    }

    const createDynamicColumns = nameColumnLabel => {
      const columns = [
        {
          label: nameColumnLabel,
          renderCell: item => (
            <div style={{ fontSize: '14px', color: '#212529' }}>
              {item.name}
            </div>
          ),
          width: `12%`,
        },
      ];
      activeSidebarItem?.policies?.forEach((sidebarItem, index) => {
        columns.push({
          label: activeSidebarItem?.hasSubNames
            ? activeSidebarItem?.policies?.[index]?.subName
            : sidebarItem?.actionName,
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

          width: `20%`,
        });
      });

      return columns;
    };

    return createDynamicColumns(
      activeTab === 'groups' ? 'All Groups' : 'All Users'
    );
  }, [activeSidebarItem, policiesAndActions, activeTab, usersActions]);

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
      toast.info('Please login to cluster');
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

  const clusterUsers = useSelector(RolesSelectors.getClusterUsers);
  const userIdentities = clusterUsers?.nifiUsers?.map(name => {
    return {
      name: name?.identity,
      id: name?.id,
    };
  });
  const filteredDataUsers = userIdentities?.filter(item =>
    item?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  return (
    <>
      <FullPageLoader loading={loading || loading2 || loading3 || loading4} />
      <Flex className="mb-4">
        <Flex>
          <Title>Cluster Access Management</Title>
        </Flex>
        <ButtonsContainer>
          <Button
            size="sm"
            disabled={isEmpty(activeSidebarItem)}
            onClick={() => {
              handleSavePermission();
            }}
          >
            Save Changes
          </Button>
        </ButtonsContainer>
      </Flex>
      <Container>
        <MainContent className="gap-3">
          <Sidebar>
            <LeftsidebarScroll className="overflow-y-auto">
              {sidebarItems.map(item => (
                <SidebarItem
                  key={item?.name}
                  active={activeSidebarItem?.name === item?.name}
                  onClick={() => setActiveSidebarItem(item)}
                >
                  {item?.name}
                </SidebarItem>
              ))}
            </LeftsidebarScroll>
          </Sidebar>

          <ContentArea>
            {
              <>
                <TabContainer>
                  <Tab
                    active={activeTab === 'groups'}
                    onClick={() => setActiveTab('groups')}
                  >
                    <TabIcon>
                      <GroupUserIcon />
                    </TabIcon>
                    Groups
                  </Tab>
                  <Tab
                    active={activeTab === 'users'}
                    onClick={() => setActiveTab('users')}
                  >
                    <TabIcon>
                      <NewUserIcon />
                    </TabIcon>
                    Users
                  </Tab>
                </TabContainer>
                {
                  <>
                    <SearchContainer>
                      <SearchInput
                        type="text"
                        placeholder="Search Names"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </SearchContainer>

                    <div
                      style={{
                        backgroundColor: theme.colors.darkGrey3,
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
                          !isEmpty(activeSidebarItem) &&
                          isEmpty(filteredDataUsersGrp)
                            ? 'No Data Found'
                            : 'Select Any Policy'
                        }
                      />
                    </div>
                  </>
                }
              </>
            }
          </ContentArea>
        </MainContent>
      </Container>
    </>
  );
};

export default NiFiClusterAccessManagement;
