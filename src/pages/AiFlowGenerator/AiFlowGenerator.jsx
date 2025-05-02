/* eslint-disable no-unused-vars */

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { debounce, isEmpty, isEqual } from 'lodash';
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
import { Button, Modal, SelectField } from '../../shared';
import { toast } from 'react-toastify';
import { FullPageLoader } from '../../components';
import SuggetionsChip from './SuggestionsChip';
import {
  DEFAULT_FLOW_JSON,
  NIFI_VERSIONS,
} from '../../constants/aiFlowGenerator.constant';
import { FlowAddToRegistryModal } from './FlowAddToRegistryModal';
import { AddNewBucketModal } from './AddNewBucketModal';
import DownloadFlowConfirmationModal from './DownLoadFlowConfirmationModal';
import { FullScreenIcon } from '../../assets/Icons/FullScreenIcon';
import { MiniScreenIcon } from '../../assets/Icons/MiniScreenIcon';
import FlowAddedSuccessModal from './FlowAddedSuccessModal';
import { history } from '../../helpers/history';
import { FlowValidationErrorModal } from './FlowValidationErrorModal';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';

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
  width: 40px;
  height: 47px;
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
  position: relative;
  height: 100%;
`;

const ErrorBanner = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #ffebee;
  color: #c62828;
  padding: 8px 16px;
  font-size: 14px;
  border-bottom: 1px solid #f44336;
  max-height: 120px;
  overflow-y: auto;
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
  const [flowName, setFlowName] = useState('');
  const [clusters, setClusters] = useState(() => {
    return JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  });

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
      dispatch(AiFlowGeneratorActions.fetchRegistryDetails());
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
  const isAIFlowSaved = useSelector(
    AiFlowGeneratorSelectors.getIsflowJsonSaved
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
      reset(DEFAULT_VERSION);
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
      dispatch(AiFlowGeneratorActions.setIsFlowValidatedSuccessfully(false));
      dispatch(AiFlowGeneratorActions.setValidatedFlowErrors([]));
      dispatch(AiFlowGeneratorActions.setIsFlowJsonSaved(false));
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
    if (originalFlow?.flowContents?.name !== flowData?.flow_name) {
      setFlowName(flowData?.flow_name);
    }
    const updatedFlowJson = {
      ...flowJson,
      flowContents: {
        ...flowJson?.flowContents,
        name: flowData?.pg_name,
      },
    };
    const bucketName = buckets?.filter(
      bucket => bucket?.id === flowData?.bucket
    )[0]?.name;
    const payload = {
      bucketId: flowData?.bucket,
      flowName: flowData?.flow_name,
      flowDesc: flowData?.flow_desc,
      flowJson: updatedFlowJson,
      bucketName: bucketName || '',
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
    if (isFlowAddedSuccessfully || isFlowDownloaded) {
      dispatch(AiFlowGeneratorActions.setIsFlowJsonSaved(true));
    }
  }, [isFlowAddedSuccessfully, isFlowDownloaded]);
  useEffect(() => {
    if (isFlowAddedSuccessfully && (pendingFlowUpdate || !isEmpty(flowName))) {
      dispatch(
        AiFlowGeneratorActions.updateGeneratedFlow({
          data: { json: pendingFlowUpdate || flowJson, flowName: flowName },
          id: generatedFlowId,
        })
      );

      setPendingFlowUpdate(null);
      setFlowName('');
    }
  }, [isFlowAddedSuccessfully, pendingFlowUpdate, flowName]);

  const handleFlowDownload = () => {
    const fileName = queryLable?.length ? `${queryLable}.json` : 'flow.json';
    setIsFLowDownloaded(true);
    downloadJsonFile(flowJson, fileName, handleRefresh);
    if (isFlowUpdated) {
      dispatch(
        AiFlowGeneratorActions.updateGeneratedFlow({
          data: { json: flowJson, flowName: flowName },
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
    setIsJsonInvalid(false);
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
  const [jsonErrors, setJsonErrors] = useState([]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    setIsPromptInputDisabled(!generateFlowPermission);
  }, [generateFlowPermission, generatedFlow]);
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

  const onJsonChange = useCallback(
    debounce(value => {
      if (value === '') {
        setIsJsonInvalid(true);
      }
      const parsed = JSON.parse(value);
      const hasChanged = !isEqual(parsed, originalFlow);
      setIsFlowUpdated(hasChanged);
      setFlowJson(parsed);
      setIsJsonInvalid(false);
      dispatch(AiFlowGeneratorActions.setIsFlowValidatedSuccessfully(false));
      if (hasChanged) {
        if (!toast.isActive('validate-flow')) {
          toast.warning('Please validate the flow JSON to proceed further', {
            toastId: 'validate-flow',
          });
        }
      }
      if (!hasChanged) {
        setIsJsonInvalid(false);
      }
    }, 300),
    [originalFlow, dispatch, toast]
  );

  const onJsonValidate = error => {
    setJsonErrors(error);
    if (isEmpty(error)) {
      setIsJsonInvalid(false);
    } else {
      setIsJsonInvalid(true);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editor.onKeyDown(e => {
      const isEnter = e.keyCode === monaco.KeyCode.Enter;
      const noModifiers = !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;
      if (isEnter && noModifiers) {
        if (!toast.isActive('enter-press')) {
          toast.info('Please press ctrl+enter to jump into new line.', {
            toastId: 'enter-press',
          });
        }
      }
    });
    monaco.editor.defineTheme('customTheme', {
      base: 'vs',
      inherit: false,
      rules: [{ token: '', foreground: '444445' }],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#444445',
        'editorLineNumber.foreground': '#888888',
        'editorCursor.foreground': '#444445',
        'scrollbarSlider.background': '#E4842B',
        'scrollbarSlider.hoverBackground': '#E4842B',
        'scrollbarSlider.activeBackground': '#E4842B',
      },
    });

    monaco.editor.setTheme('customTheme');
  };

  const validateGeneratedFlow = () => {
    dispatch(AiFlowGeneratorActions.validateFlowJson(flowJson));
  };
  const handleSuccessModalSuccess = () => {
    setIsFlowAddedSuccessModalOpen(false);
    dispatch(AiFlowGeneratorActions.setIsFlowAddedSuccessFully(false));
    history.push('/process-group');
  };

  const handleSuccessModalClose = () => {
    setIsFlowAddedSuccessModalOpen(false);
    dispatch(AiFlowGeneratorActions.setIsFlowAddedSuccessFully(false));
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

  const sortedNifiVersions = NIFI_VERSIONS?.map(item => ({
    label: item,
    value: item,
  }));
  const DEFAULT_VERSION = {
    nifiVersion: '1.26.0',
  };
  const { register, control, watch, reset } = useForm({
    defaultValues: DEFAULT_VERSION,
  });
  const nifiVersion = watch('nifiVersion');
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
              <div>
                <SelectField
                  id="nifi-version"
                  name="nifiVersion"
                  options={sortedNifiVersions || []}
                  placeholder="Select Nifi Version"
                  backgroundColor={'#f5f7fa'}
                  control={control}
                  isDisabled={loading}
                  register={register}
                  isNifiVersion={true}
                />
              </div>
              <RefreshIocnPanel
                onClick={handleRefresh}
                style={{
                  opacity: 1,
                  minWidth: '37px',
                }}
                data-tooltip-id={`tooltip-group-generate-flow-refresh`}
              >
                <RefreshIcon
                  style={{ cursor: 'pointer' }}
                  height={20}
                  width={20}
                />
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
                  isJsonEmpty={isEmpty(Object.keys(generatedFlow))}
                  allowToGenerate={isAIFlowSaved || isFlowDownloaded}
                  refresh={handleRefresh}
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
                                    isBtnDisable={
                                      isJsonInvalid ||
                                      isFlowValidatedSuccessfully
                                    }
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
              nifiVersion={nifiVersion}
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
            nifiVersion={nifiVersion}
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
          size="sm"
          primaryButtonText={'Add to Registry'}
          tertiaryButton={true}
          tertiaryButtonConfig={{
            ...config,
            tertiaryButtonDisable:
              isJsonInvalid || !isFlowValidatedSuccessfully,
          }}
          primaryButtonDisabled={isJsonInvalid || !isFlowValidatedSuccessfully}
          primaryBtnSize={'md'}
          additionalBtnText={KDFM.VALIDATE_FLOW}
          additionalBtnDisabled={isJsonInvalid || isFlowValidatedSuccessfully}
          additionalBtnClick={validateGeneratedFlow}
          onSubmit={e => {
            setIsClickedFromPreviewModal(true);
            onAddToRegistryClick(e);
          }}
          footerAlign="start"
          contentStyles={{
            maxWidth: isFullscreen ? '80%' : '35%',
            maxHeight: isFullscreen ? '820px' : '70%',
            height: '100%',
          }}
          formClass={'h-100'}
        >
          <JsonWrapper>
            {!isEmpty(jsonErrors) && (
              <ErrorBanner>
                {jsonErrors.map((err, idx) => (
                  <div key={idx}>
                    <strong>
                      Line {err.startLineNumber}, Column {err.startColumn}:
                    </strong>{' '}
                    {err.message}
                  </div>
                ))}
              </ErrorBanner>
            )}
            <Editor
              width="100%"
              language="json"
              value={JSON.stringify(flowJson, null, 2)}
              onMount={handleEditorDidMount}
              onChange={onJsonChange}
              options={{
                minimap: { enabled: false },
                readOnly: false,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 0, bottom: 0 },
                lineNumbers: 'on',
                overviewRulerLanes: 0,
                scrollbar: {
                  verticalScrollbarSize: 4,
                  horizontalScrollbarSize: 4,
                  arrowSize: 4,
                },
              }}
              onValidate={onJsonValidate}
            />
          </JsonWrapper>
        </Modal>
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
