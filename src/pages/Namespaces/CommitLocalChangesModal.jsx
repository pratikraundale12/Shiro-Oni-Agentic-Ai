import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Modal } from '../../shared';
import { GridSelectors, NamespacesSelectors } from '../../store';

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  min-height: 400px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Value = styled.div`
  font-size: 0.875rem;
  color: #666;
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  min-height: 20px;
`;

const TextAreaSection = styled.div`
  margin-bottom: 1.5rem;
  flex: 1;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.875rem;
  background-color: #fff;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

// const ButtonContainer = styled.div`
//   display: flex;
//   gap: 0.75rem;
//   justify-content: flex-start;
//   margin-top: auto;
//   padding-top: 1rem;
//   border-top: 1px solid #e9ecef;
// `;

// const Button = styled.button`
//   padding: 0.5rem 1.5rem;
//   border-radius: 4px;
//   font-size: 0.875rem;
//   font-weight: 500;
//   cursor: pointer;
//   border: 1px solid;
//   transition: all 0.2s ease;

//   &:focus {
//     outline: none;
//     box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
//   }
// `;

// const CancelButton = styled(Button)`
//   background-color: #fff;
//   color: #6c757d;
//   border-color: #6c757d;

//   &:hover {
//     background-color: #6c757d;
//     color: #fff;
//   }
// `;

// const SaveButton = styled(Button)`
//   background-color: #ff7a00;
//   color: #fff;
//   border-color: #ff7a00;

//   &:hover {
//     background-color: #ff7a00;
//     border-color: #ff7a00;
//   }

//   &:disabled {
//     background-color: #ccc;
//     border-color: #ccc;
//     cursor: not-allowed;
//   }
// `;

const CommitLocalChangesModal = ({
  isOpen,
  onClose,
  onSubmit,
  flowDescription = 'Empty String Set',
}) => {
  const [versionComments, setVersionComments] = React.useState('');
  const selectedNameSpace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );
  const registryData = useSelector(state =>
    GridSelectors.getNamespaceGridRegistry(state, 'namespaces')
  );

  const handleSubmit = () => {
    onSubmit({ versionComments });
  };

  // const handleCancel = () => {
  //   setVersionComments('');
  //   onClose();
  // };

  return (
    <Modal
      title="Save Flow Version"
      isOpen={isOpen}
      onRequestClose={onClose}
      size="md"
      primaryButtonText="Commit"
      secondaryButtonText="Cancel"
      onSubmit={handleSubmit}
      contentStyles={{
        minWidth: '500px',
        maxWidth: '600px',
        maxHeight: '80vh',
      }}
    >
      <ModalContent>
        <InfoGrid>
          <InfoSection>
            <Label>Registry</Label>
            <Value>{registryData?.name || 'Registry'}</Value>
          </InfoSection>

          <InfoSection>
            <Label>Bucket</Label>
            <Value>
              {selectedNameSpace?.bucketName || 'StreamingAnalytics_Bucket'}
            </Value>
          </InfoSection>

          <InfoSection>
            <Label>Flow Name</Label>
            <Value>
              {selectedNameSpace?.flowName || 'MYSQL-Flow_Test_John'}
            </Value>
          </InfoSection>

          <InfoSection>
            <Label>Flow Description</Label>
            <Value>{flowDescription}</Value>
          </InfoSection>
        </InfoGrid>

        <TextAreaSection>
          <Label>Version Comments</Label>
          <TextArea
            value={versionComments}
            onChange={e => setVersionComments(e.target.value)}
            placeholder="Enter Version Comments"
          />
        </TextAreaSection>

        {/* <ButtonContainer>
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          <SaveButton onClick={handleSubmit}>Save</SaveButton>
        </ButtonContainer> */}
      </ModalContent>
    </Modal>
  );
};

CommitLocalChangesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  registry: PropTypes.string,
  bucket: PropTypes.string,
  flowName: PropTypes.string,
  flowDescription: PropTypes.string,
  localChanges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      address: PropTypes.string,
      type: PropTypes.string,
      changes: PropTypes.string,
    })
  ),
};

export default CommitLocalChangesModal;
