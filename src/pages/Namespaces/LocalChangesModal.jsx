import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ArrowIcon, LocalChangeIcon, SmallSearchIcon } from '../../assets';
import { Table, TextRender } from '../../components';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { theme } from '../../styles';
import CommitLocalChangesModal from './CommitLocalChangesModal';

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  padding: 1.5rem;
`;

const ModalText = styled.p`
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HighlightedText = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

const IconContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChangesContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
`;

const TableContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;

  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
`;

const Search = styled.input`
  width: 100%;
  border-radius: 2px;
  padding: 12px 12px 12px 40px;
  font-size: 16px;
  margin: 14px 0;
  font-family: ${props => props.theme.fontRedHat};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.lightGrey};

  &:focus-visible {
    outline: none;
  }
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

const TextDiv = styled.div`
  margin-right: 80px;
`;

const LocalChangesModal = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  localChanges,
}) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const fetchLocalChanges = useSelector(NamespacesSelectors.getLocalChanges);
  const selectedNameSpace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );

  useEffect(() => {
    if (type === 'show' || type === 'revert') {
      dispatch(NamespacesActions.fetchLocalChanges());
    }
  }, [dispatch, type]);

  const handleConfirm = () => {
    if (type === 'local') {
      onClose();
      setIsCommitModalOpen(true);
    } else {
      onSubmit();
    }
  };

  const handleCommitSubmit = data => {
    setIsCommitModalOpen(false);
    onSubmit(data);
  };

  const getModalTitle = () => {
    switch (type) {
      case 'local':
        return 'Commit Local Changes';
      case 'show':
        return 'Show Local Changes';
      case 'revert':
        return 'Revert Local Changes';
      default:
        return 'Local Changes';
    }
  };

  const getModalContent = () => {
    switch (type) {
      case 'local':
        return (
          <ModalText>
            Committing will ignore available upgrades and commit local changes
            as the next version. Are you sure you want to proceed?
          </ModalText>
        );
      case 'show':
        return (
          <TextDiv>
            The following changes have been made to{' '}
            <HighlightedText>
              {selectedNameSpace?.name} (Version {selectedNameSpace?.version})
            </HighlightedText>
            .
          </TextDiv>
        );
      case 'revert':
        return (
          <TextDiv>
            The following changes have been made to{' '}
            <HighlightedText>
              {selectedNameSpace?.name} (Version {selectedNameSpace?.version})
            </HighlightedText>
            . Revert will remove all changes.
          </TextDiv>
        );
      default:
        return <ModalText></ModalText>;
    }
  };

  const COLUMNS = [
    {
      label: 'Component Name',
      renderCell: item => <TextRender text={item.componentName} />,
      width: '30%',
      resize: true,
    },
    {
      label: 'Change Type',
      renderCell: item => <TextRender text={item.componentType} />,
      width: '30%',
      resize: true,
    },
    {
      label: 'Difference',
      renderCell: item => <TextRender text={item.difference} />,
      width: '30%',
      resize: true,
    },
    {
      label: '',
      renderCell: item => (
        <div className="text-center">
          <>
            <button
              className="border-0 bg-white"
              onClick={() => console.log('Navigate to details', item)}
            >
              <ArrowIcon />
            </button>
          </>
        </div>
      ),
    },
  ];

  const renderTable = () => {
    const filteredData = fetchLocalChanges?.data?.changes?.filter(
      item =>
        item.componentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.componentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.difference?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(filteredData, 'filteredData');

    return (
      <>
        <SearchContainer>
          <SmallSearchIcon
            width={18}
            height={18}
            color={theme.colors.darkGrey1}
          />
          <Search
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <TableContainer>
          <Table
            data={filteredData}
            columns={COLUMNS}
            className="local-changes-table"
          />
        </TableContainer>
      </>
    );
  };

  return (
    <>
      <Modal
        title={getModalTitle()}
        isOpen={isOpen}
        onRequestClose={onClose}
        size="md"
        primaryButtonText={type === 'local' ? 'Confirm' : undefined}
        secondaryButtonText="Cancel"
        onSubmit={handleConfirm}
        contentStyles={{ minWidth: '60%', maxHeight: '80%' }}
      >
        <ModalContent>
          {type === 'local' && (
            <IconContainer>
              <LocalChangeIcon />
            </IconContainer>
          )}
          {getModalContent()}
          {(type === 'show' || type === 'revert') && (
            <ChangesContainer>{renderTable()}</ChangesContainer>
          )}
        </ModalContent>
      </Modal>

      <CommitLocalChangesModal
        isOpen={isCommitModalOpen}
        onClose={() => setIsCommitModalOpen(false)}
        onSubmit={handleCommitSubmit}
        localChanges={localChanges}
      />
    </>
  );
};

LocalChangesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['local', 'show', 'revert']).isRequired,
  localChanges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      component: PropTypes.string,
      type: PropTypes.string,
      changes: PropTypes.string,
      status: PropTypes.string,
    })
  ),
};

export default LocalChangesModal;
