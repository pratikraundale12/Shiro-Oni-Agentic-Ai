/*eslint-disable*/
import { Modal } from '../../../shared';
import { ExclamationFailedTestingIcon } from '../../../assets';
import styled from 'styled-components';

const Icon = styled.div`
  align-items: center !important;
  justify-content: center !important;
  display: flex !important;
`;

const Title = styled.h5`
  ont-family: noto sans;
  font-size: 20px;
  font-weight: 700;
  color: 2D343F;
  line-height: 24px;
  letter-spacing: -0.02em;
  text-align: center !important;
  padding-top: 1.5rem !important;
  margin-bottom: 0 !important;
  margin-top: 0.5rem !important;
`;

const Para = styled.p`
  margin-bottom: 0 !important;
  margin-top: 0;
  margin-bottom: 1rem;
  box-sizing: border-box;
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 140px;
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
          <ExclamationFailedTestingIcon />
        </Icon>
        <Title>Cluster Test Failed</Title>
        {testMessage != '' ? (
          <p className="pt-3 mb-0 text-center">{testMessage}</p>
        ) : (
          <Para>
            We encountered an issue while testing your cluster. Please check if
            your File is Correct
          </Para>
        )}
      </>
    </Modal>
  );
};
