/*eslint-disable*/
import { Modal } from '../../../shared';
import { RightCircleIcon } from '../../../assets';
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

export const SuccessTestModal = ({ successTest, setSuccessTest, name }) => {
  return (
    <Modal
      title="Testing Successfull"
      isOpen={successTest}
      onRequestClose={() => setSuccessTest(false)}
      size="sm"
      primaryButtonText="Continue"
      onSubmit={() => setSuccessTest(false)}
    >
      <>
        <Icon>
          <RightCircleIcon color="#0CBF59" />
        </Icon>
        <Title>{name} Test Successful</Title>
        <Para>
          Your {name} Test was successful. You <br /> can now proceed to the
          next steps.
        </Para>
      </>
    </Modal>
  );
};
