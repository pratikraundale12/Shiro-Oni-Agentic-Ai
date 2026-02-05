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
const CreationModelThirdPartySteps = [
  { step: 'Connectivity check', status: 'completed' },
  { step: 'Host preparation', status: 'completed' },
  { step: 'Certificate deployment', status: 'completed' },
  { step: 'NiFi Configuration', status: 'completed' },
  { step: 'Custom metrics agent', status: 'completed' },
  { step: 'NiFi cluster flow election', status: 'completed' },
];
const CreationModelKubeStepsEKS = [
  { step: 'Verify chart_path & values_file', status: 'completed' },
  { step: 'Resolve kubeconfig for EKS', status: 'completed' },
  { step: 'Validate aws_region input', status: 'completed' },
  {
    step: 'Verify aws/helm/kubectl and cluster connectivity',
    status: 'completed',
  },
  { step: 'Read values and derive feature flags', status: 'completed' },
  { step: 'Ensure namespace nifi', status: 'completed' },
  { step: 'cert-manager install/upgrade', status: 'completed' },
  { step: 'Ensure gp3 StorageClass (EBS CSI)', status: 'completed' },
  { step: 'Deploy/Upgrade NiFi via Helm', status: 'completed' },
  { step: 'Collect NiFi pods/services', status: 'completed' },
];
const CreationModelKubeStepsEC2 = [
  {
    step: 'Checking if NiFi installation files are present',
    status: 'completed',
  },
  {
    step: 'Reading NiFi configuration settings',
    status: 'completed',
  },
  {
    step: 'Checking connection details for remote server',
    status: 'completed',
  },
  {
    step: 'Checking if required tools are installed on remote server',
    status: 'completed',
  },
  {
    step: 'Setting up workspace on remote server',
    status: 'completed',
  },
  {
    step: 'Packaging Helm chart for remote deployment',
    status: 'completed',
  },
  {
    step: 'Setting up cluster connection on remote server',
    status: 'completed',
  },
  {
    step: 'Ensure namespace nifi',
    status: 'completed',
  },
  {
    step: 'Installing local-path provisioner and setting default StorageClass',
    status: 'completed',
  },
  {
    step: 'Installing remote cluster security certificate manager',
    status: 'completed',
  },
  {
    step: 'Deploying remote cluster NiFi application',
    status: 'completed',
  },
  {
    step: 'Ensuring metrics-server with insecure TLS flag (remote)',
    status: 'completed',
  },
  {
    step: 'Ensuring pvc-exporter Helm release (remote)',
    status: 'completed',
  },
  {
    step: 'Collect NiFi pods/services (remote)',
    status: 'completed',
  },
];

