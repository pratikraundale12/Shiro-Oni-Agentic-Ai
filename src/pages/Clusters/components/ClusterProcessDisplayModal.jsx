/*eslint-disable*/
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  GridActions,
  LoadingSelectors,
} from '../../../store';
import { Button, ModalWithRightBtn } from '../../../shared';
import { FullPageLoader, Loader } from '../../../components';
import StepProgress from './ProgressSteps';
import { GreenRightCircleIcon } from '../../../assets';
import { toast } from 'react-toastify';

const Container = styled.div`
  max-height: 50vh;
  min-height: 30vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;
const StickyProgressBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  padding-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;
const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const StepHeaderText = styled.div`
  line-height: 40px;
  font-family: Red Hat Display;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0%;
  vertical-align: middle;
`;
const PercentageHeaderText = styled.div`
  line-height: 40px;
  font-family: Red Hat Display;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: ${prop => (prop.colorBlack ? '#444445' : '#06c270')};
`;
const PercentageSubHeaderText = styled.div`
  // line-height: 40px;
  font-family: Red Hat Display;
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #444445;
`;
const CreationmodelSteps = [
  { step: 'Connectivity check', status: 'completed' },
  { step: 'Certificate preparation', status: 'completed' },
  { step: 'Host preparation', status: 'completed' },
  { step: 'CSR generation', status: 'completed' },
  { step: 'Certificate signing', status: 'completed' },
  { step: 'Certificate deployment', status: 'completed' },
  { step: 'NiFi Configuration', status: 'completed' },
  { step: 'Custom metrics agent', status: 'completed' },
  { step: 'NiFi cluster flow election', status: 'completed' },
];
const deleteModalSteps = [
  {
    step: 'Connectivity check',
    status: 'completed',
  },
  {
    step: 'Service shutdown',
    status: 'completed',
  },
  {
    step: 'Directory cleanup',
    status: 'completed',
  },
];
const RestartModalSteps = [
  {
    step: 'Connectivity check',
    status: 'completed',
  },
  {
    step: 'Restart NiFi service',
    status: 'completed',
  },
  { step: 'NiFi cluster flow election', status: 'completed' },
];
const StopModalSteps = [
  {
    step: 'Connectivity check',
    status: 'completed',
  },
  {
    step: 'NiFi stop via systemd service',
    status: 'completed',
  },
];

const StartModalSteps = [
  {
    step: 'Connectivity check',
    status: 'completed',
  },
  {
    step: 'NiFi stop via systemd service',
    status: 'completed',
  },
  { step: 'NiFi cluster flow election', status: 'completed' },
];

const UpgradeModalSteps = [
  {
    step: 'Connectivity check',
    status: 'completed',
  },
  {
    step: 'Certificate preparation',
    status: 'completed',
  },
  {
    step: 'Host preparation',
    status: 'completed',
  },
  {
    step: 'CSR generation',
    status: 'completed',
  },
  {
    step: 'Certificate signing',
    status: 'completed',
  },
  {
    step: 'Certificate deployment',
    status: 'completed',
  },
  {
    step: 'NiFi Configuration',
    status: 'completed',
  },
  {
    step: 'Custom metrics agent',
    status: 'completed',
  },
  { step: 'NiFi cluster flow election', status: 'completed' },
];

const nodesUpdateModalSteps = [
  {
    step: 'Connectivity check',
    status: 'completed',
  },
  {
    step: 'Service shutdown',
    status: 'completed',
  },
  {
    step: 'Directory cleanup',
    status: 'completed',
  },
  {
    step: 'Certificate preparation',
    status: 'completed',
  },
  {
    step: 'Host preparation',
    status: 'completed',
  },
  {
    step: 'CSR generation',
    status: 'completed',
  },
  {
    step: 'Certificate signing',
    status: 'completed',
  },
  {
    step: 'Certificate deployment',
    status: 'completed',
  },
  {
    step: 'NiFi Configuration',
    status: 'completed',
  },
  {
    step: 'Custom metrics',
    status: 'completed',
  },
  { step: 'NiFi cluster flow election', status: 'completed' },
  {
    step: 'NiFi cluster deployment',
    status: 'completed',
  },
];

const RegistryModalSteps = [
  {
    step: 'Connectivity check',
    status: 'completed',
  },
  {
    step: 'Certificate preparation',
    status: 'completed',
  },
  {
    step: 'Host preparation',
    status: 'completed',
  },
  {
    step: 'CSR generation',
    status: 'completed',
  },
  {
    step: 'Certificate signing',
    status: 'completed',
  },
  {
    step: 'Certificate deployment',
    status: 'completed',
  },
  {
    step: 'NiFi Configuration',
    status: 'completed',
  },
  {
    step: 'Custom metrics agent',
    status: 'completed',
  },
];
export const ClusterProcessDisplayModal = ({
  isProcessModalOpen,
  setIsProcessModalOpen,
  setSelectedCluster,
  selectedCluster,
  sortingState,
}) => {
  const dispatch = useDispatch();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isInitialisaitionPhase, setIsInitialisaitionPhase] = useState(false);
  const [initialisingTime, setInitialisingTime] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const isModalOpen = useSelector(
    ClustersSelectors.getProgressTrackingModalOpen
  );
  const progressStageRef = useRef(null);
  const ansibleClusterCreationData = useSelector(
    ClustersSelectors.getansibleClusterCreationResponseData
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'checkCredentialsClusterSetup')
  );
  const processData = useSelector(
    ClustersSelectors.getAnsibleClusterProgressData
  );
  const currentSteps = processData?.data?.steps?.map(ele => ({
    status: ele.status,
    step: ele?.step,
  }));

  const processExeName =
    selectedCluster?.process_name || ansibleClusterCreationData?.process_name;
  const getReferencObjectForComparison = processExeName => {
    if (processExeName === 'delete') {
      return deleteModalSteps;
    } else if (processExeName === 'creation') {
      return CreationmodelSteps;
    } else if (processExeName === 'restart') {
      return RestartModalSteps;
    } else if (processExeName === 'stop') {
      return StopModalSteps;
    } else if (processExeName === 'start') {
      return StartModalSteps;
    } else if (processExeName === 'upgrade') {
      return UpgradeModalSteps;
    } else if (processExeName === 'update-nodes') {
      return nodesUpdateModalSteps;
    } else if (processExeName === 'add-registry') {
      return RegistryModalSteps;
    }
  };
  const getModalHeading = processExeName => {
    if (processExeName === 'delete') {
      return 'Cluster Deletion Progress';
    } else if (processExeName === 'creation') {
      return 'Cluster Configuration in Progress';
    } else if (processExeName === 'restart') {
      return 'Cluster Restart Progress';
    } else if (processExeName === 'stop') {
      return 'Cluster Stop Progress';
    } else if (processExeName === 'start') {
      return 'Cluster Start Progress';
    } else if (processExeName === 'upgrade') {
      return 'Cluster Upgrade Progress';
    } else if (processExeName === 'update-nodes') {
      return 'Cluster Update Nodes Progress';
    } else if (processExeName === 'add-registry') {
      return 'Cluster Registry Association';
    }
  };

  const getFinalText = processExeName => {
    if (processExeName === 'delete') {
      return 'Cluster deleted successfully';
    } else if (processExeName === 'creation') {
      return 'Cluster successfully created and initialized.';
    } else if (processExeName === 'restart') {
      return 'Cluster restarted successfully';
    } else if (processExeName === 'stop') {
      return 'Cluster stopped successfully';
    } else if (processExeName === 'start') {
      return 'Cluster started successfully';
    } else if (processExeName === 'upgrade') {
      return 'Cluster upgraded successfully';
    } else if (processExeName === 'update-nodes') {
      return 'Cluster nodes updated successfully';
    } else if (processExeName === 'add-registry') {
      return 'Registry successfully associated. You may now Promote Flows and Manage Configurations';
    }
  };

  const getInitialingText = processExeName => {
    if (processExeName === 'delete') {
      return 'Cluster has been deleted. Initializing cluster components.';
    } else if (processExeName === 'creation') {
      return 'Cluster configuration completed. Initializing cluster components.';
    } else if (processExeName === 'restart') {
      return 'Cluster has been restarted. Initializing cluster components.';
    } else if (processExeName === 'stop') {
      return 'Cluster has been stopped. Initializing cluster components.';
    } else if (processExeName === 'start') {
      return 'Cluster has been started. Initializing cluster components.';
    } else if (processExeName === 'upgrade') {
      return 'Cluster has been updated. Initializing cluster components.';
    } else if (processExeName === 'update-nodes') {
      return 'Cluster nodes has been updated. Initializing cluster components.';
    } else if (processExeName === 'add-registry') {
      return 'Cluster registry association completed. Initializing cluster components.';
    }
  };
  function calculateCompletionPercentage(modelSteps, currentSteps) {
    const totalSteps = modelSteps?.length;
    let filteredSteps = currentSteps;
    if (processExeName === 'update-nodes') {
      filteredSteps = currentSteps?.filter((step, index) => {
        if (
          step.step === 'NiFi cluster deployment' &&
          step.status === 'completed'
        ) {
          return index === modelSteps.length - 1;
        }
        return true;
      });
    }
    const completedSteps = filteredSteps?.filter(
      step => step?.status === 'completed'
    ).length;

    const percentage = Math.round((completedSteps / totalSteps) * 100);
    if (processData?.data?.status === 'completed') {
      return 100;
    }
    return percentage;
  }
  const progress = calculateCompletionPercentage(
    getReferencObjectForComparison(processExeName),
    currentSteps
  );

  const onRequestClose = () => {
    setIsProcessModalOpen(false);
    dispatch(ClustersActions.setProgressTrackingModalOpen(false));
    setSelectedCluster({});
    dispatch(
      GridActions.fetchGrid({
        module: 'clusters',
        params: { page: 1, limit: 10 },
        ...(sortingState && {
          sort: sortingState,
        }),
      })
    );
  };

  useEffect(() => {
    if (isProcessModalOpen || isModalOpen) {
      const payload = {
        clusterId:
          selectedCluster?.id || ansibleClusterCreationData?.cluster_id,
        process_id:
          selectedCluster?.process_id || ansibleClusterCreationData?.process_id,
        process_name:
          selectedCluster?.process_name ||
          ansibleClusterCreationData?.process_name,
      };
      dispatch(ClustersActions.fetchAnsibleCLusterProcessData(payload));
    }
  }, [isProcessModalOpen, isModalOpen]);

  useEffect(() => {
    let intervalId;
    if ((isProcessModalOpen || isModalOpen) && progress < 100) {
      intervalId = setInterval(() => {
        const payload = {
          clusterId:
            selectedCluster?.id || ansibleClusterCreationData?.cluster_id,
          process_id:
            selectedCluster?.process_id ||
            ansibleClusterCreationData?.process_id,
          process_name:
            selectedCluster?.process_name ||
            ansibleClusterCreationData?.process_name,
        };
        dispatch(ClustersActions.fetchAnsibleCLusterProcessData(payload));
      }, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isProcessModalOpen, isModalOpen, dispatch, progress]);

  const extractNumberFromTimeString = timeString => {
    if (typeof timeString !== 'string') {
      return null;
    }
    const match = timeString.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  useEffect(() => {
    const extractedTime = extractNumberFromTimeString('1 mins');
    if (extractedTime !== null && !isNaN(extractedTime)) {
      setInitialisingTime(10 * 1000);
    }
  }, [processData]);

  useEffect(() => {
    if (!initialisingTime || isNaN(initialisingTime) || !isInitialisaitionPhase)
      return;

    const startTime = Date.now();
    const interval = 100;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed, initialisingTime);
      setProgressValue(progress);

      if (elapsed >= initialisingTime) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [initialisingTime, isInitialisaitionPhase]);

  const percentage =
    initialisingTime && initialisingTime > 0
      ? Math.round((progressValue / initialisingTime) * 100)
      : 0;

  useEffect(() => {
    let timeoutId;

    if (progress === 100) {
      setIsInitialisaitionPhase(true);
      setTimeout(() => {
        setIsInitialisaitionPhase(false);
      }, [initialisingTime]);
      timeoutId = setTimeout(() => {
        setIsCompleted(true);
      }, 500);
    } else {
      setIsCompleted(false);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [progress]);
  const closeModalDirect = () => {
    setIsProcessModalOpen(false);
    dispatch(ClustersActions.setProgressTrackingModalOpen(false));
    setSelectedCluster({});
    dispatch(
      GridActions.fetchGrid({
        module: 'clusters',
        params: { page: 1, limit: 10 },
        ...(sortingState && {
          sort: sortingState,
        }),
      })
    );
  };
  return (
    <>
      <FullPageLoader loading={loading} />
      <ModalWithRightBtn
        isOpen={isProcessModalOpen || isModalOpen}
        onRequestClose={closeModalDirect}
        onSubmit={() => onRequestClose()}
        title={getModalHeading(processExeName)}
        primaryButtonText={
          !isInitialisaitionPhase && isCompleted
            ? 'Close'
            : processExeName == 'delete' && isCompleted
              ? 'Close'
              : null
        }
        contentStyles={{
          minWidth:
            (!isInitialisaitionPhase && isCompleted) ||
            (processExeName == 'delete' && isCompleted)
              ? '40%'
              : '60%',
        }}
        footerAlign="start"
        displayCrossIcon={
          processExeName === 'delete' || processData?.data?.status === 'failed'
        }
      >
        <Container>
          {isCompleted ? (
            <>
              {
                <>
                  {' '}
                  {isInitialisaitionPhase && processExeName !== 'delete' ? (
                    <div className="d-flex flex-column align-items-center justify-content-center mt-4 flex-grow-1">
                      <PercentageHeaderText colorBlack={false}>
                        {percentage}%
                      </PercentageHeaderText>
                      <div className="progress w-75" style={{ height: '15px' }}>
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          role="progressbar"
                          aria-valuenow={100}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          style={{
                            width: `${percentage || 0}%`,
                            backgroundColor: 'green',
                          }}
                        />
                      </div>
                      <div className="mt-4">
                        <PercentageHeaderText colorBlack={true}>
                          {getInitialingText(processExeName)}
                        </PercentageHeaderText>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center mt-4">
                      <div>
                        <GreenRightCircleIcon width={180} height={180} />
                      </div>
                      <div className="mt-4">
                        <PercentageHeaderText colorBlack={true}>
                          {getFinalText(processExeName)}
                        </PercentageHeaderText>
                      </div>
                    </div>
                  )}
                </>
              }
            </>
          ) : (
            <>
              {progress !== 0 && (
                <StickyProgressBar>
                  <FlexRow>
                    <StepHeaderText>Progress</StepHeaderText>
                    <PercentageHeaderText>
                      {progress}% Complete
                    </PercentageHeaderText>
                  </FlexRow>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${progress || 0}%`,
                        backgroundColor: '#06C270',
                      }}
                      aria-valuenow={progress || 0}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </StickyProgressBar>
              )}
              <StepProgress progressStageRef={progressStageRef} />
            </>
          )}
        </Container>
      </ModalWithRightBtn>
    </>
  );
};
