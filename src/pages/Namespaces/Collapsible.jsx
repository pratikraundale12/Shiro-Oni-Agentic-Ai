import React from 'react';
import styled from 'styled-components';
// import { IconButton } from '../../components';
import { DownArrowIcon, UpArrowIcon, PlusCircleIcon } from '../../assets';
import PropTypes from 'prop-types';
import { Button } from '../../shared';
import { KDFM } from '../../constants';

const IconButton = styled.button`
  min-width: 32px;
  min-height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.border};

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  @media (max-width: 1025px) {
    min-width: 24px;
    min-height: 24px;
    border-width: 0.5px;
    & svg {
      width: 12px;
      height: 12px;
    }
  }
  &.pencil-icon-schedule-list {
    @media (max-width: 1025px) {
      min-width: 24px;
      min-height: 24px;
      border-width: 0.5px;
      & svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const CollapsibleWrapper = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 1);
  height: ${props => props.headerHeight};
  top: 273px;
  left: 290px;
  gap: 0px;
  border-radius: 10px 10px 0px 0px;
  opacity: 0px;
`;

const Title = styled.h3`
  font-family: Noto Sans;
  font-size: 20px;
  font-weight: 600;
  line-height: 27.24px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;

  &:focus {
    outline: none;
  }
`;

const Content = styled.div`
  top: 345px;
  left: 290px;
  gap: 0px;
  border-radius: 0px 0px 10px 10px;
  opacity: 0px;
  background: ${({ isOpenBackgroundWhite }) =>
    isOpenBackgroundWhite ? `#fff` : `rgba(224, 241, 241, 1)`};

  padding: 10px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Collapsible = ({
  title,
  children,
  btnText = KDFM.ADD,
  onBtnClick,
  isTableOpen,
  toggleCollapsible,
  isAddBtnVisible = true,
  isAddBtnDisable = false,
  isOpenBackgroundWhite = false,
  headerHeight = '72px',
}) => {
  return (
    <CollapsibleWrapper>
      <Header headerHeight={headerHeight}>
        <Title>{title}</Title>
        <div className="d-flex gap-3 w-70">
          {isAddBtnVisible && (
            <Button
              isBtnDisable={isAddBtnDisable}
              icon={<PlusCircleIcon width={16} height={16} color="white" />}
              onClick={onBtnClick}
              size="sm"
            >
              {btnText}
            </Button>
          )}
          <ToggleButton
            aria-expanded={isTableOpen}
            onClick={toggleCollapsible}
            type="button"
          >
            {isTableOpen ? (
              <IconButton type="button">
                <UpArrowIcon />
              </IconButton>
            ) : (
              <IconButton type="button">
                <DownArrowIcon />
              </IconButton>
            )}
          </ToggleButton>
        </div>
      </Header>
      {isTableOpen && (
        <Content isOpenBackgroundWhite={isOpenBackgroundWhite}>
          {children}
        </Content>
      )}
    </CollapsibleWrapper>
  );
};

Collapsible.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  btnText: PropTypes.string,
  onBtnClick: PropTypes.func,
  isTableOpen: PropTypes.bool,
  toggleCollapsible: PropTypes.func,
  isAddBtnVisible: PropTypes.bool,
  isAddBtnDisable: PropTypes.bool,
  isOpenBackgroundWhite: PropTypes.bool,
  headerHeight: PropTypes.string,
};

export default Collapsible;
