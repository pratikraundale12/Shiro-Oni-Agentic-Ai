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
`;

// const ModalText = styled.p`
//   text-align: center;
//   margin-bottom: 1.5rem;
// `;

const InfoSection = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const Value = styled.div`
  font-size: 0.875rem;
  color: #555;
  margin-bottom: 0.75rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  background-color: #f5f7f9;
`;

const CommitLocalChangesModal = ({
  isOpen,
  onClose,
  onSubmit,
  flowDescription = 'Empty string set',
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

  return (
    <Modal
      title="Save Flow Version"
      isOpen={isOpen}
      onRequestClose={onClose}
      size="md"
      primaryButtonText="Commit"
      secondaryButtonText="Cancel"
      onSubmit={handleSubmit}
      contentStyles={{ minWidth: '60%', maxHeight: '80%' }}
    >
      <ModalContent>
        <InfoSection>
          <Label>Registry</Label>
          <Value>{registryData?.name}</Value>
        </InfoSection>

        <InfoSection>
          <Label>Bucket</Label>
          <Value>{selectedNameSpace?.bucketName}</Value>
        </InfoSection>

        <InfoSection>
          <Label>Flow Name</Label>
          <Value>{selectedNameSpace?.flowName}</Value>
        </InfoSection>

        <InfoSection>
          <Label>Flow Description</Label>
          <Value>{flowDescription}</Value>
        </InfoSection>

        <InfoSection>
          <Label>Version Comments</Label>
          <TextArea
            value={versionComments}
            onChange={e => setVersionComments(e.target.value)}
            placeholder="Enter version comments here..."
          />
        </InfoSection>
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
