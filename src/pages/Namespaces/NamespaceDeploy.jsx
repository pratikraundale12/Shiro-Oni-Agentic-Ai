import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../shared';
import styled from 'styled-components';
import {
  GreenRightCircleIcon,
  SmallNotThunderIcon,
  SmallThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import { updateNamespaceStatus } from '../../utils/services';
import { toast } from 'react-toastify';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;
const ModalIcon = styled.div`
  align-items: center;
  justify-content: center;
`;
const ModalHFive = styled.h5`
  text-align: center !important;
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 700;
  color: #2d343f;
  line-height: 24px;
  letter-spacing: -0.02em;
`;
const RowModal = styled.div`
  margin-top: 1.5rem !important;
  display: flex;
  flex-wrap: wrap;
`;
const ColumnThree = styled.div`
  margin-bottom: 1rem !important;
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-3 {
    flex: 0 0 auto;
    width: 25%;
  }
`;
const RowModalDiv = styled.div`
  align-items: flex-start !important;
  justify-content: space-around !important;
  flex-direction: column !important;
`;
const ActionTitleSet = styled.h6`
  font-size: 14px;
  font-weight: 700;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  color: #2d343f;
`;
const SubTitleSet = styled.p`
  color: #7a7a7a !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  line-height: 18.52px !important;
  letter-spacing: -0.005em Im !important;
`;
const CustomNine = styled.div`
  margin-bottom: 1rem !important;
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-9 {
    flex: 0 0 auto;
    width: 75%;
  }
`;
const ActiveButtonContainer = styled.div`
  align-items: center;
  justify-content: flex-start !important;
  gap: 7px;
`;

const ActiveButtonDiv = styled.div`
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  border: 1px solid #dde4f0;
  border-radius: 8px;
  background-color: #f5f7fa;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border: 1px solid
      ${props => (props.isActive ? props.activeColor : '#c52b2b')};
  }

  & span {
    position: absolute;
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
    font-weight: 500;
    line-height: 23px;
    color: ${props => (props.isActive ? '#fff' : '#b5bdc8')};
  }

  svg path {
    fill: ${props => (props.isActive ? props.activeColor : '#b5bdc8')};
  }
`;

const NamespaceDeploy = ({
  isOpen,
  closePopup,
  getParamerterContext,
  countDetails,
  upgradeData,
  selectedVersion,
  selectedClusterName,
  selectedClusterId,
  deployCountDetails,
}) => {
  const [activeButton, setActiveButton] = useState(null);

  const handleUpdateStatus = async (state, buttonId) => {
    try {
      const clusterId = selectedClusterId;
      console.log(clusterId);

      const namespaceId = upgradeData?.id;
      console.log(namespaceId);
      await updateNamespaceStatus(clusterId, namespaceId, state);
      setActiveButton(buttonId);
      toast.success(`Namespace status updated to ${state}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(`Failed to update namespace status to ${state}`);
    }
  };
  return (
    <Modal
      title="Namespace Deployed"
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="sm"
      onSecondarySubmit={getParamerterContext}
      secondaryButtonText="ParaMeter Context"
      primaryButtonText="Navigate"
      contentStyles={{ maxWidth: '45%', maxHeight: '50%' }}
      //   onSubmit={handleSubmit(onSubmit)}
    >
      <ModalBody className="modal-body">
        <ModalIcon className="d-flex ">
          <GreenRightCircleIcon />
        </ModalIcon>
        <ModalHFive className="pt-4 mt-2 mb-0 ">
          {upgradeData?.name} Namespace successfully deployed to{' '}
          {selectedClusterName} cluster instance
        </ModalHFive>
        <RowModal>
          <ColumnThree className="col-3 mb-3">
            <RowModalDiv className="d-flex  h-100  ">
              <ActionTitleSet className="mb-0 ">Namespace</ActionTitleSet>
              <SubTitleSet className="mb-0 ">{upgradeData?.name}</SubTitleSet>
            </RowModalDiv>
          </ColumnThree>
          <CustomNine className="col-9 mb-3">
            <ActiveButtonContainer className="d-flex ">
              <ActiveButtonDiv className="div-btn-1">
                <TriangleIcons color="#B5BDC8" />
                <span>
                  {countDetails?.data[0]?.runningCount ||
                    deployCountDetails?.data?.runningCount}
                </span>
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-2">
                <SquareBoxIcon color="#B5BDC8" />
                <span>
                  {countDetails?.data[0]?.stoppedCount ||
                    deployCountDetails?.data?.stoppedCount}
                </span>
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-3">
                <TriangleExclamationMarkIcon color="#B5BDC8" />
                <span>
                  {countDetails?.data[0]?.invalidCount ||
                    deployCountDetails?.data?.invalidCount}
                </span>
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-4">
                <SmallNotThunderIcon color="#B5BDC8" />
                <span>
                  {countDetails?.data[0]?.disabledCount ||
                    deployCountDetails?.data?.disabledCount}
                </span>
              </ActiveButtonDiv>
            </ActiveButtonContainer>
          </CustomNine>
          <ColumnThree className="col-3 mb-3">
            <RowModalDiv className="d-flex  h-100  ">
              <ActionTitleSet className="mb-0 ">Current Version</ActionTitleSet>
              <SubTitleSet className="mb-0 ">{selectedVersion}</SubTitleSet>
            </RowModalDiv>
          </ColumnThree>
          <CustomNine className="col-9 mb-3">
            <ActiveButtonContainer className="d-flex ">
              <ActiveButtonDiv className="div-btn-1">
                <ActiveButtonDiv
                  className="div-btn-1"
                  isActive={activeButton === 'RUNNING'}
                  activeColor="#58e715"
                  hoverColor="#58e715"
                  activeTextColor="#fff"
                  onClick={() => handleUpdateStatus('RUNNING', 'RUNNING')}
                >
                  <TriangleIcons color="#B5BDC8" />
                </ActiveButtonDiv>
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-2">
                <ActiveButtonDiv
                  className="div-btn-1"
                  isActive={activeButton === 'STOPPED'}
                  activeColor="#c52b2b"
                  hoverColor="#c52b2b"
                  activeTextColor="#fff"
                  onClick={() => handleUpdateStatus('STOPPED', 'STOPPED')}
                >
                  <SquareBoxIcon
                    color="#B5BDC8"
                    onClick={() => handleUpdateStatus('STOPPED')}
                  />
                </ActiveButtonDiv>
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-3">
                <ActiveButtonDiv
                  className="div-btn-1"
                  isActive={activeButton === 'ENABLED'}
                  activeColor="#cf9f5d"
                  hoverColor="#cf9f5d"
                  activeTextColor="#fff"
                  onClick={() => handleUpdateStatus('ENABLED', 'ENABLED')}
                >
                  <SmallThunderIcon
                    color="#B5BDC8"
                    onClick={() => handleUpdateStatus('ENABLED')}
                  />
                </ActiveButtonDiv>
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-4">
                <ActiveButtonDiv
                  className="div-btn-1"
                  isActive={activeButton === 'DISABLED'}
                  activeColor="#2c7cf3"
                  hoverColor="#2c7cf3"
                  activeTextColor="#fff"
                  onClick={() => handleUpdateStatus('DISABLED', 'DISABLED')}
                >
                  <SmallNotThunderIcon
                    color="#B5BDC8"
                    onClick={() => handleUpdateStatus('DISABLED')}
                  />
                </ActiveButtonDiv>
              </ActiveButtonDiv>
            </ActiveButtonContainer>
          </CustomNine>
        </RowModal>
      </ModalBody>
    </Modal>
  );
};

NamespaceDeploy.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  getParamerterContext: PropTypes.func,
  countDetails: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        runningCount: PropTypes.number,
        stoppedCount: PropTypes.number,
        invalidCount: PropTypes.number,
        disabledCount: PropTypes.number,
      })
    ),
  }),
  upgradeData: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  selectedVersion: PropTypes.string,
  selectedClusterName: PropTypes.string,
  selectedClusterId: PropTypes.string,
  deployCountDetails: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        runningCount: PropTypes.number,
        stoppedCount: PropTypes.number,
        invalidCount: PropTypes.number,
        disabledCount: PropTypes.number,
      })
    ),
  }),
};

export default NamespaceDeploy;
