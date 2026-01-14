import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { NamespacesSelectors } from '../../store';
import { AiAgentIcon } from '../../assets';
import { KDFM } from '../../constants';

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
`;

const TextStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MainTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  font-family: 'Red Hat Display', sans-serif;
`;

const ClusterPill = styled.div`
  display: flex;
  align-items: center;
  background-color: #fef0e6;
  color: #444445;
  padding: 2px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  width: fit-content;
  gap: 6px;
  min-height: 23px;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #0cbf59;
  border-radius: 50%;
`;

export const AgenticAiModalTitle = () => {
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);

  return (
    <TitleContainer>
      <AiAgentIcon />
      <TextStack>
        <MainTitle>{KDFM.AGENTIC_AI_MODAL_TITLE || 'DFM Assistant'}</MainTitle>
        {selectedCluster?.label && (
          <ClusterPill>
            <StatusDot />
            {selectedCluster.label}
          </ClusterPill>
        )}
      </TextStack>
    </TitleContainer>
  );
};
