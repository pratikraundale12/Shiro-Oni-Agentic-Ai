/* eslint-disable no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import { Modal } from '../../../shared';
import PropTypes from 'prop-types';
import { SquareBoxIcon, TriangleIcons } from '../../../assets';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const Container = styled.div`
  height: 350px;
`;
const TextsvgDiv = styled.div`
  display: flex;
  align-items: center;
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
      ${props => (props.isActive ? props.activeColor : '#FF7A00')};
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
export const ActionStatusModal = ({ statusModalOpen, setStatusModalOpen }) => {
  return (
    <Modal
      size="md"
      title={'Cluster Action Status'}
      isOpen={statusModalOpen}
      onRequestClose={() => setStatusModalOpen(false)}
      secondaryButtonText="Cancel"
      primaryButtonText={'Continue'}
      // primaryButtonDisabled={showApprover && isEmpty(approver_ids)}
      onSubmit={() => {}}
      footerAlign="start"
      contentStyles={{ minWidth: '45%', minHeight: '40%' }}
    >
      <Container>
        <div className="row">
          <div className="col-12">
            <TextsvgDiv className="d-flex mb-3">
              <ActiveButtonDiv className="div-btn-1 mr-2">
                <ActiveButtonDiv
                  className="div-btn-1 "
                  isActive={true}
                  activeColor="#58e715"
                  hoverColor="#58e715"
                  activeTextColor="#fff"
                  onClick={() => {}}
                  data-tooltip-id="start"
                >
                  <TriangleIcons color="#B5BDC8" />
                </ActiveButtonDiv>
              </ActiveButtonDiv>
              <div className="mr-2">Start Cluster</div>
            </TextsvgDiv>
            <TextsvgDiv className="d-flex">
              <ActiveButtonDiv className="div-btn-2 mr-2">
                <ActiveButtonDiv
                  className="div-btn-1"
                  isActive={true}
                  activeColor="#c52b2b"
                  hoverColor="#c52b2b"
                  activeTextColor="#fff"
                  onClick={() => {}}
                  data-tooltip-id="stop"
                >
                  <SquareBoxIcon color="#B5BDC8" />
                </ActiveButtonDiv>
              </ActiveButtonDiv>
              <div>Stop Cluster</div>
            </TextsvgDiv>
            <ReactTooltip
              id="start"
              content="Start"
              place="right"
              positionStrategy="fixed"
            />{' '}
            <ReactTooltip
              id="stop"
              content="Stop"
              place="right"
              positionStrategy="fixed"
            />
          </div>
        </div>
      </Container>
    </Modal>
  );
};
ActionStatusModal.propTypes = {
  statusModalOpen: PropTypes.object,
  //   errors: PropTypes.object.isRequired,
  //   scheduleInitialOpen: PropTypes.bool,
  //   setScheduleInitialOpen: PropTypes.func,
  //   handleContinue: PropTypes.func,
  //   startDate: PropTypes.string.isRequired,
  //   setStartDate: PropTypes.func.isRequired,
  //   showButton: PropTypes.bool,
  setStatusModalOpen: PropTypes.func,
};
