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
  color: #313131;
`;

const TextStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MainTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  font-family: 'Red Hat Display', sans-serif;
`;

const ClusterPill = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffe9d6;
  color: #444445;
  padding: 2px 6px;
  border-radius: 15px;
  border: 1px solid #ffc188;
  font-size: 12px;
  font-weight: 500;
  width: fit-content;
  gap: 6px;
  min-height: 23px;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #05df72;
  border-radius: 50%;
`;

export const AgenticAiModalTitle = () => {
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);

  return (
    <TitleContainer>
      <AiAgentIcon />
      <TextStack>
        <MainTitle>{KDFM.AGENTIC_AI_MODAL_TITLE || 'KNOWE'}</MainTitle>
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
