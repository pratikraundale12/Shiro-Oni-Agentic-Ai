import React from 'react';
import SetupClusterWrapper from './ClusterSetupWrapper';
import SetupClusterGettingStartedWrapper from './SetupClusterGettingStartedWraper';
import { useSelector } from 'react-redux';
import { ClustersSelectors } from '../../../store';
import SetupClusterManageHostWrapper from './SetupClusterManageHostWrapper';
import SetupClusterManageConfigWrapper from './SetupClusterManageConfigWrapper';
import ManageTrustoreCertificateTab from './ManageTrustoreCertificate';

const SetupClusterPage = () => {
  const activeSelectedTab = useSelector(
    ClustersSelectors.getActiveTabClusterSetup
  );
  return (
    <>
      {activeSelectedTab === 'getting_started' && (
        <SetupClusterGettingStartedWrapper activeTab={activeSelectedTab} />
      )}
      {activeSelectedTab === 'cluster_details' && (
        <SetupClusterWrapper activeTab={activeSelectedTab} />
      )}
      {activeSelectedTab === 'manage_host' && (
        <SetupClusterManageHostWrapper activeTab={activeSelectedTab} />
      )}
      {activeSelectedTab === 'manage_config' && (
        <SetupClusterManageConfigWrapper activeTab={activeSelectedTab} />
      )}
      {activeSelectedTab === 'manage_trustore_certificate' && (
        <ManageTrustoreCertificateTab activeTab={activeSelectedTab} />
      )}
    </>
  );
};
export default SetupClusterPage;
