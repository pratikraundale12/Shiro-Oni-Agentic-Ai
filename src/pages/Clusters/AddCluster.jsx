/* eslint-disable */

import React, { useState } from 'react';
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
  background-color: var(--col-F5F7FA);
  padding: 10px 0 0 0;
`;

const NavTabs = styled.div`
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
  const [activeTab, setActiveTab] = useState('cluster');
  const [newRegistry, setNewRegistry] = useState(false);
  const [clusterData, setClusterData] = useState({
    name: '',
    nifi_url: '',
    username: '',
    password: '',
    file: '',
    passphrase: '',
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

  return (
    <AddClusterContainer>
      <Title title="Add Cluster Details" />
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
        />
      )}
      {activeTab === 'registry' && !newRegistry && (
        <AddRegistry
          setNewRegistry={setNewRegistry}
          registryData={registryData}
          clusterData={clusterData}
          setRegistryData={setRegistryData}
          setActiveTab={setActiveTab}

        />
      )}
      {newRegistry && (
        <AddNewRegistry
          setActiveTab={setActiveTab}
          setRegistryData={setRegistryData}
          registryData={registryData}
          newRegistry={newRegistry}
          clusterData={clusterData}
          setActiveTab={setActiveTab}
        />
      )}
    </AddClusterContainer>
  );
};
