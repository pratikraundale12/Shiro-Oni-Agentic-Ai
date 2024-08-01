/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Title } from './components/Title';
import { AddNewCluster } from './components/AddNewCluster';
import { AddRegistry } from './components/AddRegistry';
import { AddNewRegistry } from './components/AddNewRegistry';

const AddClusterContainer = styled.div`
  height: calc(100vh - 78px);
  width: calc(100vw - 250px);
  overflow: hidden;
  padding: 25px 50px 22px 20px;
  --bs-bg-opacity: 1;
  background-color: rgba(var(--bs-white-rgb), var(--bs-bg-opacity)) !important;
`;

const ToptabsContainer = styled.div`
  border-radius: 20px 20px 0 0;
  background-color: ${props => props.theme.colors.lightGrey};
  padding: 10px 0 0 0;
`;

const NavTabs = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};

  display: flex;

  .nav-link {
    border: 0;
    background: none;
    cursor: pointer;
    padding: 10px 15px;
    font-size: 16px;
    color: #000;
    transition:
      color 0.3s,
      border-bottom 0.3s;

    &.active {
      color: red;
      border-bottom: 2px solid red;
    }

    &:hover {
      color: red;
    }
  }
`;

const NavButton = styled.button`
  border: 0;
  background: none;
  cursor: pointer;
  padding: 10px 15px;
  font-size: 16px;
  color: #000;
  transition:
    color 0.3s,
    border-bottom 0.3s;

  &.active {
    color: red;
    border-bottom: 2AddClusterContainerpx solid red;
  }

  &:hover {
    color: red;
  }
`;

export const AddCluster = () => {
  // const { id } = useParams();
  const location = useLocation();
  const data = location.state || {};

  const [isEdit, setIsEdit] = useState(false);
  const [activeTab, setActiveTab] = useState('cluster');
  const [newRegistry, setNewRegistry] = useState(false);
  const [registryId, setRegistryId] = useState();
  const [clusterId, setClusterId] = useState();
  const [clusterData, setClusterData] = useState({
    id: data?.id || '',
    name: data.name || '',
    nifi_url: data.nifi_url || '',
    username: data.username || '',
    password: data.password || '',
    file: data.file || '',
    passphrase: data.passphrase || '',
  });
  const [registryData, setRegistryData] = useState({
    name: '',
    regsitry_url: '',
    username: '',
    password: '',
    file: '',
    passphrase: '',
  });

  // const handleTabClick = tab => {
  //   setActiveTab(tab);
  // };

  console.log('CLUSTERDATA.....................?????????????', clusterData);
  console.log('REGISTRYDATA.....................?????????????', registryData);
  useEffect(() => {
    if (data?.id) {
      console.log('ifffffff', data);
      setIsEdit(true);
      setRegistryId(data?.registry_id || '');
      setClusterId(data?.id);
    }
  }, []);
  return (
    <AddClusterContainer>
      <Title
        title={isEdit ? 'Edit cluster Details' : 'Add New Cluster Details'}
      />
      <ToptabsContainer>
        <NavTabs className="nav nav-tabs" id="nav-tab" role="tablist">
          <NavButton
            className={`nav-link ${activeTab === 'cluster' ? 'active' : ''}`}
            id="nav-cluster-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-cluster"
            type="button"
            role="tab"
            aria-controls="nav-cluster"
            aria-selected={activeTab === 'cluster'}
            // onClick={() => handleTabClick('cluster')}
          >
            Cluster Details
          </NavButton>
          <NavButton
            className={`nav-link ${activeTab === 'registry' ? 'active' : ''}`}
            id="nav-registry-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-registry"
            type="button"
            role="tab"
            aria-controls="nav-registry"
            aria-selected={activeTab === 'registry'}
            // onClick={() => handleTabClick('registry')}
          >
            Registry Details
          </NavButton>
        </NavTabs>
      </ToptabsContainer>

      {activeTab === 'cluster' && !newRegistry && (
        <AddNewCluster
          setActiveTab={setActiveTab}
          setClusterData={setClusterData}
          clusterData={clusterData}
          isEdit={isEdit}
          clusterId={clusterId}
        />
      )}
      {activeTab === 'registry' && !newRegistry && (
        <AddRegistry
          setNewRegistry={setNewRegistry}
          registryData={registryData}
          clusterData={clusterData}
          setRegistryData={setRegistryData}
          setActiveTab={setActiveTab}
          isEdit={isEdit}
          registry_id={registryId}
          clusterId={clusterId}
        />
      )}
      {newRegistry && (
        <AddNewRegistry
          setActiveTab={setActiveTab}
          setRegistryData={setRegistryData}
          registryData={registryData}
          setNewRegistry={setNewRegistry}
          clusterData={clusterData}
          setActiveTab={setActiveTab}
          isEdit={isEdit}
          clusterId={clusterId}
          registry_id={registryId}
        />
      )}
    </AddClusterContainer>
  );
};
