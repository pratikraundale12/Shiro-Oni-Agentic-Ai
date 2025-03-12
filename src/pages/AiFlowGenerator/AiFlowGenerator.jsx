/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { DownloadIcon, OpenEyeIcon, RefreshIcon, TodoIcon } from '../../assets';
import styled from 'styled-components';
import { CLUSTERS_TOKEN, KDFM } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  AiFlowGeneratorSelectors,
  AuthenticationSelectors,
  LoadingSelectors,
} from '../../store';
import { isEmpty } from 'lodash';
import { fetchDefaultRecentFlowsData } from './services';
import { RecommendedFlow } from './RecommendedFlow';
import { PromptInputBox } from './PromptInputBox';
import { downloadJsonFile, formattedTime } from './utils';
import userImage from '../../assets/images/avatar.png';
import dfmImage from '../../assets/images/default-logo.png';
import fileImage from '../../assets/images/folder (1) 1.png';
import { Button, Modal } from '../../shared';
import { toast } from 'react-toastify';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import DiscardFlowConfirmationModal from './DiscardFlowConfirmationModal';

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

export const AiFlowGenerator = () => {
  const dispatch = useDispatch();
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);

  const defaultFLows = useSelector(AiFlowGeneratorSelectors.getDefaultFlows);
  const recentFlows = useSelector(AiFlowGeneratorSelectors.getRecentFlows);

  // query prompt
  const generateFlowPermission = userPermissions.includes('add_genai');
  const [queryText, setQueryText] = useState('');
  const [openConversation, setOpenConversation] = useState(false);
  const [isPromptInputDisabled, setIsPromptInputDisabled] = useState(
    !generateFlowPermission
  );
  const [addedToRegistry, setAddedToRegistry] = useState(false);
  const [isFlowDownloaded, setIsFLowDownloaded] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  useEffect(() => {
    fetchDefaultRecentFlowsData(dispatch);
  }, []);

  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const [isJsonInvalid, setIsJsonInvalid] = useState(false); // State to track JSON validity

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'generateFlowAPI')
  );
  const [isDiscardFlowModalOpen, setIsDiscardFlowModalOpen] = useState(false);
  const handleRefresh = () => {
    if (loading) {
      if (!toast.isActive('generating-flow')) {
        toast.warning('Flow is generating... please wait', {
          toastId: 'generating-flow',
        });
      }
      return;
    } else {
      setOpenConversation(false);
      setQueryText('');
      setIsPromptInputDisabled(!generateFlowPermission);
      // history.push('/ai-flow-generator');
      console.log('Refresh');
    }
  };
  const handleAddToRegistryClick = e => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    setOpenPreviewModal(false);
    setAddedToRegistry(true);
    toast.info('Flow will be added to registry soon');
    handleRefresh();
  };

  const handleDownloadClick = () => {
    setIsFLowDownloaded(true);
    downloadJsonFile(json, 'demo.json');
    handleRefresh();
  };

  const handlePreviewClick = () => {
    setOpenPreviewModal(true);
    setIsDiscardFlowModalOpen(false);
    setIsJsonInvalid(false);
    handleChange(flow);
  };

  console.log('isPromptInputDisabled=----', isPromptInputDisabled);
  const config = {
    tertiaryButtonTest: '',
    tertiaryButtonSubmit: handleDownloadClick,
    icon: <DownloadIcon color="#444445" />,
  };
  const flow = useSelector(AiFlowGeneratorSelectors.getGeneratedFlow);
  const [json, setJson] = useState(flow || {});

  useEffect(() => {
    setJson(flow || {});
  }, [flow]);
  console.log('json---', json);

  const handleChange = content => {
    console.log('content---', content);

    if (content.jsObject) {
      setJson(content.jsObject);
      setIsJsonInvalid(false);
    } else if (content.error) {
      console.log('hiiii');
      setIsJsonInvalid(true); // Invalid JSON
    }
  };

  const customStyles = {
    outerBox: {
      height: '100%',
      border: 'none', // Remove outer border if needed
      borderRadius: '8px',
      backgroundColor: '#ffffff !important', // Background color
    },
    container: {
      height: '100%',
      fontSize: '16px', // Font size
      color: '#444443 !important', // Font color
      backgroundColor: '#ffffff !important', // Editor background
    },
    body: {
      fontSize: '16px', // JSON text font size
      color: '#444443',
      fontWeight: 400,
      // backgroundColor: '#ffffff !important', // Editor background
    },
    errorMessage: {
      color: '#ff4d4f', // Error message color
    },
    labelColumn: {
      color: '#444443', // Keys in JSON objects
    },
  };
  const handleDiscardFlow = () => {
    handleRefresh();
    setIsDiscardFlowModalOpen(false);
    setOpenPreviewModal(false);
  };
  return (
    <Container>
      <Flex className="flex-column align-items-start w-100">
        <Flex className="w-100">
          <HeadingWrapper
            showHeading={!(isEmpty(recentFlows) && isEmpty(defaultFLows))}
          >
            <TodoIcon width={22} height={24} />
            <HeadingStyle>
              {!isEmpty(recentFlows)
                ? KDFM.RECENT_GENERATED_FLOWS
                : KDFM.RECOMMENDED_FLOWS}
            </HeadingStyle>
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
        {!(isEmpty(recentFlows) && isEmpty(defaultFLows)) && (
          <Flex>
            <RecommendedFlowBox>
              <RecommendedFlow
                openConversation={openConversation}
                defaultFlows={defaultFLows}
                recentFlows={recentFlows}
                generateFlowPermission={generateFlowPermission}
                setQueryText={setQueryText}
                loading={loading}
              />
            </RecommendedFlowBox>
          </Flex>
        )}
      </Flex>
      {openConversation && (
        <DataFlowContainer>
          <DataFlowList className="gen-ai-dataflow-sec mb-4">
            <div className="d-flex gap-2 ps-3">
              <div className="df-manager-icon">
                <img src={userImage} alt="" className="avatar-img" />
              </div>
              <span className="fs-12 fw-medium">You</span>
              <span className="fs-12 ms-auto">{formattedTime()}</span>
            </div>
            <div className="data-flow-content p-3">
              <p className="mt-1">{queryText}</p>
            </div>
          </DataFlowList>
          <DataFlowList className="gen-ai-dataflow-sec mb-4">
            <div className="d-flex gap-2 ps-3">
              <div className="df-manager-icon">
                <img src={dfmImage} alt="" className="avatar-img" />
              </div>
              <span className="fs-12 fw-medium">Data Flow Manager</span>
              <span className="fs-12 ms-auto">{formattedTime()}</span>
            </div>
            <div className="data-flow-content-response p-3">
              <p className="mt-1">
                {loading
                  ? 'Generating Flow...'
                  : 'Here is the JSON File generated as per your prompt....'}
              </p>
              {!loading && (
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
                      <Button onClick={handleAddToRegistryClick} size="sm">
                        Add to Registry
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
        <PromptInputBox
          setOpenConversation={setOpenConversation}
          disabled={isPromptInputDisabled}
          queryText={queryText}
          setQueryText={setQueryText}
          setIsPromptInputDisabled={setIsPromptInputDisabled}
        />
      </PromptSection>
      <Modal
        title="Preview Json"
        isOpen={openPreviewModal}
        onRequestClose={() => setIsDiscardFlowModalOpen(true)}
        size="sm"
        secondaryButtonText="Close"
        primaryButtonText={'Add to Registry'}
        tertiaryButton={true}
        tertiaryButtonConfig={{
          ...config,
          tertiaryButtonDisable: isJsonInvalid,
        }}
        primaryButtonDisabled={isJsonInvalid}
        onSubmit={handleAddToRegistryClick}
        footerAlign="start"
        contentStyles={{ maxWidth: '40%', maxHeight: '80%' }}
      >
        <JSONInput
          id="json-editor"
          locale={locale}
          placeholder={json}
          width="100%"
          onChange={handleChange}
          value={JSON.stringify(json, null, 2)} // Ensure the editor reflects the current state
          style={customStyles}
        />
      </Modal>
      {isDiscardFlowModalOpen && (
        <DiscardFlowConfirmationModal
          isDiscardFlowModalOpen={isDiscardFlowModalOpen}
          setIsDiscardFlowModalOpen={setIsDiscardFlowModalOpen}
          handleDiscardFlow={handleDiscardFlow}
        />
      )}
    </Container>
  );
};
