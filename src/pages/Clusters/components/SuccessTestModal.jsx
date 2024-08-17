/*eslint-disable*/
import styled from 'styled-components';
import { RightCircleIcon } from '../../../assets';
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
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-end: 0px;
`;

export const SuccessTestModal = ({ successTest, setSuccessTest, name }) => {
  return (
    <Modal
      title="Testing Successful"
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
        <Title className="text-capitalize">{name} Test Successful</Title>
        <Para>
          Your {name} Test was successful. You <br /> can now proceed to the
          next steps.
        </Para>
      </>
    </Modal>
  );
};
