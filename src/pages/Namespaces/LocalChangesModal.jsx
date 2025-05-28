import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  CircleArrowIcon,
  LocalChangeIcon,
  RevertLocalChangesIcon,
  SmallSearchIcon,
} from '../../assets';
import { Table, TextRender } from '../../components';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { theme } from '../../styles';
// import CommitLocalChangesModal from './CommitLocalChangesModal';

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
`;

const ModalText = styled.p`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalTitle = styled.h3`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.dark || '#000'};
`;
const ConfirmModalTitle = styled.h3`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.dark || '#000'};
`;
const ConfirmModalDescription = styled.p`
  text-align: center;
  font-size: 16px;
  font-family: Red Hat Display;
  font-weight: 500;
  line-height: 24px;
`;

const ModalDescription = styled.p`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 16px;
  font-family: Red Hat Display;
  font-weight: 500;
  line-height: 24px;
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
  /* margin-top: 1rem; */
  max-height: 400px;
  overflow-y: auto;
`;

const TableContainer = styled.div`
  width: 100%;
  /* margin-top: 1rem; */
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

const LocalChangesModal = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const isOpen = useSelector(NamespacesSelectors.getLocalChangesModalOpen);
  const type = useSelector(NamespacesSelectors.getLocalChangesModalType);
  const showConfirmation = useSelector(
    NamespacesSelectors.getRevertConfirmationModalOpen
  );
  const fetchLocalChanges = useSelector(NamespacesSelectors.getLocalChanges);
  const selectedNameSpace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );

  useEffect(() => {
    if (type === 'show' || type === 'revert') {
      dispatch(NamespacesActions.fetchLocalChanges());
    }
  }, [dispatch, type]);

  const handleIdClick = componentLink => {
    window.open(componentLink, '_blank');
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

  const getModalSize = () => {
    switch (type) {
      case 'local':
        return 'sm';
      case 'show':
      case 'revert':
        return 'md';
      default:
        return 'sm';
    }
  };

  const getModalContent = () => {
    switch (type) {
      case 'local':
        return (
          <>
            <ModalTitle>Are you sure you want to Proceed?</ModalTitle>
            <ModalDescription>
              Committing will ignore available Upgrades and commit local changes
              as the next version
            </ModalDescription>
          </>
        );
      case 'show':
        return (
          <div>
            The following changes have been made to{' '}
            <HighlightedText>
              {selectedNameSpace?.name} (Version {selectedNameSpace?.version})
            </HighlightedText>
            .
          </div>
        );
      case 'revert':
        return (
          <div>
            The following changes have been made to{' '}
            <HighlightedText>
              {selectedNameSpace?.name} (Version {selectedNameSpace?.version})
            </HighlightedText>
            . Revert will remove all changes.
          </div>
        );
      default:
        return <ModalText></ModalText>;
    }
  };
  const getButtonText = type => {
    switch (type) {
      case 'local':
        return 'Confirm';
      case 'revert':
        return 'Revert';
      default:
        return undefined;
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
              onClick={() => handleIdClick(item?.componentLink)}
              type="button"
            >
              <CircleArrowIcon />
            </button>
          </>
        </div>
      ),
    },
  ];

  const handleMainModalClose = () => {
    dispatch(NamespacesActions.setLocalChangesModalOpen(false));
    dispatch(NamespacesActions.setLocalChangesModalType(null));
  };

  const handleRevertChanges = () => {
    dispatch(NamespacesActions.setLocalChangesModalOpen(false));
    dispatch(NamespacesActions.setRevertConfirmationModalOpen(true));
  };

  const handleConfirmRevert = () => {
    dispatch(NamespacesActions.revertLocalChanges());
    dispatch(NamespacesActions.setRevertConfirmationModalOpen(false));
    handleMainModalClose();
  };

  const handleCancelRevert = () => {
    dispatch(NamespacesActions.setRevertConfirmationModalOpen(false));
    dispatch(NamespacesActions.setLocalChangesModalOpen(true));
  };

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
        onRequestClose={handleMainModalClose}
        size={getModalSize(type)}
        primaryButtonText={getButtonText(type)}
        secondaryButtonText="Cancel"
        onSubmit={handleRevertChanges}
        contentStyles={
          type === 'local'
            ? { width: '400px', maxWidth: '90%' }
            : { width: '800px', maxWidth: '95%', maxHeight: '80vh' }
        }
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

      <Modal
        title="Confirm Revert Local Changes"
        isOpen={showConfirmation}
        onRequestClose={handleCancelRevert}
        size="sm"
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        onSubmit={handleConfirmRevert}
        contentStyles={{ width: '400px', maxWidth: '90%' }}
      >
        <div>
          <div className="d-flex justify-center mb-4">
            <RevertLocalChangesIcon />
          </div>

          <ConfirmModalTitle>
            Are you sure you want to revert these changes?
          </ConfirmModalTitle>
          <ConfirmModalDescription>
            All local changes will be reverted to the current version.
          </ConfirmModalDescription>
        </div>
      </Modal>
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
