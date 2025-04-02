/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
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
import { fetchDefaultRecentFlowsData } from './services';
import { RecommendedFlow } from './RecommendedFlow';
import { PromptInputBox } from './PromptInputBox';
import {
  downloadJsonFile,
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  svg {
    margin: 0px;
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
    .data-flow-thum-img {
      background-color: #fff;
      border-radius: 10px;
      padding: 8px;
      display: inline-flex;
      text-align: center;
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
    height: 240px;
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
  #json-editor > * {
    color: #444445 !important;
  }
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
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const isArrayEmpty = arr => {
    return arr.length === 0 || arr.every(obj => Object.keys(obj).length === 0);
  };
  useEffect(() => {
    if (!isArrayEmpty(clusters)) {
      fetchDefaultRecentFlowsData(dispatch);
      dispatch(AiFlowGeneratorActions.fetchRegistry());
    }
  }, []);

  const [isJsonInvalid, setIsJsonInvalid] = useState(false);

  const recentFlowLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchDefaultRecentFlows')
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'generateFlowAPI')
  );
  const [isDiscardFlowModalOpen, setIsDiscardFlowModalOpen] = useState(false);
  const [openAddToRegistryModal, setOpenAddToRegistryModal] = useState(false);
  const [isAddNewBucketModalOpen, setIsAddNewBucketModalOpen] = useState(false);
  const bucketListData = useSelector(
    NamespacesSelectors.getBucketListDropDownData
  );
  const [buckets, setBuckets] = useState(bucketListData?.bucketList);
  useEffect(() => {
    if (!isEmpty(bucketListData)) {
      setBuckets(bucketListData?.bucketList);
    }
  });
  const registryData = useSelector(AiFlowGeneratorSelectors.getRegistry);
  const [registry, setRegistry] = useState(registryData);
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
      setIsFlowUpdated(false);
      setIsFLowDownloaded(false);
      setAddedToRegistry(false);
      setOpenConversation(false);
      setQueryText('');
      setFlowJson({});
      setOriginalFlow({});
      setIsPromptInputDisabled(!generateFlowPermission);
      dispatch(AiFlowGeneratorActions.setGeneratedFlow({}));
      dispatch(AiFlowGeneratorActions.setGenFlowError(''));
      dispatch(AiFlowGeneratorActions.fetchDefaultRecentFlows());
    }
  };

  const onAddToRegistryClick = e => {
    if (e.keyCode == 13) {
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
    const payload = {
      bucketId: flowData?.bucket,
      flowName: flowData?.flow_name,
      flowDesc: flowData?.flow_desc,
      flowJson: flowJson,
    };
    dispatch(AiFlowGeneratorActions.addFlowToRegistry(payload));
    handleRefresh();
    if (isFlowUpdated) {
      dispatch(
        AiFlowGeneratorActions.updateGeneratedFlow({
          data: flowJson,
          id: generatedFlow?.id,
        })
      );
    }
    setOpenAddToRegistryModal(false);
  };

  const handleDownloadClick = () => {
    setIsFLowDownloaded(true);
    downloadJsonFile(flowJson, 'demo.json');
    if (isFlowUpdated) {
      dispatch(
        AiFlowGeneratorActions.updateGeneratedFlow({
          data: flowJson,
          id: generatedFlow?.id,
        })
      );
    }
    setOpenPreviewModal(false);
    handleRefresh();
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
  const error = useSelector(AiFlowGeneratorSelectors.getGenFlowError);
  const [flowJson, setFlowJson] = useState({});
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
  useEffect(() => {
    setFlowError(error);
  }, [error]);

  useEffect(() => {
    setQueryLable(flowJson?.flowContents?.name);
  }, [flowJson]);

  useEffect(() => {
    if (Object.keys(generatedFlow).length > 0) {
      let repaired = generatedFlow?.response;
      try {
        const parsedJson =
          typeof generatedFlow?.response === 'string'
            ? JSON.parse(generatedFlow?.response)
            : generatedFlow?.response;

        repaired = jsonrepair(parsedJson?.response);
      } catch (error) {
        console.error('Error repairing JSON:', error);
        return;
      }
      setFlowJson(JSON.parse(repaired));
      setOriginalFlow(JSON.parse(repaired));
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
      backgroundColor: '#ffffff !important',
    },
    container: {
      height: '100%',
      fontSize: '16px',
      color: '#444443 !important',
      backgroundColor: '#ffffff !important',
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

  return isArrayEmpty(clusters) ? (
    getLoginToClusterPopup()
  ) : (
    <>
      <FullPageLoader
        loading={recentFlowLoading || bucketLoading || flowAddedLoading}
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
                />
              </RecommendedFlowBox>
            </Flex>
          )}
        </Flex>
        {!openConversation && <MidSection>{KDFM.AI_FLOW_GENERATOR}</MidSection>}{' '}
        {openConversation && (
          <DataFlowContainer>
            <DataFlowList className="gen-ai-dataflow-sec mb-4">
              <div className="d-flex gap-2 ps-3">
                <div className="df-manager-icon">
                  <img
                    src={
                      currentUser?.photo
                        ? `${API_URL}${currentUser?.photo}`
                        : userImage
                    }
                    alt=""
                    className="avatar-img"
                  />
                </div>
                <span className="fs-12 fw-medium">{KDFM.YOU}</span>
                <span className="fs-12 ms-auto">{formattedTime()}</span>
              </div>
              <div className="data-flow-content p-3">
                <p className="mt-1">{queryText}</p>
              </div>
            </DataFlowList>
            <DataFlowList className="gen-ai-dataflow-sec mb-4">
              <div className="d-flex gap-2 ps-3">
                <div className="df-manager-icon">
                  <img src={dfmImage} alt="user" className="dfm-img" />
                </div>
                <span className="fs-12 fw-medium">
                  {KDFM.DATA_FLOW_MANAGER}
                </span>
                <span className="fs-12 ms-auto">{formattedTime()}</span>
              </div>
              <div className="data-flow-content-response p-3">
                {!isEmpty(flowError) && !loading && (
                  <TriangleExclamationMarkIcon color="red" />
                )}{' '}
                <p
                  className={`mt-1 d-inline ${!isEmpty(flowError) && !loading ? 'text-danger' : ''}`}
                >
                  {loading
                    ? 'Generating Flow...'
                    : !loading && isEmpty(flowError)
                      ? 'Here is the JSON File generated as per your prompt....'
                      : `${flowError} please refresh...`}
                </p>
                {!loading && isEmpty(flowError) && (
                  <>
                    <div className="d-flex flex-wrap gap-3 mb-3 mt-4">
                      <div className="data-flow-thum text-center">
                        <div className="data-flow-thum-img mb-1">
                          <img src={fileImage} alt="" className="img-fluid" />
                        </div>
                        <div className="data-flow-thum-text">demo.json</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <div className="add-to-registry-btn">
                        <Button onClick={onAddToRegistryClick} size="sm">
                          {KDFM.ADD_TO_REGSITRY}
                        </Button>
                      </div>
                      <div className="flow-download-btn">
                        <Button
                          onClick={handleDownloadClick}
                          variant="secondary"
                          icon={<DownloadIcon color="#444445" />}
                        />
                      </div>
                      <button
                        onClick={handlePreviewClick}
                        className="preview-btn d-flex align-items-center justify-content-center"
                      >
                        <OpenEyeIcon width={24} height={18} color="#FF7A00" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </DataFlowList>
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
              setIsPromptInputDisabled={setIsPromptInputDisabled}
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
          />
        </PromptSection>
        <Modal
          title={flowJson?.flowContents?.name || 'Preview Json'}
          isOpen={openPreviewModal}
          onRequestClose={() => {
            if (!isFlowDownloaded && !addedToRegistry) {
              setIsDiscardFlowModalOpen(true);
            } else {
              setIsDiscardFlowModalOpen(false);
              setOpenPreviewModal(false);
            }
          }}
          size="sm"
          secondaryButtonText="Close"
          primaryButtonText={'Add to Registry'}
          tertiaryButton={true}
          tertiaryButtonConfig={{
            ...config,
            tertiaryButtonDisable: isJsonInvalid,
          }}
          primaryButtonDisabled={isJsonInvalid}
          onSubmit={onAddToRegistryClick}
          footerAlign="start"
          contentStyles={{ maxWidth: '50%', maxHeight: '80%' }}
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
              setIsDiscardFlowModalOpen(true);
            }}
            setIsAddNewBucketModalOpen={setIsAddNewBucketModalOpen}
          />
        )}
        {isAddNewBucketModalOpen && (
          <AddNewBucketModal
            isModalOpen={isAddNewBucketModalOpen}
            setIsModalOpen={setIsAddNewBucketModalOpen}
          />
        )}
      </Container>
    </>
  );
};
