import React, { useEffect, useState } from 'react';
import { RefreshIcon, TodoIcon } from '../../assets';
import styled from 'styled-components';
import { CLUSTERS_TOKEN, KDFM } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { AiFlowGeneratorSelectors, AuthenticationSelectors } from '../../store';
import { isEmpty } from 'lodash';
import { fetchDefaultRecentFlowsData } from './services';
import { RecommendedFlow } from './RecommendedFlow';
import { PromptInputBox } from './PromptInputBox';
import { getLoginToClusterPopup } from './utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
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

const BoxItem1 = styled.div`
  width: 100%;
  height: 56px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background: rgba(245, 247, 250, 1);
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
  max-height: 40vh;
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
`;

export const AiFlowGenerator = () => {
  const handleRefresh = () => {
    console.log('Refresh');
  };

  const dispatch = useDispatch();
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);

  const defaultFLows = useSelector(AiFlowGeneratorSelectors.getDefaultFlows);
  const recentFlows = useSelector(AiFlowGeneratorSelectors.getRecentFlows);

  // query prompt
  const [queryText, setQueryText] = useState('');

  const generateFlowPermission = userPermissions.includes('add_genai');

  useEffect(() => {
    fetchDefaultRecentFlowsData(dispatch);
  }, []);

  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');

  return isEmpty(clusters) ? (
    getLoginToClusterPopup()
  ) : (
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
              <BoxItem1></BoxItem1>
              <RecommendedFlow
                defaultFlows={defaultFLows}
                recentFlows={recentFlows}
                generateFlowPermission={generateFlowPermission}
              />
            </RecommendedFlowBox>
          </Flex>
        )}
      </Flex>
      <DataFlowContainer>
        <DataFlowList className="gen-ai-dataflow-sec mb-4">
          <div className="d-flex gap-2 ps-3">
            <div className="df-manager-icon">
              <img src="./images/img-1.png" alt="" className="img-fluid" />
            </div>
            <span className="fs-12">Data Flow Manager</span>
            <span className="fs-12 ms-auto">12: 40 AM 15: 11: 24</span>
          </div>
          <div className="data-flow-content p-3">
            <p>Here is the JSON File generated as per your prompt....</p>
          </div>
        </DataFlowList>
        <DataFlowList className="gen-ai-dataflow-sec mb-4">
          <div className="d-flex gap-2 ps-3">
            <div className="df-manager-icon">
              <img src="./images/img-1.png" alt="" className="img-fluid" />
            </div>
            <span className="fs-12">Data Flow Manager</span>
            <span className="fs-12 ms-auto">12: 40 AM 15: 11: 24</span>
          </div>
          <div className="data-flow-content p-3">
            <p>Here is the JSON File generated as per your prompt....</p>
          </div>
        </DataFlowList>
        <DataFlowList className="gen-ai-dataflow-sec mb-4">
          <div className="d-flex gap-2 ps-3">
            <div className="df-manager-icon">
              <img src="./images/img-1.png" alt="" className="img-fluid" />
            </div>
            <span className="fs-12">Data Flow Manager</span>
            <span className="fs-12 ms-auto">12: 40 AM 15: 11: 24</span>
          </div>
          <div className="data-flow-content p-3">
            <p>Here is the JSON File generated as per your prompt....</p>
          </div>
        </DataFlowList>
        <DataFlowList className="gen-ai-dataflow-sec mb-4">
          <div className="d-flex gap-2 ps-3">
            <div className="df-manager-icon">
              <img src="./images/img-1.png" alt="" className="img-fluid" />
            </div>
            <span className="fs-12">Data Flow Manager</span>
            <span className="fs-12 ms-auto">12: 40 AM 15: 11: 24</span>
          </div>
          <div className="data-flow-content p-3">
            <p>Here is the JSON File generated as per your prompt....</p>
            <div className="d-flex flex-wrap gap-3 mb-3">
              <div className="data-flow-thum text-center">
                <div className="data-flow-thum-img mb-1">
                  {/* <img
                    src="./images/json-icon.png"
                    alt=""
                    className="img-fluid"
                  /> */}
                </div>
                <div className="data-flow-thum-text">lorem-ispum.json</div>
              </div>
            </div>

            <button className="btn py-2 d-inline-flex gap-2 align-items-center btn-add-catlog">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6.33447 6.33203V3.66536H7.66781V6.33203H10.3345V7.66536H7.66781V10.332H6.33447V7.66536H3.66781V6.33203H6.33447ZM7.00114 13.6654C3.31924 13.6654 0.334473 10.6806 0.334473 6.9987C0.334473 3.3168 3.31924 0.332031 7.00114 0.332031C10.683 0.332031 13.6678 3.3168 13.6678 6.9987C13.6678 10.6806 10.683 13.6654 7.00114 13.6654ZM7.00114 12.332C9.94667 12.332 12.3345 9.94423 12.3345 6.9987C12.3345 4.05318 9.94667 1.66536 7.00114 1.66536C4.05562 1.66536 1.66781 4.05318 1.66781 6.9987C1.66781 9.94423 4.05562 12.332 7.00114 12.332Z"></path>{' '}
              </svg>
              Add to Catlog
            </button>
          </div>
        </DataFlowList>
      </DataFlowContainer>
      <PromptSection>
        <PromptInputBox
          disabled={!generateFlowPermission}
          queryText={queryText}
          setQueryText={setQueryText}
        />
      </PromptSection>
    </Container>
  );
};
