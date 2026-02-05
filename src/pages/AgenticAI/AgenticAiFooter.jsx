import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { KDFM } from '../../constants';
import { SendIcon } from '../../assets';

const FooterWrapper = styled.div`
  padding: 10px 20px 0px 20px;
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  gap: 8px; /* Space between banner and input box */
`;

const StatusBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #ff7a00;
  border-radius: 8px;
`;

const StatusText = styled.span`
  font-family: 'Red Hat Display', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #ff7a00;

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #ff7a00;
    border-radius: 50%;
    margin-right: 8px;
    vertical-align: middle;
  }
`;

const InputContainer = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  border: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;

  ${props =>
    props.disabled &&
    css`
      background-color: #fafafa;
      opacity: 0.7;
      cursor: not-allowed;
    `}

  &:focus-within {
    border-color: ${props => (props.disabled ? '#eaeaea' : '#ff7a00')};
    box-shadow: ${props =>
      props.disabled ? 'none' : '0 4px 16px rgba(0, 0, 0, 0.1)'};
  }
`;

const InputBox = styled.textarea`
  width: 100%;
  flex-grow: 1;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  font-size: 16px;
  line-height: 1.5;
  font-family:
    Red Hat Display,
    sans-serif;
  padding: 16px 20px 10px 20px;
  color: #414141;
  min-height: 48px;

  max-height: 300px;
  overflow-y: auto;

  &::placeholder {
    color: #aaa;
  }
`;

const BottomActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 12px 12px 12px;
  background: white;
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => (props.disabled ? '#e0e0e0' : '#ff7a00')};
  border: none;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    filter: brightness(0.9);
  }
`;

export const AgenticAiFooter = ({
  queryText,
  setQueryText,
  handleSendMessage,
  isLoading,
  sessionId,
  hasMessages,
  isSessionActive,
}) => {
  const inputRef = useRef(null);
  const isInputDisabled = isLoading || !sessionId || !isSessionActive;
  const isInputValid = queryText.trim().length > 0;
  const isSendBtnDisabled = isLoading || !isInputValid || !sessionId;

  useEffect(() => {
    if (!isLoading && isSessionActive) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isSessionActive]);

  const handleInputChange = e => {
    const val = e.target.value;
    if (val.length <= KDFM.MAX_CHAR_LIMIT) {
      setQueryText(val);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        e.stopPropagation();
        return;
      }
      e.preventDefault();
      e.stopPropagation();

      if (!isSendBtnDisabled) {
        handleSendMessage();
      }
    }
  };

  return (
    <FooterWrapper>
      {!isSessionActive && (
        <StatusBanner>
          <StatusText>{KDFM.ERROR_CONNECTING_MCP}</StatusText>
        </StatusBanner>
      )}
      <InputContainer>
        <InputBox
          ref={inputRef}
          value={queryText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isInputDisabled}
          placeholder={
            hasMessages ? KDFM.PROMPT_PLACEHOLDER : 'Type your message...'
          }
          rows={2}
          maxLength={KDFM.MAX_CHAR_LIMIT}
        />

        <BottomActionRow>
          <SendButton
            type="button"
            disabled={isSendBtnDisabled}
            onClick={handleSendMessage}
          >
            <SendIcon color={isSendBtnDisabled ? '#a0a0a0' : '#ff7a00'} />
          </SendButton>
        </BottomActionRow>
      </InputContainer>
    </FooterWrapper>
  );
};

AgenticAiFooter.propTypes = {
  queryText: PropTypes.string.isRequired,
  setQueryText: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  sessionId: PropTypes.string,
  hasMessages: PropTypes.bool.isRequired,
  isSessionActive: PropTypes.bool.isRequired,
};
