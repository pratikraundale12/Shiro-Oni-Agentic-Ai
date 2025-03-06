import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { GeneratedFlowIcon } from '../../assets';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import { KDFM } from '../../constants';

const FlowsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  padding: 15px;
  gap: 20px;
`;

const FlowItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  width: 480px;
  height: 72px;
  cursor: pointer;
  border-radius: 10px;
  background: rgba(245, 247, 250, 1);
  padding: 25px;
`;

const FlowName = styled.span`
  font-family: Noto Sans;
  font-weight: 500;
  font-size: 16px;
  line-height: 21.79px;
  letter-spacing: 0%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const RecommendedFlow = ({
  generateFlowPermission,
  defaultFlows = [],
  recentFlows = [],
}) => {
  const flowData = (
    !isEmpty(recentFlows) ? recentFlows : defaultFlows || []
  ).slice(0, 6); // allow only 6 flows to be show on UI

  const handleRecentFlowClick = id => {
    if (generateFlowPermission) {
      // flow generate logic
      console.log('flow id--', id);
    } else {
      if (!toast.isActive('permission-error')) {
        toast.error(KDFM.NO_PERMISSION_TO_GENERATE_FLOW, {
          toastId: 'permission-error',
          autoClose: 900,
        });
      }
    }
  };
  return (
    <FlowsWrapper>
      {!isEmpty(flowData) &&
        flowData?.map(flow => (
          <>
            <FlowItems
              key={flow.id}
              onClick={() => handleRecentFlowClick(flow.id)}
            >
              <GeneratedFlowIcon />
              <FlowName data-tooltip-id={`flow-name-tooltip-${flow.id}`}>
                {flow.name}
              </FlowName>
            </FlowItems>
            <ReactTooltip
              id={`flow-name-tooltip-${flow.id}`}
              place="right"
              content={flow.name}
              style={{
                width: 'auto',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            />
          </>
        ))}
    </FlowsWrapper>
  );
};

RecommendedFlow.propTypes = {
  defaultFlows: PropTypes.array,
  recentFlows: PropTypes.array,
  generateFlowPermission: PropTypes.bool.isRequired,
};
