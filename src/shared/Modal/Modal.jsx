import React from 'react';
import Modal from 'react-modal';
import './index.css';
import { CrossIconWithBorderGrey } from '../../assets/Icons/CrossIcon';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
  border: 0;
  gap: 36px;
  display: flex;
  justify-content: start;
  height: 53px;
  margin: 0 0 30px 0;
  width: 100%;
  padding-left: 16px;
`;
const Header = styled.div`
  background-color: #f5f7fa;
  border: 0;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  height: 53px;
  display: flex;
  justify-content: between;
  padding: 16px;
  width: 100%;
`;
const HeaderText = styled.h5`
  font-family: 'Noto Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2d343f;
  line-height: 24px;
  letter-spacing: -0.02em;
  text-align: center;
  align-items: center;
`;
const Container = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  color: var(--bs-modal-color);
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  // border: 1px solid rgba(0, 0, 0, 0.175);
  border-radius: 0.5rem;
  outline: 0;
  height: 100%;
  align-items: center;
`;

const Model = ({
  modalIsOpen,
  children,
  size,
  leftButtonText = '',
  rightButtonText = '',
  title = '',
  onSubmit = () => {},
  closeModal = () => {},
  rightButtonAction = () => {},
}) => {
  const styleObject = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: size === 'lg' ? '75%' : size === 'md' ? '45%' : '45%',
      width: size === 'lg' ? '70%' : size === 'md' ? '45%' : '30%',
      padding: '0',
      borderRadius: '16px',
      zIndex: 9,
    },
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={styleObject}
      >
        <Container onSubmit={onSubmit}>
          <Header>
            <HeaderText>{title}</HeaderText>
            <button className="cross-icon-btn" onClick={closeModal}>
              <CrossIconWithBorderGrey />
            </button>
          </Header>
          {children}
          <ButtonWrapper>
            <Button variant="secondary" onClick={closeModal} size="md">
              {leftButtonText}
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              onClick={rightButtonAction}
            >
              {rightButtonText}
            </Button>
          </ButtonWrapper>
        </Container>
      </Modal>
    </div>
  );
};

export default Model;

Model.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  setModalIsOpen: PropTypes.func.isRequired,
  children: PropTypes.node,
  size: PropTypes.oneOf(['lg', 'md', 'sm']),
  leftButtonText: PropTypes.string,
  rightButtonText: PropTypes.string,
  title: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func,
  closeModal: PropTypes.func.isRequired,
  rightButtonAction: PropTypes.func.isRequired,
};
