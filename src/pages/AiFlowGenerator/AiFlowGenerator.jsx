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
