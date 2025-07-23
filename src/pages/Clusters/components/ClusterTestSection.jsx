/*eslint-disable*/
import React from 'react';
import styled from 'styled-components';
import { KDFM } from '../../../constants';
import { Button } from '../../../shared';

const Flex = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;
const ButtonLabel = styled.h6`
  margin-bottom: 10px;
  color: #425466;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  margin-top: 15px;
`;
const ORText = styled.div`
  color: #7a7a9d;
  font-weight: 500;
  font-size: 20px;
  line-height: 26px;
`;

const ClusterTestSection = ({
  test,
  setIsCertificateOpen,
  testSuccess,
  dataFill,
  checkDuplicate,
  checkDuplicateName,
  setIsCredOpen,
  watchedFields,
  testData,
  data,
  certificateOption = false,
}) => {
const isDisabled = () => {
  if (certificateOption !== data?.is_certificate_based_service_account) {
    return false;
  }

  return (
    testSuccess ||
    !dataFill ||
    checkDuplicate ||
    checkDuplicateName ||
    watchedFields?.[1] === data?.nifi_url
  );
};

  return (
    <Flex>
      {test ? (
        <>
          <div>
            <ButtonLabel>{KDFM.TEST_VIA_CERTIFICATE}</ButtonLabel>
            <Button
              onClick={() => setIsCertificateOpen(true)}
              disabled={isDisabled()}
            >
              {KDFM.ADD_CERTIFICATE}
            </Button>
          </div>
          {certificateOption === false && (
            <>
              <ORText>{KDFM.SEPARATOR}</ORText>
              <div>
                <ButtonLabel>{KDFM.TEST_VIA_CREDENTIALS}</ButtonLabel>
                <Button
                  onClick={() => setIsCredOpen(true)}
                  disabled={isDisabled()}
                >
                  {KDFM.ENTER_CREDENTIALS}
                </Button>
              </div>
            </>
          )}
        </>
      ) : (
        <div>
          <ButtonLabel>{KDFM.TEST_CLUSTER}</ButtonLabel>
          <Button onClick={testData}>{KDFM.TEST_CLUSTER}</Button>
        </div>
      )}
    </Flex>
  );
};
export default ClusterTestSection;
