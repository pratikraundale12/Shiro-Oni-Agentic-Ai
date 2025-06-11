import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { InvalidProcessorIcon, NoDataIcon } from '../../assets';
// import { KDFM } from '../../constants';
import { Modal } from '../../shared';
import { isEmpty } from 'lodash';
import SanityCheckCollapsableItem from './SanityCheckCollapsableItem';
import { NamespacesSelectors } from '../../store';
import { useSelector } from 'react-redux';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 250px;
`;
const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

const SanityCheckAuditLogReportModal = ({
  isSanityCheckModalOpen,
  setIsSanitCheckModalOpen,
}) => {
  const responseData = useSelector(
    NamespacesSelectors.getSanityReportAuditData
  );

  const handleSecondaryClick = () => {
    setIsSanitCheckModalOpen(false);
  };

  const handleRequestClose = () => {
    setIsSanitCheckModalOpen(false);
  };
  const sanityCheckData = responseData?.data?.sanity_details || [];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <InvalidProcessorIcon />
          {'Invalid Component Detected : Sanity Verification Report'}
        </div>
      }
      isOpen={isSanityCheckModalOpen}
      onRequestClose={() => handleRequestClose()}
      size="md"
      primaryButtonText={'Close'}
      onSecondarySubmit={handleSecondaryClick}
      footerAlign="start"
      onSubmit={() => {
        setIsSanitCheckModalOpen(false);
      }}
      contentStyles={{ maxWidth: '70%', maxHeight: '60%' }}
    >
      <ModalBody className="modal-body">
        {' '}
        {sanityCheckData &&
          !isEmpty(sanityCheckData) &&
          sanityCheckData?.map(item => (
            <span key={item?.processGroupId}>
              <SanityCheckCollapsableItem item={item} />
            </span>
          ))}
        {isEmpty(sanityCheckData) && (
          <div className="d-flex flex-column align-items-center mt-5">
            <NoDataIcon width={130} />
            <NoDataText>No Data Found!!</NoDataText>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

SanityCheckAuditLogReportModal.propTypes = {
  isSanityCheckModalOpen: PropTypes.bool,
  setIsSanitCheckModalOpen: PropTypes.func,
};

export default SanityCheckAuditLogReportModal;
