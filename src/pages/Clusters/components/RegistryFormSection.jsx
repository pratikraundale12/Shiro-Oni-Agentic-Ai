/*eslint-disable*/
import React from 'react';
import styled from 'styled-components';
import { KDFM } from '../../../constants';
import { Button } from '../../../shared';
import CertificateTextDisplay from './CertificateTextDisplay';
import RegistryFormInputs from './RegistryFormInputs';

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
const RegistryFormSection = ({
  register,
  errors,
  testSuccess,
  test,
  setIsCertificateOpen,
  dataFill,
  checkDuplicateRegistry,
  checkDuplicateRegistryName,
  setIsCredOpen,
  testData,
  successModal,
  activeTab,
  clusterId,
  registryData,
  watchedFields,
  isCertificateUser,
  registeryCertificateOption,
  setRegisteryCertificateOption,
}) => {
  return (
    <>
      <RegistryFormInputs
        register={register}
        errors={errors}
        testSuccess={testSuccess}
        registeryCertificateOption={registeryCertificateOption}
        setRegisteryCertificateOption={setRegisteryCertificateOption}
      />
      {watchedFields?.[7] === true ? (
        <Flex>
          <>
            <div>
              <ButtonLabel>{KDFM.TEST_VIA_CERTIFICATE}</ButtonLabel>
              <Button
                onClick={() => setIsCertificateOpen(true)}
                disabled={
                  testSuccess ||
                  !dataFill ||
                  checkDuplicateRegistry ||
                  checkDuplicateRegistryName
                }
              >
                {KDFM.ADD_CERTIFICATE}
              </Button>
            </div>
            {registeryCertificateOption === false && (
              <>
                <ORText>OR</ORText>
                <div>
                  <ButtonLabel>{KDFM.TEST_VIA_CREDENTIALS}</ButtonLabel>
                  <Button
                    onClick={() => setIsCredOpen(true)}
                    disabled={
                      testSuccess ||
                      !dataFill ||
                      checkDuplicateRegistry ||
                      checkDuplicateRegistryName
                    }
                  >
                    {KDFM.ENTER_CREDENTIALS}
                  </Button>
                </div>
              </>
            )}
          </>
        </Flex>
      ) : null}
      {testSuccess && !successModal && (
        <CertificateTextDisplay
          clusterModule={false}
          activeTab={activeTab}
          clusterId={clusterId}
        />
      )}
    </>
  );
};
export default RegistryFormSection;
