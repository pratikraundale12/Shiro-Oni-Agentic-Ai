import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../shared';
import styled from 'styled-components';
import {
  SmallNotThunderIcon,
  SmallThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';

const ModalBody = styled.div`
  padding: 35px 16px 25px;
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
  margin-right: 1.5rem;
  margin-left: 1.5rem;
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

const NamespaceDeploy = ({ isOpen, closePopup, openParameterContext }) => {
  return (
    <Modal
      title="Namespace Deployed"
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="md"
      onSecondarySubmit={openParameterContext}
      secondaryButtonText="ParaMeter Context"
      primaryButtonText="Navigate"
      //   onSubmit={handleSubmit(onSubmit)}
    >
      <ModalBody className="modal-body">
        <ModalIcon className="d-flex ">
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M70 140C108.66 140 140 108.66 140 70C140 31.3401 108.66 0 70 0C31.3401 0 0 31.3401 0 70C0 108.66 31.3401 140 70 140Z"
              fill="#0CBF59"
            />
            <path
              d="M64.0529 95.3127C63.9278 95.3127 63.8025 95.3097 63.677 95.3036C62.5699 95.2502 61.4875 94.958 60.504 94.447C59.5204 93.936 58.659 93.2183 57.9789 92.3431L47.2413 78.5374C45.991 76.9262 45.4308 74.8848 45.6837 72.8611C45.9366 70.8373 46.9819 68.9966 48.5903 67.7425L48.9765 67.4418C50.5879 66.1916 52.6294 65.6315 54.6532 65.8844C56.677 66.1373 58.5179 67.1825 59.7721 68.7908C60.3773 69.569 61.1435 70.2072 62.0182 70.6617C62.8929 71.1163 63.8555 71.3765 64.8401 71.4245C65.8247 71.4725 66.808 71.3072 67.7228 70.9398C68.6376 70.5725 69.4622 70.0119 70.1402 69.2963L91.9431 46.2811C92.6379 45.5477 93.4704 44.9583 94.393 44.5466C95.3155 44.1349 96.3102 43.909 97.3201 43.8817C98.33 43.8544 99.3353 44.0264 100.279 44.3877C101.222 44.749 102.085 45.2926 102.819 45.9874L103.175 46.3247C104.656 47.7278 105.518 49.6618 105.574 51.7012C105.629 53.7406 104.871 55.7183 103.468 57.1993L69.6357 92.9104C68.9174 93.6694 68.0518 94.274 67.0919 94.687C66.132 95.1001 65.0979 95.313 64.0529 95.3127Z"
              fill="white"
            />
          </svg>
        </ModalIcon>
        <ModalHFive className="pt-4 mt-2 mb-0 ">
          Namespace successfully deployed to production instance
        </ModalHFive>
        <RowModal>
          <ColumnThree className="col-3 mb-3">
            <RowModalDiv className="d-flex  h-100  ">
              <ActionTitleSet className="mb-0 ">Namespace</ActionTitleSet>
              <SubTitleSet className="mb-0 ">Kafka to Hive</SubTitleSet>
            </RowModalDiv>
          </ColumnThree>
          <CustomNine className="col-9 mb-3">
            <ActiveButtonContainer className="d-flex ">
              <ActiveButtonDiv className="div-btn-1">
                <TriangleIcons color="#B5BDC8" />
                <span>2</span>
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-2">
                <SquareBoxIcon color="#B5BDC8" />
                <span>2</span>
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-3">
                <TriangleExclamationMarkIcon color="#B5BDC8" />
                <span>2</span>
              </ActiveButtonDiv>
              <ActiveButtonDiv className="div-btn-4">
                <SmallNotThunderIcon color="#B5BDC8" />
                <span>2</span>
              </ActiveButtonDiv>
            </ActiveButtonContainer>
          </CustomNine>
          <ColumnThree className="col-3 mb-3">
            <RowModalDiv className="d-flex  h-100  ">
              <ActionTitleSet className="mb-0 ">Current Version</ActionTitleSet>
              <SubTitleSet className="mb-0 ">V4</SubTitleSet>
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
};

export default NamespaceDeploy;
