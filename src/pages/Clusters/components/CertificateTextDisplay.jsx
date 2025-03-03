/*eslint-disable*/
import React from 'react';
import styled from 'styled-components';
import { RightCircleIcon } from '../../../assets';
import { CLUSTER_MODULE_TABS, KDFM } from '../../../constants';

const UploadCertificateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  margin-top: auto;
  height: 95px;
`;
const CertificateMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;
const TextTest = styled.div`
  font-family: ${props => props.theme.fontNato};
  font-weight: 500;
  font-size: 1.25rem;
  color: #444445;
  line-height: 27.24px;
  max-width: 100%;
`;
const CertificateTextDisplay = ({
  clusterModule,
  activeTab = '',
  clusterId = '',
}) => {
  const giveTestText = () => {
    return activeTab === CLUSTER_MODULE_TABS.REGISTRY
      ? KDFM.REGISTRY_TESTED_SUCCESS_PROMPT
      : KDFM.CLUSTER_TESTED_SUCCESSFULLY;
  };
  const giveTestClusterTexts = () => {
    if (activeTab === CLUSTER_MODULE_TABS.CLUSTER) {
      if (clusterId) {
        return KDFM.CLUSTER_TESTED_SUCCES;
      } else {
        return KDFM.CLUSTER_TESTED_SUCCES_PROMPT;
      }
    } else {
      return KDFM.REGISTRY_TESTED_SUCCESS_PROMPT;
    }
  };
  return (
    <UploadCertificateContainer>
      <CertificateMessage>
        <RightCircleIcon width={60} height={60} />
        <TextTest>
          {clusterModule ? giveTestClusterTexts() : giveTestText()}
        </TextTest>
      </CertificateMessage>
    </UploadCertificateContainer>
  );
};
export default CertificateTextDisplay;
