import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { GeneratedFlowIcon } from '../../assets';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import { KDFM } from '../../constants';

const FlowsWrapper = styled.div`
  max-height: 20vh;
  overflow: auto;
  height: auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  padding: 15px;
  gap: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(406px, 1fr));
  @media (max-width: 991.98px) {
    grid-template-columns: repeat(auto-fill, minmax(306px, 1fr));
  }
`;

const FlowItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  // width: 480px;
  height: 56px;
  cursor: pointer;
  border-radius: 10px;
  background: rgba(245, 247, 250, 1);
  padding: 17px;
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
  recentFlows = [],
  isJsonEmpty,
  setQueryText,
  loading,
  setQueryLable,
  allowToGenerate,
  refresh,
}) => {
  const flowData = (!isEmpty(recentFlows) ? recentFlows : []).slice(0, 6);

  const handleRecentFlowClick = flow => {
    if (allowToGenerate) {
      refresh();
      setQueryText(flow?.prompt);
      setQueryLable(flow?.short_name);
      return;
    }
    if (loading && !allowToGenerate) {
      if (!toast.isActive('generating-flow')) {
        toast.warning('Flow is generating please wait', {
          toastId: 'generating-flow',
        });
      }
    } else if (generateFlowPermission && isJsonEmpty) {
      setQueryText(flow?.prompt);
      setQueryLable(flow?.short_name);
    } else {
      if (!isJsonEmpty) {
        if (!toast.isActive('already-generated')) {
          toast.warning(
            'Please save the already generated flow or refresh the conversation to generate a new flow',
            {
              toastId: 'already-generated',
            }
          );
        }
      } else if (!generateFlowPermission) {
        if (!toast.isActive('permission-error')) {
          toast.error(KDFM.NO_PERMISSION_TO_GENERATE_FLOW, {
            toastId: 'permission-error',
          });
        }
      }
    }
  };
  return (
    <FlowsWrapper>
      {!isEmpty(flowData) &&
        flowData?.map(flow => (
          <>
            <FlowItems
              key={flow.flow_id}
              onClick={() => handleRecentFlowClick(flow)}
            >
              <GeneratedFlowIcon />
              <FlowName data-tooltip-id={`flow-name-tooltip-${flow.flow_id}`}>
                {flow.short_name || 'AI Generated Nifi Flow'}
              </FlowName>
            </FlowItems>
            <ReactTooltip
              id={`flow-name-tooltip-${flow.flow_id}`}
              place="right"
              content={flow.short_name || 'AI Generated Nifi Flow'}
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
  openConversation: PropTypes.bool.isRequired,
  setQueryText: PropTypes.func,
  loading: PropTypes.bool,
  setQueryLable: PropTypes.func,
  isValidFlowGenerated: PropTypes.bool,
  isJsonEmpty: PropTypes.bool,
  allowToGenerate: PropTypes.bool,
  refresh: PropTypes.func,
};
