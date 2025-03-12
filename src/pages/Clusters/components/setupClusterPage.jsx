import React, { useState } from 'react';
import SetupClusterWrapper from './ClusterSetupWrapper';

import ClusterDetailTab from './ClusterDetailTab';
import ClusterSetupGettingStartedTab from './ClusterSetupGettingStarted';

const SetupClusterPage = () => {
  const [activeTab, setAtiveTab] = useState('getting_started');
  return (
    <SetupClusterWrapper setAtiveTab={setAtiveTab} activeTab={activeTab}>
      {activeTab === 'getting_started' && (
        <>
          <ClusterSetupGettingStartedTab />
        </>
      )}
      {activeTab === 'cluster_details' && (
        <>
          <ClusterDetailTab />
        </>
      )}
    </SetupClusterWrapper>
  );
};
export default SetupClusterPage;
