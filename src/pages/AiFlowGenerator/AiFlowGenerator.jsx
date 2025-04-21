/* eslint-disable no-unused-vars */

import React, { useEffect, useRef, useState } from 'react';
import {
  DownloadIcon,
  OpenEyeIcon,
  RefreshIcon,
  TodoIcon,
  TriangleExclamationMarkIcon,
} from '../../assets';
import styled from 'styled-components';
import { API_URL, CLUSTERS_TOKEN, KDFM } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  AiFlowGeneratorActions,
  AiFlowGeneratorSelectors,
  AuthenticationSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { isEmpty, isEqual } from 'lodash';
import { RecommendedFlow } from './RecommendedFlow';
import { PromptInputBox } from './PromptInputBox';
import {
  downloadJsonFile,
  formatMissingValues,
  formattedTime,
  getLoginToClusterPopup,
} from './utils';
import userImage from '../../assets/images/avatar.png';
import dfmImage from '../../assets/images/dfm.png';
import fileImage from '../../assets/images/folder (1) 1.png';
import { Button, Modal } from '../../shared';
import { toast } from 'react-toastify';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import DiscardFlowConfirmationModal from './DiscardFlowConfirmationModal';
import { jsonrepair } from 'jsonrepair';
import { FullPageLoader } from '../../components';
import SuggetionsChip from './SuggestionsChip';
import { DEFAULT_FLOW_JSON } from '../../constants/aiFlowGenerator.constant';
import { FlowAddToRegistryModal } from './FlowAddToRegistryModal';
import { AddNewBucketModal } from './AddNewBucketModal';
import DownloadFlowConfirmationModal from './DownLoadFlowConfirmationModal';
import { FullScreenIcon } from '../../assets/Icons/FullScreenIcon';
import { MiniScreenIcon } from '../../assets/Icons/MiniScreenIcon';
import FlowAddedSuccessModal from './FlowAddedSuccessModal';
import { history } from '../../helpers/history';
import { FlowValidationErrorModal } from './FlowValidationErrorModal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  svg {
    margin: 0px;
  }

  .loader {
    background-color: transparent;
    margin-top: 5px;
    @keyframes blink {
      50% {
        fill: transparent;
      }
    }

    .dot {
      animation: blink 1s infinite;
      fill: grey;
    }

    .dot:nth-child(2) {
      animation-delay: 250ms;
    }

    .dot:nth-child(3) {
      animation-delay: 500ms;
    }
  }
`;

const RefreshIocnPanel = styled.div`
  cursor: pointer;
  background-color: #f5f7fa;
  border: 1px solid #dde4f0;
  width: 37px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  border-radius: 4px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  visibility: ${props => (props.showHeading ? 'visible' : 'hidden')};
`;

const HeadingStyle = styled.h3`
  font-family: 'Nato Sans', sans-serif;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;

const RecommendedFlowBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 16px;
  border-width: 1px;
  border: 1px solid rgba(221, 228, 240, 1);
  margin-top: 14px;
`;

const PromptSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-direction: column;
`;
const DataFlowContainer = styled.div`
  width: 100%;
  margin-bottom: auto;
  margin-top: 1rem;
  height: 45vh;
  max-height: 45vh;
  overflow: auto;
  padding-right: 5px;
`;
const DataFlowList = styled.div`
  width: 100%;
  position: relative;
  .fs-12 {
    font-size: 12px;
  }
  .data-flow-thum {
    display: flex;
    flex-direction: column;

    .data-flow-thum-img {
      background-color: #fff;
      border-radius: 10px;
      padding: 8px;
      display: inline-flex;
      text-align: center;
      width: 80px;
    }
    .data-flow-thum-text {
      font-size: 12px;
    }
  }
  .df-manager-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: #e8e8e9;
    padding: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .data-flow-content {
    background-color: #f5f7fa;
    border-radius: 10px;
    margin-top: -12px;
  }
  .data-flow-content-response {
    background-color: #f5f7fa;
    border-radius: 10px;
    margin-top: -12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-height: max-content;
  }
  .avatar-img {
    height: 32px;
    width: 32px;
    border-radius: 8px;
  }
  .dfm-img {
    height: 22px;
    width: 14px;
    border-radius: 8px;
    background: #e8e8e9;
  }
  .add-to-registry-btn {
    width: 159px;
  }
  .validate-flow-btn {
    width: 111px;
  }
  .flow-download-btn {
    width: 39px;
    button {
      padding: 0px;
    }
    svg {
      margin: 0px;
    }
  }
  .preview-btn {
    width: 39px;
    height: 39px;
    border-radius: 5px;
    border-width: 1px;
    border: 1px solid #ff7a00;
    background: #ffffff;
    cursor: pointer;
    svg {
      margin: 0px;
    }
  }
`;

