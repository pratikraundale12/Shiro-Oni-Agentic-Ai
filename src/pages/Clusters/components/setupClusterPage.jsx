import React, { useState } from 'react';
import SetupClusterWrapper from './ClusterSetupWrapper';

import ClusterDetailTab from './ClusterDetailTab';
import ClusterSetupGettingStartedTab from './ClusterSetupGettingStarted';
import SetupClusterGettingStartedWrapper from './SetupClusterGettingStartedWraper';

const SetupClusterPage = () => {
  const [activeTab, setAtiveTab] = useState('getting_started');
  console.log(activeTab, 'activeTab');

  return (
    <>
      {activeTab === 'getting_started' && (
        <SetupClusterGettingStartedWrapper
          setAtiveTab={setAtiveTab}
          activeTab={activeTab}
        />
      )}
      {activeTab === 'cluster_details' && (
        <SetupClusterWrapper setAtiveTab={setAtiveTab} activeTab={activeTab} />
      )}
    </>
  );
};
export default SetupClusterPage;
