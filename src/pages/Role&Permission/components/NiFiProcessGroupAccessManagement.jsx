import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  Button,
  CheckboxField,
  SelectField,
  SwitchButton,
} from '../../../shared';
import { FullPageLoader, Table } from '../../../components';
import GroupUserIcon from '../../../assets/Icons/GroupUserIcon';
import NewUserIcon from '../../../assets/Icons/NewUserIcon';
import {
  GridActions,
  GridSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
  RolesActions,
  RolesSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { DocumentTextIcon, SmallSearchIcon } from '../../../assets';
import { isEmpty } from 'lodash';
import Breadcrumb from '../../../shared/Breadcrumb';
import { theme } from '../../../styles';
import Hierarchy from '../../../assets/Icons/Hierarchy';

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
  display: flex;
  justify-content: space-between;
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
    background-color: #E4842B;
    color: #fff;
    font-weight: 500;
  `}

  ${props =>
    props.disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}

  &:hover {
    background-color: ${props => (props.disabled ? 'transparent' : '#E4842B')};
    color: #fff;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 0;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
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

const BreadcrumbContainer = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #444445;
  align-items: center;
`;

const SidebarButton = styled.button`
  padding: 3px;
  border-radius: 100%;
`;

const NiFiProcessGroupAccessManagement = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [grpsData, setGrpsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  const clusterNiFiPolicies = useSelector(
    RolesSelectors.getClusterNiFiPolicies
  );
  const processGroupList = useSelector(state =>
    GridSelectors.getGridData(state, 'namespaces')
  );
  const [activeSidebarItem, setActiveSidebarItem] = useState(
    processGroupList[0]
  );
  const namespaces = useSelector(NamespacesSelectors.getNamespacesAllData);
  const clusterUsers = useSelector(RolesSelectors.getClusterUsers);
  const groupsPerPolicies = useSelector(RolesSelectors.getFlowPolicyDetails);

  useEffect(() => {
    if (processGroupList && processGroupList.length > 0 && !activeSidebarItem) {
      setActiveSidebarItem(processGroupList[0]);
      // Clear any existing checkbox data when component first loads
      setGrpsData([]);
      setUsersData([]);
      setSelectedPolicy(null);
    }
  }, [processGroupList, activeSidebarItem]);

  useEffect(() => {
    if (selectedCluster?.value) {
      dispatch(
        RolesActions.fetchClusterNiFiPolicies({
          clusterId: selectedCluster?.value,
        })
      );
    }
  }, [dispatch, selectedCluster?.value]);

  useEffect(() => {
    // Only set data if a policy is selected
    if (selectedPolicy && !isEmpty(groupsPerPolicies?.userGroups)) {
      setGrpsData(groupsPerPolicies?.userGroups);
    } else {
      setGrpsData([]);
    }
  }, [groupsPerPolicies?.userGroups, selectedPolicy]);

  useEffect(() => {
    // Only set data if a policy is selected
    if (selectedPolicy && !isEmpty(groupsPerPolicies?.users)) {
      setUsersData(groupsPerPolicies?.users);
    } else {
      setUsersData([]);
    }
  }, [groupsPerPolicies?.users, selectedPolicy]);

  // Filter policies based on selected process group
  const getFilteredPolicies = useCallback(() => {
    if (!activeSidebarItem?.id || !clusterNiFiPolicies?.flowPolicies) {
      return [];
    }

    const processGroupPolicies = clusterNiFiPolicies.flowPolicies.find(
      policyGroup => policyGroup['process-group-id'] === activeSidebarItem.id
    );

    return (
      processGroupPolicies?.policies?.map(policy => ({
        value: policy.id,
        label: policy.descriptor,
        ...policy,
      })) || []
    );
  }, [activeSidebarItem?.id, clusterNiFiPolicies?.flowPolicies]);

  const getRootFilteredPolicies = useCallback(() => {
    if (
      !processGroupList?.[0]?.parentGroupId ||
      !clusterNiFiPolicies?.flowPolicies
    ) {
      return [];
    }

    const processGroupPolicies = clusterNiFiPolicies.flowPolicies.find(
      policyGroup =>
        policyGroup['process-group-id'] === processGroupList?.[0]?.parentGroupId
    );

    return (
      processGroupPolicies?.policies?.map(policy => ({
        value: policy.id,
        label: policy.descriptor,
        ...policy,
      })) || []
    );
  }, [processGroupList?.[0]?.parentGroupId, clusterNiFiPolicies?.flowPolicies]);

  const policyList = isSwitchEnabled
    ? getRootFilteredPolicies()
    : getFilteredPolicies();

  const handleSidebarClick = item => {
    setActiveSidebarItem(item);
    setSelectedPolicy(null);
    // Clear checkbox data when switching process groups
    setGrpsData([]);
    setUsersData([]);
    dispatch(
      RolesActions.fetchClusterNiFiPolicies({
        clusterId: selectedCluster?.value,
      })
    );
  };

  useEffect(() => {
    if (selectedCluster?.value) {
      // Fetch users for a specific cluster
      dispatch(
        RolesActions.fetchClusterUsers({
          clusterId: selectedCluster?.value,
        })
      );
      // Fetch process groups for a specific cluster
      dispatch(
        GridActions.fetchGrid({
          module: 'namespaces',
          clusterId: selectedCluster?.value,
        })
      );
    }
  }, [dispatch, selectedCluster]);

  const handlePolicyChange = value => {
    setSelectedPolicy(value);
    //response ke baad
    dispatch(
      RolesActions.fetchFlowPolicyDetails({
        clusterId: selectedCluster?.value,
        namespaceId:
          activeSidebarItem?.id || processGroupList?.[0]?.parentGroupId,
        params: {
          action: value?.action,
          resource: value?.preProcessGroupSegment,
        },
      })
    );
  };

  // Access the users in your component
  const userIdentities = clusterUsers?.nifiUsers?.map(name => {
    return {
      identity: name?.identity,
      id: name?.id,
    };
  });
  const filteredDataUsers = userIdentities?.filter(item =>
    item?.identity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userGroupIdentities = clusterUsers?.userGroups?.map(name => {
    return {
      identity: name?.identity,
      id: name?.id,
    };
  });

  const filteredDataUsersGrp = userGroupIdentities?.filter(item =>
    item?.identity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLUMN = [
    {
      label: activeTab === 'groups' ? 'All Groups' : 'All Users',
      renderCell: item => (
        <div style={{ fontSize: '14px', color: '#212529' }}>
          {item.identity}
        </div>
      ),
      width: '50%',
    },
    {
      label: 'Permission',
      renderCell: item => {
        // Only show checked state if a policy is selected
        let hasPermission =
          selectedPolicy && grpsData.some(ele => ele?.id === item?.id);
        let hasUserPermission =
          selectedPolicy && usersData.some(ele => ele?.id === item?.id);

        const handleChangeCheck = (check, item) => {
          // Check if no policy is selected and user is trying to check the checkbox
          if (check && !selectedPolicy) {
            toast.warning('Please select policy');
            return;
          }

          if (check) {
            setGrpsData(prev => [...prev, item]);
            setUsersData(prev => [...prev, item]);
          } else {
            setGrpsData(prevItems =>
              prevItems.filter(ele => ele.id !== item?.id)
            );
            setUsersData(prevItems =>
              prevItems.filter(ele => ele.id !== item?.id)
            );
          }
        };

        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CheckboxField
              name={`${item?.id}`}
              checked={
                selectedPolicy ? hasPermission || hasUserPermission : false
              }
              onChange={e => {
                handleChangeCheck(e.target.checked, item);
              }}
            />
          </div>
        );
      },
      width: '50%',
    },
  ];
  const handleSavePermission = () => {
    const { policyId, revision } = groupsPerPolicies;
    const subPayload = {
      policyId,
      revision,
      users: usersData,
      userGroups: grpsData,
    };

    const descriptionPayload = {
      policies: [subPayload],
      resource: selectedPolicy?.resource,
    };
    const payload = {
      id: selectedCluster?.value,
      descriptionPayload,
      selectedPolicy,
      activeSidebarItem,
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
    LoadingSelectors.getLoading(state, 'fetchFlowPolicyDetails')
  );
  const loading4 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'updateClusterPermissionsAndActions')
  );
  const loading5 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchNamespaces')
  );

  const handleSwitchChange = e => {
    setActiveSidebarItem(null);
    setIsSwitchEnabled(e.target.checked);
    if (!isSwitchEnabled) {
      dispatch(
        RolesActions.fetchClusterNiFiPolicies({
          clusterId: selectedCluster?.value,
        })
      );
    }
  };

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab, activeSidebarItem]);

  // Clear checkbox data when no policy is selected
  useEffect(() => {
    if (!selectedPolicy) {
      setGrpsData([]);
      setUsersData([]);
    }
  }, [selectedPolicy]);

  // Show toast message when no cluster is selected
  useEffect(() => {
    if (!selectedCluster?.value) {
      toast.info('Please login to cluster');
    }
  }, [selectedCluster]);

  const handleChildProcessGroupClick = (e, item) => {
    e.stopPropagation();
    dispatch(
      NamespacesActions.setSelectedNamespace({
        label: item.name,
        value: item.id,
      })
    );
    dispatch(NamespacesActions.fetchNamespaces());
  };

  return (
    <>
      <FullPageLoader
        loading={loading || loading2 || loading3 || loading4 || loading5}
      />
      <Flex className="mb-4">
        <Flex>
          <Title>Process Group Access Management</Title>
        </Flex>
        <div className="d-flex align-items-center justify-content-end gap-xl-3 gap-2">
          {selectedCluster?.value && (
            <div>
              <SwitchButton
                id="openModalInput1"
                name="NiFi Root Policy"
                checked={isSwitchEnabled}
                onChange={handleSwitchChange}
                isDisabled={false}
              />
            </div>
          )}
          <ButtonsContainer>
            <Button
              size="sm"
              onClick={() => {
                handleSavePermission();
              }}
              disabled={isEmpty(selectedPolicy)}
            >
              Save Changes
            </Button>
          </ButtonsContainer>
        </div>
      </Flex>
      <Container>
        <MainContent className="gap-3">
          <Sidebar>
            <LeftsidebarScroll className="overflow-y-auto">
              {isEmpty(namespaces?.data) &&
                processGroupList.map(item => (
                  <SidebarItem
                    key={item?.id}
                    active={activeSidebarItem?.id === item?.id}
                    disabled={isSwitchEnabled}
                    onClick={() => !isSwitchEnabled && handleSidebarClick(item)}
                  >
                    {item?.name}
                    <SidebarButton
                      type="button"
                      onClick={e => handleChildProcessGroupClick(e, item)}
                      className="ml-2"
                    >
                      <Hierarchy />
                    </SidebarButton>
                  </SidebarItem>
                ))}
              {!isEmpty(namespaces?.data) &&
                namespaces?.data?.map(item => (
                  <span key={item?.id}>
                    {!item?.isProcessor && (
                      <SidebarItem
                        active={activeSidebarItem?.id === item?.id}
                        disabled={isSwitchEnabled}
                        onClick={() =>
                          !isSwitchEnabled && handleSidebarClick(item)
                        }
                      >
                        {item?.name}
                        <SidebarButton
                          type="button"
                          onClick={e => handleChildProcessGroupClick(e, item)}
                          className="ml-2"
                        >
                          <Hierarchy />
                        </SidebarButton>
                      </SidebarItem>
                    )}
                  </span>
                ))}
            </LeftsidebarScroll>
          </Sidebar>

          <ContentArea>
            <BreadcrumbContainer className="d-flex  mb-3 mt-3">
              <Breadcrumb
                module="role_permission"
                path={
                  namespaces?.breadcrumb?.map(item => ({
                    label: item.name,
                    value: item.id,
                    id: item.id,
                  })) || []
                }
                activeSidebarItem={activeSidebarItem}
              />
            </BreadcrumbContainer>
            <TabContainer>
              <div className="d-flex">
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
              </div>
              <SelectField
                id="policy"
                className="w-25"
                name="policy"
                icon={<DocumentTextIcon />}
                options={policyList}
                value={selectedPolicy}
                placeholder={
                  policyList.length === 0
                    ? 'No policies available'
                    : 'Select Policy'
                }
                disabled={policyList.length === 0}
                showCircleIcon={true}
                sortAlphabetically={false}
                onChange={handlePolicyChange}
              />
            </TabContainer>
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
                    placeholder={`search ${activeTab}`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </SearchContainer>

                <div>
                  <TableHeight
                    data={
                      activeTab === 'groups'
                        ? filteredDataUsersGrp
                        : filteredDataUsers
                    }
                    columns={COLUMN}
                    className={
                      activeTab === 'groups' ? 'groups-table' : 'users-table'
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
          </ContentArea>
        </MainContent>
      </Container>
    </>
  );
};

export default NiFiProcessGroupAccessManagement;