const MidSection = styled.div`
  font-weight: 500;
  font-size: 64px;
  text-align: center;
  color: #73737f;
`;

const JsonWrapper = styled.div`
  background-color: #f5f7fa !important;
  #json-editor > * {
    color: #444445 !important;
  }
`;

const FullScreen = styled(FullScreenIcon)`
  padding: 5px;
  border-radius: 50%;
  border: 1px solid #dde4f0;
  background: #ffffff;
`;

const MiniScreen = styled(MiniScreenIcon)`
  padding: 5px;
  border-radius: 50%;
  border: 1px solid #dde4f0;
  background: #ffffff;
`;

export const AiFlowGenerator = () => {
  const dispatch = useDispatch();
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);
  const recentFlows = useSelector(AiFlowGeneratorSelectors.getRecentFlows);
  const generateFlowPermission = userPermissions.includes('add_genai');
  const [queryText, setQueryText] = useState('');
  const [queryLable, setQueryLable] = useState('');
  const [openConversation, setOpenConversation] = useState(false);
  const [isPromptInputDisabled, setIsPromptInputDisabled] = useState(
    !generateFlowPermission
  );
  const [addedToRegistry, setAddedToRegistry] = useState(false);
  const [isFlowDownloaded, setIsFLowDownloaded] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [inputError, setInputError] = useState({});
  const [pendingFlowUpdate, setPendingFlowUpdate] = useState(null);
  const isFlowAddedSuccessfully = useSelector(
    AiFlowGeneratorSelectors.getIsFlowAddedSuccessFully
  );
  const [clusters, setClusters] = useState(() => {
    return JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  });

  useEffect(() => {
    setIsPromptInputDisabled(!generateFlowPermission);
  }, [generateFlowPermission]);

  useEffect(() => {
    const interval = setInterval(() => {
      const storedClusters = JSON.parse(
        localStorage.getItem(CLUSTERS_TOKEN) || '[]'
      );
      setClusters(prev => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(storedClusters);
        return prevStr !== newStr ? storedClusters : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isArrayEmpty = arr => {
    return arr.length === 0 || arr.every(obj => Object.keys(obj).length === 0);
  };
  useEffect(() => {
    if (!isArrayEmpty(clusters) && !isEmpty(Object.keys(currentUser))) {
      const payload = {
        user_id: currentUser?.id,
        user_role: currentUser?.role,
      };
      dispatch(AiFlowGeneratorActions.fetchDefaultRecentFlows(payload));
      dispatch(AiFlowGeneratorActions.fetchRegistry());
    }
  }, [clusters]);

  const [isJsonInvalid, setIsJsonInvalid] = useState(false);

  const recentFlowLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchDefaultRecentFlows')
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'generateFlowAPI')
  );
  const flowValidationLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'validateFlowJson')
  );
  const [isDiscardFlowModalOpen, setIsDiscardFlowModalOpen] = useState(false);
  const [openAddToRegistryModal, setOpenAddToRegistryModal] = useState(false);
  const [isAddNewBucketModalOpen, setIsAddNewBucketModalOpen] = useState(false);
  const bucketListData = useSelector(
    NamespacesSelectors.getBucketListDropDownData
  );
  const [buckets, setBuckets] = useState(bucketListData?.bucketList);
  const [isFlowAddedSuccessModalOpen, setIsFlowAddedSuccessModalOpen] =
    useState(false);
  useEffect(() => {
    if (!isEmpty(bucketListData)) {
      setBuckets(bucketListData?.bucketList);
    }
  }, [bucketListData]);
  const registryData = useSelector(AiFlowGeneratorSelectors.getRegistry);
  const [registry, setRegistry] = useState(registryData);
  const validationError = useSelector(
    AiFlowGeneratorSelectors.getValidatedFlowErrors
  );
  const [flowValidationError, setFlowValidationError] =
    useState(validationError);
  const isFlowErrorModalOpen = useSelector(
    AiFlowGeneratorSelectors.getIsFlowErrorModalOpen
  );
  const isFlowValidatedSuccessfully = useSelector(
    AiFlowGeneratorSelectors.getIsflowValidatedSuccessfully
  );
  useEffect(() => {
    if (!isEmpty(validationError)) {
      setFlowValidationError(validationError);
    }
  }, [validationError]);
  useEffect(() => {
    setRegistry(registryData);
  }, [registryData]);
  const handleRefresh = () => {
    if (loading) {
      if (!toast.isActive('generating-flow')) {
        toast.warning('Flow is generating please wait', {
          toastId: 'generating-flow',
        });
      }
      return;
    } else {
      const payload = {
        user_id: currentUser?.id,
        user_role: currentUser?.role,
      };
      setIsValidFlowGenerated(false);
      setisInputEmpty(false);
      setIsFlowUpdated(false);
      setIsFLowDownloaded(false);
      setAddedToRegistry(false);
      setOpenPreviewModal(false);
      setOpenConversation(false);
      setQueryText('');
      setFlowJson({});
      setConversationalRes([]);
      setOriginalFlow({});
      setInputError({});
      setIsPromptInputDisabled(!generateFlowPermission);
      dispatch(AiFlowGeneratorActions.setGeneratedFlow({}));
      dispatch(AiFlowGeneratorActions.setGenFlowError(''));
      dispatch(AiFlowGeneratorActions.fetchDefaultRecentFlows(payload));
    }
  };

  const onAddToRegistryClick = e => {
    if (e?.keyCode == 13) {
      e.preventDefault();
      return false;
    }
    if (!isEmpty(registry)) {
      dispatch(
        NamespacesActions.fetchRegistryData({
          registriesId: registry[0]?.id,
        })
      );
    }
    setOpenPreviewModal(false);
    setOpenAddToRegistryModal(true);
    setAddedToRegistry(true);
  };

  const handleAddToRegistry = flowData => {
    if (!isFlowValidatedSuccessfully) {
      if (!toast.isActive('validate-flow')) {
        toast.warning('Please validate the flow json to proceed further', {
          toastId: 'validate-flow',
        });
      }
      return;
    }
    const updatedFlowJson = {
      ...flowJson,
      flowContents: {
        ...flowJson?.flowContents,
        name: flowData?.pg_name,
      },
    };
    const payload = {
      bucketId: flowData?.bucket,
      flowName: flowData?.flow_name,
      flowDesc: flowData?.flow_desc,
      flowJson: updatedFlowJson,
    };
    dispatch(AiFlowGeneratorActions.addFlowToRegistry(payload));
    setOpenPreviewModal(false);
    if (!isEqual(updatedFlowJson, originalFlow)) {
      setPendingFlowUpdate(updatedFlowJson);
    }
    if (isFlowUpdated) {
      setPendingFlowUpdate(updatedFlowJson);
    }
  };

  useEffect(() => {
    if (isFlowAddedSuccessfully && pendingFlowUpdate) {
      dispatch(
        AiFlowGeneratorActions.updateGeneratedFlow({
          data: pendingFlowUpdate,
          id: generatedFlowId,
        })
      );

      setPendingFlowUpdate(null);
    }
  }, [isFlowAddedSuccessfully, pendingFlowUpdate]);

  const handleFlowDownload = () => {
    const fileName = queryLable?.length ? `${queryLable}.json` : 'flow.json';
    setIsFLowDownloaded(true);
    downloadJsonFile(flowJson, fileName, handleRefresh);
    if (isFlowUpdated) {
      dispatch(
        AiFlowGeneratorActions.updateGeneratedFlow({
          data: flowJson,
          id: generatedFlowId,
        })
      );
    }
    setOpenPreviewModal(false);
  };

  const handleDownloadClick = () => {
    if (!isFlowValidatedSuccessfully) {
      if (!toast.isActive('validate-flow')) {
        toast.warning('Please validate the flow json to proceed further', {
          toastId: 'validate-flow',
        });
      }
      return;
    }
    setIsDownloadModalOpen(true);
  };

  const handlePreviewClick = () => {
    setOpenPreviewModal(true);
    setIsDiscardFlowModalOpen(false);
    setIsJsonInvalid(false);
    handleChange(generatedFlow);
  };

  const config = {
    tertiaryButtonTest: '',
    tertiaryButtonSubmit: handleDownloadClick,
    icon: <DownloadIcon color="#444445" />,
  };
  const generatedFlow = useSelector(AiFlowGeneratorSelectors.getGeneratedFlow);
  const [generatedFlowId, setGeneratedFlowId] = useState(generatedFlow?.id);
  const error = useSelector(AiFlowGeneratorSelectors.getGenFlowError);
  const [flowJson, setFlowJson] = useState({});
  const [conversationalRes, setConversationalRes] = useState([]);
  const [isValidFlowGenerated, setIsValidFlowGenerated] = useState(false);
  const [flowError, setFlowError] = useState(error || '');
  const [originalFlow, setOriginalFlow] = useState({});
  const [isFlowUpdated, setIsFlowUpdated] = useState(false);
  const bucketLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchRegistryData')
  );
  const flowAddedLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'addFlowToRegistry')
  );
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const [isInputEmpty, setisInputEmpty] = useState(false);
  const [isClickedFromPreviewModal, setIsClickedFromPreviewModal] =
    useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationalRes]);

  useEffect(() => {
    setFlowError(error);
  }, [error]);

  useEffect(() => {
    setQueryLable(flowJson?.flowContents?.name);
  }, [flowJson]);

  useEffect(() => {
    if (Object.keys(generatedFlow).length > 0) {
      setGeneratedFlowId(generatedFlow?.id);
      const repaired = generatedFlow?.response;
      const jsonType = typeof repaired;

      let newSystemMessage = null;
      const timestamp = formattedTime();

      if (jsonType === 'string') {
        const formattedRes = repaired
          .replace(/\\"/g, '"')
          .replace(/\\n/g, '\n')
          .replace(/^"/, '')
          .replace(/"$/, '');

        newSystemMessage = {
          role: 'system',
          type: 'string',
          status: 'completed',
          data: formattedRes,
          time: timestamp,
        };
        setIsPromptInputDisabled(false);
        setIsValidFlowGenerated(false);
        setOriginalFlow({});
        setFlowJson({});
      } else if (jsonType === 'object' && repaired !== null) {
        newSystemMessage = {
          role: 'system',
          type: 'object',
          status: 'completed',
          data: repaired,
          time: timestamp,
        };
        setIsPromptInputDisabled(true);
        setIsValidFlowGenerated(true);
        setFlowJson(repaired);
        setOriginalFlow(repaired);
      }

      if (newSystemMessage) {
        setConversationalRes(prev => {
          const updated = [...prev];
          const lastIndex = updated
            .map(msg => msg.status)
            .lastIndexOf('pending');

          if (lastIndex !== -1) {
            updated[lastIndex] = newSystemMessage;
          }
          return updated;
        });
      }
    }
  }, [generatedFlow]);

  const handleChange = content => {
    if (content.jsObject) {
      if (!isEqual(content.jsObject, originalFlow)) {
        setIsFlowUpdated(true);
      } else {
        setIsFlowUpdated(false);
      }
      setFlowJson(content.jsObject);
      dispatch(AiFlowGeneratorActions.setIsFlowValidatedSuccessfully(false));
      if (!toast.isActive('validate-flow')) {
        toast.warning('Please validate the flow json to proceed further', {
          toastId: 'validate-flow',
        });
      }
      setIsJsonInvalid(false);
    } else if (content.error) {
      setIsJsonInvalid(true);
    }
  };

  const customStyles = {
    outerBox: {
      height: '100%',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#F5F7FA !important',
    },
    container: {
      height: '100%',
      fontSize: '16px',
      color: '#444443 !important',
      backgroundColor: '#F5F7FA !important',
    },
    body: {
      fontSize: '16px',
      color: '#444443',
      fontWeight: 400,
      backgroundColor: '#ffffff !important',
    },
    errorMessage: {
      color: '#ff4d4f',
    },
    labelColumn: {
      color: '#444443 !important',
    },
  };
  const handleDiscardFlow = flow => {
    dispatch(AiFlowGeneratorActions.deleteGeneratedFlow(flow?.id));
    handleRefresh();
    setIsDiscardFlowModalOpen(false);
    setOpenPreviewModal(false);
    setOpenAddToRegistryModal(false);
  };

  const validateGeneratedFlow = () => {
    dispatch(AiFlowGeneratorActions.validateFlowJson(flowJson));
  };
  const handleSuccessModalSuccess = () => {
    setIsFlowAddedSuccessModalOpen(false);
    handleRefresh();
    history.push('/process-group');
  };

  const handleSuccessModalClose = () => {
    setIsFlowAddedSuccessModalOpen(false);
    handleRefresh();
  };
  useEffect(() => {
    if (
      !loading &&
      isEmpty(flowError) &&
      openConversation &&
      !isEmpty(Object.keys(flowJson))
    ) {
      setOpenPreviewModal(true);
    } else {
      setOpenPreviewModal(false);
    }
  }, [loading, flowError, flowJson]);

  const toggleFullScreen = () => {
    setIsFullscreen(prev => !prev);
  };
  return isArrayEmpty(clusters) ? (
    getLoginToClusterPopup()
  ) : (
    <>
      <FullPageLoader
        loading={
          recentFlowLoading ||
          bucketLoading ||
          flowAddedLoading ||
          flowValidationLoading
        }
      />
      <Container>
        <Flex className="flex-column align-items-start w-100">
          <Flex className="w-100">
            <HeadingWrapper showHeading={!isEmpty(recentFlows)}>
              <TodoIcon width={22} height={24} />
              <HeadingStyle>{KDFM.RECENT_GENERATED_FLOWS}</HeadingStyle>
            </HeadingWrapper>
            <div className="mb-2 d-flex align-items-center">
              <RefreshIocnPanel
                onClick={handleRefresh}
                style={{
                  opacity: 1,
                  minWidth: '37px',
                }}
                data-tooltip-id={`tooltip-group-generate-flow-refresh`}
              >
                <RefreshIcon style={{ cursor: 'pointer' }} />
              </RefreshIocnPanel>
            </div>
          </Flex>
          {!isEmpty(recentFlows) && (
            <Flex>
              <RecommendedFlowBox>
                <RecommendedFlow
                  openConversation={openConversation}
                  recentFlows={recentFlows}
                  generateFlowPermission={generateFlowPermission}
                  setQueryText={setQueryText}
                  loading={loading}
                  setQueryLable={setQueryLable}
                  isValidFlowGenerated={isValidFlowGenerated}
                  isJsonEmpty={isEmpty(Object.keys(flowJson))}
                />
              </RecommendedFlowBox>
            </Flex>
          )}
        </Flex>
        {!openConversation && <MidSection>{KDFM.AI_FLOW_GENERATOR}</MidSection>}{' '}
        {openConversation && (
          <DataFlowContainer>
            {conversationalRes.map((item, index) => (
              <DataFlowList className="gen-ai-dataflow-sec mb-4" key={index}>
                <div className="d-flex gap-2 ps-3">
                  <div className="df-manager-icon">
                    <img
                      src={
                        item.role === 'user'
                          ? currentUser?.photo
                            ? `${API_URL}${currentUser?.photo}`
                            : userImage
                          : dfmImage
                      }
                      alt="user"
                      className={
                        item.role === 'user' ? 'avatar-img' : 'dfm-img'
                      }
                    />
                  </div>
                  <span className="fs-12 fw-medium">
                    {item.role === 'user' ? KDFM.YOU : KDFM.DATA_FLOW_MANAGER}
                  </span>
                  <span className="fs-12 ms-auto">
                    {item?.time ?? formattedTime()}
                  </span>
                </div>

                <div
                  className={`data-flow-content${item.role === 'system' ? '-response' : ''} p-3`}
                >
                  {item.role === 'user' && <p className="mt-1">{item.data}</p>}

                  {item.role === 'system' &&
                    item.status === 'pending' &&
                    loading && (
                      <p className="mt-1 d-flex align-items-center">
                        <span>Generating Flow</span>
                        <svg height="40" width="100" className="loader">
                          <circle className="dot" cx="10" cy="20" r="2" />
                          <circle className="dot" cx="20" cy="20" r="2" />
                          <circle className="dot" cx="30" cy="20" r="2" />
                        </svg>
                      </p>
                    )}

                  {item.role === 'system' &&
                    item.status === 'completed' &&
                    item.type === 'string' && (
                      <p style={{ whiteSpace: 'pre-line' }} className="mt-1">
                        {item.data}
                      </p>
                    )}
                  {item.role === 'system' &&
                    !isEmpty(flowError) &&
                    !loading && (
                      <p
                        style={{ whiteSpace: 'pre-line' }}
                        className="mt-1 text-danger"
                      >
                        <span className="d-flex align-items-center gap-1">
                          <TriangleExclamationMarkIcon color="red" />
                          {flowError}
                        </span>{' '}
                      </p>
                    )}
                  {item.role === 'system' &&
                    !isEmpty(flowError) &&
                    !loading && (
                      <div className="mt-2 add-to-registry-btn">
                        <Button
                          onClick={() => {
                            handleRefresh();
                          }}
                          size="sm"
                        >
                          {KDFM.RESTART_CONVERSATION}
                        </Button>
                      </div>
                    )}
                  {item.role === 'system' &&
                    item.status === 'completed' &&
                    item.type === 'object' &&
                    isEmpty(flowError) && (
                      <>
                        <p className="mt-1">
                          Here is the JSON generated as per your prompt!
                        </p>
                        {!loading &&
                          isEmpty(flowError) &&
                          !isEmpty(Object.keys(flowJson)) && (
                            <>
                              <div className="d-flex flex-wrap gap-3 mb-3 mt-4">
                                <div className="data-flow-thum text-center">
                                  <div className="data-flow-thum-img mb-1">
                                    <img
                                      src={fileImage}
                                      alt="file"
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="data-flow-thum-text">
                                    {queryLable?.length
                                      ? `${queryLable}.json`
                                      : 'Flow.json'}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2">
                                <div className="add-to-registry-btn">
                                  <Button
                                    isBtnDisable={!isFlowValidatedSuccessfully}
                                    onClick={() => {
                                      setIsClickedFromPreviewModal(false);
                                      onAddToRegistryClick();
                                    }}
                                    size="sm"
                                  >
                                    {KDFM.ADD_TO_REGSITRY}
                                  </Button>
                                </div>
                                <div className="flow-download-btn">
                                  <Button
                                    isBtnDisable={!isFlowValidatedSuccessfully}
                                    onClick={handleDownloadClick}
                                    variant="secondary"
                                    icon={<DownloadIcon color="#444445" />}
                                  />
                                </div>
                                <button
                                  disabled={isEmpty(Object.keys(flowJson))}
                                  onClick={handlePreviewClick}
                                  className="preview-btn d-flex align-items-center justify-content-center"
                                >
                                  <OpenEyeIcon
                                    width={24}
                                    height={18}
                                    color="#FF7A00"
                                  />
                                </button>
                                <div className="validate-flow-btn">
                                  <Button
                                    variant="secondary"
                                    isBtnDisable={isFlowValidatedSuccessfully}
                                    onClick={() => validateGeneratedFlow()}
                                    size="sm"
                                  >
                                    {KDFM.VALIDATE_FLOW}
                                  </Button>{' '}
                                </div>
                              </div>
                            </>
                          )}{' '}
                      </>
                    )}

                  {}
                </div>
              </DataFlowList>
            ))}
            {/* Invisible div for auto-scroll */}
            <div ref={messagesEndRef} />
          </DataFlowContainer>
        )}
        <PromptSection>
          {!loading && !openConversation && !isEmpty(DEFAULT_FLOW_JSON) && (
            <SuggetionsChip
              generateFlowPermission={generateFlowPermission}
              SuggetionsArray={DEFAULT_FLOW_JSON}
              setQueryLable={setQueryLable}
              setOpenConversation={setOpenConversation}
              refresh={handleRefresh}
              setQueryText={setQueryText}
              setisInputEmpty={setisInputEmpty}
              setInputError={setInputError}
              setIsPromptInputDisabled={setIsPromptInputDisabled}
              setConversationalRes={setConversationalRes}
            />
          )}
          <PromptInputBox
            setOpenConversation={setOpenConversation}
            disabled={isPromptInputDisabled}
            queryText={queryText}
            setQueryText={setQueryText}
            setIsPromptInputDisabled={setIsPromptInputDisabled}
            queryLabel={queryLable}
            refresh={handleRefresh}
            isInputEmpty={isInputEmpty}
            inputError={inputError}
            setInputError={setInputError}
            setConversationalRes={setConversationalRes}
          />
        </PromptSection>
        <Modal
          title={
            `${`${flowJson?.flowContents?.name ? flowJson?.flowContents?.name : 'Flow Json'}`}` +
            ' Preview'
          }
          isOpen={openPreviewModal}
          isAdditionalIcon={true}
          additionalIcon={isFullscreen ? <MiniScreen /> : <FullScreen />}
          onAdditionalIconClick={toggleFullScreen}
          onRequestClose={() => {
            setIsFullscreen(false);
            setOpenPreviewModal(false);
          }}
          onSecondarySubmit={() => {
            setIsDiscardFlowModalOpen(true);
          }}
          size="sm"
          secondaryButtonText="Discard"
          primaryButtonText={'Add to Registry'}
          tertiaryButton={true}
          tertiaryButtonConfig={{
            ...config,
            tertiaryButtonDisable:
              isJsonInvalid || !isFlowValidatedSuccessfully,
          }}
          primaryButtonDisabled={isJsonInvalid || !isFlowValidatedSuccessfully}
          additionalBtnText={KDFM.VALIDATE_FLOW}
          additionalBtnDisabled={isFlowValidatedSuccessfully}
          additionalBtnClick={validateGeneratedFlow}
          onSubmit={e => {
            setIsClickedFromPreviewModal(true);
            onAddToRegistryClick(e);
          }}
          footerAlign="start"
          contentStyles={{
            maxWidth: isFullscreen ? '80%' : '35%',
            maxHeight: isFullscreen ? '90%' : '70%',
          }}
        >
          <JsonWrapper>
            <JSONInput
              id="json-editor"
              locale={locale}
              placeholder={flowJson}
              width="100%"
              onChange={handleChange}
              style={customStyles}
            />
          </JsonWrapper>
        </Modal>
        {isDiscardFlowModalOpen && (
          <DiscardFlowConfirmationModal
            isDiscardFlowModalOpen={isDiscardFlowModalOpen}
            setIsDiscardFlowModalOpen={setIsDiscardFlowModalOpen}
            handleDiscardFlow={handleDiscardFlow}
            generatedFlow={generatedFlow}
          />
        )}
        {openAddToRegistryModal && (
          <FlowAddToRegistryModal
            isModalOpen={openAddToRegistryModal}
            setIsModalOpen={setOpenAddToRegistryModal}
            bucketList={buckets || []}
            defaultFlowName={queryLable || 'AI Generated Nifi Flow'}
            handleAddToRegistry={handleAddToRegistry}
            handleClose={() => {
              if (isClickedFromPreviewModal) {
                setOpenAddToRegistryModal(false);
                setOpenPreviewModal(true);
              } else {
                setOpenAddToRegistryModal(false);
              }
            }}
            setIsAddNewBucketModalOpen={setIsAddNewBucketModalOpen}
            refresh={handleRefresh}
            setIsFlowAddedSuccessModalOpen={setIsFlowAddedSuccessModalOpen}
            setFlowJson={setFlowJson}
          />
        )}
        {isAddNewBucketModalOpen && (
          <AddNewBucketModal
            isModalOpen={isAddNewBucketModalOpen}
            setIsModalOpen={setIsAddNewBucketModalOpen}
          />
        )}
        {isDownloadModalOpen && (
          <DownloadFlowConfirmationModal
            isModalOpen={isDownloadModalOpen}
            setIsModalOpen={setIsDownloadModalOpen}
            handleDownloadFlow={handleFlowDownload}
          />
        )}
        {isFlowAddedSuccessModalOpen && (
          <FlowAddedSuccessModal
            isModalOpen={isFlowAddedSuccessModalOpen}
            handleClose={handleSuccessModalClose}
            handleSubmit={handleSuccessModalSuccess}
          />
        )}
        {isFlowErrorModalOpen && (
          <FlowValidationErrorModal
            isModalOpen={isFlowErrorModalOpen}
            handleClose={() => {
              dispatch(AiFlowGeneratorActions.setIsFlowErrorModalOpen(false));
            }}
            errorData={formatMissingValues(flowValidationError) || []}
          />
        )}
      </Container>
    </>
  );
};
