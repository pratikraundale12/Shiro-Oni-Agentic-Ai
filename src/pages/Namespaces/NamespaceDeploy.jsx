import React from 'react';
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
    border: 1px solid #c52b2b;
  }

  & span {
    position: absolute;
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
    font-weight: 500;
    line-height: 23px;
    color: #b5bdc8;
  }

  &.div-btn-1:hover svg path,
  &.div-btn-1:hover span {
    fill: #58e715;
    color: #58e715;
  }

  &.div-btn-2:hover svg path,
  &.div-btn-2:hover span {
    fill: #c52b2b;
    color: #c52b2b;
  }

  &.div-btn-3:hover svg path,
  &.div-btn-3:hover span {
    fill: #cf9f5d;
    color: #cf9f5d;
  }

  &.div-btn-4:hover svg path,
  &.div-btn-4:hover span {
    fill: #2c7cf3;
    color: #2c7cf3;
  }
`;

const NamespaceDeploy = ({
  isOpen,
  closePopup,
  openParameterContext,
  countDetails,
  upgradeData,
  selectedVersion,
  selectedClusterName,
}) => {
  console.log(countDetails?.data[0]?.runningCount, 'countDetails');
  return (
    <Modal
      title="Namespace Deployed"
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="sm"
      onSecondarySubmit={openParameterContext}
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
                <span>{countDetails?.data[0]?.runningCount}</span>
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-2">
                <SquareBoxIcon color="#B5BDC8" />
                <span>{countDetails?.data[0]?.stoppedCount}</span>
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-3">
                <TriangleExclamationMarkIcon color="#B5BDC8" />
                <span>{countDetails?.data[0]?.invalidCount}</span>
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-4">
                <SmallNotThunderIcon color="#B5BDC8" />
                <span>{countDetails?.data[0]?.disabledCount}</span>
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
                <TriangleIcons color="#B5BDC8" />
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-2">
                <SquareBoxIcon color="#B5BDC8" />
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-3">
                <SmallThunderIcon color="#B5BDC8" />
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-4">
                <SmallNotThunderIcon color="#B5BDC8" />
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
  openParameterContext: PropTypes.func,
  countDetails: PropTypes.func,
  upgradeData: PropTypes.shape({
    name: PropTypes.string,
    // Add other properties if known
  }),
  selectedVersion: PropTypes.string,
  selectedClusterName: PropTypes.string,
};

export default NamespaceDeploy;
