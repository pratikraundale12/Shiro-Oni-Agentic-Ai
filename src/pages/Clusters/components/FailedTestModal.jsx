/*eslint-disable*/
import styled from 'styled-components';
import { ExclamationFailedTestingIcon } from '../../../assets';
import { KDFM } from '../../../constants';
import { Modal } from '../../../shared';

const Icon = styled.div`
  align-items: center !important;
  justify-content: center !important;
  display: flex !important;
`;

const Title = styled.h5`
  font-family: noto sans;
  font-size: 20px;
  font-weight: 700;
  text-transform: capitalize;
  color: #2d343f;
  line-height: 24px;
  letter-spacing: -0.02em;
  text-align: center !important;
  padding-top: 1.5rem !important;
  margin-bottom: 0 !important;
  margin-top: 0.5rem !important;
`;

const Para = styled.p`
  text-align: center;
  margin-bottom: 0 !important;
  margin-top: 0;
  margin-bottom: 1rem;
  box-sizing: border-box;
  display: block;
  text-transform: capitalize;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-end: 0px;
`;

export const FailedTestModal = ({ failedTest, setFailedTest, testMessage }) => {
  return (
    <Modal
      title="Testing Failed"
      isOpen={failedTest}
      onRequestClose={() => setFailedTest(false)}
      size="sm"
      primaryButtonText="Continue"
      onSubmit={() => setFailedTest(false)}
    >
      <>
        <Icon>
          <ExclamationFailedTestingIcon color="#FF7A00" />
        </Icon>
        <Title>{KDFM.CLUSTER_TEST_FAILED}</Title>
        {testMessage != '' ? (
          <Para>{testMessage}</Para>
        ) : (
          <Para>{KDFM.PFX_TEST_FAIL_MESSAGE}</Para>
        )}
      </>
    </Modal>
  );
};