const CreationModelKubeStepsAKS = [
  {
    step: 'Launching NiFi deployment',
    status: 'completed',
  },
  {
    step: 'Validating Azure access',
    status: 'completed',
  },
  {
    step: 'Resolving kubeconfig',
    status: 'completed',
  },
  {
    step: 'Ensuring pvc-exporter monitoring in namespace pvc-exporter',
    status: 'completed',
  },
  {
    step: 'Checking helm/kubectl availability and cluster reachability',
    status: 'completed',
  },
  {
    step: 'Parsing values file for deployment options',
    status: 'completed',
  },
  {
    step: 'Ensuring namespace nifi exists',
    status: 'completed',
  },
  {
    step: 'Evaluating cert-manager release cert-manager in namespace cert-manager',
    status: 'completed',
  },
  {
    step: 'Validating storage class local-path for persistence',
    status: 'completed',
  },
  {
    step: 'Ensuring metrics-server is deployed in kube-system',
    status: 'completed',
  },
  {
    step: 'Setting up Azure LoadBalancer Public IP',
    status: 'completed',
  },
  {
    step: 'Installing NiFi',
    status: 'completed',
  },
  {
    step: 'Collect NiFi pods/services (remote)',
    status: 'completed',
  },
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
const nodesAddThirdPartyModalSteps = [
  {
    step: 'Connectivity check',
    status: 'completed',
  },
  {
    step: 'Host preparation',
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
  { step: 'NiFi cluster flow election', status: 'completed' },
  { step: 'NiFi cluster deployment', status: 'completed' },
];
const nodesDeleteThirdPartyModalSteps = [
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
    step: 'Host preparation',
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
  { step: 'NiFi cluster flow election', status: 'completed' },
  { step: 'NiFi cluster deployment', status: 'completed' },
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
const deleteEKSClusterSteps = [
  { step: 'Read values for flags', status: 'completed' },
  { step: 'Resolve kubeconfig for EKS', status: 'completed' },
  { step: 'Uninstall NiFi (EKS)', status: 'completed' },
];
const deleteEC2ClusterSteps = [
  {
    step: 'Read values for flags',
    status: 'completed',
  },
  {
    step: 'Validate EC2 SSH inputs',
    status: 'completed',
  },
  {
    step: 'Verify kubectl/helm on remote',
    status: 'completed',
  },
  {
    step: 'Resolve kubeconfig on remote',
    status: 'completed',
  },
  {
    step: ' NiFi uninstall (remote)',
    status: 'completed',
  },
];

const deleteAKSClusterSteps = [
  {
    step: 'NiFi AKS uninstall routine',
    status: 'completed',
  },
  {
    step: 'Normalizing kubeconfig path',
    status: 'completed',
  },
  {
    step: 'Validating kubectl access',
    status: 'completed',
  },
  {
    step: 'Checking Helm release nifi in namespace nifi',
    status: 'completed',
  },
  {
    step: 'Uninstalling Helm release nifi',
    status: 'completed',
  },
  {
    step: 'Deleting NiFi workloads (STS/Deploy/SVC)',
    status: 'completed',
  },
  {
    step: 'Deleting NiFi PVCs',
    status: 'completed',
  },
  {
    step: 'Deleting NiFiKop CRDs if present',
    status: 'completed',
  },
  {
    step: 'Deleting namespace nifi',
    status: 'completed',
  },
  {
    step: 'Waiting for namespace nifi to terminate',
    status: 'completed',
  },
];
const createRegistryAKS = [
  { step: 'Verifying Helm chart', status: 'completed' },
  { step: 'Validating Azure access', status: 'completed' },
  { step: 'Resolving kubeconfig', status: 'completed' },
  {
    step: 'Checking helm/kubectl availability and cluster reachability',
    status: 'completed',
  },
  { step: 'Parsing values file for deployment options', status: 'completed' },
  { step: 'Ensuring namespace nifi-registry exists', status: 'completed' },
  {
    step: 'Evaluating cert-manager release cert-manager in namespace cert-manager',
    status: 'completed',
  },
  { step: 'Validating storage class for persistence', status: 'completed' },
  {
    step: 'Creating/validating Load Balancer IP for NiFi Registry',
    status: 'completed',
  },
  { step: 'Installing NiFi Registry', status: 'completed' },
  { step: 'Collect NiFi Registry pods/services', status: 'completed' },
];
const deleteRegistryAKS = [
  { step: 'Validating CLI tools (helm/kubectl)', status: 'completed' },
  { step: 'Checking Helm release nifi-registry', status: 'completed' },
  {
    step: 'Deleting PersistentVolumeClaims in nifi-aks-registry',
    status: 'completed',
  },
  { step: 'Deleting Secrets in nifi-aks-registry', status: 'completed' },
  { step: 'Deleting namespace nifi-aks-registry', status: 'completed' },
];
export const ClusterProcessDisplayModal = ({
  isProcessModalOpen,
  setIsProcessModalOpen = () => {},
  setSelectedCluster = () => {},
  selectedCluster,
  sortingState,
  itemPerClusterList,
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
    if (processData?.isKubeRegistry) {
      if (processExeName === 'creation') {
        return createRegistryAKS;
      } else if (processExeName === 'delete') {
        return deleteRegistryAKS;
      }
    }

    if (processExeName === 'delete') {
      return processData?.isKubeCluster && processData?.cluster_type === 'eks'
        ? deleteEKSClusterSteps
        : processData?.isKubeCluster && processData?.cluster_type === 'ec2'
          ? deleteEC2ClusterSteps
          : processData?.isKubeCluster && processData?.cluster_type === 'aks'
            ? deleteAKSClusterSteps
            : deleteModalSteps;
    } else if (processExeName === 'creation') {
      return processData?.isKubeCluster && processData?.cluster_type === 'eks'
        ? CreationModelKubeStepsEKS
        : processData?.isKubeCluster && processData?.cluster_type === 'ec2'
          ? CreationModelKubeStepsEC2
          : processData?.isKubeCluster && processData?.cluster_type === 'aks'
            ? CreationModelKubeStepsAKS
            : processData?.has_third_party_cert
              ? CreationModelThirdPartySteps
              : CreationmodelSteps;
    } else if (processExeName === 'restart') {
      return RestartModalSteps;
    } else if (processExeName === 'stop') {
      return StopModalSteps;
    } else if (processExeName === 'start') {
      return StartModalSteps;
    } else if (processExeName === 'upgrade') {
      return processData?.isKubeCluster && processData?.cluster_type === 'eks'
        ? CreationModelKubeStepsEKS
        : processData?.isKubeCluster && processData?.cluster_type === 'ec2'
          ? CreationModelKubeStepsEC2
          : processData?.isKubeCluster && processData?.cluster_type === 'aks'
            ? CreationModelKubeStepsAKS
            : UpgradeModalSteps;
    } else if (processExeName === 'update-nodes') {
      return processData?.has_third_party_cert
        ? nodesAddThirdPartyModalSteps
        : nodesUpdateModalSteps;
    } else if (processExeName === 'add-registry') {
      return RegistryModalSteps;
    } else if (processExeName === 'remove-node') {
      return processData?.has_third_party_cert
        ? nodesDeleteThirdPartyModalSteps
        : nodesUpdateModalSteps;
    }
  };
  const getModalHeading = processExeName => {
    if (
      ansibleClusterCreationData?.registry_id &&
      processExeName === 'creation'
    ) {
      return 'Registry Configuration in Progress';
    }
    if (
      ansibleClusterCreationData?.registry_id &&
      processExeName === 'delete'
    ) {
      return 'Registry Deletion in Progress';
    }
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
    } else if (
      processExeName === 'update-nodes' ||
      processExeName === 'remove-node'
    ) {
      return 'Cluster Update Nodes Progress';
    } else if (processExeName === 'add-registry') {
      return 'Cluster Registry Association';
    }
  };

  const getFinalText = processExeName => {
    if (
      ansibleClusterCreationData?.registry_id &&
      processExeName === 'creation'
    ) {
      return 'Registry successfully created and initialized.';
    } else if (
      ansibleClusterCreationData?.registry_id &&
      processExeName === 'delete'
    ) {
      return 'Registry deleted successfully';
    } else if (processExeName === 'delete') {
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
    } else if (
      processExeName === 'update-nodes' ||
      processExeName === 'remove-node'
    ) {
      return 'Cluster nodes updated successfully';
    } else if (processExeName === 'add-registry') {
      return 'Registry successfully associated. You may now Promote Flows and Manage Configurations';
    }
  };

  const getInitialingText = processExeName => {
    if (
      ansibleClusterCreationData?.registry_id &&
      processExeName === 'creation'
    ) {
      return 'Registry setup completed. Initializing registry components.';
    } else if (
      ansibleClusterCreationData?.registry_id &&
      processExeName === 'delete'
    ) {
      return 'Registry has been deleted. Initializing registry components.';
    } else if (processExeName === 'delete') {
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
    } else if (
      processExeName === 'update-nodes' ||
      processExeName === 'remove-node'
    ) {
      return 'Cluster nodes has been updated. Initializing cluster components.';
    } else if (processExeName === 'add-registry') {
      return 'Cluster registry association completed. Initializing cluster components.';
    }
  };
  function calculateCompletionPercentage(modelSteps, currentSteps) {
    const totalSteps = modelSteps?.length;
    let filteredSteps = currentSteps;
    if (processExeName === 'update-nodes' || processExeName === 'remove-node') {
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
    dispatch(ClustersActions.setansibleClusterProgressData({}));
    setSelectedCluster({});
    dispatch(
      GridActions.fetchGrid({
        module:
          ansibleClusterCreationData?.request_type === 'registry' ||
          selectedCluster?.is_kube_registry
            ? 'registry'
            : 'clusters',
        params: { page: 1, limit: itemPerClusterList, sort: 'name' },
        ...(sortingState && {
          sort: sortingState,
        }),
      })
    );
  };

  useEffect(() => {
    if (
      (isProcessModalOpen || isModalOpen) &&
      processData?.data?.status !== 'failed'
    ) {
      if (
        ansibleClusterCreationData?.request_type === 'registry' ||
        selectedCluster?.is_kube_registry
      ) {
        const payload = {
          clusterId:
            selectedCluster?.id || ansibleClusterCreationData?.registry_id,
          process_id:
            selectedCluster?.process_id ||
            ansibleClusterCreationData?.process_id,
          process_name:
            selectedCluster?.process_name ||
            ansibleClusterCreationData?.process_name,
          request_type: 'registry',
          registry_type:
            selectedCluster?.registry_type ||
            ansibleClusterCreationData?.registry_type,
          ...(selectedCluster?.cluster_type ||
          ansibleClusterCreationData?.cluster_type
            ? {
                cluster_type:
                  selectedCluster?.cluster_type ||
                  ansibleClusterCreationData?.cluster_type,
              }
            : {}),
        };
        dispatch(ClustersActions.fetchAnsibleCLusterProcessData(payload));
      } else {
        const payload = {
          clusterId:
            selectedCluster?.id || ansibleClusterCreationData?.cluster_id,
          process_id:
            selectedCluster?.process_id ||
            ansibleClusterCreationData?.process_id,
          process_name:
            selectedCluster?.process_name ||
            ansibleClusterCreationData?.process_name,
          ...(selectedCluster?.cluster_type ||
          ansibleClusterCreationData?.cluster_type
            ? {
                cluster_type:
                  selectedCluster?.cluster_type ||
                  ansibleClusterCreationData?.cluster_type,
              }
            : {}),
        };
        dispatch(ClustersActions.fetchAnsibleCLusterProcessData(payload));
      }
    }
  }, [
    isProcessModalOpen,
    isModalOpen,
    dispatch,
    selectedCluster,
    ansibleClusterCreationData,
    processData?.data?.status,
  ]);

  useEffect(() => {
    let intervalId;
    if (
      (isProcessModalOpen || isModalOpen) &&
      progress < 100 &&
      processData?.data?.status !== 'failed'
    ) {
      intervalId = setInterval(() => {
        if (
          ansibleClusterCreationData?.request_type === 'registry' ||
          selectedCluster?.is_kube_registry
        ) {
          const payload = {
            clusterId:
              selectedCluster?.id || ansibleClusterCreationData?.registry_id,
            process_id:
              selectedCluster?.process_id ||
              ansibleClusterCreationData?.process_id,
            process_name:
              selectedCluster?.process_name ||
              ansibleClusterCreationData?.process_name,
            request_type: 'registry',
            registry_type:
              selectedCluster?.registry_type ||
              ansibleClusterCreationData?.registry_type,
            ...(selectedCluster?.cluster_type ||
            ansibleClusterCreationData?.cluster_type
              ? {
                  cluster_type:
                    selectedCluster?.cluster_type ||
                    ansibleClusterCreationData?.cluster_type,
                }
              : {}),
          };
          dispatch(ClustersActions.fetchAnsibleCLusterProcessData(payload));
        } else {
          const payload = {
            clusterId:
              selectedCluster?.id || ansibleClusterCreationData?.cluster_id,
            process_id:
              selectedCluster?.process_id ||
              ansibleClusterCreationData?.process_id,
            process_name:
              selectedCluster?.process_name ||
              ansibleClusterCreationData?.process_name,
            ...(selectedCluster?.cluster_type ||
            ansibleClusterCreationData?.cluster_type
              ? {
                  cluster_type:
                    selectedCluster?.cluster_type ||
                    ansibleClusterCreationData?.cluster_type,
                }
              : {}),
          };
          dispatch(ClustersActions.fetchAnsibleCLusterProcessData(payload));
        }
      }, 5500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    isProcessModalOpen,
    isModalOpen,
    progress,
    dispatch,
    selectedCluster,
    ansibleClusterCreationData,
    processData?.data?.status,
  ]);

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
      if (processData?.isKubeCluster || processData?.isKubeRegistry) {
        setInitialisingTime(60 * 1000);
      } else {
        setInitialisingTime(180 * 1000);
      }
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
    dispatch(ClustersActions.setansibleClusterProgressData({}));
    setSelectedCluster({});
    dispatch(
      GridActions.fetchGrid({
        module:
          ansibleClusterCreationData?.request_type === 'registry' ||
          selectedCluster?.is_kube_registry
            ? 'registry'
            : 'clusters',
        params: { page: 1, limit: itemPerClusterList, sort: 'name' },
        ...(sortingState && {
          sort: sortingState,
        }),
      })
    );
  };
  const handleDeleteClusterFromDB = () => {
    const payload = {
      clusterIdToDelete:
        selectedCluster?.id || ansibleClusterCreationData?.cluster_id,
      deleteType: 'db_only',
      payloadData: {},
    };
    dispatch(ClustersActions.deleteClusterKube(payload));
    setIsProcessModalOpen(false);
    dispatch(ClustersActions.setProgressTrackingModalOpen(false));
    dispatch(ClustersActions.setansibleClusterProgressData({}));
    setSelectedCluster({});
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
          {!(
            processExeName === 'delete' &&
            processData?.data?.status === 'failed'
          ) && (
            <>
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
                          <div
                            className="progress w-75"
                            style={{ height: '15px' }}
                          >
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
                          {Number(progress) || 0}% Complete
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
            </>
          )}
          {processExeName === 'delete' &&
            processData?.data?.status === 'failed' && (
              <div className="d-flex flex-column justify-content-center align-items-center h-100 flex-grow-1">
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  Cluster delete has failed due to some reason, Do you want to
                  delete cluster from db
                </div>

                <br />
                <div>
                  <Button onClick={handleDeleteClusterFromDB}>
                    Delete Cluster from DB
                  </Button>
                </div>
              </div>
            )}
        </Container>{' '}
      </ModalWithRightBtn>
    </>
  );
};
